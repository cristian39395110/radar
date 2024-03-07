import { FC } from "react";
import Navigation from "../components/Navigation";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

interface Props {}

const BasicLayout: FC<Props> = () => {
  return (
    <div>
      <Navigation />
      <Outlet />
    </div>
  );
};

export default BasicLayout;
