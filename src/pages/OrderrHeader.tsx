import MyDateField2 from '@/components/MYDate';
import PayOptions from '@/components/PayOptions';
import StatusSelector from '@/components/StatusSelector';
import axiosClient from '@/helpers/axios-client';
import { Customer, Order } from '@/Types/types';
import { Autocomplete, LoadingButton } from '@mui/lab';
import { TextField } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react'
interface OrderHeaderProps {
    selectedOrder: Order|null;
    setSelectedOrder: (order: Order) => void;
    customers: Customer[];
    newOrderHandler: () => void;
  
}
function OrderHeader({selectedOrder,setSelectedOrder,customers,newOrderHandler}:OrderHeaderProps) {
  return (
    <Stack
    gap={2}
    direction={"row"}
    sx={{ borderRadius: "1px solid black", mb: 1, alignItems: "end" }}
    alignItems={"center"}
  >
    <LoadingButton onClick={newOrderHandler} variant="contained">
      +
    </LoadingButton>
    <Autocomplete
      value={selectedOrder?.customer}
      sx={{ width: "200px", mb: 1 }}
      options={customers}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      getOptionLabel={(option) => option.name}
      onChange={(e, data) => {
        axiosClient
          .patch(`orders/${selectedOrder?.id}`, {
        customer_id: data?.id,
          })
          .then(({ data }) => {
            setSelectedOrder(data.order);
          });
      }}
      renderInput={(params) => {
        return (
          <TextField variant="standard" label={"الزبون"} {...params} />
        );
      }}
    ></Autocomplete>
    <MyDateField2
      label="تاريخ التسليم"
      path="orders"
      colName="delivery_date"
      disabled={false}
      val={selectedOrder?.delivery_date ?? new Date()}
      item={selectedOrder}

    />
     {selectedOrder && <PayOptions selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} key={selectedOrder.id} />}
     <StatusSelector selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder}/>
  </Stack>
  )
}

export default OrderHeader