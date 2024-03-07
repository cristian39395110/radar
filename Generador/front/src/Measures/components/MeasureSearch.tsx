import {
  Button,
  Checkbox,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { ChangeEvent, FC, FormEvent, useState } from "react";
import { useNeighborhoods } from "../../dopplerApi/hooks/useNeighborhoods";
import { QueryMeasures } from "../../dopplerApi/types/Measures";

interface Props {
  onSearch?: (query: QueryMeasures) => void;
}
const MeasureSearch: FC<Props> = ({ onSearch }) => {
  const [query, setQuery] = useState<QueryMeasures>({
    time: {},
    neighborhood: "all",
    plate: true,
    isCompleted: false,
    isDiscarded: false,
  });

  const { neighborhoods } = useNeighborhoods();

  const handleChangeNeighborhood = (e: SelectChangeEvent<string>) => {
    const value = e.target.value;
    setQuery({
      ...query,
      neighborhood: value,
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setQuery({
      ...query,
      [name as any]: checked,
    });
  };

  const handleDate = (date: Date | null, name: "end" | "start") => {
    if (!date) return;
    if (name === "start" && !query.time.end) {
      return setQuery({
        ...query,
        time: {
          start: date,
          end: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() + 1
          ),
        },
      });
    }
    setQuery({
      ...query,
      time: {
        ...query.time,
        [name]: date,
      },
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch &&
      onSearch({
        ...query,
        neighborhood:
          query.neighborhood === "all" ? undefined : query.neighborhood,
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormLabel>
        <label>Barrio:</label>
        <Select value={query.neighborhood} onChange={handleChangeNeighborhood}>
          <MenuItem value="all">Todos</MenuItem>
          {neighborhoods?.map((n) => (
            <MenuItem key={n._id} value={n._id}>
              {n.name}
            </MenuItem>
          ))}
        </Select>
      </FormLabel>
      <DatePicker
        label="Desde"
        value={query.time.start}
        onChange={(date) => handleDate(date, "start")}
      />
      <DatePicker
        label="Hasta"
        value={query.time.end}
        minDate={query.time.start}
        maxDate={new Date()}
        onChange={(date) => handleDate(date, "end")}
      />
      <FormControlLabel
        label="Incluir descartados"
        control={
          <Checkbox
            onChange={handleChange}
            name="isDiscarded"
            checked={query.isDiscarded}
          />
        }
      />
      <FormControlLabel
        label="Con reportes creados"
        control={
          <Checkbox
            onChange={handleChange}
            name="isCompleted"
            checked={query.isCompleted}
          />
        }
      />
      <FormControlLabel
        label="Que contengan patente"
        control={
          <Checkbox
            onChange={handleChange}
            name="plate"
            checked={query.plate}
          />
        }
      />
      <Button type="submit">Buscar</Button>
    </form>
  );
};

export default MeasureSearch;
