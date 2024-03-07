import {
  Alert,
  Button,
  FormGroup,
  FormLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import {
  FC,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Neighborhood } from "../../dopplerApi/types/Neighborhoods";
import { loadNeighborhoods } from "../../dopplerApi/neighborhoods.api";
import {
  countReportsByNeighborhood,
  loadReportsByNeighborhood,
  updateSent,
} from "../../dopplerApi/reports.api";
import GenerateBlobReports from "../components/GenerateBlobReports";
import { Report } from "../../dopplerApi/types/Report";
import { sendReport } from "../../apis/accessin";
import { AccessinReportBodyWithOutPDF } from "../../apis/accessin/types/AccessinReportBody";
import ProgresiveLoadingModal from "../components/ProgresiveLoadingModal";

interface Props {}

const SendToAccessin: FC<Props> = () => {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [form, setForm] = useState({
    neighborhoodId: "",
    start: new Date(),
    end: new Date(),
  });
  const [reports, setReports] = useState<Report[]>([]);
  const [sentReportsResponses, setSentReportsResponses] = useState<
    Record<string, { ok: boolean; message: string }>
  >({});
  const [reportCounter, setReportCounter] = useState<number | null>(null);

  useEffect(() => {
    loadNeighborhoods(true).then((n) => setNeighborhoods(n));
  }, []);

  useEffect(() => {
    if (Object.keys(sentReportsResponses).length !== reports.length) return;
    const validReportIds = Object.entries(sentReportsResponses)
      .filter(([id, value]) => value.ok)
      .map(([id]) => id);
    updateSent(validReportIds).then((r) => {});
  }, [sentReportsResponses]);

  useEffect(() => {
    if (!Object.values(form).every(Boolean)) return;
    const { neighborhoodId, ...options } = form;
    countReportsByNeighborhood(neighborhoodId, {
      ...options,
      mode: "measure",
      wasSent: false,
    }).then((total) => setReportCounter(total));
  }, [form]);

  const handleSelect = (e: SelectChangeEvent<string>) => {
    setForm({ ...form, neighborhoodId: e.target.value });
  };

  const handleDate = (date: Date | null, name: "start" | "end") => {
    if (!date) return;
    setForm({ ...form, [name]: date });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //start to send
    const { neighborhoodId: id, ...rest } = form;
    const neighborhood = neighborhoods.find((n) => n._id === id);
    if (!neighborhood) return;
    const reports = await loadReportsByNeighborhood(form.neighborhoodId, {
      ...rest,
      wasSent: false,
      mode: "measure",
    }).then((rs) => rs.map((r) => ({ ...r, neighborhood })));
    setReports(reports);
  };

  const handleNewBlob = async (blob: Blob, report: Report) => {
    if (!report.neighborhood.tokens?.accessin) return;
    const {
      plate,
      date,
      neighborhood: { tokens },
    } = report;
    const accessinReport: AccessinReportBodyWithOutPDF = {
      domain: plate,
      real_date: typeof date === "string" ? new Date(date) : date,
      token: tokens?.accessin,
    };
    if (sentReportsResponses[report._id]) return;
    const result = await sendReport(
      blob,
      report.neighborhood.name,
      accessinReport
    );
    setSentReportsResponses((r) => ({
      ...r,
      [report._id]: result,
    }));
  };

  return (
    <>
      <ProgresiveLoadingModal
        open={reports.length > 0}
        total={reports.length}
        sent={Object.keys(sentReportsResponses).length}
      >
        {reports.length === Object.keys(sentReportsResponses).length && (
          <>
            <Typography>Errores: </Typography>
            <ul>
              {Object.values(sentReportsResponses)
                .filter((r) => !r.ok)
                .map((r) => (
                  <li>{r.message}</li>
                ))}
            </ul>
            <Button
              onClick={() => {
                setReports([]);
                setSentReportsResponses({});
                setReportCounter(null);
              }}
            >
              Cerrar
            </Button>
          </>
        )}
      </ProgresiveLoadingModal>
      <Alert severity="info">
        <List>
          <ListItem>Los reportes se buscan por fecha de medición</ListItem>
        </List>
      </Alert>
      <Typography variant="h3" textAlign="center">
        Envio de mediciones a accessin
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel>Barrio:</FormLabel>
          <Select value={form.neighborhoodId} onChange={handleSelect}>
            {neighborhoods
              .filter((n) => n.tokens)
              .map(({ _id, name }) => (
                <MenuItem key={_id} value={_id}>
                  {name}
                </MenuItem>
              ))}
          </Select>
        </FormGroup>
        <DatePicker
          label="Fecha de inicial"
          value={form.start}
          onChange={(d) => handleDate(d, "start")}
          maxDate={form.end}
        />
        <DatePicker
          label="Fecha de final"
          value={form.end}
          onChange={(d) => handleDate(d, "end")}
          minDate={form.start}
          maxDate={new Date()}
        />
        <Button type="submit">Enviar</Button>
      </form>
      {reportCounter !== null && (
        <Typography variant="body1" textAlign="center">
          Se encontraron: {reportCounter} reportes
        </Typography>
      )}
      <GenerateBlobReports reports={reports} addBlob={handleNewBlob} />
    </>
  );
};

export default SendToAccessin;
