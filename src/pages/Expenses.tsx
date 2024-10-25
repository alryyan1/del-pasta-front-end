import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import AddCostForm from "@/components/forms/cost";
import axiosClient from "@/helpers/axios-client";
import { useAuthContext } from "@/contexts/stateContext";


function CashDenos() {
  useEffect(() => {
    document.title = "الفئات -";
  }, []);

  const {data,setData} = useAuthContext()
  useEffect(()=>{
    axiosClient.get<Cost[]>(`costs`).then(({data})=>{
      setData(data);
    })
},[])


  useEffect(() => {
    axiosClient.get('costs').then(({data})=>{
        console.log(data,'costs')
    })
  },[])

  return (
    <>
     
      
      <Grid container spacing={2}>
       
        <Grid item lg={3} xs={12}>
          <AddCostForm/>
        </Grid>
     
        <Grid item lg={3} xs={12}>
          <Box sx={{ p: 1 }}>
            <Typography variant="h6" textAlign={"center"}>
              المصروفات 
            </Typography>
            <Table size="small" style={{ direction: "rtl" }}>
              <TableHead>
                <TableRow>
                  <TableCell>وصف المنصرف</TableCell>
                  <TableCell>قسم </TableCell>
                  <TableCell>المبلغ</TableCell>
                  <TableCell>حذف</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((cost) => {
                  return (
                    <TableRow key={cost.id}>
                      <TableCell>{cost.description}</TableCell>
                      <TableCell>{cost?.cost_category?.name}</TableCell>
                      <TableCell>{cost.amount}</TableCell>
                      <TableCell>
                        <LoadingButton
                          onClick={() => {
                            axiosClient
                              .delete(`cost/${cost.id}`)
                              .then(({ data }) => {
                                console.log(data);
                              });
                          }}
                        >
                          حذف
                        </LoadingButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Grid>
      
      </Grid>
    </>
  );
}

export default CashDenos;
