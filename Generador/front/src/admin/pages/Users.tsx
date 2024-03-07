import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FC, useState } from "react";
import { useUsers } from "../../dopplerApi/hooks/useUsers";
import { Link } from "react-router-dom";
import UserModal from "../components/UserModal";
import { AdminUser } from "../../dopplerApi/types/AdminUser";

interface Props {}

const Users: FC<Props> = () => {
  const { users } = useUsers();
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  return (
    <>
      <UserModal
        open={Boolean(selectedUser)}
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.roles.join(", ")}</TableCell>
                <TableCell>
                  <Button onClick={() => setSelectedUser(user)}>Editar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Link to="new">
        <Button variant="contained">Agregar usuario</Button>
      </Link>
    </>
  );
};

export default Users;
