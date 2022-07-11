import Iterator from './iterator.interface';
import MenuComponent from './component';
class IteratorComposite implements Iterator {

    public arr: Array<any> = [];
    public index: number = 0;

    constructor(compt: Iterator) {
        this.arr.push(compt);
    }

    hasNext(): boolean {
        const len = this.arr.length;
        if(!len) {
            return false
        }
        const last = this.arr[len - 1];
        if(!last.hasNext()) {
            this.arr.pop();
            return this.hasNext();
        } else {
            return true
        }
    }

    next(): any {
        if(this.hasNext()) {
            const len = this.arr.length;
            const last = this.arr[len - 1];
            const component = last.next();
            if(component instanceof MenuComponent) {
                this.arr.push(component.createIterator())
            }
            return component
        } else {
            return null;
        }
    }
}

export default IteratorComposite;