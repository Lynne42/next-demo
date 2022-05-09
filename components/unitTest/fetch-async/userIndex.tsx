import React, { useEffect, useState } from "react";
import User from "./user";

interface Props {}
const UserIndex: React.FunctionComponent<Props> = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users/1"
      );
      const data = await response.json();
      setUser(data);
    } catch (error: any) {
      setError(error.message || "请求错误");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (error) {
    return <span>{error}</span>;
  }

  return <div>{!loading ? <User user={user} /> : <span>Loading...</span>}</div>;
};
export default UserIndex;
