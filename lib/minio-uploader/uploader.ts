/* eslint-disable class-methods-use-this */
import { message } from 'antd';
import MinioClient from './minio';
import PLimit from './plimit';

import { FileStatus, toCalculateMD5, toFileSlice } from './file';

type FileStatusInfo = {
  status: FileStatus;
  [attr: string]: any;
};

type InitParams = {
  file: File;
  callback: any;
};

type UploadPartInfo = {
  successInfo?: any[];
  errorInfo?: any[];
  accumulatedCount: number;
};

class Uploader {
  chunkSize: number = 5 * 1024 * 1024;

  minioClient: any;

  plimit: any;

  uploadId: string = '';

  md5: string = '';

  emitterInfo: any;

  file: File | null = null;

  chunks: any[] = [];

  chunkLen: number = 0;

  uploadPartInfo: UploadPartInfo = {
    successInfo: [],
    errorInfo: [],
    accumulatedCount: 0,
  };

  uploadStatusInfo: any = {};

  constructor() {
    this.plimit = new PLimit({ concurrency: 4 });
  }

  // 更新上传状态
  uploadFileStatusInfo(params: FileStatusInfo) {
    const newParams = {
      ...this.uploadStatusInfo,
      ...params,
    };
    this.uploadStatusInfo = newParams;
    this.emitterInfo(newParams);
  }

  async preUpload() {
    try {
      const uploadId = await this.minioClient.createMultipartUpload(this.md5);
      this.uploadId = uploadId;
      return true;
    } catch (error: any) {
      message.error(error.message);
      return false;
    }
  }

  // 分片结果
  uploadPartResult(result: any) {
    const { status } = result;
    if (status) {
      this.uploadPartInfo.successInfo?.push(result);
    } else {
      this.uploadPartInfo.errorInfo?.push(result);
    }
    this.uploadPartInfo.accumulatedCount += 1;
    if (this.uploadPartInfo.accumulatedCount === this.chunkLen) {
      // 分片上传完成
      const nowStatus = this.uploadPartInfo.errorInfo?.length
        ? FileStatus.UPLOADING_FAIL
        : FileStatus.UPLOADING_SUCCESS;
      this.uploadFileStatusInfo({
        status: nowStatus,
        succCount: this.uploadPartInfo.successInfo?.length,
        total: this.chunkLen,
      });
      if (nowStatus === FileStatus.UPLOADING_SUCCESS) {
        // 合并
        this.completeMultipartUpload();
      } else {
        // 上传失败
        message.error('合并文件失败，请重试');
      }
    } else {
      this.uploadFileStatusInfo({
        status: FileStatus.UPLOADING,
        succCount: this.uploadPartInfo.successInfo?.length,
        total: this.chunkLen,
      });
    }
  }

  // 分片
  getFileSlice() {
    if (this.file) {
      const chunks = toFileSlice(this.file!, this.chunkSize);
      this.chunks = chunks || [];
    }
  }

  // 上传分片
  toUploadPart(chunkList?: any[]) {
    const nowChunkList =
      chunkList && chunkList.length ? chunkList : this.chunks;
    for (let i = 0, len = nowChunkList.length; i < len; i++) {
      this.plimit.add(() =>
        this.minioClient.uploadPart({
          ...nowChunkList[i],
          uploadId: this.uploadId,
          md5: this.md5,
          callback: this.uploadPartResult.bind(this),
        }),
      );
    }
  }

  // 合并
  async completeMultipartUpload() {
    const params = {
      uploadInfo: this.uploadPartInfo.successInfo
        ?.map((item) => ({
          ETag: item.result.ETag,
          PartNumber: item.index + 1,
        }))
        .sort((a, b) => a.PartNumber - b.PartNumber),
      uploadId: this.uploadId,
      md5: this.md5,
    };
    try {
      const result = await this.minioClient.completeMultipartUpload(params);

      this.uploadFileStatusInfo({
        status: FileStatus.MERGE_SUCCESS,
        fileInfo: {
          bucketName: result.Bucket,
          objectName: result.Key,
        },
      });
      localStorage.removeItem(this.md5);
    } catch (error: any) {
      message.error(error.message);
      this.uploadFileStatusInfo({
        status: FileStatus.MERGE_FAIL,
      });
    }
  }

  // 根据md5查看文件是否已经存在
  async getBucketObjectByMD5() {
    try {
      const result = await this.minioClient.getBucketsObject(this.md5);

      if (result && result.Contents && result.Contents.length) {
        return {
          bucketName: result.Name,
          objectName: result.Contents[0].Key,
        };
      }
      return true;
    } catch (error: any) {
      return true;
    }
  }

  // 终止上传
  async abortMultipartUpload(params: any) {
    try {
      const result = await this.minioClient.abortMultipartUpload(params);
    } catch (error: any) {
      console.log(error);
    }
  }

