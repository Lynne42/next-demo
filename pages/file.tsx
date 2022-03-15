import type { NextPage } from "next";
import PQueue from 'p-queue';

import { useCallback, useEffect } from "react";
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

import AsyncLimit from '../lib/utils/async-limit';

import { asyncPool } from "../lib/utils/asyncPool";

import pLimit from "../lib/utils/p-limit";


const chunkSize = 20 * 1024;
const url = "http://i.imgur.com/z4d4kWk.jpg";
const poolLimit = 3;

const limit = pLimit(poolLimit);

const pqueue = new PQueue({concurrency: poolLimit});
const asyncLimit = new AsyncLimit({concurrency: poolLimit});

console.log(999, asyncLimit)



const File: NextPage = () => {

  useEffect(() => {
    asyncLimit.on('completed', function() {
      console.log(2)
    });
    asyncLimit.on('add', () => {
      console.log(2, asyncLimit.size, asyncLimit.pending)
    });
  }, [])
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


  /**
   * p-queue 下载
   */
  const handleUploadPQueue = useCallback(async () => {
    console.time('p-queue 下载');
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
      pqueue.add(() => getBinaryContent({
        url,
        start: item.start, 
        end: item.end, 
        index: item.index,
      }))
    ))

    const results = await Promise.allSettled(promiseFetchs);
    
    
  }, []);

  /**
   * async limit download
  */
  const handleUploadAsyncLimit = useCallback(async () => {

    const contentLength = await getContentLength(url);
    console.log("init", contentLength);

    const chunkFiles: GetChunksResult[] = getChunks({
      chunkSize,
      contentLength,
    });

    console.log('chunkFiles', chunkFiles)
    const promiseFetchs = chunkFiles.map(item => (
      asyncLimit.add(() => getBinaryContent({
        url, 
        start: item.start, 
        end: item.end, 
        index: item.index,
      }))
    ))
    console.log('promiseFetchs', promiseFetchs)
    
    const results = await Promise.allSettled(promiseFetchs);

    console.log(11, results)

    
    
  }, []);

  return (
    <div className={styles.container}>
      <button onClick={handleUpload}>async-pool demo</button>
      <button onClick={handleDownload}>async-pool </button>
      <button onClick={handleUploadPlimit}>p-limit </button>
      <button onClick={handleUploadPQueue}>p-queue </button>
      <button onClick={handleUploadAsyncLimit}>async limit </button>
    </div>
  );
};

export default File;
