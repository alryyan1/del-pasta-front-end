import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
} from '@mui/material';
import axiosClient from '@/helpers/axios-client';

// Define the Meal interface
interface Meal {
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

// Sample data for meals


const MealTable: React.FC = () => {

  const [meals,setMeals]=useState([])

  useEffect(()=>{
    axiosClient.get<Meal[]>('meals').then(({data})=>{
      setMeals(data)
      console.log(data,'meals')
    })
  },[])
  return (
    <TableContainer component={Paper}>
      <Typography variant='h5' textAlign={'center'}>كل الوجبات</Typography>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell>اسم</TableCell>
            <TableCell>السعر (ريال)</TableCell>
            <TableCell>معرف الفئة</TableCell>
            <TableCell>الوصف</TableCell>
            <TableCell>صورة</TableCell>
            <TableCell>متاح</TableCell>
            <TableCell>السعرات الحرارية</TableCell>
            <TableCell>وقت التحضير (دقائق)</TableCell>
            <TableCell>مستوى التوابل (1-5)</TableCell>
            <TableCell>نباتي</TableCell>
            <TableCell>خالٍ من الغلوتين</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {meals.map((meal, index) => (
            <TableRow key={index}>
              <TableCell>{meal.name}</TableCell>
              <TableCell>{meal.price}</TableCell>
              <TableCell>{meal.category_id}</TableCell>
              <TableCell>{meal.description}</TableCell>
              <TableCell>
                <img src={meal.image} alt={meal.name} style={{ width: '100px' }} />
              </TableCell>
              <TableCell>
                <Checkbox checked={meal.available} disabled />
              </TableCell>
              <TableCell>{meal.calories ?? 'N/A'}</TableCell>
              <TableCell>{meal.prep_time ?? 'N/A'}</TableCell>
              <TableCell>{meal.spice_level ?? 'N/A'}</TableCell>
              <TableCell>
                <Checkbox checked={meal.is_vegan} disabled />
              </TableCell>
              <TableCell>
                <Checkbox checked={meal.is_gluten_free} disabled />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MealTable;