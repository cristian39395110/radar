import {
  Alert,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { FC } from "react";
import { FunctionalUnit } from "../../dopplerApi/types/FunctionalUnit";

interface Props {
  functionalUnits: FunctionalUnit[];
}

const FunctionalUnits: FC<Props> = ({ functionalUnits }) => {
  if (functionalUnits.length === 0)
    return (
      <Alert severity="warning">No se detecto ninguna unidad funcional</Alert>
    );
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align="center">Unidad funcional</TableCell>
          <TableCell align="center">Dueño</TableCell>
          <TableCell align="center">Patentes</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {functionalUnits?.map(({ name, homeowner, plates }) => (
          <TableRow key={name}>
            <TableCell align="center">{name}</TableCell>
            <TableCell align="center">{homeowner}</TableCell>
            <TableCell align="center">
              {
                <List>
                  {plates.map((plate, i) => (
                    <ListItem key={plate + i}>{plate}</ListItem>
                  ))}
                </List>
              }
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default FunctionalUnits;
