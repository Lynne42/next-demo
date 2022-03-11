import type { NextPage } from "next";

import { useCallback } from "react";
import styles from "../styles/Home.module.css";
import {
  getContentLength,
  getChunks,
  getBinaryContent,
  pollDownload,
  concatenate,
  saveAs,
  download,
} from "../lib/utils/downloadFile";

import { asyncPool } from "../lib/utils/asyncPool";

import pLimit from "../lib/utils/p-limit";
import { start } from "repl";

const chunkSize = 20 * 1024;
const url = "http://i.imgur.com/z4d4kWk.jpg";
const poolLimit = 3;

const limit = pLimit(poolLimit);


const File: NextPage = () => {
  /**
   * async pool下载
   */
  const handleDownload = useCallback(async () => {
    console.time('async pool 下载');
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

    console.timeEnd('async pool 下载');

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
  const handleUploadPlimit = useCallback(async () => {
    console.time('p-limit 下载');
    // 文件大小
    const contentLength = await getContentLength(url);
    console.log("init", contentLength);

    // 分片文件
    const chunkFiles: GetChunksResult[] = getChunks({
      chunkSize,
      contentLength,
    });

    // 并发
    const promiseFetchs = chunkFiles.map(item => (
      limit(() => getBinaryContent({
        url, 
        start: item.start, 
        end: item.end, 
        index: item.index,
      }))
    ))
    const results = await Promise.allSettled(promiseFetchs);
    
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

    console.timeEnd('p-limit 下载');
  }, []);

  return (
    <div className={styles.container}>
      <button onClick={handleUpload}>async-pool demo</button>
      <button onClick={handleDownload}>async-pool download</button>
      <button onClick={handleUploadPlimit}>p-limit download</button>
    </div>
  );
};

export default File;

/**
 * promise和async互相转化
 * promise 和 async 运行，哪里是同步任务哪里是微任务
 * promise实现
 */
