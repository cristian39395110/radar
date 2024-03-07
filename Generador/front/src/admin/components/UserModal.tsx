import {
  Box,
  Button,
  FormLabel,
  Input,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { AdminUser, Role } from "../../dopplerApi/types/AdminUser";
import { useModalStore } from "../../state/modal.store";
import { adminUpdateUser } from "../../dopplerApi/auth.api";

interface Props {
  open: boolean;
  user?: AdminUser | null;
  onClose: () => void;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
};

const UserModal: FC<Props> = ({ open, onClose, user: userData }) => {
  const setStatus = useModalStore((s) => s.setStatus);
  const [user, setUser] = useState<{
    id: string;
    password: string;
    role?: Role;
  }>({
    id: "",
    password: "",
    role: "employer",
  });

  useEffect(() => {
    if (!userData) return;
    setUser({ ...user, role: userData.roles[0], id: userData._id });
  }, [userData]);

  const updatePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUser({ ...user, password: value });
  };

  const handleChangeRole = (e: SelectChangeEvent<string>) => {
    const { value } = e.target;
    setUser({ ...user, role: value as Role });
  };

  const handleUpdateUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading", `actualizando datos de ${userData?.fullName}`);
    const id = user.id;
    const role = userData?.roles[0] === user.role ? undefined : user.role;
    const password = user.password === "" ? undefined : user.password;
    const result = await adminUpdateUser(id, role, password);
    if (result) {
      setStatus("success", "Datos actulazidados");
      onClose();
      return;
    }
    setStatus("error", "No fue posible actualizar los datos");
    onClose();
  };

  return (
    <Modal open={open}>
      <Box sx={style}>
        <Typography variant="h4">{userData?.fullName}</Typography>
        <form onSubmit={handleUpdateUser}>
          <TextField
            label="password"
            value={user.password}
            onChange={updatePassword}
            helperText="La contraseña debe tener 8 caracteres como minimo"
            error={user.password.length > 0 && user.password.length < 8}
          />
          <FormLabel>Role:</FormLabel>
          <Select value={user.role} onChange={handleChangeRole}>
            <MenuItem value="employer">Empleado</MenuItem>
            <MenuItem value="admin">Administrador</MenuItem>
          </Select>
          <Button type="submit" variant="contained" color="success">
            Actualizar
          </Button>
        </form>
        <Button color="error" onClick={onClose}>
          Cerrar
        </Button>
      </Box>
    </Modal>
  );
};

export default UserModal;
