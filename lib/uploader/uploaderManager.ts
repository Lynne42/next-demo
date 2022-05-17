import { EventEmitter } from 'eventemitter3';
import UpdateFile from './uploader';
import { FileStatus, FileTopStatus } from './upload.type';

// import {
//   uploadChunkFileApi,
//   uploadFullFileApi,
//   getChunksStatusApi,
//   getFileContinueInfoApi,
//   changeUploadFileApi,
// } from '@lib/api/assets';

type FullFileInfo = {
  md5: string;
  status: 'ok' | 'error';
};
type ProgressInfo = {
  successfulCount?: number;
  totalCount?: number;
  status?: string;
};

type CompletedChunkEventContent = {
  taskId?: string;
  successfulCount?: number | any;
  totalCount?: number | any;
  status?: 'completed';
  [str: string]: any;
};

type CompletedServerChunkStatusEventContent = {
  taskId?: string;
  total?: number;
  successfulList: number[];
  errorList: number[];
  status: FileStatus;
};
enum FileInfoStatus {
  'pending' = 'pending',
  'running' = 'running',
  'completed' = 'completed',
}
type FileInfosContent = {
  file: File;
  taskId: string;
  fileInstance?: UpdateFile;
  fullFileInfo?: FullFileInfo;
  progressInfo?: ProgressInfo & CompletedChunkEventContent;
  serverInfo?: CompletedServerChunkStatusEventContent;
  [propName: string]: any;
};

type FileInfos = {
  [key: string]: FileInfosContent;
};

class UploadFilesManage extends EventEmitter<'changeFilesInfoEvent'> {
  fileInfos: FileInfos;

  fileList: any[];

  runningFileList: any[];

  chunkSize: number = 5 * 1024 * 1024;

  constructor() {
    super();
    this.fileInfos = {};
    this.fileList = [];
    this.runningFileList = [];
  }

  add(params: FileInfosContent) {
    const { taskId, status } = params;
    this.fileInfos[taskId] = params;

    const fileInstance = new UpdateFile({
      
      ...params,
      chunkSize: this.chunkSize,
      // uploadChunkFileApi,
      // uploadFullFileApi,
      // getChunksStatusApi,
      // getFileContinueInfoApi,
      // changeUploadFileApi,
    });
    this.listenEmitEvent(fileInstance);
    this.fileInfos[taskId] = {
      ...this.fileInfos[taskId],
      fileInstance,
      fileInfoStatus: FileInfoStatus.pending,
    };

    if(status === FileTopStatus.FILERETRY) {
      // 重置状态
      fileInstance.emit('completedChunkEvent', {
        status: undefined,
        totalCount: 0,
        successfulCount: 0,
      })
    }

    this.enqueue(fileInstance);

  }

  reAdd(taskId: string) {
    const { file, progressInfo, serverInfo, fileInstance, ...rest } = this.fileInfos[taskId];
    fileInstance!.options.status = FileTopStatus.RETRY;
    this.listenEmitEvent(fileInstance!);
    if (serverInfo) {
      const { errorList, successfulList, total } = serverInfo;
      const newProgressInfo: CompletedChunkEventContent = {
        ...progressInfo,
        status: undefined,
      };
      if (errorList.length) {
        newProgressInfo.totalCount = total!;
        newProgressInfo.successfulCount = successfulList?.length;
      }
      this.fileInfos[taskId] = {
        ...rest,
        file,
        fileInstance,
        progressInfo: newProgressInfo,
        fileInfoStatus: FileInfoStatus.pending,
      };
      fileInstance?.emit('completedChunkEvent', newProgressInfo);
      this.fileList.unshift(fileInstance);
      if (!this.runningFileList.length) {
        this.dequeue();
      }
    }
  }


  enqueue(fileInstance: UpdateFile) {
    this.fileList.push(fileInstance);
    this.fileList[this.fileList.length - 1].init();

    if (!this.runningFileList.length) {
      this.dequeue();
    }
  }

