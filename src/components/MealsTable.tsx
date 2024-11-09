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
} from '@mui/material';
import axiosClient from '@/helpers/axios-client';
import { useAuthContext } from '@/contexts/stateContext';
import { Meal } from '@/Types/types';
import MealChildrenDialog from './MealChildrenDialog';

// Define the Meal interface

// Sample data for meals

const MealTable: React.FC = () => {
  const [file, setFile] = useState(null);
  const [src, setSrc] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState<Meal|null>(null)
  const {data,setData,deleteItem,add} = useAuthContext()     
  const [open, setOpen] = useState(false);

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
      add(data)
    });
  };
  useEffect(()=>{
    axiosClient.get<Meal[]>('meals').then(({data})=>{
      setData(data)
    })
  },[])
  useEffect(()=>{
     console.log('useefect',selectedMeal)
    data.map((m)=>{
      if(m.id == selectedMeal?.id){
        return selectedMeal
      }else{
        return m
      }
    })
  },[selectedMeal])
  return (
    <TableContainer component={Paper} dir="rtl">
      <Typography variant='h5' textAlign={'center'}>كل الوجبات</Typography>
      <Table size='small' className="text-sm border border-gray-300">
        <TableHead className="bg-gray-100">
          <TableRow>
            <TableCell className="p-2">اسم</TableCell>
            <TableCell className="p-2">السعر </TableCell>
            <TableCell className="p-2"> الفئة</TableCell>
            <TableCell className="p-2">صورة</TableCell>
            {/* <TableCell className="p-2">وقت التحضير (دقائق)</TableCell> */}
            {/* <TableCell className="p-2">مستوى التوابل (1-5)</TableCell> */}
            <TableCell className="p-2"> الصوره</TableCell>
            <TableCell className="p-2"> فرعي</TableCell>
            <TableCell className="p-2">حذف</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((meal:Meal, index) => (
            <TableRow key={index} className="hover:bg-gray-50">
              <TableCell className="p-2">{meal.name}</TableCell>
              <TableCell className="p-2">{meal.price}</TableCell>
              <TableCell className="p-2">{meal?.category?.name}</TableCell>
              <TableCell className="p-2">
                <img src={meal.image} alt={meal.name} style={{ width: '100px' }} />
              </TableCell>
           
              {/* <TableCell className="p-2">{meal.prep_time ?? 'N/A'}</TableCell> */}
              {/* <TableCell className="p-2">{meal.spice_level ?? 'N/A'}</TableCell> */}
              <input onChange={(e)=>{
          handleFileChange(e,meal)
        }} type="file"></input>
              <TableCell className="p-2">
                <Button onClick={()=>{
                  
                  handleClickOpen()
                  setSelectedMeal(meal)}}>الوجبات</Button>
              </TableCell>
           {/* <TableCell> */}
           {/* <img width={100} src={URL.createObjectURL(meal.image)} alt="" /> */}
           {/* </TableCell> */}
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
      <MealChildrenDialog setSelectedMeal={setSelectedMeal} selectedMeal={selectedMeal} open={open} handleClickOpen={handleClickOpen} handleClose={handleClose}/>
    </TableContainer>
  );
};

export default MealTable;