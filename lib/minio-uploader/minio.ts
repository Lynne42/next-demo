import S3 from 'aws-sdk/clients/s3';

type initMinioParams = {
  oss_bucket_name: string;
  oss_access_key: string;
  oss_secret_key: string;
  oss_security_token: string;
  oss_type: string;
  oss_endpoint: string;
  oss_port: string | number;
  oss_scheme: string;
};
class MinioClient {
  s3: any;

  bucketName: string = 'registry';

  isBucketCreated: boolean = false;

  constructor(params: initMinioParams) {
    this.s3 = new S3({
      accessKeyId: 'minio',
      secretAccessKey: 'minio@123',
      endpoint: `http://101.43.129.224:9000`,
      s3ForcePathStyle: true,
    });
    this.bucketName = params.oss_bucket_name;

    console.log('minio-client', this.s3);
    this.createBucket();
  }

  // 创建bucket
  createBucket() {
    this.s3.createBucket({ Bucket: this.bucketName }, (err: any) => {
      if (err) {
        //
      } else {
        //
      }
    });
  }

  // 根据bucket name获取该bucket下的所有objects
  getListBucketsObjects() {
    return new Promise((resolve, reject) => {
      this.s3.listObjects(
        { Bucket: this.bucketName },
        (err: any, data: any) => {
          console.log(1, err, data);
        },
      );
    });
  }

  /**
   * 大文件分片上传初始化，获取一个唯一的任务id(UploadId), 用于后面每个分片的参数
   * @Bucket： bucketName
   * @Key： 上传文件的唯一标识(也是object的name)，这里使用文件MD5
   */
  createMultipartUpload(md5: string) {
    return new Promise((resolve, reject) => {
      this.s3.createMultipartUpload(
        { Bucket: this.bucketName, Key: `${md5}.tar` },
        (err: any, data: any) => {
          if (err) {
            console.log('分片初始化', err);
            reject(new Error('分片上传初始化失败'));
          }
          resolve(data.UploadId);
        },
      );
    });
  }

  /**
   * 分片上传
   * @Bucket： bucketName
   * @Key： 上传文件的唯一标识(也是object的name)，这里使用文件MD5
   * @UploadId： 分片初始化接口返回的任务id
   * @PartNumber: 分片的下标(从1开始)
   * @Body：每个分片文件内容(File类型)
   * @ContentLength： 分片的size
   */
  uploadPart(params: any) {
    return new Promise((resolve, reject) => {
      const { callback, md5, ...rest } = params;
      this.s3.uploadPart(
        {
          Bucket: this.bucketName,
          Key: `${md5}.tar`,
          UploadId: rest.uploadId,
          PartNumber: rest.index + 1,
          Body: rest.file,
          ContentLength: rest.chunkSize,
        },
        (err: any, data: any) => {
          if (err) {
            callback({ status: 0, ...rest });
            reject();
          }
          callback({ status: 1, result: data, ...rest });
          resolve({ status: 1, result: data, ...rest });
        },
      );
    });
  }

  /**
   * 合并分片
   * @Bucket： bucketName
   * @Key： 上传文件的唯一标识(也是object的name)，这里使用文件MD5
   * @UploadId： 分片初始化接口返回的任务id
   * @MultipartUpload: { Parts: uploadInfo } 分片上传返回的每个分片信息的集合
   */
  completeMultipartUpload(params: any) {
    const { uploadInfo, uploadId, md5 } = params;
    return new Promise((resolve, reject) => {
      this.s3.completeMultipartUpload(
        {
          Bucket: this.bucketName,
          Key: `${md5}.tar`,
          MultipartUpload: { Parts: uploadInfo },
          UploadId: uploadId,
        },
        (err: any, data: any) => {
          if (err) {
            console.log('合并', err);
            reject(new Error('分片合并失败'));
          }
          resolve(data);
        },
      );
    });
  }

  /**
   * 终止分片上传，使用abortMultipartUpload终止后，minio会清除已经上传的分片的所有缓存数据，如果需要支持断点续传功能， 不能使用该api
   * @Bucket： bucketName
   * @Key： 上传文件的唯一标识(也是object的name)，这里使用文件MD5
   * @UploadId： 分片初始化接口返回的任务id
   * 
   */
  abortMultipartUpload(params: any) {
    const { uploadId, md5 } = params;
    return new Promise((resolve, reject) => {
      this.s3.abortMultipartUpload(
        {
          Bucket: this.bucketName,
          Key: `${md5}.tar`,
          UploadId: uploadId,
        },
        (err: any, data: any) => {
          if (err) {
            reject(new Error('终止上传失败'));
          }
          resolve(data);
        },
      );
    });
  }

  /**
   * 查询存储对象，可用于判断对象是否已经存在
   * @Bucket： bucketName
   * @Key： 上传文件的唯一标识(也是object的name)，这里使用文件MD5
   * @UploadId： 分片初始化接口返回的任务id
   */
  getBucketsObject(md5: string) {
    return new Promise((resolve, reject) => {
      this.s3.listObjects(
        {
          Bucket: this.bucketName,
          Prefix: `${md5}.tar`,
        },
        (err: any, data: any) => {
          if (err) {
            console.log('获取存储对象', err);
            reject(new Error('获取存储数据失败'));
          }
          resolve(data);
        },
      );
    });
  }

  /**
   * 获取已经上传的分片数据，可用于断点续传
   * @Bucket： bucketName
   * @Key： 上传文件的唯一标识(也是object的name)，这里使用文件MD5
   * @UploadId： 已上传的文件对应的上传id
   */
  listMultipartUploads(params: any) {
    const { md5, uploadId } = params;
    return new Promise((resolve, reject) => {
      this.s3.listParts(
        {
          Bucket: this.bucketName,
          Key: `${md5}.tar`,
          UploadId: uploadId,
        },
        (err: any, data: any) => {
          if (err) {
            console.log('获取已上传的部分存储对象', err);
            reject(new Error('获取存储数据失败'));
          }
          resolve(data);
        },
      );
    });
  }
}

export default MinioClient;
