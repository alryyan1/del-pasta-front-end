import React, { useEffect, useState } from "react";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import axiosClient from "@/helpers/axios-client";
import { AxiosResponseProps, ChildMeal, Meal, Order } from "@/Types/types";
import { Mealorder } from "../Types/types";

interface DeductDialogProbs {
  open: boolean;
  handleClose: () => void;
  handleClickOpen: () => void;
  selectedOrder: Order;
  setSelectedOrder:()=>void
}

const DeductDialog = ({
  handleClose,
  open,
  selectedOrder,
  setSelectedOrder
}: DeductDialogProbs) => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {}, []);
  const deductHandler = ()=>{
    // TODO: add this order to deducted_orders
    axiosClient.post(`deducts/${selectedOrder.id}`,{
        add:selectedOrder.deducts.length == 0 
    }).then(({data})=>{
        setSelectedOrder(data.order)
    })
    // TODO: duduct quantites
  }

  return (
    <div className="">
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle></DialogTitle>
        <DialogContent className="">
          <Typography textAlign={'center'}>خصم من المخزون</Typography>
          {selectedOrder.meal_orders.map((mealOrder: Mealorder) => (
            <>
              <Typography variant='h6' sx={{mb:1}} textAlign={'center'}><Chip label={mealOrder.meal.name}></Chip></Typography>
                    <Table size="small">
                    <TableHead>
              <TableRow>
                      <TableCell sx={{textAlign:'center'}}>الصنف</TableCell>
                      <TableCell sx={{textAlign:'center'}}>الكميه المطلوبه </TableCell>
                      <TableCell sx={{textAlign:'center'}}>الكميه المتوفره</TableCell>
                      {/* <TableCell sx={{textAlign:'center'}}>الكميه الجديد </TableCell> */}
                    </TableRow>
                    </TableHead>
                      <TableBody>
              {mealOrder.requested_child_meals.map((r) => (
                   
                    <TableRow key={r.id}>
                      <TableCell sx={{textAlign:'center'}}>{r.child_meal.service.name}</TableCell>
                      <TableCell sx={{textAlign:'center'}}>{r.quantity * r.count}</TableCell>
                      <TableCell sx={{textAlign:'center'}}>{r.available - r.deducted }</TableCell>
                      {/* <TableCell sx={{textAlign:'center'}}>{r.available - (r.quantity * r.count)}</TableCell> */}
                    </TableRow>
              ))}
              </TableBody>
              </Table>
            </>
          ))}
          <Button color={selectedOrder?.deducts?.length > 0 ?'error':'inherit'}  onClick={deductHandler} sx={{mt:1}} variant='contained'> {selectedOrder?.deducts?.length > 0 ?'استرجاع الكميات':'خصم الكميات'}</Button>
        </DialogContent>
        <DialogActions>
          <Button  onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeductDialog;
