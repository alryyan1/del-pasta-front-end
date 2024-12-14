import React, { useState } from "react";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ProductForm from "./forms/meal";



const AddItemDialog = ({handleClose,open}) => {


  return (
    <div className="">
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
            <Typography>Add Item</Typography>
        </DialogTitle>
        <DialogContent className="">
            <ProductForm handleClose={handleClose} open={open}/>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddItemDialog;
