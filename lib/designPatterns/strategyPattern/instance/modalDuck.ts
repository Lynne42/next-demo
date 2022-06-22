import Duck from '../duck';
import { Quack } from '../quack';
import { FlyNoWay } from '../fly';

class ModalDuck extends Duck {
    constructor() {
        super();
        this.behaviorDuck();
    }

    public behaviorDuck() {
        this.quackBehavior = new Quack();
        this.flyBehavior = new FlyNoWay();
    }

    public display() {
        console.log('绿头')
    }
}

export default ModalDuck;