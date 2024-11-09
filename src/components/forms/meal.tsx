import React, { useEffect } from 'react';
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
  Typography,
  Card,
  Stack
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
  useEffect(()=>{
    axiosClient.get<Category>(`categories`).then(({data})=>{
      setCategories(data)
    })
  },[])
  
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
    <Card sx={{p:1}}>
      <Typography variant="h4" align="center" gutterBottom>
         اضافه بوفيه
      </Typography>
      <form  style={{direction:'rtl'}}  onSubmit={handleSubmit(submitForm)}>
         <Stack direction={'column'} gap={1}>
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
          variant='standard'
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
         </Stack>
        {/* Name */}
     
        {/* Prep Time */}
    
   

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          حفظ
        </Button>
      </form>
    </Card>
  );
};

export default ProductForm;