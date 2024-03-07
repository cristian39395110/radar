import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loadReport } from "../../dopplerApi/reports.api";
import { Report } from "../../dopplerApi/types/Report";
import ReportForm from "../../components/ReportForm";

interface Props {}

const EditReport: FC<Props> = () => {
  const { report: id } = useParams();
  const [report, setReport] = useState<Report>();

  useEffect(() => {
    if (!id) return;
    loadReport(id, true).then((r) => setReport(r));
  }, []);

  return (
    <div>
      {report && typeof report.measure === "object" && (
        <ReportForm
          measure={{
            ...report.measure,
            radar: report.radar,
          }}
          neighborhood={report.neighborhood}
          report={report}
          onSubmit={() => console.log("hola")} //Es casi opcional el onSubmit, hay que cambiarlo
        />
      )}
    </div>
  );
};

export default EditReport;
