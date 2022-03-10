import type { NextPage } from 'next'

import { useCallback } from 'react'
import styles from '../styles/Home.module.css'
import init from '../lib/utils/downloadFile';
import { asyncPool } from '../lib/utils/asyncPool';
import pLimit from '../lib/utils/p-limit';
const limit = pLimit(3);

const File: NextPage = () => {
  const handleDownload = useCallback(
    () => {
        init()
    },
    [],
  )

  // async-pool
  const handleUpload = useCallback(async () => {
    const result = await asyncPool(3, [1,2,3,4,5,6,7,8,9,10], (value: number) => Promise.resolve().then(() => value * value));
    console.log('async-pool', result)
  }, [])

  // p-limit
  const handleUploadPlimit = useCallback(async () => {
    // const arr = [1,2,3,4,5,6,7,8,9,10];
    // const asyncFn = (value: number) => () => Promise.resolve().then(() => value * value);
    // const result = arr.map(item => {
    //     return limit(
    //         asyncFn(item), 
    //         (count: number) => console.log(333, count)
    //     )
    // });
    // Promise.allSettled(result).then(res => {
    //     console.log(4, res)
    // })
    init()
  }, [])
  
  return (
    <div className={styles.container}>
      <button onClick={handleDownload}>download</button>
      <button onClick={handleUpload}>async-pool</button>
      <button onClick={handleUploadPlimit}>p-limit</button>
    </div>
  )
}

export default File
