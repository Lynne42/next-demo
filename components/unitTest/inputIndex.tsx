import React, { useState } from "react";
import InputComponent from './input';

interface Props {}
const InputIndex: React.FunctionComponent<Props> = () => {
  const [inputValue, setInputValue] = useState("4");

  const handleChange = (event: any) => {
    setInputValue(event.target.value);
  };

  return (
    <div>
      <InputComponent handleChange={handleChange} inputValue={inputValue} />
    </div>
  );
};
export default InputIndex;
