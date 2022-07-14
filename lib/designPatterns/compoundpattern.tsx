import React, { useCallback, useEffect, useState } from "react";
import View from './compoundPattern/index';


interface Props {}
const CompoundPattern: React.FunctionComponent<Props> = () => {
  
  const [info, setInfo] = useState<string[]>([]);

  useEffect(() => {
    const view = new View();
    view.init((str: string[]) => setInfo(str));
  }, [setInfo]);


  return (
    <section>
      <h2 className="font-bold">CompoundPattern</h2>
      <ul>
        {
          info.map(item => <li key={item}>{item}</li>)
        }
      </ul>
    </section>
  );
};
export default CompoundPattern;
