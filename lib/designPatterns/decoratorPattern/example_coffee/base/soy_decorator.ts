import CondimentDecorator from './condiment';
import Beverage, { SizeType } from './beverage';

const priceConfig = {
    [SizeType.tall]: 1.1,
    [SizeType.grande]: 2.1,
    [SizeType.venti]: 3.1,
}
class SoyDecorator extends CondimentDecorator {
    public discription: string = '';
    public size: SizeType;

    private beverage: Beverage;
    private price: number = 0;

    constructor(bg: Beverage) {
        super();
        this.beverage = bg;
        const size:SizeType  = this.beverage.getSize();
        this.size = size;
        this.price = priceConfig[size];
        this.discription = this.beverage.discription + ', soy';
    }

    public getDiscription(): string {
        
        return this.discription;
    }

    public cost(): number {
        return this.price + this.beverage.cost();
    }
}

export default SoyDecorator;