import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import axiosClient from "@/helpers/axios-client";
import { AxiosResponseProps, ChildMeal, Meal } from "@/Types/types";
import MealChildrenTable, {
  MealChildrenTableMobile,
} from "./MealChildrenTable";

interface DepositDialogProbs {
  open: boolean;
  handleClose: () => void;
  handleClickOpen: () => void;
  selectedChild: ChildMeal | null;
}

const DepositDialog = ({
  handleClose,
  open,
  selectedChild,
}: DepositDialogProbs) => {
  const [width, setWidth] = useState(window.innerWidth);

  const { handleSubmit, register } = useForm();
  const submitHandler = (data) => {
    console.log(data, "data");
    axiosClient
      .post<AxiosResponseProps<Meal>>(`deposits`, {
        quantity: data.quantity,
        child_id: selectedChild?.id,
      })
      .then(({ data }) => {
        console.log(data, "child meals add");
        
      });
  };
  return (
    <div className="">
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Typography variant="h4">{selectedChild?.name}</Typography>{" "}
        </DialogTitle>
        <DialogContent className="">
          <Typography>اضافه للمخزن</Typography>

          <form onSubmit={handleSubmit(submitHandler)}>
            <Stack gap={2} direction={"column"}>
          
              <TextField
                label="العدد"
                {...register("quantity")}
                size="small"
              ></TextField>
               <Button sx={{ width: "100px" }} type="submit" variant="contained">
                {" "}
                +
              </Button>
           
            </Stack>
          </form>
          
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

export default DepositDialog;
