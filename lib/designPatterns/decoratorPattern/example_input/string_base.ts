abstract class StringBase {
    public str: string = '';

    public getStr(): string {
        return this.str;
    }

    public setStr(value: string) {
        this.str = value;
    }

    public abstract toUpperCase(): string;
}


export default StringBase;