import Duck from './duck.interface';

class MallaryDuck implements Duck {
    quack(): string {
        return 'duck quack';
    }

    fly(): string {
        return 'duck fly';
    }
}

export default MallaryDuck;