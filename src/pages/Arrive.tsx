import { useAuthContext } from "@/contexts/stateContext";
import axiosClient from "@/helpers/axios-client";
import { Order } from "@/Types/types";
import { CheckCircleOutline } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useParams } from "react-router-dom";

function Arrive() {

   const {id} =  useParams()
   const [loading,setLoading] = useState(false)
   const [order,setOrder] = useState<Order|null>(null)
   const {register,handleSubmit} =  useForm()
   useEffect(()=>{
      axiosClient.get(`orderById/${id}`).then(({data})=>{
        setOrder(data)
      })
   },[loading])
   const submitHandler = (data) =>{
    setLoading(true)
        console.log(data)
        axiosClient.patch(`arrival/${id}`, {
            car_palette : data.car_palette,
            outside:true ,
            outside_confirmed:1 ,
        }).then(({ data }) => {}).then(()=>{
         setLoading(false)
        });

   }
  return (
    <Box
      className="rounded-md "
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
     {order?.outside_confirmed ?<CheckCircleOutline fontSize="large" color="success"/> :   <form onSubmit={handleSubmit(submitHandler)}>
        <Stack gap={1} sx={{ maxWidth: "400px" }} direction={"column"}>
          <Typography textAlign={"center"} variant="h4">
            Arrival-  الوصول
          </Typography>
          <TextField {...register('car_palette',{
            required: true,
          })} label="Car Palette رقم لوحه السياره" />
          <LoadingButton loading={loading}
          type="submit"
           
            variant="contained"
          >
         I am Here - انا هنا
          </LoadingButton >
        </Stack>
      </form>}
    </Box>
  );
}

export default Arrive;
