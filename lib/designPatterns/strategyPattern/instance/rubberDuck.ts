import Duck from '../duck';
import { FlyNoWay } from '../fly';
import { MuteQuack } from '../quack';

class RubberDuck extends Duck {
    constructor() {
        super();
        this.behaviorDuck();
    }

    public behaviorDuck() {
        this.quackBehavior = new MuteQuack();
        this.flyBehavior = new FlyNoWay();
    }

    display() {
        console.log('橡皮鸭')
    }
}

export default RubberDuck;