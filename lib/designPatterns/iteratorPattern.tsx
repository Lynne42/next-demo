import React, { useEffect, useState } from "react";
import AdapterDuckInstance from "./adapterPattern/duck.instance";

interface Props {}
const IteratorPattern: React.FunctionComponent<Props> = () => {
  const [info, setInfo] = useState<string[]>([]);

  useEffect(() => {
    
  }, []);

  return (
    <section>
      <h2 className="font-bold">IteratorPattern</h2>
      <div>{info}</div>
    </section>
  );
};
export default IteratorPattern;
