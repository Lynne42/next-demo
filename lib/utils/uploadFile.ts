import SparkMD5 from "spark-md5";

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
  chunkRange: string;
  chunkSize: number;
};
export const toFileSlice = (file: File, chunkSize: number): ChunkFile[] => {
  const chunks = Math.ceil(file.size / chunkSize);
  console.log(33, chunks, file.size, chunkSize);
  const arrChunk: ChunkFile[] = [];
  let start = 0;
  let end = chunkSize;
  for (let i = 0; i < chunks; i++) {
    const chunkFile = file.slice(start, end);
    arrChunk.push({
      index: i,
      file: chunkFile,
      chunkRange: `${start}-${end}`,
      chunkSize: chunkFile.size,
    });
    start = end;
    end = end + chunkSize;
  }
  return arrChunk;
};

/**
 * 计算文件MD5值，及分片的MD5值
 */
export const toCalculateMD5 = (file: File, chunks: ChunkFile[]) => {
  console.time("toCalculateMD5");
  const spark = new SparkMD5.ArrayBuffer();
  const fileReader = new FileReader();
  let currentChunk = 0;
  const chunksLen = chunks.length;

  fileReader.onload = function (e: any) {
    console.log("read chunk nr", currentChunk + 1, "of", chunks);
    spark.append(e.target.result);
    currentChunk++;

    if (currentChunk < chunksLen) {
      loadNext();
    } else {
      console.log("finished loading");
      console.log(4444, spark.end());
      console.timeEnd('toCalculateMD5');
    }
  };

  fileReader.onerror = function () {
    console.warn("oops, something went wrong.");
  };

  function loadNext() {
    fileReader.readAsArrayBuffer(chunks[currentChunk].file);
  }

  loadNext();

  
};
