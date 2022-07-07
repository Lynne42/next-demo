import Iterator from './iterator.interface';

class IteratorArray implements Iterator {
    public arr: Array<any>;
    public index: number = 0;

    constructor(arr: Array<any>) {
        this.arr = arr;
    }

    hasNext(): boolean {
        if(this.index >= this.arr.length) {
            return false
        }
        return true
    }

    next(): any {
        const item = this.arr[this.index];
        this.index += 1;
        return item;
    }
}

export default IteratorArray;