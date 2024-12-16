import React, { useEffect, useState } from "react";
import {
  Autocomplete,
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
import MealChildrenTable, {
  MealChildrenTableMobile,
} from "./MealChildrenTable";
import { useServiceStore } from "@/pages/ServiceStore";

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
  const [width, setWidth] = useState(window.innerWidth);
  const [selectedService,setSelectedService] = useState()
const {serviceList,addService,fetchData} = useServiceStore()
  useEffect(() => {
    fetchData()
  }, []);

  const { handleSubmit, register } = useForm();
  const submitHandler = (data) => {
    console.log(data, "data");
    axiosClient
      .post<AxiosResponseProps<Meal>>(`childMeals`, {
        ...data,
        meal_id: selectedMeal?.id,
        service_id: selectedService?.id,
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
        <DialogTitle>
          <Typography className=" text-center  bg-red-300 p-1 border rounded-lg " variant="h6">{selectedMeal?.name}</Typography>{" "}
        </DialogTitle>
        <DialogContent className="">
          <Typography>اضافه صنف</Typography>

          <form onSubmit={handleSubmit(submitHandler)}>
            <Stack gap={2} sx={{mb:1}} direction={"row"}>
              <Autocomplete
              fullWidth
              getOptionLabel={(op)=>op.name}
              options={serviceList}
              value={selectedService}
              onChange={(e,val)=>{
                setSelectedService(val)
              }}
              renderInput={(props)=>{
                return (
                  <TextField
                  {...props}
                    size="small"
                  />
                );
              }}
              />
              {" "}
              {/* <TextField
                label="الاسم"
                {...register("name", {
                  required: {
                    value: true,
                    message: "الحقل مطلوب",
                  },
                })}
                size="small"
              ></TextField> */}
              {/* <TextField
                  label="العدد"
                  {...register("quantity", {
                    required: {
                      value: true,
                      message: "الحقل مطلوب",
                    },
                  })}
                  size="small"
                ></TextField> */}
              {/* <TextField
                label="السعر"
                {...register("price")}
                size="small"
              ></TextField> */}
               <Button sx={{ width: "100px" }} type="submit" variant="contained">
                {" "}
                +
              </Button>
              {/* <Stack direction={"row"} gap={1}>
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
              </Stack> */}
             
            </Stack>
          </form>
          <div>
            {width > 700 ? (
              <MealChildrenTable
                selectedMeal={selectedMeal}
                setSelectedMeal={setSelectedMeal}
                data={selectedMeal?.child_meals}
              />
            ) : (
              <MealChildrenTableMobile
                selectedMeal={selectedMeal}
                setSelectedMeal={setSelectedMeal}
                data={selectedMeal?.child_meals}
              />
            )}
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
