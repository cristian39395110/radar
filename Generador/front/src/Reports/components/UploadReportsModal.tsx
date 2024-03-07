import { LinearProgress, Modal, Typography } from "@mui/material";
import { FC, useMemo, useState } from "react";
import { Report } from "../../dopplerApi/types/Report";
import templates from "../../pdf";
import UploadReport from "./UploadReport";
import { sendReport } from "../../apis/accessin";

interface Props {
  open: boolean;
  onClose: () => void;
  reports: Report[];
}

const UploadReportsModal: FC<Props> = ({ open, onClose, reports }) => {
  const [successIds, setSuccessIds] = useState<string[]>([]);
  const { token, template, neighborhood } = useMemo(() => {
    const neighborhood = reports[0].neighborhood;
    const token = neighborhood.tokens?.accessin;
    const template = neighborhood.template;
    return {
      token,
      template: templates[template] || templates.doppler,
      neighborhood: neighborhood.name,
    };
  }, [reports]);

  const handleLoad = (report: Report) => {
    return async (blob: Blob) => {
      if (!token) {
        throw new Error(
          "No existe el token de accessin, por favor contacte con algún administrador"
        );
      }
      const date =
        typeof report.date === "string" ? new Date(report.date) : report.date;
      const result = await sendReport(blob, neighborhood, {
        token,
        domain: report.plate,
        real_date: date,
      });
      setSuccessIds([...successIds, report._id]);
      return;
    };
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div>
        <Typography variant="h3">Enviando reportes</Typography>
        <LinearProgress value={(successIds.length / reports.length) * 100} />
        <ul>
          {reports.map((report) => (
            <UploadReport
              report={report}
              template={template}
              onLoad={handleLoad(report)}
            />
          ))}
        </ul>
      </div>
    </Modal>
  );
};

export default UploadReportsModal;
