import { PizzaFactory } from '../pizzaFactory';
import ThincruseDouch from '../stock/dough/thincruse';
import TomatoSauce from '../stock/sauce/tomato';

class NYPizzaFactory implements PizzaFactory {
    
    createDough() {
        return new ThincruseDouch();
    }
    
    createSauce() {
        return new TomatoSauce();
    }

}

export default NYPizzaFactory;