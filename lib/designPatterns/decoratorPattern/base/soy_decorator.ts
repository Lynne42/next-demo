import CondimentDecorator from './condiment';
import Beverage from './beverage';

class SoyDecorator extends CondimentDecorator {

    public discription: string = '';

    private beverage: Beverage;

    constructor(bg: Beverage) {
        super();
        this.beverage = bg;
    }

    public getDiscription(): string {
        return this.discription + 'soy';
    }

    public cost(): number {
        return 2.4 + this.beverage.cost();
    }
}

export default SoyDecorator;