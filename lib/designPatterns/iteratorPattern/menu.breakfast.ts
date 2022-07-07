import MenuItem from './menuItem.class';
import IteratorArray from './iterator.array';

class BreakfastMenu {
    public list: MenuItem[] = [];

    constructor() {
        this.makeMenu();
    }
    
    /**
     * makeMenu
     */
    public makeMenu() {
        this.addMenu('1', 'this is BreakfastMenu 1',false, 1.2);
        this.addMenu('2', 'this is BreakfastMenu 2',true, 2.2);
        this.addMenu('3', 'this is BreakfastMenu 3',false, 3.2);
        this.addMenu('4', 'this is BreakfastMenu 4',true, 4.2);
    }

    /**
     * addMenu
     */
    public addMenu(name: string, description: string, vegetarian: boolean, price: number) {
        const menu: MenuItem = new MenuItem(name, description, vegetarian, price);
        this.list.push(menu);
    }

    /**
     * createIterator
     */
    public createIterator() {
        return new IteratorArray(this.list);
    }
}

export default BreakfastMenu;