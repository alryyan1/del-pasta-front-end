import MyDateField2 from "@/components/MYDate";
import PayOptions from "@/components/PayOptions";
import StatusSelector from "@/components/StatusSelector";
import axiosClient from "@/helpers/axios-client";
import { Customer, Order } from "@/Types/types";
import { Autocomplete, LoadingButton } from "@mui/lab";
import { Button, IconButton, TextField, Tooltip } from "@mui/material";
import { Stack } from "@mui/system";
import { Plus, Printer, PrinterIcon, UserPlus } from "lucide-react";
import React, { useEffect } from "react";
import { useCustomerStore } from "./Customer/useCustomer";
import printJS from "print-js";

interface OrderHeaderProps {
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order) => void;
  newOrderHandler: () => void;
  setIsFormOpen: (isOpen: boolean) => void;
}
function OrderHeader({
  selectedOrder,
  setSelectedOrder,
  newOrderHandler,
  setIsFormOpen,
}: OrderHeaderProps) {
  const { customers, addCustomer, updateCustomer, fetchData } =
    useCustomerStore();
  useEffect(() => {
    fetchData();
  }, []);
  const printHandler = ()=>{
    
    const form = new URLSearchParams();
    axiosClient
      .get(`printSale?order_id=${selectedOrder?.id}&base64=1`)
      .then(({ data }) => {
        form.append("data", data);
        form.append("node_direct",'0');
        // console.log(data, "daa");
        
          printJS({
            printable: data.slice(data.indexOf("JVB")),
            base64: true,
            type: "pdf",
          });
        
        // if (userSettings?.node_dialog) {
        //   fetch("http://127.0.0.1:4000/", {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/x-www-form-urlencoded",
        //     },

        //     body: form,
        //   }).then(() => {});
        // }
      });
  
}
  return (
    <Stack
      justifyContent={"space-around"}
      gap={2}
      direction={"row"}
      sx={{ alignItems: "end" }}
      alignItems={"center"}
    >
      <LoadingButton variant="outlined" onClick={newOrderHandler}>
        <Plus />
      </LoadingButton>

      {selectedOrder && (
        <Stack direction={"row"} alignItems={"center"}>
          <Button
            size="small"
            onClick={() => {
              setIsFormOpen(true);
            }}
          >
            <UserPlus />
          </Button>

          <Autocomplete
            value={selectedOrder?.customer}
            sx={{ width: "200px", mb: 1 }}
            options={customers}
            isOptionEqualToValue={(option, val) => option.id === val.id}
            getOptionLabel={(option) => option.name}
            filterOptions={(options, state) => {
              return options.filter((customer) => {
                return (
                  customer.name
                    .toLowerCase()
                    .includes(state.inputValue.toLowerCase()) ||
                  customer.phone.includes(state.inputValue.toLowerCase())
                );
              });
            }}
            onChange={(e, data) => {
              axiosClient
                .patch(`orders/${selectedOrder?.id}`, {
                  customer_id: data?.id,
                })
                .then(({ data }) => {
                  setSelectedOrder(data.order);
                });
            }}
            renderInput={(params) => {
              return (
                <TextField variant="standard" label={"الزبون"} {...params} />
              );
            }}
          ></Autocomplete>
        </Stack>
      )}
      {selectedOrder && (
        <>
          <MyDateField2
            label="تاريخ التسليم"
            path="orders"
            colName="delivery_date"
            disabled={false}
            val={selectedOrder?.delivery_date ?? new Date()}
            item={selectedOrder}
          />
          <PayOptions
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
            key={selectedOrder.id}
          />
          <StatusSelector
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
          />
          <IconButton onClick={printHandler}>
            
            <Tooltip  title=" طباعه الفاتورة">
            <Printer />
            </Tooltip>
          </IconButton>
        </>
      )}
    </Stack>
  );
}

export default OrderHeader;
