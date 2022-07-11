import React, { useEffect } from "react";
import ObserverPattern from "@/lib/designPatterns/observerPattern";
import DecoratorPattern from "@/lib/designPatterns/decoratorPattern";
import FactoryPattern from '@/lib/designPatterns/factoryPattern';
import SingletonPatter from '@/lib/designPatterns/singletonPattern';
import CommandPattern from '@/lib/designPatterns/commandPattern';
import AdapterPattern from '@/lib/designPatterns/adapterPattern';
import TemplatePattern from '@/lib/designPatterns/templatePattern';
import IteratorPattern from '@/lib/designPatterns/iteratorPattern';
import StatePattern from '@/lib/designPatterns/statePattern';

type Props = {};

const DesignPatterns: React.FunctionComponent<Props> = () => {
  useEffect(() => {}, []);
  return (
    <ul className="w-1/2 m-[100px] mx-auto">
      <li className="border-b border-slate-200 py-[12px]">
        <ObserverPattern />
      </li>
      <li className="border-b border-slate-200 py-[12px]">
        <SingletonPatter />
      </li>
      <li className="border-b border-slate-200 py-[12px]">
        <DecoratorPattern />
      </li>
      <li className="border-b border-slate-200 py-[12px]">
        <FactoryPattern />
      </li>
      <li className="border-b border-slate-200 py-[12px]">
        <CommandPattern />
      </li>

      <li className="border-b border-slate-200 py-[12px]">
        <AdapterPattern />
      </li>

      <li className="border-b border-slate-200 py-[12px]">
        <TemplatePattern />
      </li>
      <li className="border-b border-slate-200 py-[12px]">
        <IteratorPattern />
      </li>
      <li className="border-b border-slate-200 py-[12px]">
        <StatePattern />
      </li>
    </ul>
  );
};
export default DesignPatterns;
