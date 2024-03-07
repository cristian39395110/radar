import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { FC, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../dopplerApi/hooks/useAuth";
import { useAuthStore } from "../state";
import { ExitToApp } from "@mui/icons-material";

interface Props {}

type NavRoute = {
  to: string;
  message: string;
};

const routes: NavRoute[] = [
  {
    to: "/neighborhoods",
    message: "Inicio",
  },
  {
    to: "/reports",
    message: "Reportes",
  },
  {
    to: "/reports/accessin",
    message: "Accessin",
  },
  {
    to: "/measures",
    message: "Mediciones",
  },
  {
    to: "/update-password",
    message: "Actualizar contraseña",
  },
];

const adminRoutes: NavRoute[] = [
  {
    to: "/admin/neighborhoods",
    message: "Barrios",
  },
  {
    to: "/admin/radars",
    message: "Radares",
  },
  {
    to: "/admin/users",
    message: "Usuarios",
  },
];

const Navigation: FC<Props> = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const roles = user?.roles ?? [];
  const fullName = user?.fullName ?? "";

  const userRoutes = useMemo(() => {
    if (roles?.includes("admin")) return [...routes, ...adminRoutes];
    return [...routes];
  }, [roles]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar variant="dense" sx={{ justifyContent: "space-between" }}>
          <div>
            {userRoutes.map(({ to, message }) => (
              <Link to={to} key={to}>
                <Button color="inherit">{message}</Button>
              </Link>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography>{fullName}</Typography>
            <IconButton color="error" onClick={handleLogout}>
              <ExitToApp />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navigation;
