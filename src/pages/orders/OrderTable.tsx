import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  TablePagination,
} from "@mui/material";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Order } from "@/Types/types";
import { StatusChip } from "./StatusShip";
import { UpdateOrderDialog } from "./UpdateOrderDialog";
import dayjs from "dayjs";
import TdCell from "@/helpers/TdCell";
import StatusSelector from "@/components/StatusSelector";
import BasicPopover from "@/components/Mypopover";
import MealChildrenTable, {
  OrderMealsTable,
} from "@/components/MealChildrenTable";

interface OrderTableProps {
  orders: Order[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: Partial<Order>) => void;
}

export const OrderTable = ({ orders, onDelete, onUpdate }: OrderTableProps) => {
  const [page, setPage] = useState(0);
  const [editStatus, setEditStatus] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleUpdateSubmit = (data: Partial<Order>) => {
    if (selectedOrder) {
      onUpdate(selectedOrder.id, data);
    }
  };

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>رقم الطلب</TableCell>
                <TableCell> الزبون</TableCell>
                <TableCell>الحالة</TableCell>
                <TableCell>حالة الدفع</TableCell>
                <TableCell> اجمالي</TableCell>
                <TableCell> المدفوع</TableCell>
                <TableCell>تاريخ الإنشاء</TableCell>
                <TableCell>تاريخ التسليم</TableCell>
                <TableCell> تكلفه الطلب</TableCell>
                {/* <TableCell align="right">الإجراءات</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>
                      <BasicPopover
                        title={order.id}
                        content={<OrderMealsTable data={order.meal_orders} />}
                      />
                    </TableCell>
                    <TableCell>{order?.customer?.name}</TableCell>
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
                    <TableCell>{order.payment_type}</TableCell>
                    <TableCell>{
                      order.meal_orders.reduce((prev,curr)=>prev + curr.meal.price,0)
                      }</TableCell>
                    <TdCell
                      sx={{ width: "50px" }}
                      table={"orders"}
                      item={order}
                      colName={"amount_paid"}
                    >
                      {order.amount_paid}
                    </TdCell>
                    <TableCell>
                      {dayjs(new Date(order.created_at)).format(
                        "YYYY-MM-DD H:m A"
                      )}
                    </TableCell>
                    <TableCell>{order?.delivery_date}</TableCell>
                    <TdCell
                      sx={{ width: "50px" }}
                      table={"orders"}
                      item={order}
                      colName={"cost"}
                    >
                      {order.cost}
                    </TdCell>
                    {/* <TableCell align="right"> */}
                    {/* <IconButton
                        size="small"
                        onClick={() => handleUpdateClick(order)}
                        color="primary"
                      >
                        <Pencil size={16} />
                      </IconButton> */}
                    {/* <IconButton
                        size="small"
                        onClick={() => onDelete(order.id)}
                        color="error"
                      >
                        <Trash2 size={16} /> */}
                    {/* </IconButton> */}
                    {/* </TableCell> */}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <UpdateOrderDialog
        open={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        order={selectedOrder}
        onUpdate={handleUpdateSubmit}
      />
    </>
  );
};
