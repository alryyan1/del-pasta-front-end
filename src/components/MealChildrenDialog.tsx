import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import axiosClient from "@/helpers/axios-client";
import { AxiosResponseProps, Meal } from "@/Types/types";
import MealChildrenTable from "./MealChildrenTable";

interface MealChildrenDialogProps {
  open: boolean;
  handleClose: () => void;
  handleClickOpen: () => void;
  selectedMeal: Meal | null;
  setSelectedMeal: (meal: Meal | null) => void;
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
    console.log(data, "data");
    axiosClient
      .post<AxiosResponseProps<Meal>>(`childMeals`, {
        ...data,
        meal_id: selectedMeal?.id,
      })
      .then(({ data }) => {
        console.log(data, "child meals add");
        if (data.status) {
          setSelectedMeal(data.data);
        }
      });
  };
  return (
    <div className="">
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle><Typography variant="h4">{selectedMeal?.name}</Typography>  </DialogTitle>
        <DialogContent className="grid gap-1">
          <form onSubmit={handleSubmit(submitHandler)}>
            <Stack gap={2} direction={"column"}>
              <Stack direction={"row"} gap={1}>
                {" "}
                <TextField
                  label="الاسم"
                  {...register("name", {
                    required: {
                      value: true,
                      message: "الحقل مطلوب",
                    },
                  })}
                  size="small"
                ></TextField>
                <TextField
                  label="العدد"
                  {...register("quantity", {
                    required: {
                      value: true,
                      message: "الحقل مطلوب",
                    },
                  })}
                  size="small"
                ></TextField>
                <TextField
                  label="السعر"
                  {...register("price")}
                  size="small"
                ></TextField>
              </Stack>
              <Stack direction={"row"} gap={1}>
                {" "}
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
              </Stack>

              <Button sx={{width:'100px'}} type="submit" variant="contained">
                {" "}
                +
              </Button>
            </Stack>
          </form>
          <div>
            <MealChildrenTable
             selectedMeal={selectedMeal}
                 
             setSelectedMeal={setSelectedMeal}
              data={selectedMeal?.child_meals}
            />
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
