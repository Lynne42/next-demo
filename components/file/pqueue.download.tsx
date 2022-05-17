import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";

import PQueue from "p-queue";

import {
  getContentLength,
  getChunks,
  getBinaryContent,
  pollDownload,
  concatenate,
  saveAs,
} from "@/lib/uploader/downloadFile";

import AsyncLimit from "@/lib/limit/self-async-limit";

import pLimit from "@/lib/limit/p-limit";

const chunkSize = 20 * 1024;
const url = "http://i.imgur.com/z4d4kWk.jpg";
const poolLimit = 3;

const limit = pLimit(poolLimit);

const pqueue = new PQueue({ concurrency: poolLimit });
const asyncLimit = new AsyncLimit({ concurrency: poolLimit });

const PQueueUploaderFile: NextPage = () => {
  useEffect(() => {
    asyncLimit.on("completed", function () {
      console.log(
        "completed",
        `pending: ${asyncLimit.pending}`,
        `size: ${asyncLimit.size}`,
        `completed: ${8 - asyncLimit.pending - asyncLimit.size}`
      );
    });
    asyncLimit.on("add", () => {
      // console.log('add', `pending: ${asyncLimit.pending}`, `size: ${asyncLimit.size}`, )
    });
    asyncLimit.on("idle", () => {
      console.log(
        "idle",
        `pending: ${asyncLimit.pending}`,
        `size: ${asyncLimit.size}`
      );
    });
  }, []);

  /**
   * p-queue 下载
   */
  const handleDownloadPQueue = useCallback(async () => {
    console.time("p-queue 下载");
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
      pqueue.add(() =>
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

    console.timeEnd("p-queue 下载");
  }, []);

  return (
    <div className="m-[12px]">
      <button
        className="border border-primary text-primary rounded-[4px] px-[16px] py-[8px]"
        onClick={handleDownloadPQueue}
      >
        p-queue download
      </button>
    </div>
  );
};

export default PQueueUploaderFile;
