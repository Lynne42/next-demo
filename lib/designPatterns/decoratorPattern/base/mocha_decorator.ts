import CondimentDecorator from './condiment';
import Beverage from './beverage';

class MochaDecorator extends CondimentDecorator {

    public discription: string = '';

    private beverage: Beverage;

    constructor(bg: Beverage) {
        super();
        this.beverage = bg;
    }

    public getDiscription(): string {
        return this.discription + 'mocha';
    }

    public cost(): number {
        return 3.4 + this.beverage.cost();
    }
}

export default MochaDecorator;