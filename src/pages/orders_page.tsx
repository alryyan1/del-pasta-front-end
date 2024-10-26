import React from "react";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { Card } from "@/components/ui/card"; // Assuming Card component
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table"; // Assuming the table structure
import Header from "@/components/header";

const OrdersPage = () => {
  // Example orders data
  const orders = [
    {
      order_number: 1,
      customer_id: "عميل رقم 1",
      meals: ["دجاج مشوي", "شوربة", "عصير"],
      amount_paid: "50 ريال",
      payment_type: "كاش",
      delivery_date: "2024-08-15",
      compileted_at: "2024-08-15",
      delivery_address: "سندان ",
      status: "قيد المعالجة",
      discount: "0",
      user_id: "الكاشير",
      notes: "لا يوجد ملاحظات",
      special_instruction: "لا يوجد تعليمات خاصة",
      payment_status: "تم الدفع",
      is_delivered: true,
      delivery_fee: "5 ريال",
      created_at: "2024-08-15",
      updated_at: "2024-08-15",
    },
    {
      order_number: 2,
      customer_id: "عميل رقم 2",
      meals: ["دجاج مشوي", "شوربة", "عصير"],
      amount_paid: "58 ريال",
      payment_type: "كاش",
      delivery_date: "2024-08-15",
      compileted_at: "2024-08-15",
      delivery_address: "سندان ",
      status: "قيد المعالجة",
      discount: "0",
      user_id: "الكاشير",
      notes: "لا يوجد ملاحظات",
      special_instruction: "لا يوجد تعليمات خاصة",
      payment_status: "تم الدفع",
      is_delivered: true,
      delivery_fee: "5 ريال",
      created_at: "2024-08-15",
      updated_at: "2024-08-15",
    },
  ];

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8" dir="rtl">
        {/* Cards for actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <CardLink
            title="إضافة طلب جديد"
            description="قم بإضافة طلب جديد إلى النظام"
            href="/create-new-order"
          />
          <CardLink
            title="إضافة قسم جديد"
            description="قم بإضافة تصنيف جديد"
            href="/create-category"
          />
          <CardLink
            title="إضافة صنف جديد"
            description="قم بإضافة وجبة جديدة إلى القائمة"
            href="/create-meal"
          />
        </div>

        {/* Orders Table */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-2xl font-bold mb-4">الطلبات</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>رقم الطلب</TableCell>
                <TableCell>اسم العميل</TableCell>
                <TableCell>محتويات الطلب</TableCell>
                <TableCell>السعر</TableCell>
                <TableCell>طريقة الدفع</TableCell>
                <TableCell>تاريخ التسليم</TableCell>
                <TableCell>تاريخ اكمال الطلب</TableCell>
                <TableCell>عنوان التسليم</TableCell>
                <TableCell>الحالة</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.order_number}>
                  <TableCell>{order.order_number}</TableCell>
                  <TableCell>{order.customer_id}</TableCell>
                  <TableCell>
                    {order.meals.map((meal, index) => (
                      <span key={index}>
                        {meal}
                        {index < order.meals.length - 1 && ", "}
                      </span>
                    ))}
                  </TableCell>
                  <TableCell>{order.amount_paid}</TableCell>
                  <TableCell>{order.payment_type}</TableCell>
                  <TableCell>{order.delivery_date}</TableCell>
                  <TableCell>{order.compileted_at}</TableCell>
                  <TableCell>{order.delivery_address}</TableCell>
                  <TableCell>{order.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

// Card component for navigation
const CardLink = ({ title, description, href }) => {
  return (
    <a
      href={href}
      className="block bg-white shadow-md hover:shadow-lg rounded-lg p-4 transition"
    >
      <Card>
        <div className="p-4">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </Card>
    </a>
  );
};

export default OrdersPage;
