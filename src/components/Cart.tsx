import React, { useState } from "react";
import { Mealorder, Order } from "@/Types/types";
import axiosClient from "@/helpers/axios-client";
import { LoadingButton } from "@mui/lab";
import "./../magicCard.css";
import { Stack } from "@mui/system";
import CartItem from "./CartItem";
import { ShoppingCart } from "lucide-react";
interface CartProps {
  selectedOrder: Order;
  setSelectedOrder: (order) => void;
}

interface Cart {}

function Cart({ selectedOrder, setSelectedOrder }: CartProps) {
  const updateQuantity = (increment: boolean, item: Mealorder) => {
    axiosClient
      .patch(`orderMeals/${item.id}`, {
        quantity: increment
          ? item.quantity + 1
          : Math.max(0, item.quantity - 1),
      })
      .then(({ data }) => {
        setSelectedOrder(data.order);
      });
  };

  const itemTotal = selectedOrder.meal_orders.reduce(
    (sum, item) => sum + item.meal.price * item.quantity,
    0
  );
  const restaurantCharges = itemTotal * 0.02;
  const deliveryFee = 10;
  const discount = itemTotal * 0.6;
  const finalTotal = itemTotal + restaurantCharges + deliveryFee - discount;
  console.log(selectedOrder, "selected order");
  const orderUpdateHandler = () => {
    axiosClient
      .patch(`orders/${selectedOrder.id}`, {
        order_confirmed: 1,
      })
      .then(({ data }) => {
        setSelectedOrder(data.order);
      });
  };
  const orderItemUpdateHandler = (e, orderMeal) => {
    axiosClient
      .patch(`orderMeals/${orderMeal.id}`, {
        delivery_fee: Number(e.target.value),
      })
      .then(({ data }) => {
        setSelectedOrder(data.order);
      });
  };
  return (
    <div className="h-full bg-gray-50 flex justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm">
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6"></div>
          <Stack
            className=""
            direction={"column"}
            justifyContent={"space-between"}
          >
            <div className="space-y-4 mb-6">
              {selectedOrder.meal_orders.map((item) => {
                const isMultible =
                  item.quantity > 1
                    ? "animate__animated animate__rubberBand"
                    : "";
                return (
                  <CartItem
                    updateQuantity={updateQuantity}
                    isMultible={isMultible}
                    item={item}
                  />
                );
              })}
            </div>

            <div className="space-y-2 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">إجمالي العناصر</span>
                <span className="text-gray-900">{itemTotal.toFixed(2)}</span>
              </div>
           
            

              {/* <div className="flex justify-between">
                <span className="text-gray-600">رسوم التوصيل</span>
                <span className="text-gray-900">
                  <TextField
                    onChange={orderItemUpdateHandler}
                    defaultValue={selectedOrder.delivery_fee}
                  ></TextField>
                </span>
              </div> */}
            </div>

            <LoadingButton
              disabled={selectedOrder.order_confirmed}
              onClick={orderUpdateHandler}
              variant="contained"
              sx={{}}
              className="card w-full bg-blue-500 text-white py-4 rounded-xl hover:bg-blue-600 transition-colors"
            >
              تاكيد
            </LoadingButton>
          </Stack>
        </div>
      </div>
    </div>
  );
}

export default Cart;
