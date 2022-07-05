class MenuItem {

    public name: string;
    public description: string;
    public vegetarian: boolean;
    public price: number;

    constructor(name: string, description: string, vegetarian: boolean, price: number) {
        this.name = name;
        this.description = description;
        this.vegetarian = vegetarian;
        this.price = price;
    }

    /**
     * getName
     */
    public getName(): string {
        return this.name;
    }

    /**
     * getDescription
     */
    public getDescription(): string {
        return this.description;
    }

    /**
     * getVegetarian
     */
    public getVegetarian(): boolean {
        return this.vegetarian;
    }

    /**
     * getPrice
     */
    public getPrice(): number {
        return this.price;
    }

}

export default MenuItem;