import { QuackBehavior } from './quackBehavior';

export class Quack implements QuackBehavior {
    quack(): void {
        console.log('quack, quack')
    }
    
}


export class MuteQuack implements QuackBehavior {
    quack(): void {
        console.log('《silence》')
    }
}

export class SQuack implements QuackBehavior {
    quack(): void {
        console.log('Squack')
    }
}