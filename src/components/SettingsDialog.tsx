import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {Order } from "@/Types/types";
import OrderHeader from "@/pages/OrderrHeader";
import OrderHeaderMobile from "./OrderHeaderMobile";

interface SettingsDialogProbs {
  open: boolean;
  handleClose: () => void;
  selectedOrder: Order;
  setSelectedOrder:Dispatch<SetStateAction<Order|null>>;
  setIsFormOpen: Dispatch<SetStateAction<boolean>>;
  setOrders: Dispatch<SetStateAction<Order[]>>;
}

const SettingsDialog = ({
  handleClose,
  open,
  selectedOrder,
  setSelectedOrder,
  setIsFormOpen,
  setOrders
}: SettingsDialogProbs) => {



  return (
    <div className="">
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle></DialogTitle>
        <DialogContent className="">
            <OrderHeaderMobile setOrders={setOrders} setIsFormOpen={setIsFormOpen} showNewOrderBtn={false} selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} />
         
        </DialogContent>
        <DialogActions>
          <Button  onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SettingsDialog;
