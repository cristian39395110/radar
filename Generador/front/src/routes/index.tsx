import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "../Login";
import FindMeasures from "../Measures/Pages/FindMeasures";
import Measures from "../Measures/Pages/Measures";
import NewRegister from "../Measures/Pages/NewRegister";
import NewRegisterById from "../Measures/Pages/NewRegisterById";
import SelectNeighborhood from "../Measures/Pages/SelectNeighborhood";
import EditReport from "../Reports/Pages/EditReport";
import Report from "../Reports/Pages/Report";
import Reports from "../Reports/Pages/Reports";
import ReportsResume from "../Reports/Pages/ReportsResume";
import SendToAccessin from "../Reports/Pages/SendToAccessin";
import AdminHome from "../admin/pages/AdminHome";
import Homeowners from "../admin/pages/Homeowners";
import Neighborhoods from "../admin/pages/Neighborhoods";
import NewNeighborhood from "../admin/pages/NewNeighborhood";
import NewRadar from "../admin/pages/NewRadar";
import NewUser from "../admin/pages/NewUser";
import Radars from "../admin/pages/Radars";
import Users from "../admin/pages/Users";
import UpdatePassword from "../auth/pages/UpdatePassword";
import { dopplerApi } from "../dopplerApi/doppler";
import AdminLayout from "../layouts/AdminLayout";
import BasicLayout from "../layouts/BasicLayout";
import { useAuthStore } from "../state";
import { User } from "../types/User";
import Home from "./Home";
import EditHomeowners from "../admin/pages/EditHomeowners";

export const MainRouter = () => {
  const { updateUser } = useAuthStore();
  const navigate = useNavigate();

  const updateToken = async () => {
    try {
      const { data } = await dopplerApi.put<User>("/auth");
      updateUser(data);
    } catch (e) {
      navigate("/login");
    }
  };

  useEffect(() => {
    updateToken();
  }, []);

  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/" element={<BasicLayout />}>
        <Route path="update-password" element={<UpdatePassword />} />
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="neighborhoods" element={<BasicLayout />}>
        <Route index element={<SelectNeighborhood />} />
        <Route path=":neighborhoodId">
          <Route index element={<NewRegister />} />
          <Route path="reports" element={<ReportsResume />} />
          <Route path="measures" element={<FindMeasures />} />
        </Route>
      </Route>
      <Route path="measures" element={<BasicLayout />}>
        <Route index element={<Measures />} />
        <Route path=":id" element={<NewRegisterById />} />
      </Route>
      <Route path="reports" element={<BasicLayout />}>
        <Route index element={<Reports />} />
        <Route path="accessin" element={<SendToAccessin />} />
        <Route path=":report">
          <Route index element={<Report />} />
          <Route path="edit" element={<EditReport />} />
        </Route>
      </Route>
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminHome />} />
        <Route path="neighborhoods">
          <Route index element={<Neighborhoods />} />
          <Route path="new" element={<NewNeighborhood />} />
          <Route path=":id" element={<NewNeighborhood />} />
          <Route path=":id/homeowners">
            <Route index element={<Homeowners />} />
            <Route path="edit" element={<EditHomeowners />} />
          </Route>
        </Route>
        <Route path="radars">
          <Route index element={<Radars />} />
          <Route path="new" element={<NewRadar />} />
          <Route path=":id" element={<NewRadar />} />
        </Route>
        <Route path="users">
          <Route index element={<Users />} />
          <Route path="new" element={<NewUser />} />
        </Route>
      </Route>
    </Routes>
  );
};
