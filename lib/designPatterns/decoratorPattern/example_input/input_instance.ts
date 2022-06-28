import StringBase from './string_base';
import InputInstanceBase from './input_instance_base';
import ToUpperCaseDecorator from './toUpperCase_decorator';

class InputInstance {
    private base: StringBase;

    constructor() {
        let base = new InputInstanceBase();
        base.setStr('qln');
        base = new ToUpperCaseDecorator(base);
        this.base = base;
    }

    public getUpperCase() {
        return this.base.toUpperCase();
    }

}

export default InputInstance;