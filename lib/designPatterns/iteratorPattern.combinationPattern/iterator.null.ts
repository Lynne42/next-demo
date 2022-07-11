import Iterator from './iterator.interface';

class IteratorNull implements Iterator {
    public arr: Array<any>;
    public index: number = 0;

    constructor(arr: Array<any>) {
        this.arr = arr;
    }

    hasNext(): boolean {
        return false
    }

    next(): any {
        
        return null;
    }

}

export default IteratorNull;