import React, { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { Order } from "@/Types/types";
import axiosClient from "@/helpers/axios-client";

// Status options array
const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "In Preparation", value: "in preparation" },
  { label: "Completed", value: "Completed" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

interface StatusSelectorProps {
  setSelectedOrder: (order: Order) => void;
  selectedOrder: Order; // Assuming this is the order object with the status property
}
const StatusSelector = ({
  setSelectedOrder,
  selectedOrder,
}: StatusSelectorProps) => {
  const [status, setStatus] = useState(statusOptions.find((st)=>st.value == selectedOrder?.status));
  const handleChange = (event, newValue) => {
    setStatus(newValue);
    axiosClient.patch(`orders/${selectedOrder.id}`,{
        status: newValue.value,
  
    }).then(({data})=>{
        setSelectedOrder(data.order);
      });
    }
  

  return (
    <Autocomplete
      sx={{ width: "170px" }}
      value={status}
      size="small"
      onChange={handleChange}
      options={statusOptions}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      renderInput={(params) => (
        <TextField {...params} label="Status" variant="outlined" />
      )}
    />
  );
};

export default StatusSelector;
