import { useEffect, useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, TextField } from '@mui/material';
import { AxiosDataShape, Customer, Order } from '@/Types/types';
import { OrderTable } from './orders/OrderTable';
import axiosClient from '@/helpers/axios-client';
import { Stack } from '@mui/system';
import { Search } from 'lucide-react';


const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(()=>{
    //fetch orders 
    axiosClient.get<Order[]>('orders').then(({data})=>{
      setOrders(data);
    })
  },[])

  const handleDelete = (id: number) => {
     axiosClient.delete<AxiosDataShape<Order>>(`orders/${id}`).then(({data})=>{
      if (data.status) {
         
        setOrders(orders.filter(order => order.id !== id));
      }
     })
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
          <Stack direction={'column'}>

          <h1 className="text-3xl font-bold mb-8">اداره الطلبات </h1>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search  size={20} className="mr-2 text-gray-500" />,
            }}
          />
          </Stack>
         
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