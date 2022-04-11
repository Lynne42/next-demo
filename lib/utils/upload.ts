import SparkMD5 from 'spark-md5';

export type ChunksStatusContent = {
  sliceIndex: number;
  uploadStatus: boolean;
};

/**
 * 检查文件后缀
 */
export const toCheckTypeFile = (name: string, fileType: string[]): boolean => {
  const index = name.lastIndexOf('.');
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
        md5: '',
      });
    };
    fileReader.readAsArrayBuffer(chunk.file);
  });

export const toFileSlice = async (
  file: File,
  chunkSize: number,
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
      }),
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
  successfulList: number[],
): Promise<ChunkFile[]> => {
  const chunks = Math.ceil(file.size / chunkSize);
  const arrChunk: any = [];
  let start = 0;
  let end = chunkSize;
  for (let i = 0; i < chunks; i++) {
    const chunkFile = file.slice(start, end);
    if(!successfulList.includes(i)) {
      arrChunk.push(
        toCalculateChunkMD5({
          index: i,
          file: chunkFile,
          chunkSize: chunkFile.size,
        }),
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
export const toCalculateMD5 = (chunks: ChunkFile[]) => {
  console.time('toCalculateMD5');
  const spark = new SparkMD5.ArrayBuffer();
  const fileReader = new FileReader();
  let currentChunk = 0;
  const chunksLen = chunks.length;

  function loadNext() {
    fileReader.readAsArrayBuffer(chunks[currentChunk].file);
  }

  fileReader.onload = function (e: any) {
    console.log('read chunk nr', currentChunk + 1, 'of', chunks);
    spark.append(e.target.result);
    currentChunk += 1;

    if (currentChunk < chunksLen) {
      loadNext();
    } else {
      console.log('finished loading');
      console.log(4444, spark.end());
      console.timeEnd('toCalculateMD5');
    }
  };

  fileReader.onerror = function () {
    console.warn('oops, something went wrong.');
  };

  
  loadNext();
};



// eslint-disable-next-line no-promise-executor-return
export const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))