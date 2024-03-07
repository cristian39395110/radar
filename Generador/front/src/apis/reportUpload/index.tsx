import { uploadFile } from "./firebase";
import { formatToArg } from "../../utils/formatToArg";

export const uploadReport = async (
  blob: Blob,
  neighborhood: string,
  plate: string,
  date: Date
) => {
  const actualDate = new Date();
  const folderName = formatToArg(actualDate, "dd_MM_yyyy");
  const parseDate = formatToArg(date, "dd_MM_yyyy__HH_mm_ss");
  const fileName = `${neighborhood}__${plate}__${parseDate}.pdf`;
  return uploadFile(blob, folderName, fileName);
};
