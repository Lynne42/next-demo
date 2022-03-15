import { EventEmitter } from "eventemitter3";

import TaskQueue from "./queue";
import type { Queue, RunFunction } from "./queue";

interface Options {
  concurrency: number;
}

class Test extends EventEmitter {
  constructor() {
    super();
  }
}
const a = new Test();
console.log(1, a);

class AsyncPool extends EventEmitter {
  private _concurrency: number;
  private _pendingCount: number;

  private _queue: Queue;

  constructor(options: Options) {
    super();
    console.log(55555, this);
    this._queue = new TaskQueue();
    this._concurrency = options.concurrency;
    this._pendingCount = 0;
  }

  async run(fn: RunFunction, resolve: any, rest: any) {
    this._pendingCount++;
    const result = (async () => fn(...rest))();

    resolve(result);
    try {
      await result;
      this.emit("completed");
    } catch {
      this.emit("error");
    }
    this.next();
  }

  next(): void {
    this._pendingCount--;
    this.tryToStartAnother();
    this.emit("next");
  }

  tryToStartAnother(): boolean {
    if (this._queue.size) {
      const job = this._queue.dequeue();
      if (!job) {
        return false;
      }
      this.emit("active");
      job();
      return true;
    }
    return false;
  }

  enqueue(fn: RunFunction, resolve: any, rest: any) {
    
    this._queue.enqueue(this.run.bind(this, fn, resolve, rest));
    this.emit("add");
  }

  add(runfn: RunFunction, ...rest: any): Promise<unknown> {
    const that = this;
    return new Promise((resolve) => that.enqueue(runfn, resolve, rest));
  }

  addAll(runfns: RunFunction[]): Promise<unknown> {
    return Promise.allSettled(
      runfns.map((item: RunFunction) => this.add(item))
    );
  }

  get size(): number {
    return this._queue.size;
  }

  get pending(): number {
    return this._pendingCount;
  }
}

export default AsyncPool;
