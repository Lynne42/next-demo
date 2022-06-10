import SparkMD5 from "spark-md5";

export enum FileStatus {
  "INITING_MINIO" = "INITING_MINIO",
  "INITING_MINIO_FAIL" = "INITING_MINIO_FAIL",
  "CALCULATE_MD5" = "CALCULATE_MD5",
  "CALCULATE_MD5_SUCCESS" = "CALCULATE_MD5_SUCCESS",
  "CALCULATE_MD5_FAIL" = "CALCULATE_MD5_FAIL",
  "UPLOADING" = "UPLOADING",
  "UPLOADING_SUCCESS" = "UPLOADING_SUCCESS",
  "UPLOADING_FAIL" = "UPLOADING_FAIL",
  "MERGE_SUCCESS" = "MERGE_SUCCESS",
  "MERGE_FAIL" = "MERGE_FAIL",
  "IMAGE_CREATING" = "IMAGE_CREATING",
  "IMAGE_SUCCESS" = "IMAGE_SUCCESS",
  "IMAGE_FAIL" = "IMAGE_FAIL",
}

export enum GatherFileFlag {
  "SUCCESS" = "SUCCESS",
  "FAIL" = "FAIL",
  "GATHERING" = "GATHERING",
}

export enum FileTopStatus {
  "RETRY" = "RETRY",
  "FILERETRY" = "FILERETRY",
}

// 检查文件后缀
export const toCheckTypeFile = (name: string, fileType: string[]): boolean => {
  let isInclude = false;
  for (let i = 0; i <= fileType.length; i++) {
    if (name.endsWith(fileType[i])) {
      isInclude = true;
      break;
    } else {
      isInclude = false;
    }
  }
  return isInclude;
};

export type ChunkFile = {
  index: number;
  file: any;
  chunkSize: number;
  md5?: string;
};

// 计算文件MD5值
export const toCalculateMD5 = (
  file: File,
  chunkSize: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const blobSlice = File.prototype.slice;
      const fileReader = new FileReader();

      const totalChunks = Math.ceil(file.size / chunkSize);
      console.log(`总分片数：${totalChunks}`);
      let currentChunk = 0;
      const spark = new SparkMD5.ArrayBuffer();
      loadNext();
      fileReader.onload = function (e: any) {
        spark.append(e.target.result);
        if (currentChunk < totalChunks) {
          currentChunk++;
          loadNext();
        } else {
          resolve(spark.end());
        }
      };
      fileReader.onerror = function () {
        reject("");
      };
      function loadNext() {
        const start = currentChunk * chunkSize;
        const end =
          start + chunkSize >= file.size ? file.size : start + chunkSize;
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
      }
    } catch (error) {
      reject("");
    }
  });
};

// 分片
export const toFileSlice = (file: File, chunkSize: number): ChunkFile[] => {
  if (!file || !file.size) {
    return [];
  }
  const chunks = Math.ceil(file.size / chunkSize);
  const arrChunk: any = [];
  let start = 0;
  let end = chunkSize;
  for (let i = 0; i < chunks; i++) {
    const chunkFile = file.slice(start, end);
    arrChunk.push({
      index: i,
      file: chunkFile,
      chunkSize: chunkFile.size,
    });
    start = end;
    end += chunkSize;
  }

  return arrChunk;
};