  // 获取断点文件列表
  async getListMultipartUploads(uploadId: string) {
    try {
      const data = await this.minioClient.listMultipartUploads({
        md5: this.md5,
        uploadId,
      });
      if (data) {
        return data;
      }
      return true;
    } catch (error) {
      return true;
    }
  }

  // 获取已上传文件信息
  getMultiparts(data: any) {
    const { UploadId, Parts } = data || {};
    this.uploadId = UploadId;
    if (!Parts || !Parts.length) {
      this.toUploadPart();
    } else {
      const chunks = toFileSlice(this.file!, this.chunkSize);
      const arr = [];
      for (let i = 0, len = chunks.length; i < len; i++) {
        //
        if (
          !Parts.find((item: any) => item.PartNumber - 1 === chunks[i].index)
        ) {
          arr.push(chunks[i]);
        }
      }
      //
      this.uploadPartInfo.successInfo = Parts.map((item: any) => ({
        result: {
          ETag: JSON.parse(item.ETag),
        },
        index: item.PartNumber - 1,
      }));
      this.uploadPartInfo.accumulatedCount = Parts.length;

      if (arr && arr.length) {
        this.uploadFileStatusInfo({
          status: FileStatus.UPLOADING,
          succCount: this.uploadPartInfo.successInfo?.length,
          total: this.chunkLen,
        });
        this.toUploadPart(arr);
      } else {
        this.uploadFileStatusInfo({
          status: FileStatus.UPLOADING_SUCCESS,
          succCount: this.uploadPartInfo.successInfo?.length,
          total: this.chunkLen,
        });

        // 合并
        this.completeMultipartUpload();
      }
    }
  }

  // reset
  async reset(isAbort?: boolean) {
    // if (isAbort) {
    //   await this.abortMultipartUpload({
    //     md5: this.md5,
    //     uploadId: this.uploadId,
    //   });
    // }

    this.uploadId = '';
    this.md5 = '';
    this.emitterInfo = () => {};
    this.file = null;
    this.chunks = [];
    this.chunkLen = 0;
    this.uploadPartInfo = {
      successInfo: [],
      errorInfo: [],
      accumulatedCount: 0,
    };
    this.uploadStatusInfo = {};
    this.plimit.clear();
  }

  // 初始化minio
  initMinio() {
    // 实际项目中，需要通过接口， 从后台获取minio: accessKeyId, secretAccessKey, endpoint
    return true
  }

  // 初始化
  async init(initParams: InitParams) {
    // 获取 minio 初始化 参数
    const { file, callback } = initParams;
    this.file = file;
    const chunkLen = Math.ceil(file.size / this.chunkSize);

    this.chunkLen = chunkLen;
    this.emitterInfo = callback;

    this.uploadFileStatusInfo({
      status: FileStatus.INITING_MINIO,
    });
    // 获取 minio 初始化 参数
    const isMinioAble: any = await this.initMinio();
    if (typeof isMinioAble === 'boolean' && !isMinioAble) {
      this.uploadFileStatusInfo({
        status: FileStatus.INITING_MINIO_FAIL,
      });
      return;
    }

    // 初始化minio
    this.minioClient = new MinioClient(isMinioAble);

    this.getFileSlice();

    this.uploadFileStatusInfo({
      status: FileStatus.CALCULATE_MD5,
    });

    const md5: string = await toCalculateMD5(file, this.chunkSize);

    if (md5) {
      this.md5 = md5;
      this.uploadFileStatusInfo({
        status: FileStatus.CALCULATE_MD5_SUCCESS,
        md5,
      });
    } else {
      this.uploadFileStatusInfo({
        status: FileStatus.CALCULATE_MD5_FAIL,
      });
      message.error('计算文件MD5值失败');
      return;
    }

    console.log('md5', md5);

    // 查看MD5文件是否已经存在
    const isUploadNeeded = await this.getBucketObjectByMD5();

    if (typeof isUploadNeeded !== 'boolean' && isUploadNeeded) {
      // 文件已存在， 不需要重复上传
      this.uploadFileStatusInfo({
        status: FileStatus.MERGE_SUCCESS,
        fileInfo: isUploadNeeded,
      });
      return;
    }

    // 判断是否断点续传
    const storage = JSON.parse(localStorage.getItem(this.md5));
    if (storage && storage.uploadId) {
      const isAbort = await this.getListMultipartUploads(storage.uploadId);
      if (typeof isAbort !== 'boolean' && isAbort) {
        // 断点
        this.getMultiparts(isAbort);
        return;
      }
    }

    // 上传初始化
    const isUploadId = await this.preUpload();
    if (!isUploadId) {
      message.error('获取上传文件id失败， 请稍后重试');
      return;
    }

    localStorage.setItem(
      md5,
      JSON.stringify({
        md5,
        uploadId: this.uploadId,
      }),
    );

    this.toUploadPart();
  }
}

const uploader = new Uploader();

export default uploader;
