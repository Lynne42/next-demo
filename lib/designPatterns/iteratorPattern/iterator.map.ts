import Iterator from './iterator.interface';


class IteratorMap implements Iterator {

    public arr: Map<number, any>;
    public index: number = 0;

    constructor(arr: Map<number, any>) {
        this.arr = arr;
        
    }

    hasNext(): boolean {
        if(this.index >= this.arr.size) {
            return false
        }
        return true
    }

    next(): any {
        const item = this.arr.get(this.index);
        this.index += 1;
        return item;
    }
}

export default IteratorMap;