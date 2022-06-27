import Beverage from './base/beverage';
import EspressoInstanceBase from './espresso_instance_base';


class EspressoInstance {
    public instance: Beverage;

    constructor() {
        this.instance = new EspressoInstanceBase();
    }

    info() {
        return {
            cost: this.instance.cost(),
            describe: this.instance.getDiscription()
        }
    }

}

export default EspressoInstance;