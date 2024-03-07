import { FC, useEffect, useRef, useState } from "react";
import { useModalStore } from "../state/modal.store";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Typography,
} from "@mui/material";
import { Check, Error } from "@mui/icons-material";

interface Props {}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
};

const iconStyle = {
  fontSize: 50,
};

const Components = {
  idle: <></>,
  error: <Error color="error" sx={iconStyle} />,
  loading: <CircularProgress />,
  success: <Check color="success" sx={iconStyle} />,
};

const defaultMessages = {
  idle: "",
  error: "Error inesperador",
  loading: "Cargando...",
  success: "Información correcta",
};

const StatusModal: FC<Props> = () => {
  const { status, message, timeout, setStatus } = useModalStore();
  const [disabled, setDisabled] = useState(true);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setDisabled(status !== "success");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDisabled(false), timeout);
  }, [status]);

  const handleClose = () => {
    setStatus("idle", "");
  };

  return (
    <Modal open={status !== "idle"}>
      <Box sx={style}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          {Components[status]}
          <Typography variant="h4">
            {message || defaultMessages[status]}
          </Typography>
        </div>
        <Button color="error" disabled={disabled} onClick={handleClose}>
          Cerrar
        </Button>
      </Box>
    </Modal>
  );
};

export default StatusModal;
