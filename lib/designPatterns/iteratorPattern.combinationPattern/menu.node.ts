
import MenuComponent from './component';
import IteratorArray from './iterator.array';
import Iterator from './iterator.interface';


class Menus extends MenuComponent {

    public menus: Array<MenuComponent> = [];

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

    print() {
        
    }

    private printChild() {
        let arr = [];
        const iterator = new IteratorArray(this.menus);
        while(iterator.hasNext()) {
            const menu = iterator.next();
            try {
                if(menu.getChild()) {
                    
                }
            } catch (err: any) {
                arr.push(this.printLeaf(menu))
            }
        }
    }

    private printLeaf(menuItem: MenuComponent) {
        return menuItem.getInfo();
    }
}

export default Menus;