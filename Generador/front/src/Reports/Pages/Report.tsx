import { FC } from "react";
import { useParams } from "react-router-dom";
import { loadReport } from "../../dopplerApi/reports.api";
import { useQuery } from "react-query";
import { PDFViewer } from "@react-pdf/renderer";
import templates from "../../pdf";
import UploadReport from "../components/UploadReport";

interface Props {}

const Report: FC<Props> = () => {
  const { report: reportId } = useParams();

  const { data: report } = useQuery(reportId || "void", () =>
    loadReport(reportId || "")
  );

  if (!report) return <h1>No se encontro el reporte</h1>;

  const Template = templates[report.neighborhood.template] || templates.doppler;

  return (
    <>
      <PDFViewer
        style={{
          height: "100vh",
          width: "100%",
        }}
      >
        <Template report={report} />
      </PDFViewer>
      <UploadReport template={Template} report={report} />
    </>
  );
};

export default Report;
