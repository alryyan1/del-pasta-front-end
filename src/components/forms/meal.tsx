import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
} from '@mui/material';
import axiosClient from '@/helpers/axios-client';

interface ICategory {
  id: number;
  name: string;
}

interface IFormInput {
  name: string;
  price: number;
  category: number;
  description: string;
  image: string;
  available: boolean;
  calories?: number;
  prep_time?: number;
  spice_level?: number;
  is_vegan: boolean;
  is_gluten_free: boolean;
}

const ProductForm = ( ) => {

    const [categories, setCategories] = React.useState<ICategory[]>([]);
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();

  const submitForm: SubmitHandler<IFormInput> = (data) => {
    console.log(data)
    axiosClient.post('meal',data).then(({data})=>{
        console.log(data,'data')
    })
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      {/* Name */}
      <TextField
        label="Name"
        fullWidth
        margin="normal"
        {...register('name', { required: 'Name is required' })}
        error={!!errors.name}
        helperText={errors.name?.message}
      />

      {/* Price */}
      <TextField
        label="Price"
        type="number"
        fullWidth
        margin="normal"
        {...register('price', { required: 'Price is required', min: 0 })}
        error={!!errors.price}
        helperText={errors.price?.message}
      />

      {/* Category */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Category</InputLabel>
        <Select
          label="Category"
          defaultValue=""
          {...register('category')}
          error={!!errors.category}
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
        {errors.category && <p>{errors.category.message}</p>}
      </FormControl>

      {/* Description */}
      <TextField
        label="Description"
        fullWidth
        margin="normal"
        {...register('description', { required: 'Description is required' })}
        error={!!errors.description}
        helperText={errors.description?.message}
      />

      {/* Image */}
      <TextField
        label="Image URL"
        fullWidth
        margin="normal"
        {...register('image', { required: 'Image URL is required' })}
        error={!!errors.image}
        helperText={errors.image?.message}
      />

      {/* Available */}
      <FormControlLabel
        control={<Checkbox defaultChecked {...register('available')} />}
        label="Available"
      />

      {/* Calories */}
      <TextField
        label="Calories"
        type="number"
        fullWidth
        margin="normal"
        {...register('calories')}
      />

      {/* Prep Time */}
      <TextField
        label="Prep Time (minutes)"
        type="number"
        fullWidth
        margin="normal"
        {...register('prep_time')}
      />

      {/* Spice Level */}
      <TextField
        label="Spice Level (1-5)"
        type="number"
        fullWidth
        margin="normal"
        inputProps={{ min: 1, max: 5 }}
        {...register('spice_level')}
      />

      {/* Is Vegan */}
      <FormControlLabel
        control={<Checkbox {...register('is_vegan')} />}
        label="Is Vegan"
      />

      {/* Is Gluten Free */}
      <FormControlLabel
        control={<Checkbox {...register('is_gluten_free')} />}
        label="Is Gluten Free"
      />

      {/* Submit Button */}
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Submit
      </Button>
    </form>
  );
};

export default ProductForm;
