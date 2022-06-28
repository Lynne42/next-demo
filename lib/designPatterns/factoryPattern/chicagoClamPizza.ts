import Pizza from './pizza';

class ChicagoClamPizza extends Pizza {
    constructor() {
        super();
        this.name = 'clam';
        this.dough = 'clam dough';
        this.sauce = 'clam sauce';
        this.toppings.push('clam top1');
    }
}

export default ChicagoClamPizza;