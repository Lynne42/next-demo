import Pizza from "../pizza";
import { PizzaFactory } from "../pizzaFactory";

class ChicagoPizza extends Pizza {
  public factory: PizzaFactory;

  constructor(factory: PizzaFactory) {
    super();
    this.factory = factory;
  }

  prepare(): string {
    this.dough = this.factory.createDough().dough;
    this.sauce = this.factory.createSauce().sauce;
    const str = this.getInfo();
    return `${str}, prepare`;
  }
}

export default ChicagoPizza;
