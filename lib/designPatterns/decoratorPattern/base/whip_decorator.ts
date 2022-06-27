import CondimentDecorator from './condiment';
import Beverage from './beverage';

class WhipDecorator extends CondimentDecorator {

    public discription: string = '';

    private beverage: Beverage;

    constructor(bg: Beverage) {
        super();
        this.beverage = bg;
    }

    public getDiscription(): string {
        return this.discription + 'whip';
    }

    public cost(): number {
        return 1.4 + this.beverage.cost();
    }
}

export default WhipDecorator;