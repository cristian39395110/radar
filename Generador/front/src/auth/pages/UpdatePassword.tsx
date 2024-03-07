import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { ChangeEvent, FC, FormEvent, useState } from "react";
import { useUpdatePassword } from "../hooks/useUpdatePassword";

interface Props {}

const UpdatePassword: FC<Props> = () => {
  const { form, updateForm, updatePassword, errors, isValid } =
    useUpdatePassword();

  const [show, setShow] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    updateForm(name as any, value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updatePassword();
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Contraseña actual"
        value={form.old}
        name="old"
        helperText={errors.old}
        error={!!errors.old}
        onChange={handleChange}
        type={show ? "text" : "password"}
      />
      <TextField
        label="Nueva contraseña"
        value={form.password}
        name="password"
        helperText={errors.password}
        error={!!errors.password}
        onChange={handleChange}
        type={show ? "text" : "password"}
      />
      <TextField
        label="Nueva contraseña"
        value={form.repeatPassword}
        name="repeatPassword"
        helperText={errors.repeatPassword}
        error={!!errors.repeatPassword}
        onChange={handleChange}
        type={show ? "text" : "password"}
      />
      <FormControlLabel
        control={<Checkbox checked={show} onChange={() => setShow(!show)} />}
        label="Mostrar contraseña"
      />

      <Button disabled={!isValid} variant="contained" type="submit">
        Actualizar contraseña
      </Button>
    </form>
  );
};

export default UpdatePassword;
