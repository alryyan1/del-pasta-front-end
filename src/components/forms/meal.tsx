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
  Typography
} from '@mui/material';
import axiosClient from '@/helpers/axios-client';
import { useAuthContext } from '@/contexts/stateContext';

interface ICategory {
  id: number;
  name: string;
}

interface IFormInput {
  name: string;
  price: number;
  category_id: number;
  description: string;
  image: string;
  available: boolean;
  calories?: number;
  prep_time?: number;
  spice_level?: number;
  is_vegan: boolean;
  is_gluten_free: boolean;
}

const ProductForm = () => {

  const [categories, setCategories] = React.useState<ICategory[]>([]);
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
  const  {setData,data,add,deleteItem,setAction} =   useAuthContext()

  const submitForm: SubmitHandler<IFormInput> = (data) => {
    console.log(data)
    axiosClient.post('meals', data).then(({ data }) => {
      console.log(data,'data')
      add(data)
    })
  };



  return (
    <>
      <Typography variant="h4" align="center" gutterBottom>
         اضافه وجبه
      </Typography>
      <form  style={{direction:'rtl'}}  onSubmit={handleSubmit(submitForm)}>
        {/* Name */}
        <TextField
         size='small'
          label="الاسم"
          fullWidth
          
          variant="standard"
          {...register('name', { required: 'Name is required' })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        {/* Price */}
        <TextField
         size='small'
          label="السعر"
          type="number"
          fullWidth
          
          variant="standard"
          {...register('price', { required: 'Price is required', min: 0 })}
          error={!!errors.price}
          helperText={errors.price?.message}
        />

        {/* Category */}
        <FormControl fullWidth >
          <InputLabel>الفئة</InputLabel>
          <Select
            label="الفئة"
            defaultValue=""
            {...register('category_id')}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Description */}
        <TextField
         size='small'
          label="الوصف"
          fullWidth
          
          variant="standard"
          {...register('description', { required: 'Description is required' })}
          error={!!errors.description}
          helperText={errors.description?.message}
        />

        {/* Image */}
        <TextField
         size='small'
          label="رابط الصورة"
          fullWidth
          
          variant="standard"
          {...register('image', { required: 'Image URL is required' })}
          error={!!errors.image}
          helperText={errors.image?.message}
        />

        {/* Available */}
        <FormControlLabel
          control={<Checkbox defaultChecked {...register('available')} />}
          label="متاح"
        />

        {/* Calories */}
        <TextField
         size='small'
          label="السعرات الحرارية"
          type="number"
          fullWidth
          
          variant="standard"
          {...register('calories')}
        />

        {/* Prep Time */}
        <TextField
         size='small'
          label="وقت التحضير (بالدقائق)"
          type="number"
          fullWidth
          
          variant="standard"
          {...register('prep_time')}
        />

        {/* Spice Level */}
        <TextField
         size='small'
          label="درجة الحارة (1-5)"
          type="number"
          fullWidth
          
          variant="standard"
          inputProps={{ min: 1, max: 5 }}
          {...register('spice_level')}
        />

        {/* Is Vegan */}
        <FormControlLabel
          control={<Checkbox {...register('is_vegan')} />}
          label="نباتي"
        />

        {/* Is Gluten Free */}
        <FormControlLabel
          control={<Checkbox {...register('is_gluten_free')} />}
          label="خالٍ من الغلوتين"
        />

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          إرسال
        </Button>
      </form>
    </>
  );
};

export default ProductForm;