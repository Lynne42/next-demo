
import Iterator from './iterator.interface';
import MenuItem from './menuItem.class';

import IteratorArray from './iterator.array';

class MakeMenuOptimize {

    public menus: Array<any>;

    constructor(menus: Array<any>) {
        this.menus = menus;
    }

    /**
     * printMenu
     */
    public printMenu() {
        let str = '';
        const iterator = this.createIterator();
        while(iterator.hasNext()) {
            const menu = iterator.next();
            str += this.print(menu.createIterator()) + '-';
        }

        return str;
    }

    /**
     * printBreakfastMenu
     */
    public printBreakfastMenu() {
        
    }

    /**
     * printLunchMenu
     */
    public printLunchMenu() {
        
    }

    /**
     * printVegetarianMenu
     */
    public printVegetarianMenu() {
        
    }


    /**
     * print
     */
    public print(iterator: Iterator) {
        let str = '';
        while (iterator.hasNext()) {
            const menuItem: MenuItem = iterator.next();
            
            str += menuItem.getInfo() + '|';
        }
        return str;
    }

    /**
     * printVegetarian
     */
    public printVegetarian(iterator: Iterator) {
        let str = '';
        while (iterator.hasNext()) {
            const menuItem: MenuItem = iterator.next();
            const isVegetarian: boolean = menuItem.getVegetarian();
            if(isVegetarian) {
                str += menuItem.getInfo() + '|';
            }
            
        }
        return str;
    }

    /**
     * createIterator
     */
     public createIterator() {
        return new IteratorArray(this.menus);
    }
}

export default MakeMenuOptimize;