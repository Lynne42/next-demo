
import MenuComponent from './component';

import Menus from './menu.node';
import MenusItem from './menuItem.node';

class InstanceMenu {
    public breakfastMenu: MenuComponent;
    public lunchMenu: MenuComponent;
    public dinerMenu: MenuComponent;
    public sweetMenu: MenuComponent;
    
    public menus: MenuComponent;
    

    constructor() {
        this.breakfastMenu = new Menus('breakfastMenu', 'breakfastMenu,breakfastMenu');
        this.lunchMenu = new Menus('lunchMenu', 'lunchMenu,lunchMenu');
        this.dinerMenu = new Menus('dinerMenu', 'dinerMenu,dinerMenu');
        this.sweetMenu = new Menus('sweetMenu', 'sweetMenu,sweetMenu');

        this.menus = new Menus('allmenu', 'allmenu');
        
        this.addBreakfast();
        this.addLunch();
        this.addDinner();

        this.addSweetMenu();

        this.menus.add(this.breakfastMenu);
        this.menus.add(this.lunchMenu);
        this.menus.add(this.dinerMenu);
    }

   
    /**
     * addSweetMenu
     */
    public addSweetMenu() {
        this.sweetMenu.add(this.addMenuItem('1', 'this is SweetMenu 1',false, 1.3));
        this.sweetMenu.add(this.addMenuItem('2', 'this is SweetMenu 2',true, 2.3))
    }

    /**
     * addBreakfast
     */
    public addBreakfast() {
        this.breakfastMenu.add(this.addMenuItem('1', 'this is BreakfastMenu 1',false, 1.2));
        this.breakfastMenu.add(this.addMenuItem('2', 'this is BreakfastMenu 2',true, 2.2))
    }

    /**
     * addLunch
     */
    public addLunch() {
        this.lunchMenu.add(this.addMenuItem('1', 'this is LunchMenu 1',true, 1.1));
        this.lunchMenu.add(this.addMenuItem('2', 'this is LunchMenu 2',false, 2.1));
        this.lunchMenu.add(this.sweetMenu);
    }

    /**
     * addDinner
     */
    public addDinner() {
        this.dinerMenu.add(this.addMenuItem('1', 'this is DinnerMenu 1',true, 1.1));
        this.dinerMenu.add(this.addMenuItem('2', 'this is DinnerMenu 2',false, 2.1));
    }

    // add menuItem
    public addMenuItem(name: string, description: string, vegetarian: boolean, price: number) {
        const menu: MenusItem = new MenusItem(name, description, vegetarian, price);
        return menu;
    }

    /**
     * addMenu
     */
    public addMenu(name: string, description: string, vegetarian: boolean, price: number) {
        const BreakfastMenu1 = this.addMenuItem(name, description,vegetarian, price);
        this.breakfastMenu.add(BreakfastMenu1);
    }


}

export default InstanceMenu;