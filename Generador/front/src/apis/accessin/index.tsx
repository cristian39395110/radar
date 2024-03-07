import {
  AccessinReportBody,
  AccessinReportBodyWithOutPDF,
} from "./types/AccessinReportBody";
import axios from "axios";
import { AccessinResponse } from "./types/AccessinResponses";
import { uploadReport } from "../reportUpload";
import { formatToArg } from "../../utils/formatToArg";

type Message = {
  ok: boolean;
  message: string;
};

export const sendReport = async (
  blob: Blob,
  neighborhood: string,
  report: AccessinReportBodyWithOutPDF
): Promise<Message> => {
  const link_pdf = await uploadReport(
    blob,
    neighborhood,
    report.domain,
    report.real_date
  );

  const body: AccessinReportBody = {
    ...report,
    link_pdf,
    real_date: accesinDateParser(report.real_date),
  };

  if (!import.meta.env.PROD) {
    return {
      ok: true,
      message: `La app esta en modo desarrollo, si usted esta trabajando contacte con la administración`,
    };
  }

  const { data } = await axios.post<AccessinResponse>("/accessin-api", body);

  if (data.status === "error") {
    return {
      ok: false,
      message: `Error ${report.domain}: ${data.error}`,
    };
  }

  return {
    ok: true,
    message: `Reporte de ${report.domain} enviado con exito`,
  };
};

const accesinDateParser = (date: Date) => {
  return formatToArg(date, "dd-MM-yyyy HH:mm");
};
