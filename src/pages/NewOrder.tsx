"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/helpers/axios-client";
import { useAuthContext } from "@/contexts/stateContext";
import { Category, Customer, Order } from "@/Types/types";
import MealItem from "./MealItem";
import { Badge, Box, Button, IconButton, Slide, Tooltip } from "@mui/material";
import Cart from "@/components/Cart";
import MealCategoryPanel from "@/components/MealCategoryPanel";
import OrderList from "@/components/OrderList";
import OrderHeader from "./OrderrHeader";
import { Plus, Settings, ShoppingBag, ShoppingCart } from "lucide-react";
import HoverPopover from "@/components/Mypopover";
import { CustomerForm } from "./Customer/CutomerForm";
import { useCustomerStore } from "./Customer/useCustomer";
import { Stack } from "@mui/system";
import { webUrl } from "@/helpers/constants";
import "./../App.css";
import OrderHeaderMobile from "@/components/OrderHeaderMobile";

const NewOrder = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [showOrderSettings, setOrderSettings] = useState(false);
  const [showCart, setShowCart] = useState(window.innerWidth > 700);
  const [showCategories, setShowCategories] = useState(window.innerWidth > 700);
  const [selectedCustomer, setSelectedCustomer] = useState<
    Customer | undefined
  >();
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);

      if (window.innerWidth < 700) {
        // alert('width lest than 700 and width is '+window.innerWidth);
        setShowCart(false);

      } else {
        // alert('width more than 700 and width is '+window.innerWidth);
        setShowCart(true);
        setOrderSettings(false);
        setShowCategories(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { customers, addCustomer, updateCustomer } = useCustomerStore();

  const { data, setData, add, deleteItem } = useAuthContext();
  const [orders, setOrders] = useState<Order[]>([]);
  console.log(orders, "orders");
  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    console.log(customer);
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
    
      {width < 830 && (
        <Box sx={{mb:1}}>
          <div className="order-header">
            <IconButton
              onClick={() => {
                setOrderSettings(!showOrderSettings);
              }}
            >
              <Tooltip title=" اعدادات الطلب ">
                <Settings />
              </Tooltip>
            </IconButton>
            <IconButton
              onClick={() => {
                setShowCart(showCategories);
                setShowCategories(!showCategories);
              }}
            >
              {showCategories ? <Badge badgeContent={selectedOrder?.meal_orders.length} color="primary"> <ShoppingCart  /></Badge>  : <ShoppingBag />}
            </IconButton>
          </div>
        </Box>
      )}
  {showOrderSettings && (
    <Slide direction="up" in={true} mountOnEnter unmountOnExit>
        <div>
        <OrderHeaderMobile
          showOrderSettings={showOrderSettings}
          setIsFormOpen={setIsFormOpen}
          key={selectedOrder?.id}
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          newOrderHandler={newOrderHandler}
        />
        </div>
       
        </Slide>
      )}
      {width > 830 && (
        <OrderHeader
          showOrderSettings={showOrderSettings}
          setIsFormOpen={setIsFormOpen}
          key={selectedOrder?.id}
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          newOrderHandler={newOrderHandler}
        />
      )}

      <div className="layout ">
        {  showCategories && (
          <div className="right-section">
            {selectedOrder ? (
              <MealCategoryPanel
                selectedOrder={selectedOrder}
                setOrders={setOrders}
                setSelectedOrder={setSelectedOrder}
              />
            ) : (
              <div></div>
            )}
          </div>
        )}

        <Box dir="rtl">
          <div className="orders-cart">
            {showCart && (
              <div
                style={{ border: "1px dashed lightgray" }}
                className="flex justify-center items-center  "
              >
                {selectedOrder?.meal_orders?.length > 0 && (
                  <Cart
                    setSelectedOrder={setSelectedOrder}
                    selectedOrder={selectedOrder}
                  />
                )}

                {selectedOrder?.meal_orders.length == 0 && showCart && (
                  <>
                    <div className="bg-white rounded-lg shadow-md p-6 ">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <ShoppingCart size={48} className="mb-4" />
                        <p>Your cart is empty</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            <OrderList
              orders={orders}
              selectedOrder={selectedOrder}
              setSelectedOrder={setSelectedOrder}
            />
          </div>
        </Box>
        <CustomerForm
          key={selectedCustomer?.id}
          open={isFormOpen}
          onClose={handleClose}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
};

export default NewOrder;
