import Pizza from './pizza';

class ChicagoCheesePizza extends Pizza {
    constructor() {
        super();
        this.name = 'cheese';
        this.dough = 'cheese dough';
        this.sauce = 'cheese sauce';
        this.toppings.push('cheese top1');
    }
}

export default ChicagoCheesePizza;