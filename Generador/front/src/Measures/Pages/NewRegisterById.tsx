import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReportForm from "../../components/ReportForm";
import { Measure } from "../../dopplerApi/types/Measures";
import { Neighborhood } from "../../dopplerApi/types/Neighborhoods";
import { getMeasure } from "../../dopplerApi/measures.api";

interface Props {}

const NewRegisterById: FC<Props> = () => {
  const { id } = useParams();
  const [measure, setMeasure] = useState<Measure | null>(null);

  useEffect(() => {
    if (!id) return;
    getMeasure(id).then((measure) => setMeasure(measure));
  }, [id]);

  return (
    <div>
      {measure && (
        <ReportForm
          measure={measure}
          neighborhood={measure.radar.neighborhood as Neighborhood}
          onSubmit={() => console.log("hola")} //Es casi opcional el onSubmit, hay que cambiarlo
        />
      )}
    </div>
  );
};

export default NewRegisterById;

/* 


*/
