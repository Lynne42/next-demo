
export enum SizeType  {
    'tall'= 'tall',
    'grande' = 'grande',
    'venti' = 'venti',
}
abstract class Beverage {
    public discription: string = '';
    public size: SizeType = SizeType.grande;

    public getDiscription() {
        return this.discription;
    }

    public getSize() {
        return this.size;
    }

    public setSize(size: SizeType) {
        this.size = size;
    }

    public abstract cost(): number;

}

export default Beverage