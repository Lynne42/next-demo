import Beverage, { SizeType } from './base/beverage';

import MochaDecorator from './base/mocha_decorator';
import WhipDecorator from './base/whip_decorator';

import EspressoInstanceBase from './espresso_instance_base';


class EspressoInstance {
    public instance: Beverage;

    constructor() {
        let base: Beverage = new EspressoInstanceBase();
        base.setSize(SizeType.venti);
        base = new WhipDecorator(base);
        base = new WhipDecorator(base);
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

export default EspressoInstance;