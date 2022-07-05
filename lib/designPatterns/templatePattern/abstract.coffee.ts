import Base from './abstract.base';

abstract class Coffee extends Base {
    prepare() {
        this.boilWater();
        this.brew();
        this.pourInGup();
        this.addComdiments();
    }

    abstract brew(): void;

    abstract addComdiments(): void;
}


export default Coffee;