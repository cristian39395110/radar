import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FunctionalUnit } from "../../dopplerApi/types/FunctionalUnit";
import FunctionalUnits from "../components/FunctionalUnits";
import { findNeighborhood } from "../../dopplerApi/neighborhoods.api";

interface Props {}

const Homeowners: FC<Props> = () => {
  const { id } = useParams();
  const [functionalUnits, setFunctionalUnits] = useState<
    FunctionalUnit[] | null
  >([]);

  useEffect(() => {
    if (!id) return;
    findNeighborhood(id).then((n) =>
      setFunctionalUnits(n.functionalUnits || [])
    );
  }, [id]);

  return (
    <>
      {functionalUnits && <FunctionalUnits functionalUnits={functionalUnits} />}
    </>
  );
};

export default Homeowners;
