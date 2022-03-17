import { EventEmitter } from "eventemitter3";

import TaskQueue from "./queue";
import type { Queue, RunFunction } from "./queue";

interface Options {
  concurrency: number;
}

class AsyncPool extends EventEmitter<
"active" | "idle" | "add" | "next" | "completed" | "error"
> {
  private _concurrency: number;
  private _pendingCount: number;

  private _queue: Queue;

  constructor(options: Options) {
    super();
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
    console.log('torun', `pending: ${this._pendingCount}`, `limit: ${this._concurrency}`, `size: ${this._queue.size}`)
    if (this._queue.size) {
      if (this._pendingCount < this._concurrency) {
        const job = this._queue.dequeue();
        if (!job) {
          return false;
        }
        this.emit("active");
        job();
        return true;
      } else {
          Promise.resolve();
          return false;
      }
    } else {
        this.emit("idle");
        return false;
    }
  }

  enqueue(fn: RunFunction, resolve: any, rest: any) {
    this._queue.enqueue(this.run.bind(this, fn, resolve, rest));
    this.emit("add");
    this.tryToStartAnother();
  }

  add(runfn: RunFunction, ...rest: any): Promise<unknown> {
    const that = this;
    return new Promise((resolve) => that.enqueue(runfn, resolve, rest));
  }
  
  addAll(runfns: RunFunction[]): Promise<unknown>[] {
    return runfns.map((item: RunFunction) => this.add(item))
  }

  get size(): number {
    return this._queue.size;
  }

  get pending(): number {
    return this._pendingCount;
  }
}

export default AsyncPool;
