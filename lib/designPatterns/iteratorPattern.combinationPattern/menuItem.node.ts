
import MenuComponent from './component';

class MenuItem extends MenuComponent {

    constructor(name: string, description: string, vegetarian: boolean, price: number) {
        super(name, description, vegetarian, price);
    }

    print() {
        return this.getInfo()
    }

    
}

export default MenuItem;