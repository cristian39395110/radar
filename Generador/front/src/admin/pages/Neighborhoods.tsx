import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FC } from "react";
import { useNeighborhoods } from "../../dopplerApi/hooks/useNeighborhoods";
import { Link } from "react-router-dom";
interface Props {}

const Neighborhoods: FC<Props> = () => {
  const { neighborhoods } = useNeighborhoods();

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Acronimo</TableCell>
              <TableCell>Número de acta</TableCell>
              <TableCell>Template del reporte</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {neighborhoods?.map(
              ({ _id, name, acronym, actNumber, template, reportFields }) => (
                <TableRow key={_id}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{acronym}</TableCell>
                  <TableCell>{actNumber}</TableCell>
                  <TableCell>{template}</TableCell>
                  <TableCell>
                    <Link to={`/admin/neighborhoods/${_id}/homeowners`}>
                      <Button>Dueños</Button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link to={`/admin/neighborhoods/${_id}/homeowners/edit`}>
                      <Button>Editar dueños</Button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link to={`/admin/neighborhoods/${_id}`} target="_blank">
                      <Button>Editar</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Link to="new">
        <Button variant="contained">Crear barrio</Button>
      </Link>
    </>
  );
};

export default Neighborhoods;
