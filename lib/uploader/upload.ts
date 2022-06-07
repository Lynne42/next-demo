import SparkMD5 from "spark-md5";

export type ChunksStatusContent = {
  sliceIndex: number;
  uploadStatus: boolean;
};

/**
 * 检查文件后缀
 */
export const toCheckTypeFile = (name: string, fileType: string[]): boolean => {
  const index = name.lastIndexOf(".");
  const ext = name.substring(index);
  return fileType.includes(ext);
};

/**
 * 文件分片
 */
export type ChunkFile = {
  index: number;
  file: any;
  chunkSize: number;
  md5?: string;
};

/**
 * 计算分片的MD5值
 */
export const toCalculateChunkMD5 = (chunk: ChunkFile) =>
  new Promise((resolve) => {
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();

    fileReader.onload = function (e: any) {
      spark.append(e.target.result);

      resolve({
        ...chunk,
        md5: spark.end(),
      });
    };
    fileReader.onerror = function () {
      resolve({
        ...chunk,
        md5: "",
      });
    };
    fileReader.readAsArrayBuffer(chunk.file);
  });

export const toFileSlice = async (
  file: File,
  chunkSize: number
): Promise<ChunkFile[]> => {
  const chunks = Math.ceil(file.size / chunkSize);
  const arrChunk: any = [];
  let start = 0;
  let end = chunkSize;
  for (let i = 0; i < chunks; i++) {
    const chunkFile = file.slice(start, end);
    arrChunk.push(
      toCalculateChunkMD5({
        index: i,
        file: chunkFile,
        chunkSize: chunkFile.size,
      })
    );
    start = end;
    end += chunkSize;
  }

  const result = await Promise.all(arrChunk);

  return result;
};

export const toErrorFileSlice = async (
  file: File,
  chunkSize: number,
  successfulList: number[]
): Promise<ChunkFile[]> => {
  const chunks = Math.ceil(file.size / chunkSize);
  const arrChunk: any = [];
  let start = 0;
  let end = chunkSize;
  for (let i = 0; i < chunks; i++) {
    const chunkFile = file.slice(start, end);
    if (!successfulList.includes(i)) {
      arrChunk.push(
        toCalculateChunkMD5({
          index: i,
          file: chunkFile,
          chunkSize: chunkFile.size,
        })
      );
    }

    start = end;
    end += chunkSize;
  }

  const result = await Promise.all(arrChunk);

  return result;
};

/**
 * 计算文件MD5值
 */
 export const toCalculateMD5 = (file: File, chunkSize: number, callback: Function) => {
  const blobSlice = File.prototype.slice;
  const fileReader = new FileReader();

  // 计算分片数
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
      callback(spark.end());
    }
  };
  fileReader.onerror = function () {
    callback('');
  };
  function loadNext() {
    const start = currentChunk * chunkSize;
    const end = start + chunkSize >= file.size ? file.size : start + chunkSize;
    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
  }
};

// eslint-disable-next-line no-promise-executor-return
export const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
