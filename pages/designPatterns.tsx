import React, { useEffect } from "react";
import singletonInstance from "@/lib/designPatterns/singletonPattern";

type Props = {};

const DesignPatterns: React.FunctionComponent<Props> = () => {
  useEffect(() => {
      console.log(singletonInstance.getName())
  }, []);
  return <section>test</section>;
};
export default DesignPatterns;
