"use client";

import React, { useEffect, useState, useCallback } from "react";
import axiosClient from "@/helpers/axios-client";
import { useAuthContext } from "@/contexts/stateContext";
import { Customer, Order } from "@/Types/types";
import { Badge, Box, IconButton, Paper, Slide, Tooltip, Typography } from "@mui/material";
import Cart from "@/components/Cart";
import MealCategoryPanel from "@/components/MealCategoryPanel";
import OrderList from "@/components/OrderList";
import OrderHeader from "./OrderrHeader";
import { Settings, ShoppingBag, ShoppingCart } from "lucide-react";
import { CustomerForm } from "./Customer/CutomerForm";
import { useCustomerStore } from "./Customer/useCustomer";
import OrderHeaderMobile from "@/components/OrderHeaderMobile";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import NoteDialog from "@/components/NoteDialog";
import printJS from "print-js";

const NewOrder = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [showOrderSettings, setOrderSettings] = useState(false);
  const [showCart, setShowCart] = useState(window.innerWidth > 700);
  const [showCategories, setShowCategories] = useState(window.innerWidth > 700);
  const { customers, fetchData } = useCustomerStore();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selectedCustomer, setSelectedCustomer] = useState<
    Customer | undefined
  >();
  const { t } = useTranslation('newOrder'); // Using i18next hook for translations
  useEffect(() => {
    document.title = "طلب جديد";
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);

      if (window.innerWidth < 700) {
        setShowCart(false);
      } else {
        setShowCart(true);
        setOrderSettings(false);
        setShowCategories(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [open,setOpen] = useState(false);
  const handleNoteClose = ()=>{
    setOpen(false);
  }
  const outletContext = useOutletContext() as {
    selectedOrder: Order | null;
    setSelectedOrder: (order: Order | null) => void;
  };
  const { selectedOrder, setSelectedOrder: setSelectedOrderFromContext } = outletContext;
  const { add } = useAuthContext();
  
  // Wrapper function to match NoteDialog's expected type
  const setSelectedOrder = useCallback((order: Order | ((prev: Order) => Order)) => {
    if (typeof order === 'function') {
      // Handle function case
      const currentOrder = selectedOrder;
      if (currentOrder) {
        setSelectedOrderFromContext(order(currentOrder));
      }
    } else {
      setSelectedOrderFromContext(order);
    }
  }, [selectedOrder, setSelectedOrderFromContext]);
  const [orders, setOrders] = useState<Order[]>([]);
  const printHandler = () => {
    axiosClient
      .get(`printSale?order_id=${selectedOrder?.id}&base64=1`)
      .then(({ data }) => {
        printJS({
          printable: data.slice(data.indexOf("JVB")),
          base64: true,
          type: "pdf",
        });
      });
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setSelectedCustomer(undefined);
  };

  useEffect(() => {
    setOrders((prev) => {
      return prev.map((or) => {
        if (or.id === selectedOrder?.id) {
          return selectedOrder;
        }
        return or;
      });
    });
  }, [selectedOrder]);


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
      {width < 830 && (
        <Box
          sx={{
            mb: 2,
            bgcolor: 'rgba(233, 30, 99, 0.07)',
            p: 1.5,
            borderRadius: 2,
            border: '1px dashed',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={() => {
                setOrderSettings(!showOrderSettings);
              }}
            >
              <Tooltip title={t("order_settings")}>
                <Settings />
              </Tooltip>
            </IconButton>
            <IconButton
              onClick={() => {
                setShowCart(showCategories);
                setShowCategories(!showCategories);
              }}
            >
              {showCategories ? (
              <Badge badgeContent={selectedOrder?.meal_orders?.length ?? 0} color="primary">
                  <ShoppingCart />
                </Badge>
              ) : (
                <ShoppingBag />
              )}
            </IconButton>
          </Box>
        </Box>
      )}

      {showOrderSettings && (
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
          <Box>
            <OrderHeaderMobile
              showOrderSettings={showOrderSettings}
              showNewOrderBtn={true}
              setIsFormOpen={setIsFormOpen}
              key={selectedOrder?.id}
              selectedOrder={selectedOrder}
              setSelectedOrder={setSelectedOrder}
              setOrders={setOrders}
              newOrderHandler={newOrderHandler}
            />
          </Box>
        </Slide>
      )}

      {width > 830 && (
        <OrderHeader
          customers={customers}
          setOpen={setOpen}
          handleClose={handleNoteClose}
          setIsFormOpen={setIsFormOpen}
          key={selectedOrder?.id}
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          newOrderHandler={newOrderHandler}
        />
      )}

      <Box
        sx={{
          display: { xs: 'block', md: 'grid' },
          gridTemplateColumns: { md: '1fr 1fr' },
          mt: { xs: 2, md: 3 },
          gap: { xs: 2, md: 3 },
          maxWidth: '100%',
        }}
      >
        {showCategories && (
          <Box sx={{ minHeight: { md: 'calc(100vh - 200px)' } }}>
            {selectedOrder ? (
              <MealCategoryPanel
                selectedOrder={selectedOrder}
                setSelectedOrder={(order: Order) => setSelectedOrderFromContext(order)}
              />
            ) : (
              <Paper 
                elevation={1}
                sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  color: 'text.secondary',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="body1">Select an order to view categories</Typography>
              </Paper>
            )}
          </Box>
        )}

        <Box sx={{ direction: 'ltr' }}>
          <Box
            sx={{
              display: { xs: 'block', md: 'grid' },
              gap: { xs: 2, md: 2 },
              gridTemplateColumns: { md: 'minmax(285px, 1fr) 80px' },
              minHeight: { md: 'calc(100vh - 200px)' },
            }}
          >
            {showCart && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {(selectedOrder?.meal_orders?.length ?? 0) > 0 && selectedOrder && (
                  <Cart
                    printHandler={printHandler}
                    setSelectedOrder={(order: Order) => setSelectedOrderFromContext(order)}
                    selectedOrder={selectedOrder}
                  />
                )}

                {((selectedOrder?.meal_orders?.length ?? 0) === 0) && showCart && (
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'text.secondary',
                      }}
                    >
                      <ShoppingCart size={48} style={{ marginBottom: 16 }} />
                      <Typography>{t("empty_cart")}</Typography>
                    </Box>
                  </Paper>
                )}
              </Box>
            )}
            <OrderList
              orders={orders}
              selectedOrder={selectedOrder}
              setSelectedOrder={setSelectedOrderFromContext}
            />
          </Box>
        </Box>
        <CustomerForm
          key={selectedCustomer?.id}
          open={isFormOpen}
          onClose={handleClose}
          selectedCustomer={selectedCustomer || ({} as Customer)}
          onSubmit={() => {
            // Handle customer submission if needed
            handleClose();
          }}
        />
       {selectedOrder &&  <NoteDialog handleClose={handleNoteClose} open={open} selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder as React.Dispatch<React.SetStateAction<Order>>}/>}
      </Box>
    </>
  );
};

export default NewOrder;
