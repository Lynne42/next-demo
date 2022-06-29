import Pizza from "./pizza";

abstract class PizzaStore {
  public abstract createPizza(type: string): Pizza | null;

  public orderPizza(type: string, callback: Function) {
    const pizza = this.createPizza(type);
    if (pizza) {
      let str: any = "";
      str = pizza.prepare();

      callback(str);
      str = pizza.bake();
      callback(str);
      str = pizza.cut();
      callback(str);
      str = pizza.box();
      callback(str);
    } else {
        callback("error pizza");
    }
    callback('finish success');
  }
}

export default PizzaStore;
