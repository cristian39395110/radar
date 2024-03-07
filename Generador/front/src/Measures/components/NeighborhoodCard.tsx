import { Card, CardContent, Typography } from "@mui/material";
import { FC } from "react";
import { Neighborhood } from "../../dopplerApi/types/Neighborhoods";
import { useMeasureCounter } from "../../dopplerApi/hooks/useMeasureCounter";

type Props = {
  neighborhood: Neighborhood;
  onClick?: (neighborhood: Neighborhood) => void;
};

const NeighborhoodCard: FC<Props> = ({ neighborhood, onClick }) => {
  const { name, actNumber, acronym } = neighborhood;
  const { counter } = useMeasureCounter(neighborhood._id);

  const actualActNumber = `${actNumber}`.padStart(4, "0");

  const handleClick = () => {
    if (counter === 0) return;
    onClick && onClick(neighborhood);
  };

  return (
    <Card onClick={handleClick}>
      <CardContent>
        <Typography>{name}</Typography>
        <Typography
          color="text.secondary"
          sx={{ fontSize: 14 }}
        >{`Número de acta: ${acronym}${actualActNumber}`}</Typography>
        <Typography color="text.secondary">
          Mediciones pendientes: {counter}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NeighborhoodCard;
