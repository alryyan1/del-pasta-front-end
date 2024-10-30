import { Order } from '@/Types/types';
import { LoadingButton } from '@mui/lab';
import { Badge, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react'

interface OrderListProps {
    orders : Order[];
    selectedOrder : Order | null;
    setSelectedOrder : (order: Order | null) => void;  // Function to set the selected order  // Add any other necessary props here  // Remember to import the necessary types from Types/types.ts  // The 'LoadingButton' component is assumed to be a custom component, replace it with the actual implementation in your project  // Make sure to handle the case when no order is selected, and adjust the styling accordingly  // The badge variant is set to 'standard' and badge
}
function OrderList({orders,selectedOrder,setSelectedOrder}:OrderListProps) {
  return (
    <Stack direction={'column'} gap={1} sx={{p:1}} style={{ border: "1px solid" }}>
          <Typography textAlign={'center'}>Orders</Typography>
          {orders.map((order) => {
            console.log(order);
            return (
              <Badge color='secondary'  variant="standard" badgeContent={order?.meal_orders.length}>
                    <LoadingButton style={order.order_confirmed && selectedOrder?.id != order.id ? {backgroundColor:'green'}:null} sx={{backgroundColor:(theme)=>{
                return selectedOrder?.id == order.id ? theme.palette.warning.light :''
              }}} onClick={()=>{
                setSelectedOrder(order)
              }} size="small" fullWidth variant="contained">
                {order.order_number}
              </LoadingButton>
              </Badge>
          
            );
          })}
        </Stack>
  )
}

export default OrderList