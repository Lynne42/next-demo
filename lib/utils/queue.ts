class Node {
  value: any;
  next: any;
  constructor(value: any) {
    this.value = value;
    this.next = null;
  }
}
export default class Queue {
  headNode: any;
  tailNode: any;
  size: number;

  constructor() {
    this.headNode = null;
    this.tailNode = null;
    this.size = 0;
  }

  enqueue(node: any) {
    const newNode = new Node(node);
    if (this.headNode) {
      this.tailNode.next = newNode;
      this.tailNode = newNode;
    } else {
      this.headNode = newNode;
      this.tailNode = newNode;
    }
    this.size++;
  }
  dequeue() {
    const current = this.headNode;
    if (!current) {
      return;
    }
    this.headNode = this.headNode.next;
    this.size--;
    return current.value;
  }
  clear() {
    this.headNode = null;
    this.tailNode = null;
    this.size = 0;
  }
  get count() {
    return this.size;
  }
}
