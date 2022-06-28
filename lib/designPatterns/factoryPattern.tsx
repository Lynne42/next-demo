import React, { useEffect, useState } from "react";
import PizzaInstance from "./factoryPattern/pizza_instance";

interface Props {}
const FactoryPattern: React.FunctionComponent<Props> = () => {
  const [info, setInfo] = useState<any>("");

  useEffect(() => {
    const pizza = new PizzaInstance();
    pizza.init();
    setInfo(pizza.getStep());
  }, []);

  return (
    <section>
      <h2>Factory</h2>
      {info.split("/").map((item: string, index: number) => (
        <p key={index}>{item}</p>
      ))}
    </section>
  );
};
export default FactoryPattern;
