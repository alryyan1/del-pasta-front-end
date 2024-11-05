"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/helpers/axios-client";
import { useAuthContext } from "@/contexts/stateContext";
import { Category, Customer, Order } from "@/Types/types";
import MealItem from "./MealItem";
import {
  Box,
  Button,
} from "@mui/material";
import Cart from "@/components/Cart";
import MealCategoryPanel from "@/components/MealCategoryPanel";
import OrderList from "@/components/OrderList";
import OrderHeader from "./OrderrHeader";
import { Plus, ShoppingCart } from "lucide-react";
import HoverPopover from "@/components/Mypopover";
import { CustomerForm } from "./Customer/CutomerForm";
import { useCustomerStore } from "./Customer/useCustomer";
import { Stack } from "@mui/system";

const NewOrder = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { customers, addCustomer, updateCustomer} = useCustomerStore();

  const { data, setData, add, deleteItem } = useAuthContext();
  const [orders, setOrders] = useState<Order[]>([]);
  console.log(orders, "orders");
  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    console.log(customer)
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setSelectedCustomer(undefined);
  };

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
  const handleSubmit = (customer: Customer) => {
    if (selectedCustomer) {
      updateCustomer(customer);
    } else {
      addCustomer(customer);
    }
  };
  return (
    <>
      <Stack sx={{mb:1}} direction={'row'} >
    
          <Button
        size="small"
        variant="contained"
        startIcon={<Plus size={18} />}
        onClick={() => {
          setIsFormOpen(true);
        }}
      >
        Add Customer
      </Button>
      </Stack>
      <OrderHeader key={selectedOrder?.id} selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} newOrderHandler={newOrderHandler}/>
      <Box
        className="h-[calc(100vh-80px)]"
        sx={{
          display: "grid",
          gap: "5px",
          gridTemplateColumns: " 3fr minmax(380px,1fr)  100px",
        }}
        dir="rtl"
      >

{selectedOrder ? <MealCategoryPanel
          selectedOrder={selectedOrder}
          setOrders={setOrders}
          setSelectedOrder={setSelectedOrder}
        /> :<div></div>}

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
      <CustomerForm key={selectedCustomer?.id}
          open={isFormOpen}
          onClose={handleClose}
          onSubmit={handleSubmit}
        />
    </>
  );
};

export default NewOrder;
