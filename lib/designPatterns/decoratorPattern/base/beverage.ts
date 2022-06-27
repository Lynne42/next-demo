
abstract class Beverage {
    public discription: string = '';

    public getDiscription() {
        return this.discription;
    }

    public abstract cost(): number;

}

export default Beverage