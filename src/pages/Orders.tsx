import { useEffect, useState } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  TextField,
  Button,
} from "@mui/material";
import { AxiosDataShape, Customer, Order } from "@/Types/types";
import { OrderTable } from "./orders/OrderTable";
import axiosClient from "@/helpers/axios-client";
import { Stack } from "@mui/system";
import { Search } from "lucide-react";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import PDF, { OrderPDF } from "./orders/ReactPDF/OrdersPdf";
import OrdersPDF from "./orders/ReactPDF/OrdersPdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import AppPdf from "./orders/ReactPDF/AppPdf";
import { webUrl } from "@/helpers/constants";

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    //fetch orders
    axiosClient.get<Order[]>("orders").then(({ data }) => {
      setOrders(data);
    });
  }, []);

  const handleDelete = (id: number) => {
    axiosClient
      .delete<AxiosDataShape<Order>>(`orders/${id}`)
      .then(({ data }) => {
        if (data.status) {
          setOrders(orders.filter((order) => order.id !== id));
        }
      });
  };

  const handleUpdate = (id: number, data: Partial<Order>) => {
    setOrders(
      orders.map((order) => (order.id === id ? { ...order, ...data } : order))
    );
  };


 
  console.log(searchQuery,'search query')
  // Filter orders based on search query
  const filteredOrders = orders.filter(
    (order) =>
      order?.customer?.name.includes(searchQuery) ||
      order?.customer?.phone.includes(searchQuery) ||
      order.status.includes(searchQuery) ||
      order.amount_paid.toString().includes(searchQuery) ||
      dayjs(order.created_at).isSame(  dayjs(searchQuery),'day') ||
      dayjs(order.delivery_date).isSame(  dayjs(searchQuery),'day') 
    
  
    
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Stack alignItems={'center'} direction={'row'} justifyContent={'space-around'} >

          <h1 className="text-3xl font-bold mb-8">اداره الطلبات </h1>
          <TextField
            
            variant="outlined"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <Search size={20} className="mr-2 text-gray-500" />
              ),
            }}
          />
          <input onChange={(e)=>{
            setSearchQuery(e.target.value)
          }} className=" bg-gray-50 p-8" type="date"/>
          <Button variant="contained" href={`${webUrl}orders`}>التقرير</Button>
        </Stack>

        <OrderTable
          orders={filteredOrders}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          // Pass translated column headers to OrderTable component
          columnHeaders={{
            orderNumber: "رقم الطلب",
            status: "الحالة",
            paymentStatus: "حالة الدفع",
            amountPaid: "المبلغ المدفوع",
            createdAt: "تاريخ الإنشاء",
            actions: "الإجراءات",
          }}
          // Add translations for pagination and other texts
          translations={{
            rowsPerPage: "عدد الصفوف لكل صفحة",
            of: "من",
            actions: "الإجراءات",
          }}
        />


      </div>
    </div>
  );
}

export default Orders;
