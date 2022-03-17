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
} from "../lib/utils/downloadFile";

import AsyncLimit from "../lib/utils/async-limit";

import { asyncPool } from "../lib/utils/asyncPool";

import pLimit from "../lib/utils/p-limit";

import { toCheckTypeFile, toFileSlice, toCalculateMD5 } from "../lib/utils/uploadFile";

import WebWorker from '../lib/utils/webWorker';
import childThread from '../lib/utils/worker';

const chunkSize = 20 * 1024;
const url = "http://i.imgur.com/z4d4kWk.jpg";
const poolLimit = 3;

const limit = pLimit(poolLimit);

const pqueue = new PQueue({ concurrency: poolLimit });
const asyncLimit = new AsyncLimit({ concurrency: poolLimit });

const File: NextPage = () => {
  const [worker, setWorker] = useState<Worker>();

  useEffect(() => {
    const worker = new WebWorker(childThread) as Worker;
    console.log('worker', worker)
    setWorker(worker);

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
   * async pool下载
   */
  const handleDownload = useCallback(async () => {
    console.time("async pool 下载");
    // 文件大小
    const contentLength = await getContentLength(url);
    console.log("init", contentLength);

    // 分片文件
    const chunkFiles: GetChunksResult[] = getChunks({
      chunkSize,
      contentLength,
    });

    // 并发
    const results = await pollDownload(url, poolLimit, chunkFiles);

    // 合并
    const buffers = concatenate(results);

    console.log("buffers", buffers);

    // 下载
    saveAs({ buffers, name: "图片", mime: "image/jpg" });

    console.timeEnd("async pool 下载");
  }, []);

  /**
   * async-pool demo
   */
  const handleUpload = useCallback(async () => {
    const result = await asyncPool(
      3,
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (value: number) => Promise.resolve().then(() => value * value)
    );
    console.log("async-pool", result);
  }, []);

  /**
   * p-limit 下载
   */
  const handleDownloadPlimit = useCallback(async () => {
    console.time("p-limit 下载");
    // 文件大小
    const contentLength = await getContentLength(url);
    console.log("init", contentLength);

    // 分片文件
    const chunkFiles: GetChunksResult[] = getChunks({
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

  /**
   * p-queue 下载
   */
  const handleDownloadPQueue = useCallback(async () => {
    console.time("p-queue 下载");
    // 文件大小
    const contentLength = await getContentLength(url);
    console.log("init", contentLength);

    // 分片文件
    const chunkFiles: GetChunksResult[] = getChunks({
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

  /**
   * async limit download
   */
  const handleDownloadAsyncLimit = useCallback(async () => {
    console.time("async limit 下载");
    const contentLength = await getContentLength(url);
    console.log("init", contentLength);

    const chunkFiles: GetChunksResult[] = getChunks({
      chunkSize,
      contentLength,
    });

    console.log("chunkFiles", chunkFiles);
    const promiseFetchs = chunkFiles.map((item) =>
      asyncLimit.add(() =>
        getBinaryContent({
          url,
          start: item.start,
          end: item.end,
          index: item.index,
        })
      )
    );
    console.log("promiseFetchs", promiseFetchs);
    
    const results = await Promise.allSettled(promiseFetchs);

    console.log(11, results)
    const allFetchResult = results.map(item => {
      if(item.status === 'fulfilled') {
        return item.value
      }
      return null
    }).filter(item => !!item)

    // 合并
    const buffers = concatenate(allFetchResult);

    console.log("buffers", buffers);

    // 下载
    saveAs({ buffers, name: "图片", mime: "image/jpg" });

    console.timeEnd('async limit 下载');
    
  }, []);

  /**
   * async limit upload
   */
  const handleUploadAsyncLimit = useCallback(async (e) => {
    const file = e.target.files[0];
    // 检查文件后缀， 只支持.zip,.tar,.tar.gz文件格式
    console.log("file", file);
    const isValid = toCheckTypeFile(file.name, [".zip", ".tar", ".tar.gz"]);
    if(!isValid) {
      console.log('上传文件只支持.zip,.tar,.tar.gz文件格式')
      return
    }
    // 检查文件大小
    // if(file.size > 10 * 1024 * 1024 * 1024) {
    //   console.log('上传文件大小不能超过10GiB')
    //   return
    // }

    // 分片
    const chunkSize = 5 * 1024 * 1024;
    const chunks = toFileSlice(file, chunkSize);

    // 计算MD5
    // toCalculateMD5(file, chunks)
    
    
    
  }, [worker]);

  return (
    <div>
      <button className="m-[20px] border border-primary" onClick={handleUpload}>
        async-pool demo
      </button>
      <button onClick={handleDownload}>async-pool download</button>
      <button onClick={handleDownloadPlimit}>p-limit download</button>
      <button onClick={handleDownloadPQueue}>p-queue download</button>
      <button onClick={handleDownloadAsyncLimit}>async limit download</button>
      <br />
      <input
        type="file"
        onChange={handleUploadAsyncLimit}
        accept=".zip,.tar,.tar.gz"
      />
      async limit upload
    </div>
  );
};

export default File;
