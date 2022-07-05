import React, { useEffect, useState } from "react";

import Coffee from './templatePattern/coffee.instance';
import Tea from './templatePattern/tea.instance';

interface Props {}
const TemplatePattern: React.FunctionComponent<Props> = () => {
  const [info, setInfo] = useState<string[]>([]);

  useEffect(() => {
    const coffee = new Coffee();
    const tea = new Tea();

    coffee.prepare();
    tea.prepare();
    
  }, []);

  return (
    <section>
      <h2 className="font-bold">TemplatePattern</h2>
      <div>{info}</div>
    </section>
  );
};
export default TemplatePattern;
