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
import { useForm } from "react-hook-form";
import axiosClient from "@/helpers/axios-client";
import { AxiosResponseProps, ChildMeal, Meal } from "@/Types/types";
import MealChildrenTable, {
  MealChildrenTableMobile,
} from "./MealChildrenTable";
import { Plus } from "lucide-react";

interface DepositDialogProbs {
  open: boolean;
  handleClose: () => void;
  handleClickOpen: () => void;
  selectedChild: number | null;
  mealName:string;
  childName:string
}

const DepositDialog = ({
  handleClose,
  open,
  selectedChild,
  mealName,
  childName,
}: DepositDialogProbs) => {
  const [width, setWidth] = useState(window.innerWidth);

  const { handleSubmit, register ,reset,formState:{errors}} = useForm();
  const submitHandler = (data) => {
    console.log(data, "data");
    axiosClient
      .post<AxiosResponseProps<Meal>>(`deposits`, {
        quantity: data.quantity,
        child_meal_id: selectedChild,
      })
      .then(({ data }) => {
        console.log(data, "child meals add");
        handleClose();
        reset()
        
      });
  };
  return (
    <div className="">
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Typography className='shadow-sm border rounded-sm bg-orange-500 text-yellow-50 p-3' variant="h5">{mealName}</Typography>
          <Typography variant="h5" textAlign={'center'} sx={{m:1}} ><Chip size='medium' label={childName}></Chip></Typography>
        </DialogTitle>
        <DialogContent className="">
          <Typography>اضافه للمخزن</Typography>

          <form onSubmit={handleSubmit(submitHandler)}>
            <Stack gap={2} alignItems={'center'} justifyContent={'center'} direction={"row"}>

              <TextField
                label="العدد"
                {...register("quantity",{
                  required: "العدد مطلوب",
                  min: {
                    value: 1,
                    message: "العدد يجب أن يكون على الأقل 1",
                  },
                })}
                helperText={errors?.quantity != null && errors.quantity.message}
                size="small"
              ></TextField>
               <Button size='small'  type="submit" variant="contained">
                <Plus/>
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
