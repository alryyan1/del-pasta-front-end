import MyDateField2 from "@/components/MYDate";
import PayOptions from "@/components/PayOptions";
import StatusSelector from "@/components/StatusSelector";
import axiosClient from "@/helpers/axios-client";
import { Customer, Order } from "@/Types/types";
import { Autocomplete, LoadingButton } from "@mui/lab";
import { Button, Chip, CircularProgress, IconButton, TextField, Tooltip } from "@mui/material";
import { Stack } from "@mui/system";
import { Car, File, HomeIcon, Plus, Printer, PrinterIcon, Send, UserPlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useCustomerStore } from "./Customer/useCustomer";
import printJS from "print-js";
import BasicTimePicker from "@/components/TimePicker";
import { Message, WhatsApp } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next"; // Import useTranslation
import { useOutletContext } from "react-router-dom";

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
  const { t } = useTranslation('orderheader'); // Initialize useTranslation hook
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
          style: { width: "100px" },
        });
      })
      .finally(() => setloading(false));
  };

  const [loading, setloading] = useState(false);
  const sendMsg = () => {
    axiosClient.post(`sendMsg/${selectedOrder?.id}`).then(({ data }) => {});
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

        printJS({
          printable: data.slice(data.indexOf("JVB")),
          base64: true,
          type: "pdf",
        });
      });
  };
  const {isIpadPro, setIsIpadPro} = useOutletContext();

  return (
    <Stack
      justifyContent={"space-around"}
      gap={2}
      direction={"row"}
      alignItems={"center"}
      className="shadow-lg items-center rounded-sm order-header"
    >
    <Chip variant="contained" label={selectedOrder?.id}></Chip>
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
            sx={{ width: "250px", mb: 1 }}
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
                <TextField variant="standard" label={t("Customer")} {...params} />
              );
            }}
          ></Autocomplete>
        </Stack>
      )}

      {selectedOrder && (
        <>
          <Stack direction={"row"} gap={1} alignItems={"center"} justifyContent={"center"}>
            <MyDateField2
              label={t("Delivery Date")}
              path="orders"
              colName="delivery_date"
              disabled={false}
              val={selectedOrder?.delivery_date ?? new Date()}
              item={selectedOrder}
            />
          </Stack>

          <PayOptions
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
            key={selectedOrder.id}
          />
                {!isIpadPro && <StatusSelector
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
          />}
        {!isIpadPro && selectedOrder.customer && <Stack direction={"row"} gap={1}>
            <IconButton onClick={printHandler}>
              <Tooltip title={t("Print Invoice")}>
                <Printer />
              </Tooltip>
            </IconButton>
            <IconButton onClick={sendMsg}>
              <Tooltip title={t("Send Message")}>
                <Message />
              </Tooltip>
            </IconButton>
            <IconButton disabled={selectedOrder?.whatsapp} onClick={sendHandler}>
              <Tooltip title={t("Send Invoice")}>
                {loading ? <CircularProgress /> : <WhatsApp color="success" />}
              </Tooltip>
            </IconButton>
            <IconButton color="success" onClick={deliveryHandler}>
              <Tooltip title={t("Delivery")}>
                {selectedOrder.is_delivery ? <Car /> : <HomeIcon />}
              </Tooltip>
            </IconButton>
          </Stack>}
        </>
      )}
    </Stack>
  );
}

export default OrderHeader;
