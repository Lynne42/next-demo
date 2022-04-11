import { EventEmitter } from 'eventemitter3';
import 'yet-another-abortcontroller-polyfill';

import { message } from 'antd';
import PLimit from '@/utils/plimit';
import { toFileSlice, toErrorFileSlice, delay } from './upload';
import type { ChunkFile, ChunksStatusContent } from './upload';

import { FileStatus, GatherFileFlag, FileTopStatus } from './upload.type';

type Params = {
  concurrency?: number;
  file: File;
  taskId: string;
  chunkSize?: number;
  validFile?: string[];
  validFileSize?: number;
  retryCount?: number;
  retryChunkStatusCount?: number;
  retryFullFileCount?: number;
  uploadChunkFileApi: Function;
  uploadFullFileApi: Function;
  getChunksStatusApi: Function;
  getFileContinueInfoApi: Function;
  changeUploadFileApi: Function;
  category: string;
  [str: string]: any;
};

type Options = {
  concurrency: number;
  file: File;
  chunkSize: number;
  taskId: string;
  validFile: string[];
  validFileSize: number;
  retryCount: number;
  retryChunkStatusCount: number;
  retryFullFileCount: number;
  uploadChunkFileApi: Function;
  uploadFullFileApi: Function;
  getChunksStatusApi: Function;
  getFileContinueInfoApi: Function;
  changeUploadFileApi: Function;
  category: string;
  status: string;
  [str: string]: any;
};


export default class UploadFile extends EventEmitter<
  | 'completedChunkEvent'
  | 'completedFileMd5Event'
  | 'nextEvent'
  | 'completedServerChunkStatusEvent'
