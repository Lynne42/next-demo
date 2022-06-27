import Beverage from './beverage';

abstract class CondimentDecorator extends Beverage {
    public abstract discription: string;
}

export default CondimentDecorator;