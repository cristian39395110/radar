import { useQuery } from "react-query";
import { loadRadarsWithApiKey } from "../radars.api";

export const useRadarsWithApiKey = () => {
  const { data: radars, ...rest } = useQuery(
    "radarsWithApiKey",
    loadRadarsWithApiKey
  );

  return {
    ...rest,
    radars,
  };
};
