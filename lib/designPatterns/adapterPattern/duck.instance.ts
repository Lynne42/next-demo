import MallaryDuck from './mallaryDuck';
import WildTurkey from './wildTurkey';
import TurkeyAdapter from './turkey.adapter';
import Duck from './duck.interface';

class DuckInstance {
    mallaryDuck: MallaryDuck;
    wildTurkey: WildTurkey;
    turkeyAdapter: TurkeyAdapter;

    init(callback: Function) {
        this.mallaryDuck = new MallaryDuck();
        this.wildTurkey = new WildTurkey();
        this.turkeyAdapter = new TurkeyAdapter(this.wildTurkey);

        console.log(111, this.wildTurkey.gobble())
        callback(this.wildTurkey.gobble());

        callback(this.testDuck(this.mallaryDuck));

        callback(this.testDuck(this.turkeyAdapter));

    }

    testDuck(duck: Duck) {
        const a = duck.quack();
        const b = duck.fly();

        return a + '---' + b;

    }
}

export default DuckInstance;