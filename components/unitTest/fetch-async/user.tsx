import React, { useEffect } from "react";

type User = {
    name: string;
    email: string;
}
interface Props {
    user: User | null;
}

const User: React.FunctionComponent<Props> = (props) => {
  const { name, email } = props.user || {};

  return (
    <div className="person">
      <h3 data-testid="unit-test-user-name">{name}</h3>
      <span data-testid="unit-test-user-email">{email}</span>
    </div>
  );
};

export default User;
