import { TableCell } from "@mui/material";
import React, { useState } from "react";
import StatusSelector from "./StatusSelector";
import { StatusChip } from "@/pages/orders/StatusShip";

function MyTableCellStatusSelector({  order }) {
  const [editStatus, setEditStatus] = useState(false);

  return (
    <TableCell onClick={() => setEditStatus(true)}>
      {editStatus ? (
        <StatusSelector  selectedOrder={order} />
      ) : (
        <StatusChip status={order.status} />
      )}
    </TableCell>
  );
}

export default MyTableCellStatusSelector;
