import { FlyBehavior } from './flyBehavior';

export class FlyWithWings implements FlyBehavior {
    fly(): void {
        console.log('fly with wings')
    }
    
}



export class FlyNoWay implements FlyBehavior {
    fly(): void {
        console.log('fly no  way')
    }
}


export class FlyRocketPowered implements FlyBehavior {
    fly(): void {
        console.log('I am flying with a rocket')
    }
}