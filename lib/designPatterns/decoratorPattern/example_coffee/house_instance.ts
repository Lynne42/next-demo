import Beverage from './base/beverage';

import MochaDecorator from './base/mocha_decorator';
import WhipDecorator from './base/whip_decorator';
import SoyDecorator from './base/soy_decorator';

import HouseInstanceBase from './house_instance_base';


class HouseInstance {
    public instance: Beverage;

    constructor() {
        let base: Beverage = new HouseInstanceBase();
        base = new WhipDecorator(base);
        base = new SoyDecorator(base);
        this.instance = new MochaDecorator(base);
    }

    info() {
        return {
            cost: this.instance.cost(),
            describe: this.instance.getDiscription(),
            size: this.instance.getSize(),
        }
    }

}

export default HouseInstance;