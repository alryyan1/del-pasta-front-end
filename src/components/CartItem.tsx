import { Eye, Minus, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Meal, Mealorder, Order, Requestedchildmeal } from "../Types/types";
import BasicPopover from "./Mypopover";
import MealChildrenTable from "./MealChildrenTable";
import { ColorPicker, ColorPickerChangeEvent } from 'primereact/colorpicker';

import {
  Badge,
  IconButton,
  Slide,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import axiosClient from "@/helpers/axios-client";
import RequestedChildrenTable from "./RequestedChildrenTable";
import { Box } from "@mui/system";
import RequestedServices from "./RequestedServices";
import Incremenor from "./Incremenor";
import CartItemOptions from "./CartItemOptions";
import { useOutletContext } from "react-router-dom";
import CartItemOptionsMobile from "./CartItemOptionsMobile";
interface CartItemProbs {
  item: Mealorder;
  selectedOrder:Order;
  updateQuantity: (increment: boolean, item: Mealorder) => void;
  isMultible: string;
  setSelectedOrder: (item: Mealorder) => void;
  updateRequestedQuantity : (increment: boolean, item: Requestedchildmeal) => void;
}
function CartItem({
  isMultible,
  updateQuantity,
  item,
  setSelectedOrder,
  updateRequestedQuantity,
  selectedOrder
}: CartItemProbs) {

  const [show,setShow] = useState(false)
  const [color,setColor] = useState('')
  const onDelete = () => {
    axiosClient.delete(`orderMeals/${item.id}`).then(({ data }) => {
      setSelectedOrder(data.order);
    });
  };
  useEffect(()=>{
    if(color != ''){
        const timer =    setTimeout(() => {
        axiosClient.patch(`orderMeals/${item.id}`,{
          color:color
        }).then(({data})=>{
          setSelectedOrder(data.order)
        })
      }, 300);
      return () => clearTimeout(timer);

    }
 
      
  },[color])
    const {isIpadPro, setIsIpadPro} = useOutletContext();
  
  return (
    <Badge  color="primary" badgeContent={item.requested_child_meals.length}>
      <div style={{border:'1px dashed lightblue',width:'100%'}}
    >
      <Box 
        className={` flex items-center justify-between px-4 p-2 bg-white rounded-xl shadow-md cart-item  ${isMultible}`}
      >
        <BasicPopover
        selectedOrder={selectedOrder}
          title={item.meal.name}
          content={
            <span className="text-gray-700">
              {
                <RequestedChildrenTable
                  setSelectedOrder={setSelectedOrder}
                  mealOrder={item}
                />
              }
            </span>
          }
        />

        {isIpadPro ? <CartItemOptionsMobile item={item} onDelete={onDelete} setShow={setShow} show={show} setColor={setColor} updateQuantity={updateQuantity}/> : <CartItemOptions selectedOrder={selectedOrder} item={item} onDelete={onDelete} setShow={setShow} show={show} setColor={setColor} updateQuantity={updateQuantity}/>}
      </Box>
      {item.requested_child_meals.length > 0 && (

        <RequestedServices item={item}  show={show} updateRequestedQuantity={updateRequestedQuantity}/>
      )}
    </div>
    </Badge>
  );
}

export default CartItem;
