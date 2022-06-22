import React, { useEffect } from "react";

interface Props {}
const SingletonInstance: React.FunctionComponent<Props> = () => {
  useEffect(() => {
    class SingletonPattern {
      static #instance: SingletonPattern = new SingletonPattern();

      private constructor() {}

      getName() {
        return "ql";
      }

      public static getInstance() {
        return SingletonPattern.#instance;
      }
    }

    const singletonInstance = SingletonPattern.getInstance();

  }, []);
  return <section>singletonPattern</section>;
};
export default SingletonInstance;
