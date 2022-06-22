import Duck from '../duck';

class RedheadDuck extends Duck {
    constructor() {
        super();
    }

    display() {
        console.log('红头')
    }
}

export default RedheadDuck;