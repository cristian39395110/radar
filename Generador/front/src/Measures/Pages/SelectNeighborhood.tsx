import { Grid } from "@mui/material";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

import { Neighborhood } from "../../dopplerApi/types/Neighborhoods";
import NeighborhoodCard from "../components/NeighborhoodCard";
import { useNeighborhoods } from "../../dopplerApi/hooks/useNeighborhoods";

interface Props {}

const SelectNeighborhood: FC<Props> = () => {
  const { neighborhoods, isLoading } = useNeighborhoods();
  const navigate = useNavigate();

  const selectNeighborhood = (neighborhood: Neighborhood) => {
    navigate(`${neighborhood._id}`);
  };

  return (
    <div>
      <Grid container spacing={2} sx={{ marginTop: ".5rem" }}>
        {neighborhoods?.map((neighborhood) => (
          <Grid item key={neighborhood.name}>
            <NeighborhoodCard
              neighborhood={neighborhood}
              onClick={selectNeighborhood}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default SelectNeighborhood;
