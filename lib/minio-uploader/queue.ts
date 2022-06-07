export type RunFunction = (...rest: any) => Promise<unknown>;

export interface Queue {
  size: number;
  dequeue: () => RunFunction | undefined;
  enqueue: (node: RunFunction) => void;
  clear: () => void;
}

class Node {
  value: any;
  next: any;
  constructor(value: any) {
    this.value = value;
    this.next = null;
  }
}
class TaskQueue implements Queue {
  private _headNode: any;

  private _tailNode: any;

  private _count: number;

  constructor() {
    this._headNode = null;
    this._tailNode = null;
    this._count = 0;
  }

  enqueue(node: RunFunction) {
    const newNode = new Node(node);
    if (this._headNode) {
      this._tailNode.next = newNode;
      this._tailNode = newNode;
    } else {
      this._headNode = newNode;
      this._tailNode = newNode;
    }
    this._count += 1;
  }

  dequeue() {
    const current = this._headNode;
    if (!current) {
      return undefined;
    }
    this._headNode = this._headNode.next;
    this._count -= 1;

    return current.value;
  }

  clear() {
    this._headNode = null;
    this._tailNode = null;
    this._count = 0;
  }

  get size(): number {
    return this._count;
  }
}

export default TaskQueue;
