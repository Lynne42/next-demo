import Pizza from '../pizza';
import PizzaStore from '../pizzaStore';

import NYPizzaFactory from './NYpizzaFactory';

import CheesePizza from './cheesePizza';

class NYpizzaStore extends PizzaStore {

    nyPizzaFactory: NYPizzaFactory;

    constructor() {
        super();
        this.nyPizzaFactory  = new NYPizzaFactory();
    }

    public createPizza(type: string): Pizza | null {
        let pizza = null;
        if(type === 'cheese') {
            pizza = new CheesePizza(this.nyPizzaFactory);
            pizza.setName('cheese2');
        }
        return pizza;
    }
}

export default NYpizzaStore;