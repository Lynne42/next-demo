import React, { useEffect, useState } from "react";
import EspressoInstance from './decoratorPattern/espresso_instance';

interface Props {}
const DecoratorPattern: React.FunctionComponent<Props> = () => {
  const [info, setInfo] = useState<any>('');
  useEffect(() => {
    const espressoCoffee = new EspressoInstance();
    setInfo(espressoCoffee.info())
  }, []);


  return (
    <section>
      <h2>Decorator</h2>
      <p>describe: { info.describe }</p>
      <p>cost: { info.cost }</p>
    </section>
  );
};
export default DecoratorPattern;
