import Beverage, { SizeType } from './beverage';

abstract class CondimentDecorator extends Beverage {
    public abstract discription: string;
    public abstract size: SizeType;
}

export default CondimentDecorator;