import { PizzaFactory } from '../pizzaFactory';
import ThickDouch from '../stock/dough/thick';
import PotatoSauce from '../stock/sauce/potato';

class ChicagoPizzaFactory implements PizzaFactory {
    createDough() {
        return new ThickDouch();
    }

    createSauce() {
        return new PotatoSauce();
    }
}

export default ChicagoPizzaFactory;