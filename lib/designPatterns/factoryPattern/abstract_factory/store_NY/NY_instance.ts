import NYpizzaStore from "./NYpizzaStore";

class CheesePizza {
  public store: any;

  public step: string = "";

  constructor() {
    this.store = new NYpizzaStore();
  }

  currentStep(str: string) {
    this.step = this.step + " / " + str;
  }

  init() {
    this.store.orderPizza("cheese", this.currentStep.bind(this));
  }

  getStep() {
    return this.step;
  }
}

export default CheesePizza;
