import { useQuery } from "react-query";
import { loadUsers } from "../auth.api";

export const useUsers = () => {
  const { data: users, ...rest } = useQuery("users", loadUsers);

  return {
    users,
    ...rest,
  };
};
