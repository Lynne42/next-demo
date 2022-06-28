
import React, { useEffect, useState } from "react";
import EspressoInstance from "./decoratorPattern/example_coffee/espresso_instance";
import HouseInstance from './decoratorPattern/example_coffee/house_instance';

import InputInstance from './decoratorPattern/example_input/input_instance';

interface Props {}
const DecoratorPattern: React.FunctionComponent<Props> = () => {
  const [info, setInfo] = useState<any>("");
  const [houseInfo, setHouseInfo] = useState<any>("");
  const [inputValue, setInputValue] = useState<any>("");

  useEffect(() => {
    const espressoCoffee = new EspressoInstance();
    setInfo(espressoCoffee.info());

    const houseInstance = new HouseInstance();
    setHouseInfo(houseInstance.info());

    const inputInstance = new InputInstance();
    setInputValue(inputInstance.getUpperCase())

  }, []);

  return (
    <section>
      <h2>Decorator</h2>
      <div className="pl-[20px] py-[12px] border-b border-slate-200 ">
        <p>type: espresso_coffee</p>
        <p>describe: {info.describe}</p>
        <p>size: {info.size}</p>
        <p>cost: {info.cost}</p>
      </div>
      <div className="pl-[20px] py-[12px]">
        <p>type: house_coffee</p>
        <p>describe: {houseInfo.describe}</p>
        <p>size: {houseInfo.size}</p>
        <p>cost: {houseInfo.cost}</p>
      </div>

      <div className="pl-[20px] py-[12px]">
        <p>type: input_toUpperCase</p>
        <p>inputValue: {inputValue}</p>
        
      </div>
    </section>
  );
};
export default DecoratorPattern;
