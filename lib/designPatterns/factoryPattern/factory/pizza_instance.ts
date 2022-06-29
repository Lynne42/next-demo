import ChicagoPizzaStore from './chicagoPizzaStore';

class PizzaInstance {
    public step: string = '';

    currentStep(str: string) {
        this.step = this.step + ' / ' + str;
    }

    init() {
        const chicagoPizzaStore = new ChicagoPizzaStore();
        chicagoPizzaStore.orderPizza('cheese', this.currentStep.bind(this));
    }

    getStep() {
        return this.step;
    }

}

export default PizzaInstance;