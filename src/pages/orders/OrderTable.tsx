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

interface OrderTableProps {
  orders: Order[];
}

export const OrderTable = ({ orders }: OrderTableProps) => {
  const [editStatus, setEditStatus] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)"); // adjust based on screen size

  return (
    <>
      <Paper sx={{ width: "100%", mt: 1 }}>
        <TableContainer
          sx={{
            maxHeight: 500,
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
                <TableCell> المدفوع</TableCell>
                {/* <TableCell> المتبقي</TableCell> */}
                <TableCell>تاريخ الإنشاء</TableCell>
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
                      content={<OrderMealsTable data={order.meal_orders} />}
                    />
                  </TableCell>
                  <TableCell>{order?.customer?.name}</TableCell>
                  {/* <TableCell>{order?.customer?.state}</TableCell> */}
                  <TableCell>{order?.customer?.area}</TableCell>
                  <TableCell onClick={() => setEditStatus(true)}>
                    {editStatus ? (
                      <StatusSelector
                        setSelectedOrder={null}
                        selectedOrder={order}
                      />
                    ) : (
                      <StatusChip status={order.status} />
                    )}
                  </TableCell>
                  {/* <TableCell>{order.payment_type}</TableCell> */}
                  <TableCell>{order.totalPrice.toFixed(3)}</TableCell>
                  <TdCell
                    sx={{ width: "50px" }}
                    table={"orders"}
                    item={order}
                    colName={"amount_paid"}
                  >
                    {order.amount_paid}
                  </TdCell>
                  {/* <TableCell>{ (order.totalPrice - order.amount_paid).toFixed(3)}</TableCell> */}
                  <TableCell>
                    {dayjs(new Date(order.created_at)).format("YYYY-MM-DD ")}
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
                       <TableRow>
                <TableCell> </TableCell>
                <TableCell> </TableCell>
                {/* <TableCell> الولايه</TableCell> */}
                <TableCell> </TableCell>
                <TableCell></TableCell>
                {/* <TableCell>حالة الدفع</TableCell> */}
                <TableCell>
                 <Typography variant="h4"> {orders.reduce((prev, curr) => prev + curr.totalPrice, 0)}ريال</Typography>
                </TableCell>
                <TableCell>
                  
                  <Typography variant="h4">{orders.reduce((prev, curr) => prev + curr.amount_paid, 0)}ريال</Typography>
                </TableCell>
                {/* <TableCell> المتبقي</TableCell> */}
                <TableCell> </TableCell>
                <TableCell> </TableCell>
                <TableCell> </TableCell>
                <TableCell> </TableCell>
                {/* <TableCell> تكلفه الطلب</TableCell> */}
                {/* <TableCell align="right">الإجراءات</TableCell> */}
              </TableRow>
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
