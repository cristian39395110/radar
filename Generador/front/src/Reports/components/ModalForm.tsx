import {
  Box,
  Button,
  FormLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";

import { Neighborhood } from "../../dopplerApi/types/Neighborhoods";
import { DatePicker } from "@mui/x-date-pickers";
import {
  countReportsByNeighborhood,
  loadReportsByNeighborhood,
  findResume,
} from "../../dopplerApi/reports.api";

import { json2csv } from "json-2-csv";
import { useModalStore } from "../../state/modal.store";
import { formatToArg } from "../../utils/formatToArg";
import { Report } from "../../dopplerApi/types/Report";
import JSZip from "jszip";
import GenerateBlobReports from "./GenerateBlobReports";
import { ModeOption, ReportsOptions } from "../../dopplerApi/types/Options";

interface Props {
  neighborhood?: Neighborhood;
  onClose?: () => void;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50vw",
  bgcolor: "background.paper",
  border: "2px solid #000",
  p: 4,
};

const keyResumeToString: Record<any, string> = {
  actNumber: "Número de acta",
  date: "Fecha",
  location: "Ubicación",
  maxSpeed: "Velocidad Máxima",
  model: "Radar",
  plate: "Patente",
  radarId: "Id del radar",
  speed: "Velocidad",
  hour: "Hora",
};

const parseDate = (date: Date) => formatToArg(date, "dd_MM_yyyy");

const ModalForm: FC<Props> = ({ neighborhood, onClose }) => {
  const open = Boolean(neighborhood);

  const [filter, setFilter] = useState<ReportsOptions>({
    start: new Date(),
    end: new Date(),
    mode: "measure",
  });
  const [reportCounter, setReportCounter] = useState<number>();
  const [reports, setReports] = useState<Report[]>([]);
  const [blobs, setBlobs] = useState<Record<string, Blob>>({});
  const setStatus = useModalStore((s) => s.setStatus);

  useEffect(() => {
    if (!neighborhood) return;
    countReportsByNeighborhood(neighborhood?._id, filter).then((counter) =>
      setReportCounter(counter)
    );
  }, [filter]);

  useEffect(() => {
    const keys = Object.keys(blobs) || [];
    if (reports.length === 0 || keys.length === 0) return;
    if (reports.length === keys.length) {
      downloadZip();
    }
  }, [blobs, reports]);

  const handleDateChange = (name: "start" | "end", date: Date | null) => {
    if (!date) return;
    setFilter({ ...filter, [name]: date });
  };

  const handleModeChange = (e: SelectChangeEvent<ModeOption>) => {
    const value = e.target.value;
    setFilter({ ...filter, mode: value as any });
  };

  const generateResume = async (neighborhood: Neighborhood): Promise<Blob> => {
    const resumes = await findResume(neighborhood?._id, filter);
    const parseResume = resumes.map((resume) => {
      const date = new Date(resume.date);
      const resumeWithHour = {
        ...resume,
        hour: formatToArg(date, "HH:mm:ss"),
        date: formatToArg(date, "dd/MM/yyyy"),
      };
      const entries = Object.entries(resumeWithHour).map(([key, value]) => [
        keyResumeToString[key],
        value,
      ]);
      return Object.fromEntries(entries);
    });
    setStatus("success", "Resumen generado con exito");
    const csv = await json2csv(parseResume, {
      sortHeader: true,
    });
    const file = new Blob([csv]);
    return file;
  };

  const handleDownloadResume = async () => {
    if (!neighborhood) return;
    setStatus("loading", "Generando resumen, esto puede tardar unos minutos");
    const resume = await generateResume(neighborhood);
    const url = URL.createObjectURL(resume);
    const link = document.createElement("a");
    link.download = `${neighborhood.name.toUpperCase()}-${parseDate(
      filter.start
    )}-${parseDate(filter.end)}.csv`;
    link.href = url;
    link.click();
  };

  const handleGenerateZip = async () => {
    if (!neighborhood) return;
    setStatus(
      "loading",
      "Generando archivo comprimida, esto puede tardar unos minutos"
    );
    const reports = await loadReportsByNeighborhood(neighborhood?._id, filter);
    setReports(reports);
  };

  const addBlob = (blob: Blob, report: Report) => {
    const { date, actNumber, plate } = report;
    const name = `${actNumber}_${parseDate(
      typeof date === "string" ? new Date(date) : date
    )}_${plate}.pdf`;
    if (blobs[name]) return;
    setBlobs((blobs) => ({
      ...blobs,
      [name]: blob,
    }));
  };

  const downloadZip = async () => {
    setStatus("success", "Zip generado con exito!");
    setReports([]);
    setBlobs({});
    const zip = new JSZip();
    const resumePromise = generateResume(neighborhood as Neighborhood);
    Object.entries(blobs).forEach(([filename, blob]) => {
      zip.file(filename, blob);
    });
    const resume = await resumePromise;
    zip.file(`${parseDate(filter.start)}-${parseDate(filter.end)}.csv`, resume);
    zip.generateAsync({ type: "blob" }).then((content) => {
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.download = `${neighborhood?.name.toUpperCase()}-${parseDate(
        filter.start
      )}-${parseDate(filter.end)}.zip`;
      link.href = url;
      link.click();
    });
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={style}>
          <Typography variant="h5" align="center">
            Generar resumen de {neighborhood?.name.toUpperCase()}
          </Typography>
          <form>
            <DatePicker
              label="Fecha de inicio"
              value={filter.start}
              slotProps={{ textField: { helperText: "MM/DD/YYYY" } }}
              onChange={(start) => handleDateChange("start", start)}
            />
            <DatePicker
              label="Fecha de finalización"
              value={filter.end}
              slotProps={{ textField: { helperText: "MM/DD/YYYY" } }}
              onChange={(end) => handleDateChange("end", end)}
            />
            <FormLabel>
              Modo:
              <Select value={filter.mode} onChange={handleModeChange}>
                <MenuItem value="measure">Por fecha de medición</MenuItem>
                <MenuItem value="generation">Por fecha de generación</MenuItem>
              </Select>
            </FormLabel>
            {reportCounter && (
              <Typography variant="body1">
                Se encontraron: {reportCounter} reportes
              </Typography>
            )}
            <Button onClick={handleDownloadResume}>Generar resumen</Button>
            <Button onClick={handleGenerateZip}>Generar zip</Button>
          </form>
          <Button onClick={onClose} color="error" fullWidth>
            Cerrar
          </Button>
        </Box>
      </Modal>
      <GenerateBlobReports reports={reports} addBlob={addBlob} />
    </>
  );
};

export default ModalForm;
