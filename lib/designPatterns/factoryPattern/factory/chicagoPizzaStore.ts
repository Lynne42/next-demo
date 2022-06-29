import PizzaStore from './pizzaStore';
import ChicagoCheesePizza from './chicagoCheesePizza';
import ChicagoClamPizza from './chicagoClamPizza';

class ChicagoPizzaStore extends PizzaStore {
    createPizza(type: string) {
        if(type === 'cheese') {
            return new ChicagoCheesePizza()
        } else if(type === 'clam') {
            return new ChicagoClamPizza()
        } else {
            return null
        }
    }
}

export default ChicagoPizzaStore;