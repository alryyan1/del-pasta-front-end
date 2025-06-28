// src/components/Cart.tsx
import React, { useState } from "react";
import { Order } from "@/Types/types";
import axiosClient from "@/helpers/axios-client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import printJS from "print-js";

// Components & Icons
import CartItem from "./CartItem";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Loader2, ShoppingCart } from "lucide-react";
import { webUrl } from "@/helpers/constants";

interface CartProps {
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
}

const Cart: React.FC<CartProps> = ({ selectedOrder, setSelectedOrder }) => {
  const { t } = useTranslation("cart");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmAndPrint = () => {
    if (!selectedOrder) return;

    setIsLoading(true);
    axiosClient
      .patch(`orders/${selectedOrder.id}`, { order_confirmed: 1 })
      .then(({ data }) => {
        if (data.status) {
          setSelectedOrder(data.order);
          toast.success("Order Confirmed!");
          // Trigger print after confirmation
          return axiosClient.get(
            `printSale?order_id=${selectedOrder.id}&base64=1`
          );
        }
        throw new Error(data.message || "Confirmation failed");
      })
      .then(({ data }) => {
        printJS({
          printable: data.slice(data.indexOf("JVB")),
          base64: true,
          type: "pdf",
        });
      })
      .catch((err) => toast.error(err.message || "An error occurred."))
      .finally(() => setIsLoading(false));
  };

  if (!selectedOrder) {
    return (
      <Card className="flex flex-col items-center justify-center h-full text-center p-6 border-dashed">
        <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
        <CardTitle>{t("noOrderSelected.title", "No Order Selected")}</CardTitle>
        <CardDescription>
          {t(
            "noOrderSelected.description",
            "Create a new order or select one from the list."
          )}
        </CardDescription>
      </Card>
    );
  }

  const orderIsEmpty =
    !selectedOrder?.meal_orders || selectedOrder?.meal_orders?.length === 0;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>{t("title", "Current Order")}</CardTitle>
        <CardDescription>
          {t(
            "description",
            `Review items for order #${selectedOrder?.order_number || "N/A"}`
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto p-4 space-y-3">
        {orderIsEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground">
            <ShoppingCart className="h-10 w-10 mb-4" />
            <p>
              {t("emptyCart", "This order is empty. Add items from the menu.")}
            </p>
          </div>
        ) : (
          selectedOrder?.meal_orders?.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              setSelectedOrder={setSelectedOrder}
              disabled={selectedOrder?.order_confirmed}
            />
          ))
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4 p-4 border-t dark:border-slate-800">
        <div className="w-full space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("deliveryFee")}</span>
            <Input
              type="number"
              className="w-24 h-8 text-right"
              defaultValue={selectedOrder?.delivery_fee}
              onBlur={(e) =>
                axiosClient
                  .patch(`/orders/${selectedOrder.id}`, {
                    delivery_fee: e.target.value,
                  })
                  .then(({ data }) => setSelectedOrder(data.order))
              }
              disabled={selectedOrder?.order_confirmed}
            />
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-base">
            <span className="text-slate-800 dark:text-slate-100">
              {t("total")}
            </span>
            <span className="text-brand-pink-DEFAULT dark:text-brand-pink-light">
                {Number(selectedOrder?.totalPrice).toFixed(3)}{" "}
              {t("currency_OMR", "OMR")}
            </span>
          </div>
        </div>
        <Button
          className="w-full bg-brand-pink-DEFAULT hover:bg-brand-pink-dark"
          onClick={handleConfirmAndPrint}
          disabled={isLoading || selectedOrder?.order_confirmed || orderIsEmpty}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {selectedOrder?.order_confirmed
            ? t("confirmed", "Confirmed")
            : t("confirmAndPrint", "Confirm & Print")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Cart;
