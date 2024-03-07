import { FC } from "react";
import { Report } from "../../dopplerApi/types/Report";
import { Button, TableCell, TableRow } from "@mui/material";
import { Link } from "react-router-dom";
import { formatToArg } from "../../utils/formatToArg";

interface Props {
  report: Report;
  isAdmin?: boolean;
  onDelete?: () => void;
}

const ReportSummary: FC<Props> = ({ report, isAdmin, onDelete }) => {
  const {
    actNumber,
    date,
    speed,
    location,
    plate,
    radar: { maxSpeed, radarId },
  } = report;

  return (
    <TableRow>
      <TableCell align="center">{actNumber}</TableCell>
      <TableCell align="center">{plate}</TableCell>
      <TableCell align="center">
        {formatToArg(date, "dd/MM/yyyy HH:mm:ss")}
      </TableCell>
      <TableCell align="center">{Math.abs(speed)}</TableCell>
      <TableCell align="center">{maxSpeed}</TableCell>
      <TableCell align="center">{radarId}</TableCell>
      <TableCell align="center">
        <Link to={`/reports/${report._id}`} target="_blank">
          <Button>Ver</Button>
        </Link>
      </TableCell>
      {isAdmin && (
        <TableCell align="center">
          <Button color="error" onClick={onDelete}>
            Eliminar
          </Button>
        </TableCell>
      )}
      <TableCell align="center">
        <Link to={`/reports/${report._id}/edit`} target="_blank">
          <Button color="secondary">Edit</Button>
        </Link>
      </TableCell>
    </TableRow>
  );
};

export default ReportSummary;
