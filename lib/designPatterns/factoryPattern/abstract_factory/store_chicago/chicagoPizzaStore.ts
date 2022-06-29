import Pizza from '../pizza';
import PizzaStore from '../pizzaStore';
import { PizzaFactory } from '../pizzaFactory';
import ChicagoPizza from './chicagoPizza';
import ChicagoPizzaFactory from './chicagoPizzaFactory';

class ChicagoPizzaStore extends PizzaStore {

    public factory: PizzaFactory;

    constructor() {
        super();

        this.factory = new ChicagoPizzaFactory();
    }

    public createPizza(type: string): Pizza | null {
        let pizza: Pizza | null = null;
        if(type === 'chicago') {
            pizza = new ChicagoPizza(this.factory);
            pizza.setName('chicago');
        }

        return pizza;
    }

}

export default ChicagoPizzaStore;