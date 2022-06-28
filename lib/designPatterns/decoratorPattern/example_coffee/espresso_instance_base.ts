import Beverage from './base/beverage';

class EspressoInstance extends Beverage {
    constructor() {
        super();
        this.discription = 'espresso_instance';
    }

    public cost(): number {
        return 1
    }
}


export default EspressoInstance;