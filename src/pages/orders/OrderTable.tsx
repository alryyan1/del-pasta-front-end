import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  useMediaQuery,
  Typography,
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

interface OrderTableProps {
  orders: Order[];
}

export const OrderTable = ({ orders }: OrderTableProps) => {
  const isMobile = useMediaQuery("(max-width:600px)"); // adjust based on screen size

  return (
    <>
      <Paper sx={{ width: "100%", mt: 1 }}>
        <TableContainer
          sx={{
            // maxHeight: 600,
            overflowX: "auto",
            width: isMobile ? "500px" : "auto",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>رقم الطلب</TableCell>
                <TableCell> الزبون</TableCell>
                {/* <TableCell> الولايه</TableCell> */}
                <TableCell> المنطقه</TableCell>
                <TableCell>الحالة</TableCell>
                {/* <TableCell>حالة الدفع</TableCell> */}
                <TableCell> اجمالي</TableCell>
                <TableCell width={'5%'}> المدفوع</TableCell>
                {/* <TableCell> المتبقي</TableCell> */}
                <TableCell>تاريخ الطلب</TableCell>
                <TableCell>تاريخ التسليم</TableCell>
                <TableCell>مكان التوصيل </TableCell>
                <TableCell>ملاحظات </TableCell>
                {/* <TableCell> تكلفه الطلب</TableCell> */}
                {/* <TableCell align="right">الإجراءات</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>
                    <BasicPopover
                      title={order.id}
                      content={<OrderMealsTable  data={order.meal_orders} />}
                    />
                  </TableCell>
                  <TableCell sx={{textWrap:'nowrap'}}>{order?.customer?.name}</TableCell>
                  {/* <TableCell>{order?.customer?.state}</TableCell> */}
                  <TableCell>{order?.customer?.area}</TableCell>
                  <MyTableCellStatusSelector order={order} setSelectedOrder={null} />
                  {/* <TableCell>{order.payment_type}</TableCell> */}
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
                  {/* <TableCell>{ (order.totalPrice - order.amount_paid).toFixed(3)}</TableCell> */}
                  <TableCell sx={{textWrap:'nowrap'}}>
                    {dayjs(new Date(order.created_at)).format("YYYY-MM-DD HH:mm A")}
                  </TableCell>
                  <TableCell>
                    <MyDateField2
                      path={`orders`}
                      item={order}
                      colName="delivery_date"
                      val={order.delivery_date}
                      label="تاريخ التسليم"
                    />
                  </TableCell>
                  {/* <TdCell
                      sx={{ width: "50px" }}
                      table={"orders"}
                      item={order}
                      colName={"cost"}
                    >
                      {order.cost}
                    </TdCell> */}
                  <TableCell>{order.delivery_address}</TableCell>
                  <TableCell>{order.notes}</TableCell>
                </TableRow>
              ))}
                    
            </TableBody>
            
          </Table>
  
        </TableContainer>
      
       
      </Paper>

      {/* <UpdateOrderDialog

        open={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        order={selectedOrder}
      /> */}
    </>
  );
};
