import { LockOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, FC, FormEvent } from "react";
import { useLogin } from "./hooks/useLogin";
import { useModalStore } from "../state/modal.store";

interface Props {}

const Login: FC<Props> = () => {
  const { form, isValid, login, update } = useLogin();

  //TODO: implementar errores de formulario y algun loading
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    update(name as any, value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login();
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlined />
      </Avatar>
      <Typography component="h1" variant="h5">
        Inico de sesión
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Nombre de usuario"
          value={form.username}
          name="username"
          autoFocus
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Contraseña"
          value={form.password}
          type="password"
          id="password"
          autoComplete="current-password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={!isValid}
          sx={{ mt: 3, mb: 2 }}
        >
          Entrar
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
