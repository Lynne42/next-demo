import BreakfastMenu from './menu.breakfast';
import LunchMenu from './menu.lunch';
import MakeMenu from './make.menu';


class InstanceMenu {
    public menu: MakeMenu;

    /**
     * createBreakfast
     */
    public createBreakfast(callback: Function) {
        const breakfastMenu = new BreakfastMenu();
        const lunchMenu = new LunchMenu();

        breakfastMenu.makeMenu();
        lunchMenu.makeMenu();

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

        breakfastMenu.makeMenu();
        lunchMenu.makeMenu();

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

        breakfastMenu.makeMenu();
        lunchMenu.makeMenu();

        this.menu = new MakeMenu(breakfastMenu, lunchMenu);
        const str = this.menu.printVegetarianMenu();
        callback(str)
    }


}

export default InstanceMenu;