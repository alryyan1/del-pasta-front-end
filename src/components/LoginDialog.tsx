import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,

} from "@mui/material";
import App from "@/pages/Login";


const LoginDialog = ({handleClose,open}) => {
  const [width, setWidth] = useState(window.innerWidth);


  return (
    <div className="">
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle></DialogTitle>
        <DialogContent className="">
            <App/>
        </DialogContent>
        <DialogActions>
        
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LoginDialog;
