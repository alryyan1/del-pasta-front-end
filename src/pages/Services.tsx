import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axiosClient from "@/helpers/axios-client";
import { useAuthContext } from "@/contexts/AppContext";
import { Cost, Service } from "@/Types/types";
import { useBeforeUnload } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useServiceStore } from "./ServiceStore";
import TdCell from "@/helpers/TdCell";

function Services() {
  useEffect(() => {
    document.title = "الخدمات -";
  }, []);

  const {serviceList,addService,fetchData} = useServiceStore()
  useEffect(() => {
    fetchData()
  }, []);

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<Service>();

  const submitHandler = (data) => {
    addService(data);
    
  };
  return (
    <>
      <Grid container spacing={2}>
        <Grid item lg={3} xs={12}>
          <form onSubmit={handleSubmit(submitHandler)}>
            <TextField
             autoComplete="off"
             size="small"

              {...register("name", {
                required: {
                  value: true,
                  message: "الحقل مطلوب",
                },
              })}
              fullWidth
              label=" اسم الصنف"
              variant="outlined"
              name="name"
              error={errors.name != null}
              helperText={errors.name?.message}
              required
            />
            <Button sx={{mt:1}} fullWidth variant="contained" color="primary" type="submit">
              حفظ
            </Button>
          </form>
        </Grid>

        <Grid item lg={8} xs={12}>
          <Box sx={{ p: 1 }}>
            <Typography variant="h6" textAlign={"center"}>
              الاصناف
            </Typography>
            <Table size="small" style={{ direction: "rtl", margin: "auto" }}>
              <TableHead>
                <TableRow>
                  <TableCell>اسم  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {serviceList.map((service: Service) => {
                  return (
                    <TableRow key={service.id}>
                      <TdCell item={service} colName={'name'}  table={`services`}>{service.name}</TdCell>
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

export default Services;
