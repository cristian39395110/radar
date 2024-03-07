import { Box, LinearProgress, Modal } from "@mui/material";
import { FC } from "react";

interface Props {
  open: boolean;
  value: number;
  children?: string | JSX.Element | JSX.Element[];
}

const LinearLoadingModal: FC<Props> = ({ open, children, value }) => {
  return (
    <Modal open={open}>
      <Box className="modal">
        {children}
        <LinearProgress value={value} variant="determinate" />
      </Box>
    </Modal>
  );
};

export default LinearLoadingModal;
