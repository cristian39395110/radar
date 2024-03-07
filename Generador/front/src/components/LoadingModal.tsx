import { Box, CircularProgress, Modal, Typography } from "@mui/material";
import { FC } from "react";

interface Props {
  isLoading: boolean;
  message?: string;
}

const LoadingModal: FC<Props> = ({ isLoading, message }) => {
  return (
    <Modal open={isLoading}>
      <Box sx={{}}>
        <CircularProgress />
        <Typography variant="h3">{message}</Typography>
      </Box>
    </Modal>
  );
};

export default LoadingModal;
