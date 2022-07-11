
import MenuComponent from './component';
import IteratorArray from './iterator.array';
import Iterator from './iterator.interface';
import IteratorComposite from './iterator.composite';


class Menus extends MenuComponent {

    public menus: Array<MenuComponent> = [];

    constructor(name: string, description: string) {
        super(name, description);
        
    }

    add(child: MenuComponent): void {
        this.menus.push(child);
    }

    remove(child: MenuComponent) {
        const current = this.menus.findIndex(item => item.name === child.name);
        this.menus.splice(current, 1);
    }

    getChild(): Iterator {
        const iterator = new IteratorArray(this.menus);
        return iterator;
    }

    public getVegetarian(): boolean {
        return false;
    }

    print() {
        return `
        name: ${this.getName()},
        description: ${this.getDescription()},
        menuChild: ${this.printChild()}|,
        `
    }

    private printChild() {
        let arr = [];
        const iterator = new IteratorArray(this.menus);
        while(iterator.hasNext()) {
            const menu = iterator.next();
            arr.push(menu.print())
        }
        return arr.join('-')
    }

    public createIterator() {
        const iterator = new IteratorArray(this.menus);
        return iterator
    }
}

export default Menus;