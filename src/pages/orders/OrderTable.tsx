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
import { OrderDetails } from './types';
import { OrderDetailsPopover } from "@/components/OrderDetails";
import { LoadingButton } from "@mui/lab";
import axiosClient from "@/helpers/axios-client";
import DeductDialog from "@/components/DeductDialog";

interface OrderTableProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

export const OrderTable = ({ orders,setOrders }: OrderTableProps) => {
  const isMobile = useMediaQuery("(max-width:600px)"); // adjust based on screen size
  const { t } = useTranslation('orderTable');
  const [loading ,setLoading]=useState(false)
  const [open, setOpen] = useState(false);
  const [selectedOrder , setSelectedOrder]=useState(null)
  const handleClose = ()=>{
    setOpen(false)
  }
  const deliveryHandler = (order:Order)=>{
    setSelectedOrder(order)
    setOpen(true)
    setLoading(true)
    axiosClient.patch(`orders/${order.id}`,{
      status: order.status == 'delivered' ?'cancelled' :'delivered'
    }).then(({data})=>{
      console.log('order delivered',data)
      setOrders((prev)=>{
        return prev.map(o=>o.id===order.id? data.order : o)
      })
    }).finally(()=>setLoading(false))
  }
  return (
    <>
      <Paper sx={{ width: "100%", mt: 1 }}>
        <TableContainer
          sx={{
            overflowX: "auto",
            width: isMobile ? "500px" : "auto",
          }}
        >
          <Table className="border border-collapse order-table" stickyHeader>
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
                <TableCell>التسليم</TableCell>
                {/* <TableCell>{t("orderTable.deliveryLocation")}</TableCell> */}
                {/* <TableCell>{t("orderTable.notes")}</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>
                    <BasicPopover
                      title={order.id}
                      content={<OrderDetailsPopover order={order} />}
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
                  <TableCell>
                    <LoadingButton loading={loading} onClick={()=>deliveryHandler(order)} size="small" variant="contained" color={order.status == 'delivered' ?'error' :'inherit'}>{order.status == 'delivered' ?'الغاء ' :'تسليم'}</LoadingButton>
                  </TableCell>
                  {/* <TableCell>{order.delivery_address}</TableCell> */}
                  {/* <TableCell>{order.notes}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      {selectedOrder &&  <DeductDialog setSelectedOrder={setSelectedOrder}  selectedOrder={selectedOrder} open={open} handleClose={handleClose}/>}
      </Paper>
    </>
  );
};
