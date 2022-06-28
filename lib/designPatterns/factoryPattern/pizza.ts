abstract class Pizza {
  public name: string = "";
  public dough: string = "";
  public sauce: string = "";
  public toppings: string[] = [];

  prepare() {
    console.log(`name: ${this.name}`);
    console.log(`dough: ${this.dough}`);
    console.log(`sauce: ${this.sauce}`);
    for (let i = 0, len = this.toppings.length; i < len; i++) {
      console.log(this.toppings[i]);
    }

    const str = this.getInfo();
    return `${str}, prepare`;
  }

  getName() {
      return this.name;
  }

  getInfo() {
    return `name: ${this.name}, dough: ${this.dough}, sauce: ${this.sauce}`;
  }

  bake() {
    const str = this.getInfo();
    return `${str}, baking, 60-80m`;
  }

  cut() {
    const str = this.getInfo();
    return `${str}, cutting`
  }

  box() {
    const str = this.getInfo();
    return `${str}, boxing`;
  }
}

export default Pizza;
