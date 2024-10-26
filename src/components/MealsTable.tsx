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
import { useAuthContext } from '@/contexts/stateContext';
import { Meal } from '@/Types/types';

// Define the Meal interface

// Sample data for meals

const MealTable: React.FC = () => {

  const {data,setData,deleteItem} = useAuthContext()     
  useEffect(()=>{
    axiosClient.get<Meal[]>('meals').then(({data})=>{
      setData(data)
    })
  },[])
  return (
    <TableContainer component={Paper} dir="rtl">
      <Typography variant='h5' textAlign={'center'}>كل الوجبات</Typography>
      <Table size='small' className="text-sm border border-gray-300">
        <TableHead className="bg-gray-100">
          <TableRow>
            <TableCell className="p-2">اسم</TableCell>
            <TableCell className="p-2">السعر (ريال)</TableCell>
            <TableCell className="p-2">معرف الفئة</TableCell>
            <TableCell className="p-2">الوصف</TableCell>
            <TableCell className="p-2">صورة</TableCell>
            <TableCell className="p-2">متاح</TableCell>
            <TableCell className="p-2">السعرات الحرارية</TableCell>
            <TableCell className="p-2">وقت التحضير (دقائق)</TableCell>
            <TableCell className="p-2">مستوى التوابل (1-5)</TableCell>
            <TableCell className="p-2">نباتي</TableCell>
            <TableCell className="p-2">خالٍ من الغلوتين</TableCell>
            <TableCell className="p-2">حذف</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((meal:Meal, index) => (
            <TableRow key={index} className="hover:bg-gray-50">
              <TableCell className="p-2">{meal.name}</TableCell>
              <TableCell className="p-2">{meal.price}</TableCell>
              <TableCell className="p-2">{meal.category_id}</TableCell>
              <TableCell className="p-2">{meal.description}</TableCell>
              <TableCell className="p-2">
                <img src={meal.image} alt={meal.name} style={{ width: '100px' }} />
              </TableCell>
              <TableCell className="p-2">
                <Checkbox checked={meal.available} disabled />
              </TableCell>
              <TableCell className="p-2">{meal.calories ?? 'N/A'}</TableCell>
              <TableCell className="p-2">{meal.prep_time ?? 'N/A'}</TableCell>
              <TableCell className="p-2">{meal.spice_level ?? 'N/A'}</TableCell>
              <TableCell className="p-2">
                <Checkbox checked={meal.is_vegan} disabled />
              </TableCell>
              <TableCell className="p-2">
                <Checkbox checked={meal.is_gluten_free} disabled />
              </TableCell>
              <TableCell className="p-2">
                <button onClick={() => {
                  axiosClient.delete(`meals/${meal.id}`).then(()=>{
                    deleteItem(meal)
                  })
                }}>حذف</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MealTable;