  dequeue() {

    const pendingTask = this.fileList.shift();

    FileInfoStatus.pending
    if(pendingTask.options.status === FileTopStatus.RETRY) {
      pendingTask.reInit();
    } else if(pendingTask.options.status === FileTopStatus.FILERETRY) {
      // 等待MD5计算结果
      pendingTask.reFileInit();
      
    } else {
      pendingTask.initRun();
    }
    const fileInfo = this.getCurrentFileInfoByFileInstance(pendingTask);
    fileInfo.fileInfoStatus = FileInfoStatus.running;
    this.runningFileList.push(pendingTask);
  }


  next() {
    const fileInstance = this.runningFileList.shift();
    const fileInfo = this.getCurrentFileInfoByFileInstance(fileInstance);
    fileInfo.fileInfoStatus = FileInfoStatus.completed;
    if (this.fileList.length) {
      this.dequeue();
    }
  }

  getCurrentFileInfoByFileInstance(fileInstance: UpdateFile) {
    const taskId = fileInstance.options.taskId;
    const fileInfo = this.fileInfos[taskId];
    return fileInfo
  }

  delete(taskId: string) {
    
    const { fileInstance, fileInfoStatus } = this.fileInfos[taskId]; 
    console.log('clear', taskId, fileInfoStatus )
    switch(fileInfoStatus) {
      case FileInfoStatus.pending: {
        const index = this.fileList.findIndex((file) => file.options.taskId === taskId);
        this.fileList.splice(index, 1);
        delete this.fileInfos[taskId];
        break
      }
      case FileInfoStatus.running: {
        fileInstance?.cancel();
        this.runningFileList.shift();
        delete this.fileInfos[taskId];
        break
      }
      case FileInfoStatus.completed: {
        delete this.fileInfos[taskId];
        break
      }
    }

    this.removeListenEmitEvent(fileInstance!);
    this.emit('changeFilesInfoEvent', this.fileInfos);

  }


  listenEmitEvent(fileInstance: UpdateFile) {
    
    fileInstance.on('completedFileMd5Event', (finishParams: any) => {
      const { md5, status, isFileRetry } = finishParams;
      if(isFileRetry) {
        fileInstance.reFileRun();
      }
      const currentFileInfo = this.fileInfos[fileInstance.options.taskId];
      currentFileInfo.fullFileInfo = {
        md5,
        status,
      };
      fileInstance.removeListener('completedFileMd5Event');
      this.emit('changeFilesInfoEvent', this.fileInfos);
      
    });

    fileInstance.on(
      'completedChunkEvent',
      (finishParams: CompletedChunkEventContent) => {
        const currentFileInfo = this.fileInfos[fileInstance.options.taskId];
        const { successfulCount, totalCount, status } = finishParams;
        
        currentFileInfo.progressInfo = {
          successfulCount,
          totalCount,
          status,
        };
        if (status && status === 'completed') {
          fileInstance.removeListener('completedChunkEvent');
        }

        this.emit('changeFilesInfoEvent', this.fileInfos);
      },
    );

    fileInstance.on('nextEvent', () => {
      
      this.next();
      fileInstance.removeListener('nextEvent');
    });

    fileInstance.on(
      'completedServerChunkStatusEvent',
      (finishParams: CompletedServerChunkStatusEventContent) => {
        const currentFileInfo = this.fileInfos[fileInstance.options.taskId];
        currentFileInfo.serverInfo = finishParams;
        this.emit('changeFilesInfoEvent', this.fileInfos);
        fileInstance.removeListener('completedServerChunkStatusEvent');
      },
    );
  }

  removeListenEmitEvent(fileInstance: UpdateFile) {
    fileInstance.removeListener('completedFileMd5Event');
    fileInstance.removeListener('completedChunkEvent');
    fileInstance.removeListener('nextEvent');
    fileInstance.removeListener('completedServerChunkStatusEvent');
  }

  get pendingSize(): number {
    return this.fileList.length;
  }

  get runningSize(): number {
    return this.runningFileList.length;
  }
}

const uploadFilesManage = new UploadFilesManage();

export default uploadFilesManage;
