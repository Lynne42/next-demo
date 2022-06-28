import StringDecorator from './string_decorator';
import StringBase from './string_base';

class ToUpperCaseDecorator extends StringDecorator {
    public str: string = '';

    private stringBase: StringBase;

    constructor(sb: StringBase) {
        super();
        this.stringBase = sb;
        this.str = this.stringBase.getStr();
    }

    public toUpperCase(): string {
        return this.stringBase.getStr().toUpperCase();
    }

}

export default ToUpperCaseDecorator;