import MenuItem from './menuItem.class';
import IteratorMap from './iterator.map';

class LunchMenu {
    public list: any= new Map();
    
    constructor() {
        this.makeMenu();
    }
    
    /**
     * makeMenu
     */
    public makeMenu() {
        this.addMenu('1', 'this is LunchMenu 1',true, 1.1);
        this.addMenu('2', 'this is LunchMenu 2',false, 2.1);
        this.addMenu('3', 'this is LunchMenu 3',true, 3.1);
        this.addMenu('4', 'this is LunchMenu 4',false, 4.1);
    }

    /**
     * addMenu
     */
    public addMenu(name: string, description: string, vegetarian: boolean, price: number) {
        const menu: MenuItem = new MenuItem(name, description, vegetarian, price);
        const size = this.list.size;
        this.list.set(size, menu);
    }

    /**
     * createIterator
     */
    public createIterator() {
        return new IteratorMap(this.list)
    }

}

export default LunchMenu;