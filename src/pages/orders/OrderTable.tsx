import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
} from "@mui/material";
import { Order } from "@/Types/types";
import { StatusChip } from "./StatusShip";
import { UpdateOrderDialog } from "./UpdateOrderDialog";
import dayjs from "dayjs";
import TdCell from "@/helpers/TdCell";
import StatusSelector from "@/components/StatusSelector";
import BasicPopover from "@/components/Mypopover";
import MyDateField2 from "@/components/MYDate";
import { OrderMealsTable } from "@/components/MealChildrenTable";
import MyTableCellStatusSelector from "@/components/MyTableCellStatusSelector";
import { useTranslation } from "react-i18next";

interface OrderTableProps {
  orders: Order[];
}

export const OrderTable = ({ orders }: OrderTableProps) => {
  const isMobile = useMediaQuery("(max-width:600px)"); // adjust based on screen size
  const { t } = useTranslation('orderTable');

  return (
    <>
      <Paper sx={{ width: "100%", mt: 1 }}>
        <TableContainer
          sx={{
            overflowX: "auto",
            width: isMobile ? "500px" : "auto",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>{t("orderTable.orderNumber")}</TableCell>
                <TableCell>{t("orderTable.customer")}</TableCell>
                <TableCell>{t("orderTable.area")}</TableCell>
                <TableCell>{t("orderTable.status")}</TableCell>
                <TableCell>{t("orderTable.total")}</TableCell>
                <TableCell width={"5%"}>{t("orderTable.paid")}</TableCell>
                <TableCell>{t("orderTable.orderDate")}</TableCell>
                <TableCell>{t("orderTable.deliveryDate")}</TableCell>
                <TableCell>{t("orderTable.deliveryLocation")}</TableCell>
                <TableCell>{t("orderTable.notes")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>
                    <BasicPopover
                      title={order.id}
                      content={<OrderMealsTable data={order.meal_orders} />}
                    />
                  </TableCell>
                  <TableCell sx={{ textWrap: "nowrap" }}>
                    {order?.customer?.name}
                  </TableCell>
                  <TableCell>{order?.customer?.area}</TableCell>
                  <MyTableCellStatusSelector
                    order={order}
                    setSelectedOrder={null}
                  />
                  <TableCell>{order.totalPrice.toFixed(3)}</TableCell>
                  <TdCell
                    isNum
                    sx={{ width: "50px" }}
                    table={"orders"}
                    item={order}
                    colName={"amount_paid"}
                  >
                    {order.amount_paid.toFixed(3)}
                  </TdCell>
                  <TableCell sx={{ textWrap: "nowrap" }}>
                    {dayjs(new Date(order.created_at)).format(
                      "YYYY-MM-DD HH:mm A"
                    )}
                  </TableCell>
                  <TableCell>
                    <MyDateField2
                      path={`orders`}
                      item={order}
                      colName="delivery_date"
                      val={order.delivery_date}
                      label={t("orderTable.deliveryDate")}
                    />
                  </TableCell>
                  <TableCell>{order.delivery_address}</TableCell>
                  <TableCell>{order.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};
