import { ChangeEvent, FC, FormEvent } from "react";
import { useUserForm } from "../hooks/useUserForm";
import { Button, MenuItem, Select, TextField, Typography } from "@mui/material";

interface Props {}

const NewUser: FC<Props> = () => {
  const { user, isValid, errors, update, createOrUpdate } = useUserForm();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    update(name as any, value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createOrUpdate();
  };

  return (
    <>
      <Typography align="center" variant="h3">
        Añadir usuario
      </Typography>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 15,
        }}
        onSubmit={handleSubmit}
      >
        <TextField
          label="Usuario"
          name="username"
          value={user.username}
          onChange={handleChange}
          helperText={errors?.username}
          error={!!errors?.username}
        />
        <TextField
          label="Nombre completo"
          name="fullName"
          value={user.fullName}
          onChange={handleChange}
          helperText={errors?.fullName}
          error={!!errors?.fullName}
        />
        <Typography variant="caption">
          La contraseña por defecto es: {user.password}
        </Typography>
        <Button variant="contained" type="submit" disabled={!isValid}>
          Crear
        </Button>
      </form>
    </>
  );
};

export default NewUser;
