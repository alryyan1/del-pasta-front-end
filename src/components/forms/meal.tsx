import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  TextField,
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
import { useMealsStore } from "@/stores/MealsStore";
import { Category, Meal } from "@/Types/types";
import { useTranslation } from "react-i18next";

interface ICategory {
  id: number;
  name: string;
  open:boolean;
  handleClose:()=>void
}

const ProductForm = ({handleClose,open}) => {
  const { t } = useTranslation('services'); // i18n hook for translations
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

  const addMeal = useMealsStore((state) => state.addMeal);

  const submitForm: SubmitHandler<Meal> = (data) => {
    addMeal(data);
    handleClose()
  };

  return (
    <Card sx={{ p: 1 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {t("addService")}
      </Typography>
      <form style={{ direction: "rtl" }} onSubmit={handleSubmit(submitForm)}>
        <Stack
          direction={"column"}
          justifyContent={"start"}
          alignContent={"start"}
          alignItems={"start"}
          justifyItems={"start"}
          gap={1}
        >
          {/* Name Field */}
          <TextField
            size="small"
            label={t("name")}
            fullWidth
            variant="standard"
            {...register("name", { required: t("nameRequired") })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          {/* Category Field */}
          <FormControl fullWidth>
            <InputLabel>{t("category")}</InputLabel>
            <Select
              variant="standard"
              label={t("category")}
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
        </Stack>

        {/* Submit Button */}
        <Button
          sx={{ mt: 1 }}
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          {t("save")}
        </Button>
      </form>
    </Card>
  );
};

export default ProductForm;
