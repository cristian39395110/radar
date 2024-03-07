import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { ChangeEvent, FC } from "react";
import { ReportFields } from "../../dopplerApi/types/Neighborhoods";

interface Props {
  reportFields: ReportFields;
  update: (name: keyof ReportFields, value: boolean) => void;
}

const ReportOptionsField: FC<Props> = ({ reportFields, update }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    update(name as any, checked);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
        gap: "25px",
      }}
    >
      <FormControlLabel
        label="Fecha y Hora"
        name="date"
        control={
          <Checkbox
            color="primary"
            onChange={handleChange}
            checked={reportFields.date}
          />
        }
      />
      <FormControlLabel
        label="Patente"
        name="plate"
        control={
          <Checkbox
            color="primary"
            onChange={handleChange}
            checked={reportFields.plate}
          />
        }
      />
      <FormControlLabel
        label="Número de acta"
        name="actNumber"
        control={
          <Checkbox
            color="primary"
            onChange={handleChange}
            checked={reportFields.actNumber}
          />
        }
      />
      <FormControlLabel
        label="Velocidad"
        name="speed"
        control={
          <Checkbox
            color="primary"
            onChange={handleChange}
            checked={reportFields.speed}
          />
        }
      />
      <FormControlLabel
        label="Barrio"
        name="neighborhood"
        control={
          <Checkbox
            color="primary"
            onChange={handleChange}
            checked={reportFields.neighborhood}
          />
        }
      />
      <FormControlLabel
        label="Ubicación"
        name="location"
        control={
          <Checkbox
            color="primary"
            onChange={handleChange}
            checked={reportFields.location}
          />
        }
      />
      <FormControlLabel
        label="Unidad funcional"
        name="funtionalUnit"
        control={
          <Checkbox
            color="primary"
            onChange={handleChange}
            checked={reportFields.funtionalUnit}
          />
        }
      />
      <FormControlLabel
        label="Propietario"
        name="homeowner"
        control={
          <Checkbox
            color="primary"
            onChange={handleChange}
            checked={reportFields.homeowner}
          />
        }
      />
      <FormControlLabel
        label="Id del radar"
        name="id"
        control={
          <Checkbox
            color="primary"
            onChange={handleChange}
            checked={reportFields.id}
          />
        }
      />
      <FormControlLabel
        label="Modelo del radar"
        name="model"
        control={
          <Checkbox
            color="primary"
            onChange={handleChange}
            checked={reportFields.model}
          />
        }
      />
      <FormControlLabel
        label="Id del sensor"
        name="sensorId"
        control={
          <Checkbox
            color="primary"
            onChange={handleChange}
            checked={reportFields.sensorId}
          />
        }
      />
    </div>
  );
};

export default ReportOptionsField;
