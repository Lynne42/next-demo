// import {asyncPool} from "./asyncPool";
import pLimit from "./p-limit";
const limit = pLimit(3);

// 获取文件大小
const getContentLength = (url: string) => {
  return new Promise((resolve, reject) => {
    try {
      fetch(url, {
        method: "HEAD",
      }).then((response) => {
        const contentLength = response.headers.get("content-length");
        console.log("getContentLength", contentLength);
        resolve(Number(contentLength));
      });
    } catch (err) {
      console.log(111, err);
      resolve(0);
    }
  });
};

type GetChunksParams = {
  chunkSize: number;
  contentLength: number;
};
type GetChunksResult = {
  start: number;
  end: number;
  index: number;
};
const getChunks = (params: GetChunksParams): GetChunksResult[] => {
  const { chunkSize, contentLength } = params;
  const chunks =
    typeof chunkSize === "number" ? Math.ceil(contentLength / chunkSize) : 1;
  const chunkFiles = [];
  for (let i = 0; i < chunks; i++) {
    let start = i * chunkSize;
    let end = i + 1 == chunks ? contentLength - 1 : (i + 1) * chunkSize - 1;
    chunkFiles.push({
      start,
      end,
      index: i,
    });
  }
  return chunkFiles;
};

// 分片请求
/** 
const getBinaryContent = (params) => {
  const { url, start, end, index } = params;
  return new Promise((resolve, reject) => {
    try {
      fetch(url, {
        method: "GET",
        headers: {
          range: `bytes=${start}-${end}`,
          responseType: "arrayBuffer",
        },
        keepalive: true,
        credentials:'include',
      })
        .then((res) => {
          return res.arrayBuffer();
        })
        .then((buffer) => {
          console.log(89999, buffer);
          resolve({
            index,
            buffer: buffer,
          });
        });
    } catch (err) {}
  });
};
**/
const getBinaryContent = (params) => {
  const { url, start, end, index } = params;
  return new Promise((resolve, reject) => {
    try {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.setRequestHeader("range", `bytes=${start}-${end}`);
      xhr.responseType = "arraybuffer";
      xhr.onload = function () {
        resolve({
          index,
          buffer: xhr.response,
        });
      };
      xhr.send();
    } catch (err) {
      reject(new Error(err));
    }
  });
};

// 并发请求
const pollDownload = async (
  url: string,
  poolLimit: number,
  chunkFiles: GetChunksResult[]
) => {
  /** 
  const results = await asyncPool(
      poolLimit,
      chunkFiles,
      (item: GetChunksResult) => {
      return getBinaryContent({
          url,
          start: item.start,
          end: item.end,
          index: item.index,
      });
      }
  );
  */
  const results = chunkFiles.map((item) => {
    return limit((item) =>
      getBinaryContent({
        url,
        start: item.start,
        end: item.end,
        index: item.index,
      })
    );
  });
  return results;
};

// 合并分片
const concatenate = (chunksList: any) => {
  const sortedBuffers = chunksList.map(
    (item: any) => new Uint8Array(item.buffer)
  );
  if (!sortedBuffers.length) return null;

  let totalLength = sortedBuffers.reduce((acc, value) => acc + value.length, 0);
  let result = new Uint8Array(totalLength);
  let length = 0;
  for (let array of sortedBuffers) {
    result.set(array, length);
    length += array.length;
  }
  return result;
};

// 下载数据
type SaveAsParams = {
  name: string;
  buffers: any;
  mime: string;
};
const saveAs = (params: SaveAsParams) => {
  const { name, buffers, mime = "application/octet-stream" } = params;
  const blob = new Blob([buffers], { type: mime });
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.download = name;
  a.href = blobUrl;
  a.click();
  URL.revokeObjectURL(blob);
};

type DownloadParams = {
  url: string;
  chunkSize: number;
  poolLimit: number;
  contentLength: number;
};
const download = async (params: DownloadParams) => {
  const { url, chunkSize, poolLimit, contentLength } = params;

  // 分片文件
  const chunkFiles: GetChunksResult[] = getChunks({
    chunkSize,
    contentLength,
  });

  // 并发结果
  const results = await pollDownload(url, poolLimit, chunkFiles);

  return concatenate(results); // 合并分片
};

const init = async () => {
  const chunkSize = 20 * 1024;
  const contentLength = await getContentLength(
    "http://i.imgur.com/z4d4kWk.jpg"
  );

  const buffers = await download({
    url: "http://i.imgur.com/z4d4kWk.jpg",
    chunkSize,
    poolLimit: 3,
    contentLength,
  });
  console.log("buffers", buffers);
  saveAs({ buffers, name: "图片", mime: "image/jpeg" });
};

export default init;
