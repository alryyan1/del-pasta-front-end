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
  Button,
  TextField,
} from '@mui/material';
import axiosClient from '@/helpers/axios-client';
import { useAuthContext } from '@/contexts/AppContext';
import { Meal } from '@/Types/types';
import MealChildrenDialog from './MealChildrenDialog';
import placeHolder from './../assets/images/ph.jpg'
import TdCell from '@/helpers/TdCell';
import { useMealsStore } from '@/stores/MealsStore';

// Define the Meal interface

// Sample data for meals

const MealsTableMobile: React.FC = () => {
  const [search,setSearch] = useState(null)
  const [file, setFile] = useState(null);
  const [src, setSrc] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState<Meal|null>(null)
  const [open, setOpen] = useState(false);
 let {addMeal,fetchMeals,deleteMeal,meals} =  useMealsStore()
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = (e,meal) => {
    //convert image to base64 and save it to db
    encodeImageFileAsURL(e.target.files[0],meal);

    const url = URL.createObjectURL(e.target.files[0]);
    console.log(url, "path");
    setSrc(url);
    console.log("upload", e.target.files[0]);
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  function encodeImageFileAsURL(file:File,meal:Meal) {
    const reader = new FileReader();
    reader.onloadend = function () {
      console.log("RESULT", reader.result);
      saveToDb( reader.result,meal);
    };
    reader.readAsDataURL(file);
  }
  
  const saveToDb = (data,meal) => {
    axiosClient.patch(`meals/${meal.id}`, { image:data }).then(({ data }) => {
      fetchMeals()
    });
  };
  useEffect(()=>{
    fetchMeals()
  },[selectedMeal])
  useEffect(()=>{
     console.log('useefect',selectedMeal)
     meals.map((m)=>{
      if(m.id == selectedMeal?.id){
        return selectedMeal
      }else{
        return m
      }
    })
  },[selectedMeal])
   meals  = meals.filter((m)=>{
    if (search !=null) {
      return m.name.toLowerCase().includes(search.toLowerCase())
    }else{
      return true
    }
   })
  return (
    <TableContainer sx={{mt:1, mx: 'auto'}}  dir="rtl">
      <TextField onChange={(e)=>{
        setSearch(e.target.value)
      }} size='small'/>
      <Typography variant='h5' textAlign={'center'}>الخدمات الاساسيه</Typography>
      <Table size='small' className="text-sm border border-gray-300">
        <TableHead className="bg-gray-100">
          <TableRow>
            <TableCell className="">كود</TableCell>
            <TableCell className="">اسم</TableCell>
            <TableCell className=""> فرعي</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {meals.map((meal:Meal, index) => (
            <TableRow key={meal.id} className="hover:bg-gray-50">
              <TableCell className="">{meal.id}</TableCell>
              <TdCell table={'meals'} colName={'name'} item={meal}  >{meal.name}</TdCell>
           
              <TableCell className="">
                <Button onClick={()=>{
                  
                  handleClickOpen()
                  setSelectedMeal(meal)}}>الخدمات</Button>
              </TableCell>
          
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <MealChildrenDialog setSelectedMeal={setSelectedMeal} selectedMeal={selectedMeal} open={open} handleClickOpen={handleClickOpen} handleClose={handleClose}/>
    </TableContainer>
  );
};

export default MealsTableMobile;