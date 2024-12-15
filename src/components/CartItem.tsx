import { Eye, Minus, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Meal, Mealorder, Requestedchildmeal } from "../Types/types";
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
interface CartItemProbs {
  item: Mealorder;
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
  updateRequestedQuantity
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
  return (
    <Badge  color="primary" badgeContent={item.requested_child_meals.length}>
      <div style={{border:'1px dashed lightblue',width:'100%'}}
    >
      <Box  sx={{overflow:'hidden'}}
        className={` flex items-center justify-between px-4 p-2 bg-white rounded-xl shadow-md cart-item  ${isMultible}`}
      >
        <BasicPopover
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

        <div className="flex items-center  ">
        {/* <ColorPicker value={item.color} onChange={(e:ColorPickerChangeEvent)=>{
            setColor(e.value)
          }} /> */}
          <span className="w-16 text-center">{(item.totalPrice * item.quantity).toFixed(3) }</span>
          <IconButton color="error" onClick={() => onDelete(item)} size="small">
            <Trash2 size={18} />
          </IconButton>
          <IconButton onClick={()=>{
            setShow(!show)
          }}>
            <Eye/>
          </IconButton>

     
          <Incremenor updateQuantity={updateQuantity} requested={item} />

        </div>
      </Box>
      {item.requested_child_meals.length > 0 && (

        <RequestedServices item={item}  show={show} updateRequestedQuantity={updateRequestedQuantity}/>
      )}
    </div>
    </Badge>
  );
}

export default CartItem;
