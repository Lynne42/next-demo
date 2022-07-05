import React, { useCallback, useEffect, useState } from "react";
import AdapterDuckInstance from "./adapterPattern/duck.instance";

interface Props {}
const AdapterPattern: React.FunctionComponent<Props> = () => {
  const [info, setInfo] = useState<string[]>([]);

  useEffect(() => {
    const adapterDuckInstance = new AdapterDuckInstance();
    adapterDuckInstance.init((str: string) =>
      console.log("AdapterPattern:" + str)
    );
  }, []);

  return (
    <section>
      <h2 className="font-bold">AdapterPattern</h2>
      <div>{info}</div>
    </section>
  );
};
export default AdapterPattern;
