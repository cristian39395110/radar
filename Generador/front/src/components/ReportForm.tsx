import {
  ChangeEvent,
  FC,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import OutlinersInfo from "./OutlinersInfo";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import InfoChart from "./InfoChart";
import SpeedSelect from "./SpeedSelect";
import DatePicker from "./DatePicker";
import ImagePicker from "./ImagePicker";
import { Datum, Measure } from "../dopplerApi/types/Measures";
import { sampleToGraphData } from "../utils/parseMeasuresToPlot";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { Neighborhood } from "../dopplerApi/types/Neighborhoods";
import { useModalStore } from "../state/modal.store";
import { Report } from "../dopplerApi/types/Report";

interface Props {
  measure: Measure;
  neighborhood: Neighborhood;
  report?: Report;
  onSubmit: () => void;
}

const ReportForm: FC<Props> = ({ measure, neighborhood, report, onSubmit }) => {
  const setStatus = useModalStore((s) => s.setStatus);
  const {
    register,
    isLoading,
    isValid,
    updateRegister,
    updateImage,
    updateRegisterFromRawData,
    upload,
  } = useRegisterForm(report);

  const [disabledPlate, setDisabledPlate] = useState(false);

  const plotData = useMemo(() => {
    if (!measure) {
      return {};
    }
    const pdats = measure?.samples.flatMap(
      (sample) => sample?.tdat || sample.pdat
    ) as Datum[];
    const distance = sampleToGraphData(pdats, "distance", "Distancia");
    const speed = sampleToGraphData(pdats, "speed", "Velocidad", [
      {
        label: "Velocidad elegida",
        value: register.speed || 0,
      },
      {
        label: "Velocidad permitida",
        value: measure.radar.maxSpeed,
      },
      {
        label: "Velocidad permitida negativa",
        value: -measure.radar.maxSpeed,
      },
    ]);
    return {
      distance,
      speed,
    };
  }, [measure, register.speed]);

  const samples: Datum[] = useMemo(() => {
    if (!measure) return [];
    return measure.samples.flatMap((x, i) => {
      if (x.tdat) {
        return [x.tdat, ...x.pdat];
      }
      return x.pdat;
    });
  }, [measure]);

  useEffect(() => {
    updateRegisterFromRawData(neighborhood, measure, report);
  }, [neighborhood, measure, report]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateRegister(name as any, value);
  };

  const handleChangeSelect = (
    type: "speed" | "date",
    value: number | string
  ) => {
    updateRegister(type, value as any);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading", "Creando el registro");
    try {
      await upload(onSubmit);
      setStatus("idle", "Registro creado con exito");
    } catch (e) {
      setStatus("error", "No se pudo crear el registro");
    }
  };

  const handleDisablePlate = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    if (checked) {
      updateRegister("plate", "XXXXXXX");
    }
    setDisabledPlate(checked);
  };

  return (
    <>
      <OutlinersInfo
        data={samples}
        maxSpeed={report?.radar.maxSpeed || 0}
        outliers={measure.outliers}
      />
      <Box sx={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <InfoChart data={plotData.distance} yLabel="Distancia [cm]" />
        <InfoChart data={plotData.speed} yLabel="Velocidad [km/h]" />
      </Box>

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="plate-field">
          <TextField
            name="plate"
            label="Patente"
            disabled={disabledPlate}
            required
            value={register.plate}
            helperText={`El algoritmo tiene una confianza de ${measure?.plate?.security}% en el valor de la patente`}
            onChange={handleChange}
          />
          <FormControlLabel
            label={"Patente no detectada"}
            control={
              <Checkbox checked={disabledPlate} onChange={handleDisablePlate} />
            }
          />
        </div>

        <TextField
          name="actNumber"
          label="Numero de Acta"
          required
          type="number"
          value={register.actNumber}
          onChange={handleChange}
        />
        <SpeedSelect
          speeds={samples.map((x) => x.speed)}
          value={register.speed}
          onSpeedChange={(speed) => handleChangeSelect("speed", speed)}
        />
        <DatePicker
          dates={samples.map((x) => x.date)}
          value={register.date}
          onDateChange={(date) => handleChangeSelect("date", date)}
        />
        <ImagePicker
          value={register.src.car}
          imgType="car"
          video={measure?.video}
          suggested={measure?.pic}
          onChange={(img) => updateImage("car", img)}
          oldPic={report?.src.car}
        />
        <ImagePicker
          value={register.src.domain || ""}
          imgType="plate"
          video={measure?.video}
          suggested={measure?.pic}
          onChange={(img) => updateImage("domain", img)}
          oldPic={report?.src.domain}
        />
        <Button
          type="submit"
          color="success"
          variant="contained"
          disabled={!isValid}
        >
          Generar Reporte
        </Button>
      </form>
    </>
  );
};

export default ReportForm;
