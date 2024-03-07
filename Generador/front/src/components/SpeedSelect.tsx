import {
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { FC } from "react";

interface Props {
  speeds: number[];
  value: number;
  onSpeedChange: (speed: number) => void;
}

const SpeedSelect: FC<Props> = ({ speeds, value, onSpeedChange }) => {
  speeds = [...new Set(speeds)];

  const handleChange = (e: SelectChangeEvent<number>) => {
    const { value, name } = e.target;
    onSpeedChange(value as number);
  };

  return (
    <FormControl>
      <FormLabel>Velocidad Máxima</FormLabel>
      <Select value={value} onChange={handleChange} name="speed">
        {speeds.map((speed, i) => (
          <MenuItem key={i} value={speed}>
            {speed}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SpeedSelect;
