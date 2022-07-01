import React, { useEffect } from "react";
import SingleDefault from './singletonPattern/single_default';

interface Props {}
const SingletonPatter: React.FunctionComponent<Props> = () => {
  useEffect(() => {
    const singleInstance = SingleDefault.getInstance();
    singleInstance.test();

  }, []);
  return <section className="font-bold">SingletonPattern</section>;
};
export default SingletonPatter;
