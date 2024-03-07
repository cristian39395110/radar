import { Box, Button, Modal } from "@mui/material";
import { FC } from "react";

interface Props {
  open: boolean;
  onAccept?: () => void;
  onClose?: () => void;
  children?: string | JSX.Element | JSX.Element[];
}

const ConfirmationModal: FC<Props> = ({
  children,
  open,
  onAccept,
  onClose,
}) => {
  return (
    <Modal open={open}>
      <Box className="modal">
        <div className="modal-content">{children}</div>
        <div className="modal-options">
          <Button variant="contained" color="success" onClick={onAccept}>
            Si
          </Button>
          <Button variant="contained" color="error" onClick={onClose}>
            No
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
