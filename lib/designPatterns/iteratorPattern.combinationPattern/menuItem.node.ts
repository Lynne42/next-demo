
import MenuComponent from './component';
import IteratorNull from './iterator.null';

class MenuItem extends MenuComponent {

    constructor(name: string, description: string, vegetarian: boolean, price: number) {
        super(name, description, vegetarian, price);
    }

    print() {
        return this.getInfo()
    }

    public createIterator() {
        const iterator = new IteratorNull([]);
        return iterator
    }
}

export default MenuItem;