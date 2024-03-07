import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import { useReports } from "../../dopplerApi/hooks/useReports";
import ReportSummary from "../components/ReportSummary";
import { useAuthStore } from "../../state";
import ConfirmationModal from "../../components/ConfirmationModal";
import { Report } from "../../dopplerApi/types/Report";
import { deleteReport } from "../../dopplerApi/reports.api";
import { useModalStore } from "../../state/modal.store";

interface Props {}

const ReportsResume: FC<Props> = () => {
  const { neighborhoodId } = useParams();

  const user = useAuthStore((s) => s.user);
  const setStatus = useModalStore((s) => s.setStatus);
  const isAdmin = user?.roles.includes("admin");
  const [deletedReport, setDeletedReport] = useState<Report>();

  const { reports, refetch } = useReports(neighborhoodId as string);

  const handleDelete = async () => {
    if (!deletedReport) return;
    setStatus("loading", `Eliminando el reporte: ${deletedReport.actNumber}`);
    await deleteReport(deletedReport._id)
      .then((r) => {
        setStatus(
          "success",
          `Reporte: ${deletedReport.actNumber} eliminado con exito`
        );
        refetch();
      })
      .catch((e) => {
        setStatus("error", "Error inesperado");
        refetch();
      });
    setDeletedReport(undefined);
  };

  const handleRejectDelete = () => {
    setDeletedReport(undefined);
  };

  return (
    <>
      <ConfirmationModal
        open={!!deletedReport}
        onAccept={handleDelete}
        onClose={handleRejectDelete}
      >
        <Typography variant="h3">
          Desea eliminar el reporte con número de acta:
          {deletedReport?.actNumber || "error"}?
        </Typography>
      </ConfirmationModal>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Número de acta</TableCell>
              <TableCell align="center">Patente</TableCell>
              <TableCell align="center">Fecha y hora</TableCell>
              <TableCell align="center">
                Velocidad máxima detectada [Km/h]
              </TableCell>
              <TableCell align="center">
                Velocidad máxima permitida [Km/h]
              </TableCell>
              <TableCell align="center">Radar</TableCell>
              <TableCell align="center"></TableCell>
              {isAdmin && <TableCell align="center">Eliminar</TableCell>}
              <TableCell align="center">Editar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports?.map((r) => (
              <ReportSummary
                key={r._id}
                report={r}
                isAdmin={isAdmin}
                onDelete={() => setDeletedReport(r)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ReportsResume;
