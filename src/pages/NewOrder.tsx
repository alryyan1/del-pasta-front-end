"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/helpers/axios-client";
import { useAuthContext } from "@/contexts/stateContext";
import { Category, Customer, Order } from "@/Types/types";
import MealItem from "./MealItem";
import {
  Box,
} from "@mui/material";
import Cart from "@/components/Cart";
import MealCategoryPanel from "@/components/MealCategoryPanel";
import OrderList from "@/components/OrderList";
import OrderHeader from "./OrderrHeader";
import { ShoppingCart } from "lucide-react";

const NewOrder = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const { data, setData, add, deleteItem } = useAuthContext();
  const [orders, setOrders] = useState<Order[]>([]);
  console.log(orders, "orders");

  useEffect(() => {
    console.log(selectedOrder, "selecteed order changed");
    setOrders((prev) => {
      return prev.map((or) => {
        if (or.id === selectedOrder?.id) {
          return selectedOrder;
        }
        return or;
      });
    });
  }, [selectedOrder]);
  useEffect(() => {
    //fetch customers
    axiosClient.get<Customer[]>("customers").then(({ data }) => {
      setCustomers(data);
    });
  }, []);
  const confirmOrder = () => {
    console.log("Order confirmed:", order);
  };

  const newOrderHandler = () => {
    axiosClient.post("orders").then(({ data }) => {
      setSelectedOrder(data.data);
      add(data.data, setOrders);
    });
  };
  useEffect(() => {
    axiosClient.get<Order[]>("orders?today=1").then(({ data }) => {
      setOrders(data);
    });
  }, []);
  return (
    <>
       <OrderHeader key={selectedOrder?.id} selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} customers={customers} newOrderHandler={newOrderHandler}/>
      <Box
        className="h-[calc(100vh-80px)]"
        sx={{
          display: "grid",
          gap: "5px",
          gridTemplateColumns: " 3fr 1fr  100px",
        }}
        dir="rtl"
      >
        <MealCategoryPanel
          selectedOrder={selectedOrder}
          setOrders={setOrders}
          setSelectedOrder={setSelectedOrder}
        />

        <div style={{ border: "1px solid" }} className="flex justify-center items-center">
          {selectedOrder && selectedOrder.meal_orders.length > 0 && (
            <Cart
              setSelectedOrder={setSelectedOrder}
              selectedOrder={selectedOrder}
            />
          )}
             {selectedOrder?.meal_orders.length == 0 && <>
                <div className="bg-white rounded-lg shadow-md p-6 ">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <ShoppingCart size={48} className="mb-4" />
                  <p>Your cart is empty</p>
                </div>
              </div>
              </>}
        </div>
        <OrderList
          orders={orders}
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
        />
      </Box>
    </>
  );
};

export default NewOrder;
