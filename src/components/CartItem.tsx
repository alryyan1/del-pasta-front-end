import { Minus, Plus, Trash2 } from "lucide-react";
import React from "react";
import { Meal, Mealorder } from "../Types/types";
import BasicPopover from "./Mypopover";
import MealChildrenTable from "./MealChildrenTable";
import { IconButton } from "@mui/material";
import axiosClient from "@/helpers/axios-client";
import RequestedChildrenTable from "./RequestedChildrenTable";
interface CartItemProbs {
  item: Mealorder;
  updateQuantity: (increment: boolean, item: Mealorder) => void;
  isMultible: string;
  setSelectedOrder: (item: Mealorder) => void;
}
function CartItem({
  isMultible,
  updateQuantity,
  item,
  setSelectedOrder,
}: CartItemProbs) {
  const onDelete = () => {
    axiosClient.delete(`orderMeals/${item.id}`).then(({ data }) => {
      setSelectedOrder(data.order);
    });
  };
  return (
    <div
      className={`flex items-center justify-between px-4 py-2 bg-white rounded-xl shadow-md  ${isMultible}`}
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

      <div className="flex items-center space-x-4 ">
        <span className="w-16 text-center">
          {item.totalPrice}
        </span>
        <IconButton color="error" onClick={() => onDelete(item)} size="small">
          <Trash2 size={18} />
        </IconButton>
      </div>
    </div>
  );
}

export default CartItem;
