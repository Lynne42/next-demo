onmessage = async (event) => {
  console.time('md5');
  importScripts('/js/spark-md5.min.js');
  const { file, chunkSize } = event.data;

  const chunks = Math.ceil(file.size / chunkSize);
  const arrChunk = [];
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

  const spark = new SparkMD5.ArrayBuffer();
  const fileReader = new FileReader();
  let currentChunk = 0;
  const chunksLen = arrChunk.length;

  function loadNext() {
    fileReader.readAsArrayBuffer(arrChunk[currentChunk].file);
  }

  fileReader.onloadend = (e) => {
    spark.append(e.target.result);
    currentChunk += 1;

    if (currentChunk < chunksLen) {
      loadNext();
    } else {
      console.timeEnd('md5');
      postMessage({ md5: spark.end() });
    }
  };

  fileReader.onerror = () => {
    postMessage({ md5: '' });
  };

  loadNext();
};
