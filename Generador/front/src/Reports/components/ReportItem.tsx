import { Button, TableCell, TableRow } from "@mui/material";
import { FC } from "react";
import { useReportsCount } from "../../dopplerApi/hooks/useReportsCount";
import { Neighborhood } from "../../dopplerApi/types/Neighborhoods";
import { Link } from "react-router-dom";

interface Props {
  neighborhood: Neighborhood;
  onGenerateSummary: () => void;
}

const ReportItem: FC<Props> = ({ neighborhood, onGenerateSummary }) => {
  const { reports } = useReportsCount(neighborhood._id);
  return (
    <TableRow>
      <TableCell>{neighborhood.name.toLocaleUpperCase()}</TableCell>
      <TableCell>{reports}</TableCell>
      <TableCell>
        <Button onClick={onGenerateSummary}>Generar Resumen</Button>
      </TableCell>
      <TableCell>
        <Link to={`/neighborhoods/${neighborhood._id}/reports`}>
          <Button>Ver reportes</Button>
        </Link>
      </TableCell>
    </TableRow>
  );
};

export default ReportItem;
