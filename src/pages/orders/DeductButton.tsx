import axiosClient from '@/helpers/axios-client'
import { Button } from '@mui/material'
import React from 'react'

function DeductButton({selectedOrder,setSelectedOrder,order}) {
    const deductHandler = ()=>{
        // TODO: add this order to deducted_orders
        axiosClient.post(`deducts/${order.id}`,{
            add:order.deducts.length == 0 
        }).then(({data})=>{
            setSelectedOrder(data.order)
        })
        // TODO: duduct quantites
      }
  return (
    <Button color={order?.deducts?.length > 0 ?'error':'inherit'}  onClick={deductHandler} sx={{mt:1}} variant='contained'> {order?.deducts?.length > 0 ?'استرجاع الكميات':'خصم الكميات'}</Button>
  )
}

export default DeductButton