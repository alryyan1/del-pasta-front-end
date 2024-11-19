import { Minus, Plus, Trash2 } from "lucide-react";
import React from "react";
import { Meal, Mealorder, Requestedchildmeal } from "../Types/types";
import BasicPopover from "./Mypopover";
import MealChildrenTable from "./MealChildrenTable";
import {
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import axiosClient from "@/helpers/axios-client";
import RequestedChildrenTable from "./RequestedChildrenTable";
interface CartItemProbs {
  item: Mealorder;
  updateQuantity: (increment: boolean, item: Requestedchildmeal) => void;
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
    <div>
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
          <span className="w-16 text-center">{item.totalPrice.toFixed(3)}</span>
          <IconButton color="error" onClick={() => onDelete(item)} size="small">
            <Trash2 size={18} />
          </IconButton>
        </div>
      </div>
      {item.requested_child_meals.length > 0 && (
        <div className="border-red-100 requested-meal p-2 rounded-md shadow-sm">
          <Table>
            {/* <TableRow> */}
            {/* <TableCell>اسم الوجبه</TableCell> */}
            {/* <TableCell>الصنف</TableCell> */}
            {/* <TableCell>السعر</TableCell> */}

            {/* <TableCell>الكميه</TableCell> */}
            {/* <TableCell>العدد</TableCell> */}
            {/* <TableCell>الاجمالي</TableCell> */}
            {/* </TableRow> */}
            <TableBody>
              {item.requested_child_meals.map((requested) => (
                <TableRow key={requested.id}>
                  {/* <TableCell>{requested.order_meal.meal.name}</TableCell> */}
                  <TableCell>{requested.child_meal.name}</TableCell>
                  <TableCell>{requested.child_meal.price}</TableCell>

                  {/* <TableCell>{requested.child_meal.quantity}</TableCell> */}
                  <TableCell className="text-center">
                    <Stack direction={"column"} justifyContent={'center'}>
                      <button
                        onClick={() => updateQuantity(false, requested)}
                        className="p-1 text-center bg-gray-100 rounded"
                      >
                        <Minus size={16} />
                      </button>
                      <span className=" text-center p-1">
                        {requested.count}
                      </span>
                      <button
                        onClick={() => updateQuantity(true, requested)}
                        className="p-1 text-center bg-gray-100 rounded"
                      >
                        <Plus size={16} />
                      </button>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {(requested.child_meal.price * requested.count).toFixed(3)}   
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default CartItem;
