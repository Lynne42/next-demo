import SparkMD5 from "spark-md5";

const childThread = () => {
  const webWorker: Worker = self as any;

  const toCalculateMD5 = (chunks: any[]) => {
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
        console.timeEnd("toCalculateMD5");
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

  webWorker.addEventListener("message", (event) => {
    const result = toCalculateMD5(event.data);
    console.log(45544, result);
    webWorker.postMessage({
      msg: "消息已收到，好久不见！",
    });
  });
};

export default childThread;
