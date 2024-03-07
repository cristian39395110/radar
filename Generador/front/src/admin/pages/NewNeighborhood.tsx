import {
  Button,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { ChangeEvent, FC, FormEvent } from "react";
import { useNeighborhoodForm } from "../hooks/useNeighborhoodForm";
import ReportOptionsField from "../components/ReportOptionsField";
import { useParams } from "react-router-dom";
import templates from "../../pdf";

interface Props {}

const NewNeighborhood: FC<Props> = () => {
  const { id } = useParams();
  const {
    neighborhood,
    errors,
    isValid,
    update,
    updateReportFields,
    updateTemplate,
    updateToken,
    createOrUpdateNeighborhood,
  } = useNeighborhoodForm(id);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    update(name as any, value);
  };

  const handleTemplateChange = (e: SelectChangeEvent) => {
    const template = e.target.value;
    updateTemplate(template);
  };

  const handleTokenChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateToken(value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createOrUpdateNeighborhood();
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Barrio"
        name="name"
        value={neighborhood.name}
        error={!!errors.name}
        helperText={errors.name}
        onChange={handleChange}
      />
      <TextField
        label="Acronimo"
        name="acronym"
        value={neighborhood.acronym}
        error={!!errors.acronym}
        helperText={errors.acronym}
        onChange={handleChange}
      />
      <TextField
        label="Número de acta"
        name="actNumber"
        type="number"
        value={neighborhood.actNumber}
        error={!!errors.actNumber}
        helperText={errors.actNumber}
        onChange={handleChange}
      />
      <TextField
        label="Accessin Token"
        value={neighborhood.tokens?.accessin}
        onChange={handleTokenChange}
        name="accessin"
      />
      <FormControl>
        <FormLabel>Template del reporte:</FormLabel>
        <Select value={neighborhood.template} onChange={handleTemplateChange}>
          {Object.keys(templates).map((key) => (
            <MenuItem value={key}>{key.toUpperCase()}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <ReportOptionsField
        reportFields={neighborhood.reportFields as any}
        update={updateReportFields}
      />
      <Button
        variant="contained"
        color="success"
        type="submit"
        disabled={!isValid}
      >
        Crear
      </Button>
    </form>
  );
};

export default NewNeighborhood;
