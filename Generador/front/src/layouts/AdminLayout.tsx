import { FC, useEffect } from "react";
import BasicLayout from "./BasicLayout";
import { useAuthStore } from "../state";
import { useNavigate } from "react-router-dom";

interface Props {}

const AdminLayout: FC<Props> = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    !user?.roles.includes("admin") && navigate("/neighborhoods");
  }, [user]);

  return <BasicLayout />;
};

export default AdminLayout;
