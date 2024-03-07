import { Box, LinearProgress, Modal, Typography } from "@mui/material";
import { FC } from "react";

interface Props {
  open: boolean;
  total: number;
  sent: number;
  children?: React.ReactNode;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ProgresiveLoadingModal: FC<Props> = ({ open, total, sent, children }) => {
  const progress = Math.round((sent / total) * 100);
  return (
    <Modal open={open}>
      <Box sx={style}>
        <Typography>
          {sent}/{total}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ width: "100%", mr: 1 }}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography
              variant="body2"
              color="text.secondary"
            >{`${progress}%`}</Typography>
          </Box>
        </Box>
        {children}
      </Box>
    </Modal>
  );
};

export default ProgresiveLoadingModal;
