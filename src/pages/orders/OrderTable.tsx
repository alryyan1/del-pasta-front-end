import { useState } from 'react';
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
} from '@mui/material';
import { Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Order } from '@/Types/types';
import { StatusChip } from './StatusShip';
import { UpdateOrderDialog } from './UpdateOrderDialog';
import dayjs from 'dayjs';

interface OrderTableProps {
  orders: Order[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: Partial<Order>) => void;
}

export const OrderTable = ({ orders, onDelete, onUpdate }: OrderTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleUpdateClick = (order: Order) => {
    setSelectedOrder(order);
    setUpdateDialogOpen(true);
  };

  const handleUpdateSubmit = (data: Partial<Order>) => {
    if (selectedOrder) {
      onUpdate(selectedOrder.id, data);
    }
  };

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>رقم الطلب</TableCell>
                <TableCell> الزبون</TableCell>
                <TableCell>الحالة</TableCell>
                <TableCell>حالة الدفع</TableCell>
                <TableCell>المبلغ المدفوع</TableCell>
                <TableCell>تاريخ الإنشاء</TableCell>
                <TableCell align="right">الإجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {order.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {order?.customer?.name}
                    </TableCell>
                    <TableCell>
                      <StatusChip status={order.status} />
                    </TableCell>
                    <TableCell>{order.payment_type}</TableCell>
                    <TableCell>
                      {order.amount_paid}
                    </TableCell>
                    <TableCell>
                      {dayjs(new Date(order.created_at)).format('YYYY-MM-DD H:m A')}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleUpdateClick(order)}
                        color="primary"
                      >
                        <Pencil size={16} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onDelete(order.id)}
                        color="error"
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </TableCell>
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