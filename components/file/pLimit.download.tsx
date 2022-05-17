import type { NextPage } from "next";
import { useCallback } from "react";

import {
  getContentLength,
  getChunks,
  getBinaryContent,
  concatenate,
  saveAs,
} from "@/lib/uploader/downloadFile";

import pLimit from "@/lib/limit/p-limit";

const chunkSize = 20 * 1024;
const url = "http://i.imgur.com/z4d4kWk.jpg";
const poolLimit = 3;

const limit = pLimit(poolLimit);


const PLimitDownloadFile: NextPage = () => {

  /**
   * p-limit 下载
   */
  const handleDownloadPlimit = useCallback(async () => {
    console.time("p-limit 下载");
    // 文件大小
    const contentLength = await getContentLength(url);
    console.log("init", contentLength);

    // 分片文件
    const chunkFiles = getChunks({
      chunkSize,
      contentLength,
    });

    // 并发
    const promiseFetchs = chunkFiles.map((item) =>
      limit(() =>
        getBinaryContent({
          url,
          start: item.start,
          end: item.end,
          index: item.index,
        })
      )
    );
    const results = await Promise.allSettled(promiseFetchs);

    const allFetchResult = results
      .map((item) => {
        if (item.status === "fulfilled") {
          return item.value;
        }
        return null;
      })
      .filter((item) => !!item);

    // 合并
    const buffers = concatenate(allFetchResult);

    console.log("buffers", buffers);

    // 下载
    saveAs({ buffers, name: "图片", mime: "image/jpg" });

    console.timeEnd("p-limit 下载");
  }, []);



  return (
    <div className="m-[12px]">
      <button
        className="border border-primary text-primary rounded-[4px] px-[16px] py-[8px]"
        onClick={handleDownloadPlimit}
      >
        p-limit download
      </button>
      
    </div>
  );
};

export default PLimitDownloadFile;
