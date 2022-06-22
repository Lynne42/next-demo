import Duck from '../duck';
import { Quack } from '../quack';
import { FlyWithWings } from '../fly';

class MallardDuck extends Duck {
    constructor() {
        super();
        this.behaviorDuck();
    }

    public behaviorDuck() {
        this.quackBehavior = new Quack();
        this.flyBehavior = new FlyWithWings();
    }

    public display() {
        console.log('绿头')
    }
}

export default MallardDuck;