import { useQuery } from "react-query";
import { loadRadars } from "../radars.api";

export const useRadars = () => {
  const { data: radars, ...rest } = useQuery("radars", loadRadars);

  return {
    ...rest,
    radars,
  };
};
