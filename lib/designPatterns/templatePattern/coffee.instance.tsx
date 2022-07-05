import CoffeeBase from './abstract.coffee';

class Coffee extends CoffeeBase{

    brew() {
        console.log('dripping coffee through filter');
    }

    addComdiments() {
        console.log('add sugar and milk');
    }
}

export default Coffee;