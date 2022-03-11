import type { NextPage } from "next";

import { useCallback } from "react";
import styles from "../styles/Home.module.css";

const PromiseComponent: NextPage = () => {
  const handleSetTimeout = useCallback(() => {
    const wait = (ms: number) =>
      new Promise((resolve) => setTimeout(() => resolve(ms), ms));

    wait(3000)
      .then((ms) => console.log(`wait ${ms} seconds`))
      .catch((err: any) => console.log(err));
  }, []);

  const handleOrder = useCallback(() => {
    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    wait(1).then(() => console.log(4));
    
    Promise.resolve()
      .then(() => console.log(2))
      .then(() => console.log(3));

    console.log(1); // 1, 2, 3, 4
  }, []);

  return (
    <div className={styles.container}>
      <button onClick={handleSetTimeout}>setTimeout</button>
      <button onClick={handleOrder}>时序</button>
    </div>
  );
};

export default PromiseComponent;
