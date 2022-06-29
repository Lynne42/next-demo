import React, { useEffect, useState } from "react";
import PizzaInstance from "./factoryPattern/factory/pizza_instance";

import CheesePizza from "./factoryPattern/abstract_factory/store_NY/NY_instance";
import ChicagoPizza from './factoryPattern/abstract_factory/store_chicago/instance';

interface Props {}
const FactoryPattern: React.FunctionComponent<Props> = () => {
  const [info, setInfo] = useState<any>("");

  const [info2, setInfo2] = useState<any>("");

  const [info3, setInfo3] = useState<any>("");

  useEffect(() => {
    const pizza = new PizzaInstance();
    pizza.init();
    setInfo(pizza.getStep());

    const pizza2 = new CheesePizza();
    pizza2.init();
    setInfo2(pizza2.getStep());


    const pizza3 = new ChicagoPizza();
    pizza3.init();
    setInfo3(pizza3.getStep());

  }, []);

  return (
    <section>
      <h2>Factory</h2>
      <div className="pl-[20px] py-[12px]">
        {info.split("/").map((item: string, index: number) => (
          <p key={index}>{item}</p>
        ))}
      </div>

      <div className="pl-[20px] py-[12px]">
        {info2.split("/").map((item: string, index: number) => (
          <p key={index}>{item}</p>
        ))}
      </div>

      <div className="pl-[20px] py-[12px]">
        {info3.split("/").map((item: string, index: number) => (
          <p key={index}>{item}</p>
        ))}
      </div>

    </section>
  );
};
export default FactoryPattern;
