import { FC } from "react";
import { useParams } from "react-router-dom";

interface Props {}

const FindMeasures: FC<Props> = () => {
  const { neighborhoodId: id } = useParams();
  return <div></div>;
};

export default FindMeasures;
