import { LoadingButton } from '@mui/lab';
import { Box, Divider, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import MyCustomControlledAutocomplete from '../CostAutocomplete';
import axiosClient from '@/helpers/axios-client';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthContext } from '@/contexts/stateContext';
import { Cost } from '@/Types/types';
function AddCostForm() {
    const [loading , setLoading] = useState(false)
    const [costCategories,setCostCategories] = useState([])
    const {data,setData} = useAuthContext()
    useEffect(()=>{
        axiosClient.get(`CostCategories`).then(({data})=>{
          setCostCategories(data);
        })
    },[])
   
    const {
        handleSubmit,
        setValue,
        register,
        control,
        reset,
        
        formState: { errors,submitCount },
      } = useForm();
      console.log(errors,'errors')
      const submitHandler = (data) => {
        console.log(data)
        setLoading(true);
        axiosClient.post("costs", {...data,cost_category_id:data.costCategory.id}).then(({ data }) => {
          console.log(data);
          if (data.status) {
            reset()
            
          }
        }).catch((error)=>{
            console.error(error);
        }).finally(()=>setLoading(false));
      };
  return (
    <Box elevation={2}>
    <Typography textAlign={"center"} >
      اضافه مصروف
    </Typography>
    <Divider></Divider>
    <form
      onSubmit={handleSubmit(submitHandler)}
      style={{ padding: "5px" }}
    >
      <Stack direction={"column"} gap={2}>
        <TextField
          error={errors?.description != null}
          helperText={errors?.description && errors.description.message}
          {...register("description", {
            required: {
              value: true,
              message: "يجب ادخال وصف المصروف",
            },
          })}
          multiline
          label="وصف المصروف"
        />
        <MyCustomControlledAutocomplete key={submitCount} setValue={setValue} control={control} errors={errors} rows={costCategories} setRows={setCostCategories} submitPath={'CostCategories'}  isRequired={true} title='اضافه قسم' label='قسم المصروف' controllerName={'costCategory'} />
        <TextField
          error={errors?.amount != null}
          helperText={errors?.amount && errors.amount.message}
          {...register("amount", {
            required: {
              value: true,
              message: "يجب ادخال المبلغ",
            },
          })}
          label="المبلغ"
        />
        <LoadingButton variant='contained' loading={loading} type="submit">حفظ</LoadingButton>
      </Stack>
    </form>
  </Box>
  )
}

export default AddCostForm