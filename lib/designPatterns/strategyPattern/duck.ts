import { FlyBehavior } from './flyBehavior';
import { QuackBehavior } from './quackBehavior';

abstract class Duck {
    
    public quackBehavior: QuackBehavior;

    public flyBehavior: FlyBehavior;

    swim() {
        console.log('duck swim')
    }

    /**
     * 每个鸭子实例的形状都不同， 这是一个抽象方法
     * 该方法需要在子类中自己实现，覆盖超类中的方法
     */
    abstract display(): void


    /**
     * quack() {}: 鸭子飞的行为，并不是所有的鸭子都会飞，
     * 只有会飞的鸭子才需要实现此方法
     * 拥有这种性质的行为不适合使用继承来实现
     */
     public performQuack() {
        this.quackBehavior.quack();
    }

    /**
     * fly() {}: 鸭子飞的行为，并不是所有的鸭子都会飞，
     * 只有会飞的鸭子才需要实现此方法
     * 拥有这种性质的行为不适合使用继承来实现
     */
    performFly() {
        this.flyBehavior.fly();
    }

    /**
     * 设置"飞行"行为
     */
    setFlyBehavior(fb: FlyBehavior) {
        this.flyBehavior = fb;
    }

    /**
     * 设置"声音"行为
     */
    setQuackBehavior(qb: QuackBehavior) {
        this.quackBehavior = qb;
    }
    
}


export default Duck;