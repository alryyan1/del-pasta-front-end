import axiosClient from '@/helpers/axios-client';
import { Order } from '@/Types/types';
import { LoadingButton } from '@mui/lab';
import React, { useState } from 'react'

function DeliveryButon({setSelectedOrder,setOpen,setUpdate,order,setOrders}) {
      const [loading, setLoading] = useState(false);
      const deliveryHandler = (order: Order) => {
        setSelectedOrder(order);
        setOpen(true);
        setLoading(true);
        axiosClient
          .patch(`orders/${order.id}`, {
            status: order.status == "delivered" ? "cancelled" : "delivered",
          })
          .then(({ data }) => {
            setUpdate((prev)=>prev+1)
            console.log("order delivered", data);
            setOrders((prev) => {
              return prev.map((o) => (o.id === order.id ? data.order : o));
            });
          })
          .finally(() => setLoading(false));
      };
  return (
    <LoadingButton
                        loading={loading}
                        onClick={() => {

                          deliveryHandler(order);
                        }}
                        size="small"
                        variant="contained"
                        color={
                          order.status == "delivered" ? "error" : "inherit"
                        }
                      >
                        {order.status == "delivered" ? "الغاء التسليم " : "تسليم"}
                      </LoadingButton>
  )
}

export default DeliveryButon