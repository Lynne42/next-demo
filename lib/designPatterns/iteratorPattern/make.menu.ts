
import Iterator from './iterator.interface';
import MenuItem from './menuItem.class';


class MakeMenu {
    public breakfastMenu: BreakfastMenu;
    public lunchMenu: LunchMenu;


    constructor(breakfastMenu: BreakfastMenu, lunchMenu: LunchMenu) {
        this.breakfastMenu = breakfastMenu;
        this.lunchMenu = lunchMenu;
    }

    /**
     * printMenu
     */
    public printMenu() {
        
    }

    /**
     * printBreakfastMenu
     */
    public printBreakfastMenu() {
        const list = this.breakfastMenu.createIterator();
        return this.print(list);
    }

    /**
     * printLunchMenu
     */
    public printLunchMenu() {
        const list = this.lunchMenu.createIterator();
        return this.print(list);
    }

    /**
     * printVegetarianMenu
     */
    public printVegetarianMenu() {
        const breakfastList = this.breakfastMenu.createIterator();
        const lunchList = this.lunchMenu.createIterator();
        const str1 = this.printVegetarian(breakfastList);
        const str2 = this.printVegetarian(lunchList);
        return  str1 + '|' + str2
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
}

export default MakeMenu;