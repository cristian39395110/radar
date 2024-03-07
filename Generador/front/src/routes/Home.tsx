import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Props {}

const Home: FC<Props> = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/neighborhoods");
  }, []);

  return <div>Home</div>;
};

export default Home;
