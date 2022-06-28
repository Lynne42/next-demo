import StringBase from './string_base';

abstract class StringDecorator extends StringBase {
    public abstract str: string;
}

export default StringDecorator;