import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  Typography,
  Card,
  Stack,
} from "@mui/material";
import axiosClient from "@/helpers/axios-client";
import { useAuthContext } from "@/contexts/stateContext";
import { useMealsStore } from "@/stores/MealsStore";
import { Category, Meal } from "@/Types/types";

interface ICategory {
  id: number;
  name: string;
}



const ProductForm = () => {
  const [categories, setCategories] = React.useState<ICategory[]>([]);
  useEffect(() => {
    axiosClient.get<Category>(`categories`).then(({ data }) => {
      setCategories(data);
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
  
      people_count: "1",
    },
  });
  const addMeal = useMealsStore((state)=>state.addMeal)

  const submitForm: SubmitHandler<Meal> = (data) => {
    // alert('dd')
      addMeal(data);
   
  };

  return (
    <Card sx={{ p: 1 }}>
      <Typography variant="h4" align="center" gutterBottom>
        اضافه خدمه
      </Typography>
      <form style={{ direction: "rtl" }} onSubmit={handleSubmit(submitForm)}>
        <Stack direction={"column"} justifyContent={'start'} alignContent={'start'} alignItems={'start'} justifyItems={'start'} gap={1}>
          <TextField
            size="small"
            label="الاسم"
            fullWidth
            variant="standard"
            {...register("name", { required: "Name is required" })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          {/* Price */}
          {/* <TextField
            size="small"
            label="السعر"
            fullWidth
            variant="standard"
            {...register("price", { required: "Price is required", min: 0 })}
            error={!!errors.price}
            helperText={errors.price?.message}
          /> */}

          {/* Category */}
          <FormControl  fullWidth>
            <InputLabel>الفئة</InputLabel>
            <Select
              variant="standard"
              label="الفئة"
              defaultValue=""
              {...register("category_id")}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {/* Price */}
          {/* <TextField
            size="small"
            label="عدد الاشخاص"
            fullWidth
            variant="standard"
            {...register("people_count")}
          /> */}

        </Stack>
        {/* Name */}

        {/* Prep Time */}

        {/* Submit Button */}
        <Button sx={{ mt: 1 }} type="submit" variant="contained" color="primary" fullWidth>
          حفظ
        </Button>
      </form>
    </Card>
  );
};

export default ProductForm;
