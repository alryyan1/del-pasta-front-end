import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import axiosClient from "@/helpers/axios-client";
import { AxiosResponseProps, Meal } from "@/Types/types";
import MealChildrenTable from "./MealChildrenTable";

interface MealChildrenDialogProps {
  open: boolean;
  handleClose: () => void;
  handleClickOpen: () => void;
  selectedMeal: Meal|null;
  setSelectedMeal: (meal:Meal|null) => void;
}


const MealChildrenDialog = ({
  handleClickOpen,
  handleClose,
  open,
  selectedMeal,
  setSelectedMeal,
}: MealChildrenDialogProps) => {
  const { handleSubmit, register } = useForm();
  const submitHandler = (data) => {
    console.log(data,'data')
    axiosClient.post<AxiosResponseProps<Meal>>(`childMeals`,{
        ...data,
        meal_id :selectedMeal?.id
    }).then(({data})=>{
        console.log(data,'child meals add')
        if (data.status) {
            
            setSelectedMeal(data.data)
        }
    })
  };
  return (
    <div className="">
      <Dialog  open={open} onClose={handleClose}>
        <DialogTitle>اضافه صنف لقائمه</DialogTitle>
        <DialogContent  className="grid grid-cols-2  gap-1">
          <form onSubmit={handleSubmit(submitHandler)}>
            <Stack gap={2} direction={"column"}>
              <TextField
                label="الاسم"
                {...register("name",{
                    required:{
                        value:true,
                        message:'الحقل مطلوب'
                    }
                })}
                size="small"
              ></TextField>
              <TextField
                label="العدد"
                {...register("quantity",{
                    required:{
                        value:true,
                        message:'الحقل مطلوب'
                    }
                })}
                size="small"
              ></TextField>
                <TextField
                label="السعر"
                {...register("price")}
                size="small"
              ></TextField>
               <TextField
                label="عدد الاشخاص"
                {...register("people_count")}
                size="small"
              ></TextField>
              <TextField
                label="الوزن"
                {...register("weight")}
                size="small"
              ></TextField>
              <Button type="submit" variant="contained"> +</Button>
            </Stack>
          </form>
          <div>
            <MealChildrenTable setSelectedMeal={setSelectedMeal} data={selectedMeal?.child_meals}/>
          </div>
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

export default MealChildrenDialog;
