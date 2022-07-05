import Duck from './duck.interface';
import Turkey  from './turkey.interface';

class TurkeyAdapter implements Duck {
    turkey: Turkey;

    constructor(turkey: Turkey) {
        this.turkey = turkey;
    }

    quack(): string {
        return this.turkey.gobble();
    }

    fly(): string {
        return this.turkey.fly();
    }
}

export default TurkeyAdapter;