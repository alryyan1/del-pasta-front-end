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
  Stack,
  Box,
  FormHelperText,
} from "@mui/material";
import axiosClient from "@/helpers/axios-client";
import { useMealsStore } from "@/stores/MealsStore";
import { Category, Meal } from "@/Types/types";
import { Save } from "lucide-react";

interface IFormInput {
  name: string;
  category_id: number;
  price?: number;
  people_count?: string;
}

interface ProductFormProps {
  handleClose: () => void;
  open: boolean;
}

const ProductForm = ({ handleClose }: ProductFormProps) => {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  useEffect(() => {
    axiosClient.get<Category[]>(`categories`).then(({ data }) => {
      setCategories(data);
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput>({
    defaultValues: {
      people_count: "1",
    },
  });

  const addMeal = useMealsStore((state) => state.addMeal);

  const submitForm: SubmitHandler<IFormInput> = (data) => {
    setIsSubmitting(true);
    addMeal(data as unknown as Meal);
    setTimeout(() => {
      setIsSubmitting(false);
      reset();
      handleClose();
    }, 500);
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(submitForm)}>
        <Stack spacing={3}>
          {/* Name Field */}
          <TextField
            label="Item Name"
            placeholder="Enter item name..."
            fullWidth
            {...register("name", { required: "Name is required" })}
            error={!!errors.name}
            helperText={errors.name?.message}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          {/* Category Field */}
          <FormControl fullWidth error={!!errors.category_id}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              defaultValue=""
              {...register("category_id", { required: "Category is required" })}
              sx={{
                borderRadius: 2,
              }}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                      }}
                    />
                    <Typography>{category.name}</Typography>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
            {errors.category_id && (
              <FormHelperText>{errors.category_id.message}</FormHelperText>
            )}
          </FormControl>

          {/* Price Field (Optional) */}
          <TextField
            label="Price (Optional)"
            placeholder="0.00"
            type="number"
            fullWidth
            {...register("price")}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
            inputProps={{
              step: "0.01",
              min: "0",
            }}
          />

          {/* Submit Button */}
          <Box
            sx={{
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              gap: 2,
              justifyContent: 'flex-end',
            }}
          >
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                px: 3,
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={<Save size={18} />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                },
              }}
            >
              {isSubmitting ? 'Saving...' : "Save Item"}
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};

export default ProductForm;
