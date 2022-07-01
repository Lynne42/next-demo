import React, { useEffect, useState } from "react";

import {
  Duck,
  MallardDuck,
  RubberDuck,
  RedheadDuck,
  ModalDuck,
} from "./strategyPattern/index";

import { FlyRocketPowered } from './strategyPattern/fly';

interface Props {}
const StrategyPattern: React.FunctionComponent<Props> = () => {
  useEffect(() => {
    console.log('------ MallardDuck ------')
    const mallardDuck = new MallardDuck();
    mallardDuck?.performFly();
    mallardDuck?.performQuack();
    console.log('------ MallardDuck ------')

    console.log('------ RubberDuck ------')
    const rubberDuck = new RubberDuck();
    rubberDuck?.performFly();
    rubberDuck?.performQuack();
    console.log('------ RubberDuck ------')


    console.log('------ ModalDuck ------')
    const modalDuck = new ModalDuck();
    modalDuck?.performFly();
    modalDuck.setFlyBehavior(new FlyRocketPowered());
    modalDuck?.performFly();
    console.log('------ ModalDuck ------')

  }, []);
  return (
    <section>
      <h2 className="font-bold">StrategyPattern</h2>
    </section>
  );
};
export default StrategyPattern;
