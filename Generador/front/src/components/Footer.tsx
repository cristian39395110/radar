import { FC } from "react";

interface Props {}

const Footer: FC<Props> = () => {
  return <div>Versión: {APP_VERSION}</div>;
};

export default Footer;
