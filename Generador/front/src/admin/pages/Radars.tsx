import { FC } from "react";
import { useRadars } from "../../dopplerApi/hooks/useRadars";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useRadarsWithApiKey } from "../../dopplerApi/hooks/useRadarsWithApikey";

interface Props {}

const Radars: FC<Props> = () => {
  const { radars } = useRadarsWithApiKey();

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Módelo</TableCell>
              <TableCell>Radar id</TableCell>
              <TableCell>Sensor id</TableCell>
              <TableCell>Velocidad [Km/h]</TableCell>
              <TableCell>Barrio</TableCell>
              <TableCell>Api key</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {radars?.map(
              ({
                _id,
                model,
                radarId,
                sensorId,
                maxSpeed,
                neighborhood,
                apikey,
              }) => (
                <TableRow key={_id}>
                  <TableCell>{model}</TableCell>
                  <TableCell>{radarId}</TableCell>
                  <TableCell>{sensorId}</TableCell>
                  <TableCell>{maxSpeed}</TableCell>
                  <TableCell>
                    {typeof neighborhood === "object" && neighborhood.name}
                  </TableCell>
                  <TableCell>{apikey}</TableCell>
                  <TableCell>
                    <Link to={`/admin/radars/${_id}`} target="_blank">
                      <Button>Editar</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Link to="/admin/radars/new">
        <Button variant="contained">Agregar radar</Button>
      </Link>
    </>
  );
};

export default Radars;
