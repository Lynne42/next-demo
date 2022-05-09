import React, { ChangeEventHandler } from 'react';

interface Props {
    handleChange: any;
    inputValue: string;
}
const InputComponent: React.FunctionComponent<Props> = (props) => {
    const { handleChange, inputValue } = props;

    return (
        <section>
            <input onChange={handleChange} value={inputValue} className="border px-1 h-[32px] rounded-[4px]" />
            <span>{inputValue}</span>
        </section>
    );
};
export default InputComponent;