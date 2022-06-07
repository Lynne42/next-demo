import TaskQueue from './queue';
import type { Queue, RunFunction } from './queue';

interface Options {
  concurrency: number;
}

class AsyncPool {
  private _concurrency: number;

  private _pendingCount: number;

  private _successfulCount: number;

  private _finishCount: number;

  private _queue: Queue;

  constructor(options: Options) {
    this._queue = new TaskQueue();
    this._concurrency = options.concurrency;
    this._pendingCount = 0;
    this._finishCount = 0;
    this._successfulCount = 0;
  }

  async run(fn: RunFunction, resolve: any, rest: any) {
    this._pendingCount += 1;
    const result = (async () => fn(...rest))();
    resolve(result);

    try {
      await result;
    } catch (err) {
      console.log(err);
    }
    this.next();
  }

  next(): void {
    this._pendingCount -= 1;
    this.tryToStartAnother();
  }

  tryToStartAnother(): boolean {
    if (this._queue.size) {
      if (this._pendingCount < this._concurrency) {
        const job = this._queue.dequeue();
        if (!job) {
          return false;
        }
        job();
        return true;
      }
      Promise.resolve();
      return false;
    }
    return false;
  }

  enqueue(fn: RunFunction, resolve: any, rest: any) {
    this._queue.enqueue(this.run.bind(this, fn, resolve, rest));
    this.tryToStartAnother();
  }

  add(runfn: RunFunction, ...rest: any) {
    const that = this;
    new Promise((resolve) => {
      that.enqueue(runfn, resolve, rest);
    });
  }

  _init() {
    this._queue = new TaskQueue();
    this._pendingCount = 0;
    this._finishCount = 0;
    this._successfulCount = 0;
  }

  clear() {
    this._queue.clear();
    this._init();
  }

  get size(): number {
    return this._queue.size;
  }

  get pending(): number {
    return this._pendingCount;
  }
}

export default AsyncPool;
