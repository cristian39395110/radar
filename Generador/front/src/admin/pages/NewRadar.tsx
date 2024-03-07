import {
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { ChangeEvent, FC, FormEvent, useEffect } from "react";
import { useRadarForm } from "../hooks/useRadarForm";
import { useNeighborhoods } from "../../dopplerApi/hooks/useNeighborhoods";
import { useParams } from "react-router-dom";
import { useRadarById } from "../../dopplerApi/hooks/useRadarById";
import { useModalStore } from "../../state/modal.store";

interface Props {}

const messages = {
  idle: "",
  error: "No se pudo cargar el radar",
  success: "Datos cargados con exito",
  loading: "Enviando datos al servidor",
};

const NewRadar: FC<Props> = () => {
  const { id } = useParams();
  const { radar, update, createOrUpdate } = useRadarForm(id);
  const { neighborhoods } = useNeighborhoods();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    update(name as any, value);
  };

  const handleSelectNeighborhood = (e: SelectChangeEvent) => {
    const { value } = e.target;
    update("neighborhood", value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createOrUpdate();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextField
          name="model"
          label="Modelo"
          value={radar.model}
          onChange={handleChange}
        />
        <TextField
          name="radarId"
          label="Id del radar"
          value={radar.radarId}
          onChange={handleChange}
        />
        <TextField
          name="sensorId"
          label="Id del sensor"
          value={radar.sensorId}
          onChange={handleChange}
        />
        <TextField
          label="Ubicación"
          name="location"
          value={radar.location}
          onChange={handleChange}
        />
        <TextField
          name="maxSpeed"
          label="Velocidad máxima [Km/h]"
          value={radar.maxSpeed}
          type="number"
          onChange={handleChange}
        />

        <Select onChange={handleSelectNeighborhood} value={radar.neighborhood}>
          {neighborhoods?.map(({ _id, name }) => (
            <MenuItem key={_id} value={_id}>
              {name.toUpperCase()}
            </MenuItem>
          ))}
        </Select>

        <Button variant="contained" type="submit">
          Crear
        </Button>
      </form>
    </>
  );
};

export default NewRadar;
