import { FC, useEffect, useState } from "react";
import { useReportsCount } from "../../dopplerApi/hooks/useReportsCount";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useNeighborhoods } from "../../dopplerApi/hooks/useNeighborhoods";
import ReportItem from "../components/ReportItem";
import ModalForm from "../components/ModalForm";
import { Neighborhood } from "../../dopplerApi/types/Neighborhoods";

interface Props {}

const Reports: FC<Props> = () => {
  const { neighborhoods } = useNeighborhoods();
  const [neighborhood, setNeighborhood] = useState<Neighborhood>();

  const handleCloseModal = () => setNeighborhood(undefined);

  return (
    <>
      <ModalForm neighborhood={neighborhood} onClose={handleCloseModal} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Barrio</TableCell>
              <TableCell align="center">Número de reportes</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {neighborhoods?.map((n) => (
              <ReportItem
                key={n._id}
                neighborhood={n}
                onGenerateSummary={() => setNeighborhood(n)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Reports;
