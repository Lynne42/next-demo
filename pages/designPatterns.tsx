import React, { useEffect } from "react";
import SingletonInstance from "@/lib/designPatterns/singletonPattern";
import ObserverPattern from "@/lib/designPatterns/observerPattern";

type Props = {};

const DesignPatterns: React.FunctionComponent<Props> = () => {
  useEffect(() => {}, []);
  return (
    <ul className="w-1/2 m-[100px] mx-auto">
      <li>
        <ObserverPattern />
      </li>
      <li>
        <SingletonInstance />
      </li>
    </ul>
  );
};
export default DesignPatterns;
