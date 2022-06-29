abstract class Pizza {
  public name: string = "";
  public dough: string = '';
  public sauce: string = '';
 
  abstract prepare(): string;

  getName() {
    return this.name;
  }

  setName(name: string) {
    this.name = name;
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
    return `${str}, cutting`;
  }

  box() {
    const str = this.getInfo();
    return `${str}, boxing`;
  }
}

export default Pizza;
