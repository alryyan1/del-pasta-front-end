import React, { useEffect, useState } from "react";
import { Meal, Mealorder, Order, Requestedchildmeal } from "@/Types/types";
import axiosClient from "@/helpers/axios-client";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Icons
import { Plus, ShoppingCart, CreditCard, Receipt, DollarSign } from "lucide-react";

// Components
import CartItem from "./CartItem";

interface CartProps {
  selectedOrder: Order;
  setSelectedOrder: (order: Order) => void;
  printHandler: () => void;
}

function Cart({ selectedOrder, setSelectedOrder, printHandler }: CartProps) {
  const { t } = useTranslation("cart");
  const [colName, setColName] = useState("");
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [val, setVal] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  const { meals } = useOutletContext<{ meals: Meal[] }>();

  const updateQuantity = (increment: boolean, item: Requestedchildmeal) => {
    axiosClient
      .patch(`RequestedChild/${item.id}`, {
        count: increment ? item.count + 1 : Math.max(0, item.count - 1),
      })
      .then(({ data }) => {
        setSelectedOrder(data.order);
      });
  };

  const updateMealOrderQuantity = (increment: boolean, item: Mealorder) => {
    axiosClient
      .patch(`orderMeals/${item.id}`, {
        quantity: increment
          ? item.quantity + 1
          : Math.max(0, item.quantity - 1),
      })
      .then(({ data }) => {
        setSelectedOrder(data.order);
      });
  };

  const orderUpdateHandler = async () => {
    setIsConfirming(true);
    try {
      const { data } = await axiosClient.patch(`orders/${selectedOrder.id}`, {
        order_confirmed: 1,
      });
      
      if (data.status) {
        await axiosClient.post(`orderConfirmed/${selectedOrder.id}`);
        printHandler();
        setSelectedOrder(data.order);
        toast.success(t("orderConfirmed", "Order confirmed successfully!"));
      }
         } catch {
       toast.error(t("orderConfirmError", "Failed to confirm order"));
     } finally {
      setIsConfirming(false);
    }
  };

  const orderItemUpdateHandler = (value: string, orderMeal: Order, columnName = "delivery_fee") => {
    axiosClient
      .patch(`orders/${orderMeal.id}`, {
        [columnName]: value,
      })
      .then(({ data }) => {
        setSelectedOrder(data.order);
      });
  };

  useEffect(() => {
    if (colName !== '') {
      const timer = setTimeout(() => {
        orderItemUpdateHandler(val, selectedOrder, colName);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [val, colName, selectedOrder]);

  const mealOrderHandler = () => {
    if (!selectedMeal) return;
    
    axiosClient.post('orderMeals', {
      order_id: selectedOrder?.id,
      meal_id: selectedMeal?.id,
      quantity: 1,
      price: selectedMeal?.price
    }).then(({ data }) => {
      setSelectedOrder(data.order);
      setSelectedMeal(null);
    });
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950">
      {/* Quick Add Meal Section */}
      <div className="p-4 border-b">
        <div className="flex gap-2">
          <Select value={selectedMeal?.id?.toString() || ""} onValueChange={(value) => {
            const meal = meals.find(m => m.id === parseInt(value));
            setSelectedMeal(meal || null);
          }}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder={t("selectMeal", "Select meal to add...")} />
            </SelectTrigger>
            <SelectContent>
              {meals.map((meal) => (
                <SelectItem key={meal.id} value={meal.id.toString()}>
                  {meal.name} - {Number(meal.price).toFixed(3)} {t("currency_OMR", "OMR")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={mealOrderHandler}
            disabled={!selectedMeal || selectedOrder?.order_confirmed}
            size="icon"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Cart Items */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {selectedOrder?.meal_orders?.length > 0 ? (
            <div className="space-y-3">
              {selectedOrder.meal_orders.map((item) => (
                                 <CartItem
                   key={item.id}
                   selectedOrder={selectedOrder}
                   updateRequestedQuantity={updateQuantity}
                   setSelectedOrder={() => {
                     // Refresh the whole order after cart item changes
                     axiosClient.get(`orders/${selectedOrder.id}`).then(({ data }) => {
                       setSelectedOrder(data);
                     });
                   }}
                   updateQuantity={updateMealOrderQuantity}
                   isMultible=""
                   item={item}
                 />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingCart className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {t("emptyCart", "Cart is empty")}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {t("addItemsToCart", "Add items from the menu to get started")}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Order Details & Actions */}
      {selectedOrder?.meal_orders?.length > 0 && (
        <div className="border-t bg-slate-50 dark:bg-slate-900/50">
          {/* Order Notes & Delivery Address */}
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                {t("notes", "Order Notes")}
              </Label>
              <Input
                id="notes"
                placeholder={t("notesPlaceholder", "Add notes for this order...")}
                defaultValue={selectedOrder.notes}
                onChange={(e) => {
                  setColName("notes");
                  setVal(e.target.value);
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="delivery_address" className="text-sm font-medium">
                {t("delivery_address", "Delivery Address")}
              </Label>
              <Input
                id="delivery_address"
                placeholder={t("deliveryAddressPlaceholder", "Enter delivery address...")}
                defaultValue={selectedOrder.delivery_address}
                onChange={(e) => {
                  setColName("delivery_address");
                  setVal(e.target.value);
                }}
              />
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t("total_amount", "Subtotal")}
                </p>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {selectedOrder?.totalPrice.toFixed(3)} {t("currency_OMR", "OMR")}
                </p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="delivery_fee" className="text-sm text-slate-600 dark:text-slate-400">
                  {t("delivery_fee", "Delivery Fee")}
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="delivery_fee"
                    type="number"
                    step="0.001"
                    className="w-20 text-right"
                    defaultValue={selectedOrder?.delivery_fee}
                    onChange={(e) => {
                      orderItemUpdateHandler(e.target.value, selectedOrder);
                    }}
                    onFocus={(e) => e.target.select()}
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {t("currency_OMR", "OMR")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {t("paid", "Amount Paid")}
                </span>
              </div>
              <span className="text-lg font-bold text-green-600">
                {selectedOrder?.amount_paid.toFixed(3)} {t("currency_OMR", "OMR")}
              </span>
            </div>

            {/* Confirm Order Button */}
            <Button
              onClick={orderUpdateHandler}
              disabled={selectedOrder?.order_confirmed || isConfirming}
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold"
              size="lg"
            >
              {isConfirming ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {t("confirming", "Confirming...")}
                </>
              ) : (
                <>
                  {selectedOrder?.order_confirmed ? (
                    <>
                      <Receipt className="mr-2 h-5 w-5" />
                      {t("orderConfirmed", "Order Confirmed")}
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      {t("confirm_order", "Confirm Order")}
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
