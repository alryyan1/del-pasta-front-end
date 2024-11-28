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
import { useAuthContext } from '@/contexts/stateContext';
import { Meal } from '@/Types/types';
import MealChildrenDialog from './MealChildrenDialog';
import placeHolder from './../assets/images/ph.jpg'
import TdCell from '@/helpers/TdCell';
import { useMealsStore } from '@/stores/MealsStore';

// Define the Meal interface

// Sample data for meals

const MealTable: React.FC = () => {
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
     return m.name.includes(search)
    }else{
      return true
    }
   })
  return (
    <TableContainer sx={{mt:1}}  dir="rtl">
      <TextField onChange={(e)=>{
        setSearch(e.target.value)
      }} size='small'/>
      <Typography variant='h5' textAlign={'center'}>الخدمات الاساسيه</Typography>
      <Table size='small' className="text-sm border border-gray-300">
        <TableHead className="bg-gray-100">
          <TableRow>
            <TableCell className="">كود</TableCell>
            <TableCell className="">اسم</TableCell>
            <TableCell className=""> الفئة</TableCell>
            <TableCell className="">صورة</TableCell>
            {/* <TableCell className="">وقت التحضير (دقائق)</TableCell> */}
            {/* <TableCell className="">مستوى التوابل (1-5)</TableCell> */}
            <TableCell className=""> الصوره</TableCell>
            <TableCell className=""> فرعي</TableCell>
            <TableCell className="">حذف</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {meals.map((meal:Meal, index) => (
            <TableRow key={meal.id} className="hover:bg-gray-50">
              <TableCell className="">{meal.id}</TableCell>
              <TdCell table={'meals'} colName={'name'} item={meal}  >{meal.name}</TdCell>
              <TableCell className="">{meal?.category?.name}</TableCell>
              <TableCell className="">
                <img src={meal?.image ?? placeHolder} alt={meal.name} style={{ width: '100px' }} />
              </TableCell>
           
              {/* <TableCell className="">{meal.prep_time ?? 'N/A'}</TableCell> */}
              {/* <TableCell className="">{meal.spice_level ?? 'N/A'}</TableCell> */}
              <TableCell>
                <input onChange={(e)=>{
          handleFileChange(e,meal)
        }} type="file"></input>
              </TableCell>
              
              <TableCell className="">
                <Button onClick={()=>{
                  
                  handleClickOpen()
                  setSelectedMeal(meal)}}>الخدمات</Button>
              </TableCell>
           {/* <TableCell> */}
           {/* <img width={100} src={URL.createObjectURL(meal.image)} alt="" /> */}
           {/* </TableCell> */}
              <TableCell className="">
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
      <MealChildrenDialog setSelectedMeal={setSelectedMeal} selectedMeal={selectedMeal} open={open} handleClickOpen={handleClickOpen} handleClose={handleClose}/>
    </TableContainer>
  );
};

export default MealTable;