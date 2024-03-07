import {
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { FC } from "react";
import { formatToArg } from "../utils/formatToArg";
interface Props {
  dates: string[];
  value: string;
  onDateChange: (date: string) => void;
}

const DatePicker: FC<Props> = ({ dates, value, onDateChange }) => {
  dates = [...new Set(dates)];
  dates = dates
    .map((x) => {
      const date = new Date(x);
      try {
        const inArg = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        ).toISOString();
        return inArg;
      } catch (err) {
        return null;
      }
    })
    .filter(Boolean) as string[];

  const handleChange = (e: SelectChangeEvent<string>) => {
    const { value } = e.target;
    onDateChange(value);
  };

  return (
    <FormControl>
      <FormLabel>Fecha y hora de la infracción</FormLabel>
      <Select value={value} onChange={handleChange}>
        {dates.map((date, i) => (
          <MenuItem value={date} key={date}>
            {formatToArg(date, "dd/MM/yyyy HH:mm:ss")}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DatePicker;
