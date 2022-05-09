import React, { ChangeEventHandler, useEffect } from 'react';

interface Props {
    handleChange: ChangeEventHandler<HTMLInputElement>;
    inputValue: string;
}
const InputComponent: React.FunctionComponent<Props> = (props) => {
    const { handleChange, inputValue } = props;
    useEffect(() => {
     
     }, [])
    return (
        <section>
            <input onChange={handleChange} value={inputValue} className="border px-1 h-[32px] rounded-[4px]"/>
            <span>{inputValue}</span>
        </section>
    );
};
export default InputComponent;