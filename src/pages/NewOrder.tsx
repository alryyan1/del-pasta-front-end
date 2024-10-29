"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // Assuming you have a button component
import { Card } from "@/components/ui/card"; // Assuming you have a card component
import { FiPlusCircle } from "react-icons/fi"; // For icons
import Header from "@/components/header";
import axiosClient from "@/helpers/axios-client";
import { useAuthContext } from "@/contexts/stateContext";
import { Category, Order } from "@/Types/types";
import MealItem from "./MealItem";
import { Badge, Box, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { theme } from '../helpers/constants';
import Cart from "@/components/Cart";
import MealCategoryPanel from "@/components/MealCategoryPanel";
import OrderList from "@/components/OrderList";

const NewOrder = () => {
 
  const [selectedOrder,setSelectedOrder] = useState<Order|null>(null)
  
  const { data, setData ,add,deleteItem} = useAuthContext();
  const [orders, setOrders] = useState<Order[]>([]);
  console.log(orders,'orders')


  useEffect(()=>{
    console.log(selectedOrder,'selecteed order changed')
    setOrders((prev)=>{
     return  prev.map((or)=>{
        if(or.id===selectedOrder?.id){
          return selectedOrder
        }
        return or
      })
    })
  },[selectedOrder])

  const confirmOrder = () => {
    console.log("Order confirmed:", order);
  };



  const newOrderHandler = () => {
    axiosClient.post("orders").then(({ data }) => {
      setSelectedOrder(data.data)
      add(data.data,setOrders)

    });
  };
  useEffect(() => {
    axiosClient.get<Order[]>("orders?today=1").then(({ data }) => {
      setOrders(data);
  
    });
  }, []);
  return (
    <>
      <Box
        className='h-[calc(100vh-80px)]'
        sx={{
          
          display: "grid",
          gap: "5px",
          gridTemplateColumns: "100px 3fr 1fr  100px",
        }}
        dir="rtl"
      >
        <Stack
          sx={{ borderRadius: "1px solid black" }}
          alignItems={"center"}
        >
          <LoadingButton onClick={newOrderHandler} variant="contained">
            +
          </LoadingButton>
        </Stack>
        <MealCategoryPanel  selectedOrder={selectedOrder} setOrders={setOrders} setSelectedOrder={setSelectedOrder}/>
     
        <div style={{ border: "1px solid" }}>
          {selectedOrder && selectedOrder.meal_orders.length > 0 && <Cart setSelectedOrder={setSelectedOrder} selectedOrder={selectedOrder}/>}
          </div>
         <OrderList orders={orders} selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} />
      </Box>
    </>
  );
};

export default NewOrder;
