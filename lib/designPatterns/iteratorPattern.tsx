import React, { useCallback, useEffect, useState } from "react";
import InstanceMenu from "./iteratorPattern/instance.menu";

interface Props {}
const IteratorPattern: React.FunctionComponent<Props> = () => {
  const [info, setInfo] = useState<string>("");
  const [info2, setInfo2] = useState<string>("");
  const [info3, setInfo3] = useState<string>("");
  const [info4, setInfo4] = useState<string>("");

  const callback = useCallback(
    (str: string) => {
      setInfo(str);
    },
    [setInfo]
  );

  const callback2 = useCallback(
    (str: string) => {
      setInfo2(str);
    },
    [setInfo2]
  );

  const callback3 = useCallback(
    (str: string) => {
      setInfo3(str);
    },
    [setInfo3]
  );

  const callback4 = useCallback(
    (str: string) => {
      setInfo4(str);
    },
    [setInfo4]
  );

  useEffect(() => {
    const menu = new InstanceMenu();
    menu.createBreakfast(callback);

    menu.createLunch(callback2);

    menu.createVegetarian(callback3);

    menu.createAllMenu(callback4);
  }, [callback, callback2, callback3, callback4]);

  return (
    <section>
      <h2 className="font-bold">IteratorPattern</h2>
      <div className="border-b border-slate-200 py-[12px] pl-[20px]">
        {info.split("|").map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
      <div className="border-b border-slate-200 py-[12px] pl-[20px]">
        {info2.split("|").map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
      <div className="border-b border-slate-200 py-[12px] pl-[20px]">
        {info3.split("|").map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
      <div className="pl-[20px]">
        {info4.split("-").filter((item) => !!item).map((item, index) => (
          <div key={index}>
            <p>all-{index}</p>
            {item
              .split("|")
              .filter((item) => !!item)
              .map((value) => (
                <p key={value}>{value}</p>
              ))}
          </div>
        ))}
      </div>
    </section>
  );
};
export default IteratorPattern;