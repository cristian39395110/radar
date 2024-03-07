import { Drawer, List, ListItem, Stack, SwipeableDrawer } from "@mui/material";
import { FC, useState } from "react";

interface Props {
  open: boolean;
  onClose?: () => void;
}

const Menu: FC<Props> = ({ open, onClose }) => {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <List>
        <ListItem>Paginas</ListItem>
      </List>
    </Drawer>
  );
};

export default Menu;
