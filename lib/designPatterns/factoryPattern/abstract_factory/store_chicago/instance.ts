import ChicagoPizzaStore from "./chicagoPizzaStore";

class ChicagoInstance {
  public store: any;

  public step: string = "";

  constructor() {
    this.store = new ChicagoPizzaStore();
  }

  currentStep(str: string) {
    this.step = this.step + " / " + str;
  }

  init() {
    this.store.orderPizza("chicago", this.currentStep.bind(this));
  }

  getStep() {
    return this.step;
  }
}

export default ChicagoInstance;