> {
  options: Options;

  plimit: any;

  controller: AbortController | null;

  private _worker: any;

  private _chunks: ChunkFile[] = [];

  errorChunkList: ChunkFile[] = [];

  private _filemd5: string = '';

  private _filemd5Status: 'error' | 'successful' | '' = '';

  private retry: number = 0;

  private retryChunkStatusCount: number = 0;

  private retryFullFileCount: number = 0;

  private _finishSuccessCount: number = 0;

  private _needChunkMd5: boolean = true;

  status: FileStatus;

  constructor(params: Params) {
    super();
    this.options = {
      validFile: ['.zip', '.tar', '.tar.gz'],
      validFileSize: 10 * 1024 * 1024 * 1024,
      chunkSize: 5 * 1024 * 1024,
      concurrency: 3,
      retryCount: 3,
      retryChunkStatusCount: 5,
      retryFullFileCount: 5,
      status: '',
      ...params,
    };

    this.status = FileStatus.PENDING;

    this.controller = new AbortController();
    this.plimit = new PLimit({ concurrency: this.options.concurrency });
    this._worker = new Worker('./worker/filemd5.js');
    this._worker.onmessage = async (event: MessageEvent) => {
      if (event && event.data) {
        // 已算出文件的MD5, 调用文件初始化接口
        const { md5 } = event.data;
        this._filemd5 = md5;
        if(this.options.status === FileTopStatus.FILERETRY) {
          this.emit('completedFileMd5Event', {
            md5,
            isFileRetry: true,
            status: 'ok',
          });
        } else {
          this._submitFullFillInfo(md5);
        }
      }
    };
  }

  

  // 上传完整的文件信息
  async _submitFullFillInfo(md5: string) {
    const { taskId, file, category } = this.options;
    const fullFileParams = {
      md5,
      taskId,
      totalSize: file.size,
      category,
      totalSlice: this._chunks.length,
      signal: this.controller?.signal,
    };
    try {
      const ret = await this.options.uploadFullFileApi(fullFileParams);
      const status = ret && ret.status === 'ok' ? 'ok' : 'error';
      if (status === 'ok') {
        this.emit('completedFileMd5Event', {
          ...fullFileParams,
          status,
        });
        this._filemd5Status = 'successful';
      } else {
        throw new Error('上传文件信息失败');
      }
    } catch (error) {
      if (this.retryFullFileCount < this.options.retryFullFileCount) {
        this.retryFullFileCount += 1;
        this._submitFullFillInfo(md5);
      }
      this._filemd5Status = 'error';
      this.emit('completedFileMd5Event', {
        ...fullFileParams,
        status: 'error',
      });
    }
  }

  // 分片
  async _toSliceChunk() {
    const { file, chunkSize } = this.options;
    const result = await toFileSlice(file, chunkSize);

    return result;
  }

  // 分片 fetch promise
  _handleUploadChunk(data: ChunkFile, chunksLen: number) {
    return () =>
      this.options.uploadChunkFileApi({
        file: data.file,
        md5: data.md5,
        uploadTaskId: this.options.taskId,
        category: this.options.category,
        index: data.index,
        chunkSize: data.chunkSize,
        chunks: chunksLen,
        signal: this.controller?.signal,
      });
  }

  // chunk limit
  _promiseFetchs(
    chunks: ChunkFile[],
    isRetry?: boolean,
    retrySuccessfulCount?: number,
  ) {
    const that = this;
    return chunks.map((item: ChunkFile) =>
      this.plimit.add(
        this._handleUploadChunk(item, this._chunks.length),
        (successfulCount: number) => {
          that._finishSuccessCount += successfulCount;

          that.emit('completedChunkEvent', {
            taskId: this.options.taskId,
            successfulCount: isRetry
              ? that._finishSuccessCount + retrySuccessfulCount!
              : that._finishSuccessCount,
            totalCount: that._chunks.length,
            category: this.options.category,
          });
        },
      ),
    );
  }

  // commit chunk and retry commit chunk
  runEnd(errorChunkList: ChunkFile[]) {
    if(this.status !== FileStatus.DELETE) {
      this.errorChunkList = errorChunkList;
      console.log('errorChunkList', this.options.file.name, errorChunkList);
      this.status = FileStatus.LOCAL_CHUNK_COMPONENT;
      this.emit('completedChunkEvent', {
        taskId: this.options.taskId,
        successfulCount: this._finishSuccessCount,
        totalCount: this._chunks.length,
        category: this.options.category,
        status: 'completed',
      });
      this.emit('nextEvent');
      // 轮询后端保存分片的真实状态
      this.loopFileResult();
    }
    
  }

  async run(params?: any) {
    const { isRetry, retrySuccessfulCount, chunks } = params || {};

    const subChunks = chunks || this._chunks;
    const fetchPromise = this._promiseFetchs(
      subChunks,
      isRetry,
      retrySuccessfulCount,
    );
    const results = await Promise.allSettled(fetchPromise);
    // 处理切片结果
    const errorChunkList: ChunkFile[] = [];
    results.forEach((result: any, index) => {
      const { status, value, reason } = result;
      console.log(11111, result)
      if (status === 'fulfilled') {
        if (value.status !== 'ok') {
          errorChunkList.push(subChunks[index]);
        }
      } else if(status === 'rejected' && reason?.type !== 'AbortError') {
        errorChunkList.push(subChunks[index]);
      }
    });
    console.log('errorChunkList', errorChunkList);

    if (errorChunkList.length && this.retry < this.options.retryCount) {
      // 失败重试
      console.log('retry', this.retry);
      this.retry += 1;

      this.run({
        isRetry,
        retrySuccessfulCount,
        chunks: errorChunkList,
      });
    } else {
      // 保存 上传失败(且重试失败) 的chunk信息
      this.runEnd(errorChunkList);
    }
  }

  /**
   * 上传分片完成后， 轮询接口，查询当前文件分片在后台的处理进度
     如果分片处理完成， 判断是否所有分片的处理状态：
     如果所有分片的接口均为成功， 则继续轮询接口，判断文件分片是否合并完成，等待轮询结果
     如果有分片为失败， 则 文件上传失败
   */
  // 轮询间隔
  async _waitToLoop() {
    await delay(10 * 1000);
    this.loopFileResult()
  }

  async loopFileResult() {
    const totalLen = this._chunks.length;
    try {
      const result = await this.options.getChunksStatusApi({
        uploadTaskId: this.options.taskId,
        signal: this.controller?.signal,
      });
      if (result && result.status === 'ok') {
        const { uploadingStatusList, gatherFileFlag } = result.data;
        if (uploadingStatusList.length === totalLen) {
          // 判断是分片处理完成还是 分片合并完成
          const mergedStatus = this._formatFileResultMerge(
            uploadingStatusList,
            gatherFileFlag,
            totalLen,
          );
          if (mergedStatus) {
            if (mergedStatus === FileStatus.MERGING) {
              this._waitToLoop();
              return
            }
            return;
          }

          this._formatFileResultChunk(uploadingStatusList, totalLen);
        } else {
          this._waitToLoop();
        }
      } else {
        throw new Error('获取接口失败，继续调用接口');
      }
    } catch (error) {
      console.log(error);
      this._waitToLoop();
    }
  }

  // 保存分片状态数据
  // eslint-disable-next-line class-methods-use-this
  _formatSaveChunksStatus(uploadingStatusList: ChunksStatusContent[]) {
    const successfulArr: number[] = [];
    const errorArr: number[] = [];
    uploadingStatusList.forEach((item: ChunksStatusContent) => {
      if (item.uploadStatus === true) {
        successfulArr.push(item.sliceIndex);
      } else {
        errorArr.push(item.sliceIndex);
      }
    });
    return {
      successfulArr,
      errorArr,
    };
  }

  // 处理merge状态的逻辑
  _formatFileResultMerge(
    uploadingStatusList: ChunksStatusContent[],
    gatherFileFlag: GatherFileFlag,
    totalLen: number,
  ) {
    
    let mergedStatus: FileStatus | '' = '';
    if (gatherFileFlag === GatherFileFlag.SUCCESS) {
      mergedStatus = FileStatus.MERGE_SUCCESSFUL;
    } else if (gatherFileFlag === GatherFileFlag.FAIL) {
      mergedStatus = FileStatus.MERGE_FAIL;
    } else if (gatherFileFlag === GatherFileFlag.GATHERING) {
      mergedStatus = FileStatus.MERGING;
    }

    if (mergedStatus) {
      const { successfulArr, errorArr } =
      this._formatSaveChunksStatus(uploadingStatusList);

      this.status = mergedStatus;
      this.emit('completedServerChunkStatusEvent', {
        taskId: this.options.taskId,
        total: totalLen,
        status: mergedStatus,
        successfulList: successfulArr,
        errorList: errorArr,
      });
    }
    return mergedStatus;
  }

  // 处理分片状态逻辑
  _formatFileResultChunk(
    uploadingStatusList: ChunksStatusContent[],
    totalLen: number,
  ) {
    const { successfulArr, errorArr } =
      this._formatSaveChunksStatus(uploadingStatusList);

    let status: FileStatus;
    if (errorArr.length) {
      status = FileStatus.SERVER_CHUNK_ERROR;
    } else {
      status = FileStatus.SERVER_CHUNK_SUCCESSFUL;
      this.loopFileResult();
    }
    this.status = status;
    this.emit('completedServerChunkStatusEvent', {
      taskId: this.options.taskId,
      total: totalLen,
      successfulList: successfulArr,
      errorList: errorArr,
      status,
    });
  }

  // 重新上传前，获取文件信息
  async _getServerFileInfo(taskId: string, category: string) {
    try {
      const result = await this.options.getFileContinueInfoApi({
        uploadTaskId: taskId,
        category,
      });

      if (result && result.status === 'ok') {
        return result.data;
      }
      throw new Error(
        result && result.message ? result.message : '获取已上传文件信息失败',
      );
    } catch (error) {
      message.error(typeof error === 'string' ? error : '获取已上传文件信息失败,请稍后再试')
      return false;
    }
  }

  // 如果重新上传的文件与原文件不同, 通知后端清空原已经上传的数据
  async _changeUploadFile(taskId: string, category: string, id: number) {
    const data = await this.options.changeUploadFileApi({
      taskId,
      category,
      id,
    })
    if(data && data.status === 'ok') {
      return true
    }
    return false
  }

  // 原文件 续传
  async _originFileContinueUpload(data: any) {
    const { uploadInfo } = data;
    const { uploadingStatusList } = uploadInfo;
    const { successfulArr } = this._formatSaveChunksStatus(uploadingStatusList);
    const fileSlice = await toErrorFileSlice(
      this.options.file,
      this.options.chunkSize,
      successfulArr,
    );

    this.run({
      isRetry: true,
      retrySuccessfulCount: successfulArr.length,
      chunks: fileSlice,
    });
  }

  // cancel 取消上传
  cancel() {
    this.status = FileStatus.DELETE;
    this.plimit.clear();
    if (this.controller) {
      
      this.controller.abort();
      this.controller = null;
    }
  }

  // 重置计数器
  resetCountProperty() {
    this.retryFullFileCount = 0;
    this.retryChunkStatusCount = 0;
    this.retry = 0;
  }

  
  // 初始化
  async init() {
    // 计算文件MD5值，worker异步计算
    this._worker.postMessage({
      file: this.options.file,
      chunkSize: this.options.chunkSize,
    });
  }

  // 执行
  async initRun() {
    this.status = FileStatus.RUNNING;
    const chunks = await this._toSliceChunk();
    this._chunks = chunks;
    console.log('chunks', chunks);
    this.run();
  }

  // 不需要选择文件，重新上传 初始化
  async reInit() {
    this.resetCountProperty();
    console.log(8888888)
    if (!this._filemd5 || this._filemd5Status === '') {
      this.init();
    } else if (this._filemd5Status === 'error') {
      this._submitFullFillInfo(this._filemd5);
    }
    try {
      const data = await this._getServerFileInfo(
        this.options.taskId,
        this.options.category,
      );

      if (data) {
        // 续传
        this._originFileContinueUpload(data);
      } else {
        console.log('获取文件信息失败');
      }
    } catch (error) {
      console.log(error);
      message.error('获取文件信息失败，请稍后重试');
      
    }
  }

  // 选择文件， 重新上传 初始化
  reFileInit() {
    this.resetCountProperty();
  }

  // 选择文件， 重新上传 运行
  async reFileRun() {
    // 获取已上传文件的信息
    const { taskId, category, id} = this.options;
    let data = null;
    try {
      data = await this._getServerFileInfo(
        taskId,
        category,
      );
      if (!data) {
        throw new Error('获取文件信息失败');
      } 
    } catch (error) {
      message.error('获取文件信息失败，请稍后重试');
      data = null;
    }

    if(!data) {
      return
    }
    
    const isSameFile = data.md5 === this._filemd5;
    if (isSameFile) {
      // 续传
      this._originFileContinueUpload(data);
      
    } else {
      
      // 非同一个文件
      const result = await this._changeUploadFile(taskId, category, id);

      if(result) {
        this._submitFullFillInfo(this._filemd5);
        this.initRun();
      } else {
        message.error('原文件操作失败，请稍后再试')
        
      }
    }
  }
}
