import Beverage from './base/beverage';

class HouseInstance extends Beverage {
    constructor() {
        super();
        this.discription = 'house_instance';
    }

    public cost(): number {
        return 2.5
    }
}


export default HouseInstance;