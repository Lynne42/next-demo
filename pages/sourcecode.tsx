import React, { useEffect } from "react";

import Base from '@/lib/sourcecode/base';

type Props = {};


const SourceCode: React.FunctionComponent<Props> = () => {
  useEffect(() => {}, []);
  return (
    <ul className="w-1/2 m-[100px] mx-auto">
      <li className="border-b border-slate-200 py-[12px]">
        <Base />
      </li>
    </ul>
  );
};
export default SourceCode;
