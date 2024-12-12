import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Order } from "@/Types/types";
import OrderHeader from "@/pages/OrderrHeader";
import OrderHeaderMobile from "./OrderHeaderMobile";
import axiosClient from "@/helpers/axios-client";

interface ArriavalDialogProbs {
  open: boolean;
  handleClose: () => void;
  selectedOrder: Order;
  setSelectedOrder: Dispatch<SetStateAction<Order>>;
  orders: Order[];
  setOrders: Dispatch<SetStateAction<Order[]>>;
  pauseAlarm 
}

const ArriavalDialog = ({ handleClose, open, orders ,setOrders,setSelectedOrder,pauseAlarm}: ArriavalDialogProbs) => {
  return (
    <div className="">
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle></DialogTitle>
        <DialogContent className="">
            <Typography variant="h3" textAlign={'center'}>Arrivals</Typography>
          <List>
            {orders.filter((d)=>d.outside).map((d) => {
              return (
                <Card key={d.id}>
                      <ListItem sx={{mb:1}}>
                  <ListItemText  primary={`${d?.customer?.name} Car No 🚗 ${d.car_palette}`}  />
                  <Button
                    onClick={() => {
                        axiosClient.patch(`orders/${d.id}`,{
                            outside:0
                        }).then(({data}) => {
                            handleClose();
                            pauseAlarm()
                            setSelectedOrder(data.order)
                            setOrders((prev)=>{
                                return  prev.map((o)=>{
                                     if(o.id===d.id){
                                        return data.order
                                    }
                                    return o;
                                })
                            })
                        });
                    }}
                    color="primary"
                  >
                    OK
                  </Button>
                </ListItem>
                </Card>
              
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ArriavalDialog;
