import StringBase from './string_base';

class InputInstance extends StringBase {

    constructor() {
        super();
    }

    toUpperCase() {
        return this.getStr();
    }
}

export default InputInstance;