// src/components/OrderList.tsx
import React from "react";
import { Order } from "@/Types/types";
import { useTranslation } from "react-i18next";

// Shadcn UI Components & Icons
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils"; // Utility for conditional classes

interface OrderListProps {
  orders: Order[];
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  selectedOrder,
  setSelectedOrder,
}) => {
  const { t } = useTranslation("cart"); // Using cart translations for consistency

  const getStatusVariant = (
    status: string
  ): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case "confirmed":
        return "default"; // Blue/Primary
      case "delivered":
        return "secondary"; // Green-like
      case "cancelled":
        return "destructive"; // Red
      case "pending":
      default:
        return "outline"; // Gray/Subtle
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-4 border-b dark:border-slate-800">
        <CardTitle className="text-lg">
          {t("todaysOrders", "Today's Orders")}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 flex-grow">
        <ScrollArea className="h-full">
          {orders.length > 0 ? (
            <div className="p-2 space-y-2">
              {orders.map((order) => (
                <Button
                  key={order.id}
                  variant="ghost"
                  onClick={() => setSelectedOrder(order)}
                  className={cn(
                    "w-full h-auto justify-between p-3 text-left",
                    selectedOrder?.id === order.id
                      ? "bg-slate-100 dark:bg-slate-800"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  )}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-slate-900 dark:text-slate-50">
                      #{order.order_number}
                    </span>
                    <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                      {order.customer?.name || t("noCustomer", "No Customer")}
                    </span>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                      {Number(order.totalPrice).toFixed(3)}
                    </span>
                    <Badge
                      variant={getStatusVariant(order.status)}
                      className="mt-1 text-xs"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground p-4">
              <p>{t("noOrdersToday", "No orders placed yet today.")}</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default OrderList;
