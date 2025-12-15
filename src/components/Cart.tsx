import React, { useEffect, useState } from "react";
import { Meal, Mealorder, Order, Requestedchildmeal } from "@/Types/types";
import axiosClient from "@/helpers/axios-client";
import { LoadingButton } from "@mui/lab";
import { Box, Stack } from "@mui/system";
import CartItem from "./CartItem";
import { Plus, ShoppingCart } from "lucide-react";
import { Autocomplete, Button, Divider, TextField, Typography } from "@mui/material";
import { Notes } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";

interface CartProps {
  selectedOrder: Order;
  setSelectedOrder: (order) => void;
  printHandler: () => void;
}

function Cart({ selectedOrder, setSelectedOrder, printHandler }: CartProps) {
  const { t } = useTranslation("cart"); // Using the i18n translation hook
  const [colName, setColName] = useState("");
  const [selectedMeal,setSelectedMeal]= useState<Meal|null>(null)
  const [val, setVal] = useState("");
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
        quantity: increment
          ? item.quantity + 1
          : Math.max(0, item.quantity - 1),
      })
      .then(({ data }) => {
        setSelectedOrder(data.order);
      });
  };

  const orderUpdateHandler = () => {
    axiosClient
      .patch(`orders/${selectedOrder.id}`, {
        order_confirmed: 1,
      })
      .then(({ data }) => {
        if (data.status) {
          axiosClient.post(`orderConfirmed/${selectedOrder.id}`);
          printHandler();
        }
        setSelectedOrder(data.order);
        // setTimeout(() => {
        //   setSelectedOrder(null);
        // }, 300);
      });
  };

  const orderItemUpdateHandler = (val, orderMeal, colName = "delivery_fee") => {
    axiosClient
      .patch(`orders/${orderMeal.id}`, {
        [colName]: val,
      })
      .then(({ data }) => {
        setSelectedOrder(data.order);
      });
  };
 
  useEffect(() => {
    if (colName !='') {
          const timer = setTimeout(() => {
      orderItemUpdateHandler(val, selectedOrder, colName);
    }, 400);
    return () => clearTimeout(timer);
    }

  }, [val]);
  const mealOrderHandler = ()=>{
      axiosClient.post('orderMeals',{
        order_id:selectedOrder?.id,
        meal_id:selectedMeal?.id,
        quantity:1,
        price:selectedMeal?.price
      }).then(({data})=>{
        setSelectedOrder(data.order)
        // setMealOrder(data.mealOrder)
          // console.log(data)
      })
   }
   const {meals} = useOutletContext()
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Stack
        direction={"column"}
        sx={{
          p: 2,
          boxShadow: 3,
          overflow: 'auto',
          height: 'calc(100vh - 200px)',
        }}
        gap={1}
      >
        <Stack direction={'row'} gap={1}>
          <Autocomplete onChange={(e,val)=>{
            setSelectedMeal(val)
          }} fullWidth getOptionLabel={(op)=>op.name} renderInput={(params)=>{
          return <TextField label='الوجبات' {...params}/>
        }}  options={meals}/>
        <Button disabled={selectedOrder?.order_confirmed} onClick={()=>{
          mealOrderHandler()
        }} variant="contained"><Plus/></Button>
        </Stack>
        
        <Typography variant="h4" textAlign={'center'}>الطلبات</Typography>
        <Box sx={{ display: 'grid', gap: 2, mb: 1.5 }}>
          {selectedOrder.meal_orders.map((item) => {
            const isMultible = item.quantity > 1 ? "" : "";
            return (
              <CartItem
               selectedOrder={selectedOrder}
                updateRequestedQuantity={updateQuantity}
                setSelectedOrder={setSelectedOrder}
                updateQuantity={updateMealOrderQuantity}
                isMultible={isMultible}
                item={item}
              />
            );
          })}
        </Box>

       {selectedOrder.meal_orders.length > 0 && (
        <Box>
          <Box>
            <TextField
              autoComplete="off"
              variant="standard"
              fullWidth
              label={t("notes")}
              key={selectedOrder.id}
              onChange={(e) => {
                setColName("notes");
                setVal(e.target.value);
              }}
              defaultValue={selectedOrder.notes}
            ></TextField>
          </Box>
          <Box>
            <TextField
              autoComplete="off"
              variant="standard"
              fullWidth
              label={t("delivery_address")}
              key={selectedOrder.id}
              onChange={(e) => {
                setColName("delivery_address");


                setVal(e.target.value);
              }}
              defaultValue={selectedOrder.delivery_address}
            ></TextField>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1.5, mt: 2 }}>
            <Stack direction={"row"} gap={2} justifyContent={'space-around'}>
              <Stack direction={"column"} gap={1}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{t("total_amount")}</Typography>
                <Typography variant="body1" sx={{ color: 'text.primary' }}>
                  {selectedOrder.totalPrice.toFixed(3)}
                </Typography>
              </Stack>



              <Stack direction={'column'}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{t("paid")}</Typography>
                <Typography variant="body1" sx={{ color: 'text.primary' }}>
                  {selectedOrder.amount_paid.toFixed(3)}
                </Typography>
              </Stack >
              <Stack direction={'column'}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>{t("delivery_fee")}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TextField
                 onFocus={(event) => {
                  event.target.select();
                }}
                  type="number"
                  key={selectedOrder.id}
                  variant="standard"
                  sx={{ width: "50px", direction: "ltr" }}
                  onChange={(e) => {
                    orderItemUpdateHandler(e.target.value, selectedOrder);
                  }}
                  defaultValue={selectedOrder.delivery_fee}
                ></TextField>
                <Typography variant="body2">{t("currency_OMR")}</Typography>
              </Box>
              </Stack >
            </Stack>

          
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <LoadingButton
              disabled={selectedOrder.order_confirmed}
              onClick={orderUpdateHandler}
              variant="contained"
              sx={{}}
            >
              {t("confirm_order")}
            </LoadingButton>
          </Box>
        </Box>
      )}
      </Stack>
    </Box>
  );
}

export default Cart;
