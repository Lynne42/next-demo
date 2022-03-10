async function asyncPool(
  poolLimit: number,
  array: unknown[],
  iteratorFn: Function
) {
  // 存储所有的异步任务
  const ret = [];
  // 存储正在执行的异步任务
  const executing: Promise<any>[] = [];
  
  for (const item of array) {
    // 创建调用异步任务的异步函数
    const p = new Promise((resolve) => {
      console.log(item);
      let currentItem = item;
      resolve(iteratorFn(currentItem, array))
    })

    // 存储异步任务
    ret.push(p);

    // 只有等总任务数大于并发限制数的时候进行并发控制
    if (poolLimit <= array.length) {
      // 设置异步任务执行完成后要执行的操作
      // 异步任务执行完成后，从正在执行的异步任务队列中去掉异步任务
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      // 存储要执行的异步任务
      executing.push(e);

      // 如果要执行的异步任务队列长度 >= 并发限制数， 则执行异步任务
      if (executing.length >= poolLimit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.allSettled(ret);
}

export { asyncPool };
