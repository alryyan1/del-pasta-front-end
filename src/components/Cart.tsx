import React, { useState } from "react";
import { Mealorder, Order, Requestedchildmeal } from "@/Types/types";
import axiosClient from "@/helpers/axios-client";
import { LoadingButton } from "@mui/lab";
import "./../magicCard.css";
import { Box, Stack } from "@mui/system";
import CartItem from "./CartItem";
import { ShoppingCart } from "lucide-react";
import { Divider, TextField, Typography } from "@mui/material";
interface CartProps {
  selectedOrder: Order;
  setSelectedOrder: (order) => void;
}

function Cart({ selectedOrder, setSelectedOrder }: CartProps) {
  const updateQuantity = (increment: boolean, item: Requestedchildmeal) => {
    axiosClient
      .patch(`RequestedChild/${item.id}`, {
        count: increment ? item.count + 1 : Math.max(0, item.count - 1),
      })
      .then(({ data }) => {
        setSelectedOrder(data.order);
      });
  };
  const updateMealOrderQuantity = (increment: boolean, item: Mealorder) => {
    axiosClient
      .patch(`orderMeals/${item.id}`, {
        quantity: increment ? item.quantity + 1 : Math.max(0, item.quantity - 1),
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
        if (data.status) {
          axiosClient.post(`orderConfirmed/${selectedOrder.id}`);
        }
        setSelectedOrder(data.order);
        setTimeout(() => {
          setSelectedOrder(null);
        }, 300);
      });
  };
  const orderItemUpdateHandler = (e, orderMeal, colName = "delivery_fee") => {
    axiosClient
      .patch(`orders/${orderMeal.id}`, {
        [colName]: e.target.value,
      })
      .then(({ data }) => {
        console.log(data, "data");
        setSelectedOrder(data.order);
      });
  };
  return (
    <div style={{ height: "100%" }} className="cart-items-div flex justify-center px-4">
      <Stack
        className="shadow-lg overflow-auto"
        direction={"column"}
        justifyContent={"space-between"}
        sx={{
          p: 2,
        }}
      >
        <div className="space-y-4 mb-6 grid ">
          {selectedOrder.meal_orders.map((item) => {
            const isMultible =
              item.quantity > 1 ? "animate__animated animate__rubberBand" : "";
            return (
              <CartItem
                setSelectedOrder={setSelectedOrder}
                updateQuantity={updateMealOrderQuantity}
                isMultible={isMultible}
                item={item}
              />
            );
          })}
        </div>

        <div>
          <Box>
            <TextField
              autoComplete="off"
              variant="standard"
              fullWidth
              label="ملاحظات"
              key={selectedOrder.id}
              onChange={(e) => {
                orderItemUpdateHandler(e, selectedOrder, "notes");
              }}
              defaultValue={selectedOrder.notes}
            ></TextField>{" "}
          </Box>
          <Box>
            <TextField
              autoComplete="off"
              variant="standard"
              fullWidth
              label="عنوان التوصيل"
              key={selectedOrder.id}
              onChange={(e) => {
                orderItemUpdateHandler(e, selectedOrder, "delivery_address");
              }}
              defaultValue={selectedOrder.delivery_address}
            ></TextField>{" "}
          </Box>
          <div className="space-y-2 text-sm mb-6 mt-4">
            <Typography variant="h4" className="flex justify-between text-lg">
              <span className="text-gray-600">اجمالي الملبغ</span>
              <span className="text-gray-900">
                {selectedOrder.totalPrice.toFixed(3)}
              </span>
            </Typography>
            <Divider />
            <Typography variant="h4" className="flex justify-between text-lg">
              <span className="text-gray-600">المدفوع </span>
              <span className="text-gray-900">
                {selectedOrder.amount_paid.toFixed(3)}
              </span>
            </Typography>

            <div className="flex justify-between">
              <span className="text-gray-600">رسوم التوصيل</span>
              <span className="text-gray-900">
                <TextField
                  type="number"
                  key={selectedOrder.id}
                  variant="standard"
                  sx={{ width: "50px", direction: "ltr" }}
                  onChange={(e) => {
                    orderItemUpdateHandler(e, selectedOrder);
                  }}
                  defaultValue={selectedOrder.delivery_fee}
                ></TextField>
                <span>OMR</span>
              </span>
            </div>
          </div>

          <LoadingButton
            disabled={selectedOrder.order_confirmed}
            onClick={orderUpdateHandler}
            variant="contained"
            sx={{}}
          >
            تاكيد
          </LoadingButton>
        </div>
      </Stack>
    </div>
  );
}

export default Cart;
