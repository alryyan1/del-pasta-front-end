import MyDateField2 from "@/components/MYDate";
import PayOptions from "@/components/PayOptions";
import StatusSelector from "@/components/StatusSelector";
import axiosClient from "@/helpers/axios-client";
import { Customer, Order } from "@/Types/types";
import { Autocomplete, LoadingButton } from "@mui/lab";
import {
  Button,
  Divider,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import {
  Car,
  File,
  HomeIcon,
  Map,
  Plus,
  Printer,
  PrinterIcon,
  Send,
  Trash,
  UserPlus,
} from "lucide-react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import printJS from "print-js";
import BasicTimePicker from "@/components/TimePicker";
import { useCustomerStore } from "@/pages/Customer/useCustomer";
import { Message, WhatsApp } from "@mui/icons-material";
import { toast } from "react-toastify";
import Cart from "./Cart";

interface OrderHeaderMobileProps {
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order) => void;
  newOrderHandler: () => void;
  setIsFormOpen: (isOpen: boolean) => void;
  showOrderSettings: boolean;
  showNewOrderBtn: boolean;
  setOrders: Dispatch<SetStateAction<Order[]>>;
}

function OrderHeaderMobile({
  selectedOrder,
  setSelectedOrder,
  newOrderHandler,
  setIsFormOpen,
  showOrderSettings,
  setOrders,
  showNewOrderBtn = true,
}: OrderHeaderMobileProps) {
  const { customers, addCustomer, updateCustomer, fetchData } =
    useCustomerStore();

  useEffect(() => {
    fetchData();
  }, []);

  const sendHandler = () => {
    setloading(true);
    axiosClient
      .get(`printSale?order_id=${selectedOrder?.id}&base64=2`)
      .then(({ data }) => {
        if (data.error) {
          toast.error(data.error);
          return;
        }
        axiosClient
          .patch(`orders/${selectedOrder?.id}`, { whatsapp: 1 })
          .then(({ data }) => {
            setSelectedOrder(data.order);
          });
        console.log(data, "message sent");
        toast.success(data.message, {
          style: { width: "100px" }, // Adjust width here
        });
      })
      .finally(() => setloading(false));
  };
  const [loading, setloading] = useState(false);

  const sendMsg = () => {
    axiosClient.post(`sendMsgWa/${selectedOrder?.id}`).then(({ data }) => {});
  };
  const sendLocation = () => {
    axiosClient
      .post(`sendMsgWaLocation/${selectedOrder?.id}`)
      .then(({ data }) => {});
  };
  const deliveryHandler = () => {
    axiosClient
      .patch(`orders/${selectedOrder?.id}`, {
        is_delivery: !selectedOrder?.is_delivery,
      })
      .then(({ data }) => {
        setSelectedOrder(data.order);
      });
  };
  const printHandler = () => {
    const form = new URLSearchParams();
    axiosClient
      .get(`printSale?order_id=${selectedOrder?.id}&base64=1`)
      .then(({ data }) => {
        form.append("data", data);
        form.append("node_direct", "0");
        // console.log(data, "daa");

        printJS({
          printable: data.slice(data.indexOf("JVB")),
          base64: true,
          type: "pdf",
        });
      });
  };
  const deleteHandler = () => {
    let r = confirm("Are you sure you want to delete");
    if (!r) return;
    axiosClient.delete(`orders/${selectedOrder?.id}`).then(({ data }) => {
      if (data.status) {
        setSelectedOrder(null);
        setOrders((prev) => {
          return prev.filter((order) => order.id !== selectedOrder?.id);
        });
        toast.success("Order Deleted successfully");
      }
    });
  };
  return (
    <Stack direction={"row"} gap={1}>
       <Stack
        gap={1}
        sx={{
          mb: 1,
          p: 2,
          justifyContent: "space-around",
          alignItems: "center",
        }}
        direction={"column"}
        // sx={{ alignItems: "end" }}
        alignItems={"start"}
        className="shadow-lg items-center mobile-header rounded-sm order-header"
      >
        {showNewOrderBtn && (
          <LoadingButton variant="outlined" onClick={newOrderHandler}>
            <Plus />
          </LoadingButton>
        )}

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

        {showNewOrderBtn && (
          <PayOptions
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
            key={selectedOrder.id}
          />
        )}

        <MyDateField2
          label="تاريخ التسليم"
          path="orders"
          colName="delivery_date"
          disabled={false}
          val={selectedOrder?.delivery_date ?? new Date()}
          item={selectedOrder}
        />

        <StatusSelector
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
        />
        <Divider variant="fullWidth" />

        {selectedOrder?.customer &&   <Stack justifyContent={"space-around"} direction={"row"} gap={1}>
          <IconButton onClick={sendMsg}>
            <Tooltip title=" ارسال رساله ">
              <Message />
            </Tooltip>
          </IconButton>
          <IconButton onClick={sendLocation}>
            <Tooltip title=" ارسال موقع ">
              <Map />
            </Tooltip>
          </IconButton>
          <IconButton onClick={sendHandler}>
            <Tooltip title=" ارسال الفاتوره ">
              <WhatsApp />
            </Tooltip>
          </IconButton>
          <IconButton color="success" onClick={deliveryHandler}>
            <Tooltip title="  توصيل ">
              {selectedOrder.is_delivery ? <Car /> : <HomeIcon />}
            </Tooltip>
          </IconButton>
          <IconButton onClick={printHandler}>
            <Tooltip title="طباعه">
              <Printer />
            </Tooltip>
          </IconButton>
          <IconButton onClick={deleteHandler}>
            <Tooltip title="حذف الطلب">
              <Trash />
            </Tooltip>
          </IconButton>
        </Stack>}
        <Divider />
        <Typography variant="h6" className="mb-1" textAlign={"center"}>
          مسوده
        </Typography>
        <TextField
          defaultValue={selectedOrder?.draft}
          fullWidth
          multiline
          rows={8}
        ></TextField>
      </Stack>
    {selectedOrder?.meal_orders?.length > 0 &&  <Stack>
        <Cart
          printHandler={printHandler}
          setSelectedOrder={setSelectedOrder}
          selectedOrder={selectedOrder}
        />
      </Stack>}
      {/* <Stack direction={'column'} gap={1}> */}

      {/* <Button onClick={handleSave} variant="contained">حفظ</Button> */}
      {/* </Stack> */}
    </Stack>
  );
}

export default OrderHeaderMobile;
