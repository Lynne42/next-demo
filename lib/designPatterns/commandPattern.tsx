import React, { useEffect } from "react";
import RemoteControl from "./commandPattern/test/remote_control";

interface Props {}
const CommandPattern: React.FunctionComponent<Props> = () => {
  useEffect(() => {
    const remoteControl = new RemoteControl();
    remoteControl.init();
  }, []);
  return (
    <section>
      <h2 className="font-bold">CommandPattern</h2>
      
    </section>
  );
};
export default CommandPattern;
