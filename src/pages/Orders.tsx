import { useEffect, useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Customer, Order } from '@/Types/types';
import { OrderTable } from './orders/OrderTable';
import axiosClient from '@/helpers/axios-client';

// Sample data
const initialOrders: Order[] = [
  {
    id: 1,
    customer_id: null,
    order_number: "ORD-001",
    payment_type: "credit_card",
    discount: 0,
    amount_paid: 49.99,
    user_id: 1,
    notes: "No spicy food",
    delivery_date: null,
    completed_at: null,
    delivery_address: "123 Main St",
    special_instructions: "Ring doorbell twice",
    status: "pending",
    payment_status: "paid",
    is_delivery: 1,
    delivery_fee: 5,
    address_id: null,
    created_at: "2024-02-20T10:00:00Z",
    updated_at: "2024-02-20T10:00:00Z",
    meal_orders: []
  },
  // Add more sample orders as needed
];

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function Orders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  useEffect(()=>{
    //fetch orders 
    axiosClient.get<Order[]>('orders').then(({data})=>{
      setOrders(data);
    })
  },[])
  const handleDelete = (id: number) => {
    setOrders(orders.filter(order => order.id !== id));
  };

  const handleUpdate = (id: number, data: Partial<Order>) => {
    setOrders(orders.map(order =>
      order.id === id ? { ...order, ...data } : order
    ));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto" dir="rtl">
          <h1 className="text-3xl font-bold mb-8">اداره الطلبات </h1>
          <OrderTable
            orders={orders}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            // Pass translated column headers to OrderTable component
            columnHeaders={{
              orderNumber: "رقم الطلب",
              status: "الحالة",
              paymentStatus: "حالة الدفع",
              amountPaid: "المبلغ المدفوع",
              createdAt: "تاريخ الإنشاء",
              actions: "الإجراءات"
            }}
            // Add translations for pagination and other texts
            translations={{
              rowsPerPage: "عدد الصفوف لكل صفحة",
              of: "من",
              actions: "الإجراءات"
            }}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Orders;