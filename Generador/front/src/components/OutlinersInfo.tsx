import { Alert, List, ListItem } from "@mui/material";
import { FC, useMemo } from "react";
import { Datum, Outliers } from "../dopplerApi/types/Measures";

interface Props {
  data: Datum[];
  maxSpeed: number;
  outliers?: Outliers;
}

const MAX_STEP = 0.5;
const MAX_DISTANCE_MARGIN = 1;
const MAX_SPEED_MARGIN = 1.2;

const OutlinersInfo: FC<Props> = ({ data, maxSpeed, outliers }) => {
  const haveSpeedOutliner = useMemo(() => {
    if (outliers?.speed) return true;
    const speeds = data.map((x) => x.speed);
    const min = Math.min(...speeds);
    const max = Math.max(...speeds);
    return Math.abs(max - min) > Math.abs(max);
  }, [data, outliers?.speed]);

  const haveStepOutliner = useMemo(() => {
    if (outliers?.step) return true;
    return data
      .map((x) => Math.abs(x.speed))
      .some((x, i, array) => {
        if (i === 0) {
          return false;
        }
        const xAns = array[i - 1];
        const isOutlier = Math.abs((x - xAns) / xAns) > MAX_STEP;
        return isOutlier;
      });
  }, [data, outliers?.step]);

  const haveCars = useMemo(() => {
    if (outliers?.moreThanOneCar) return true;
    return false;
  }, [data, outliers?.moreThanOneCar]);

  const speedIsLessThanMax = useMemo(() => {
    return data
      .map((x) => Math.abs(x.speed))
      .some((speed) => speed < maxSpeed * MAX_SPEED_MARGIN);
  }, [data, maxSpeed]);

  if (!haveSpeedOutliner && !haveStepOutliner && !haveCars) {
    return <></>;
  }

  return (
    <Alert severity="error">
      <List>
        {haveSpeedOutliner && (
          <ListItem>
            Existen velocidades negativas y positivas en la medición
          </ListItem>
        )}
        {haveStepOutliner && (
          <ListItem>Existe al menos un salto abrupto de velocidad</ListItem>
        )}
        {haveCars && (
          <ListItem>El sensor detecto al menos 2 objetivos</ListItem>
        )}
        {speedIsLessThanMax && (
          <ListItem>El auto no excede la velocidad maxima permitida</ListItem>
        )}
      </List>
    </Alert>
  );
};

export default OutlinersInfo;
