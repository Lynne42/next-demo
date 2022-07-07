import BreakfastMenu from './menu.breakfast';
import LunchMenu from './menu.lunch';
import MakeMenu from './make.menu';

import MakeMenuOptimize from './make.menu.optimize';

class InstanceMenu {
    public menu: MakeMenu;
    public menuOptimize: MakeMenuOptimize;

    /**
     * createBreakfast
     */
    public createBreakfast(callback: Function) {
        const breakfastMenu = new BreakfastMenu();
        const lunchMenu = new LunchMenu();

        this.menu = new MakeMenu(breakfastMenu, lunchMenu);
        const str = this.menu.printBreakfastMenu();
        callback(str)
    }

    /**
     * createBreakfast
     */
     public createLunch(callback: Function) {
        const breakfastMenu = new BreakfastMenu();
        const lunchMenu = new LunchMenu();

        this.menu = new MakeMenu(breakfastMenu, lunchMenu);
        const str = this.menu.printLunchMenu();
        callback(str)
    }

    /**
     * createBreakfast
     */
     public createVegetarian(callback: Function) {
        const breakfastMenu = new BreakfastMenu();
        const lunchMenu = new LunchMenu();


        this.menu = new MakeMenu(breakfastMenu, lunchMenu);
        const str = this.menu.printVegetarianMenu();
        callback(str)
    }

    /**
     * createAllMenu
     */
    public createAllMenu(callback: Function) {
        const breakfastMenu = new BreakfastMenu();
        const lunchMenu = new LunchMenu();

        this.menuOptimize = new MakeMenuOptimize([breakfastMenu, lunchMenu]);

        const str = this.menuOptimize.printMenu();

        callback(str);

    }


}

export default InstanceMenu;