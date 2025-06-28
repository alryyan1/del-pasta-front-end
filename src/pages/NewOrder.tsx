// src/pages/NewOrder.tsx
import React, { useState, useEffect } from "react";
import axiosClient from "@/helpers/axios-client";
import { Order, Customer } from "@/Types/types";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

// Refactored Components
import OrderHeader from "./OrderrHeader";
import MealCategoryPanel from "@/components/MealCategoryPanel";
import Cart from "@/components/Cart";
import { CustomerForm } from "./Customer/CutomerForm";
import NoteDialog from "@/components/NoteDialog";
import OrderNotesDialog from "@/components/OrderNotesDialog";

// Shadcn UI & Icons
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutGrid, ShoppingCart, Receipt, Clock, FileText, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";

const NewOrder: React.FC = () => {
  const { t } = useTranslation("newOrder");

  // State for managing UI and data
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [isOrderNotesDialogOpen, setIsOrderNotesDialogOpen] = useState(false);

  // State to control which "view" is active on mobile screens
  const [mobileView, setMobileView] = useState<"menu" | "cart">("menu");

  // Get shared state from the main layout (Layout.tsx) via Outlet context
  const { selectedOrder, setSelectedOrder } = useOutletContext<{
    selectedOrder: Order | null;
    setSelectedOrder: (order: Order | null) => void;
  }>();

  // Fetch today's orders on initial load
  useEffect(() => {
    axiosClient
      .get<Order[]>("orders?today=1")
      .then(({ data }) => {
        setOrders(data);
        // If no order is selected yet, select the first one from the list by default
        if (!selectedOrder && data.length > 0) {
          setSelectedOrder(data[0]);
        }
      })
      .catch(() =>
        toast.error(t("error.fetchOrders", "Failed to fetch today's orders."))
      );
    // We only want this to run once on mount, so the dependency array is empty.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // This effect ensures our local `orders` list stays in sync if the shared `selectedOrder` is updated elsewhere.
  useEffect(() => {
    if (selectedOrder) {
      setOrders((prevOrders) => {
        const exists = prevOrders.some((o) => o.id === selectedOrder.id);
        if (exists) {
          // Update existing order in the list
          return prevOrders.map((o) =>
            o.id === selectedOrder.id ? selectedOrder : o
          );
        } else {
          // Add new order to the list (e.g., if created from another screen)
          return [selectedOrder, ...prevOrders];
        }
      });
    }
  }, [selectedOrder]);

  const newOrderHandler = () => {
    axiosClient
      .post("orders")
      .then(({ data }) => {
        if (data.status) {
          const newOrder: Order = data.data;
          // Add the new order to the top of the list and select it
          setOrders((prev) => [newOrder, ...prev]);
          setSelectedOrder(newOrder);
          toast.success(
            t(
              "success.orderCreated",
              `Order #${newOrder.order_number} created.`
            )
          );
        }
      })
      .catch(() =>
        toast.error(t("error.createOrder", "Failed to create new order."))
      );
  };

  const handleCustomerSave = () => {
    setIsCustomerFormOpen(false);
    // Refresh the customer data or handle the saved customer
    toast.success("Customer saved successfully");
  };

  return (
    // Main POS Layout
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Professional Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm flex-shrink-0">
        <div className="px-4 py-3">
          <OrderHeader
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
            newOrderHandler={newOrderHandler}
            setIsCustomerFormOpen={setIsCustomerFormOpen}
            setIsNoteDialogOpen={setIsNoteDialogOpen}
          />
        </div>
      </header>

      {/* Main POS Interface - 3 Column Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-10 gap-4 p-4 overflow-hidden">
        {/* Left Panel: Menu Categories (60% - 6/10 columns) */}
        <div
          className={cn(
            "lg:col-span-6 flex flex-col overflow-hidden",
            mobileView === "menu" ? "flex" : "hidden lg:flex"
          )}
        >
          <Card className="flex-1 shadow-lg">
            <CardContent className="p-0 h-full">
              <MealCategoryPanel
                selectedOrder={selectedOrder}
                setSelectedOrder={setSelectedOrder}
              />
            </CardContent>
          </Card>
        </div>

        {/* Middle Panel: Cart (30% - 3/10 columns) */}
        <div
          className={cn(
            "lg:col-span-3 flex flex-col overflow-hidden",
            mobileView === "cart" ? "flex" : "hidden lg:flex"
          )}
        >
          <Card className="flex-1 shadow-lg overflow-hidden">
            <div className="p-4 border-b bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                  {t("currentOrder", "Current Order")}
                </h2>
                {selectedOrder && (
                  <span className="ml-auto text-sm font-medium text-slate-500 dark:text-slate-400">
                    #{selectedOrder.order_number}
                  </span>
                )}

                              {/* Order Notes  and delivery address*/}
                  <Button
                    onClick={() => setIsOrderNotesDialogOpen(true)}
                    variant="outline"
                    disabled={!selectedOrder}
                  >
                   +
                    <Edit3 className="h-3 w-3 text-slate-400" />
                  </Button>
                </div>
            </div>
            <CardContent className="p-0 flex-1 overflow-hidden">
              {selectedOrder ? (
                <Cart
                  selectedOrder={selectedOrder}
                  setSelectedOrder={setSelectedOrder}
                  printHandler={() => {}}
                />
              ) : (
                <div className="flex items-center justify-center h-full p-8 text-center">
                  <div className="space-y-3">
                    <Receipt className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto" />
                    <p className="text-slate-500 dark:text-slate-400">
                      {t("noOrderSelected", "Select or create an order to begin")}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: Today's Orders (10% - 1/10 columns) */}
        <div
          className={cn(
            "lg:col-span-1 flex flex-col overflow-hidden",
            "hidden lg:flex" // Always hidden on mobile since it's too narrow
          )}
        >
          <Card className="flex-1 shadow-lg">
            <div className="p-2 border-b bg-slate-50 dark:bg-slate-800/50">
              <div className="flex flex-col items-center gap-1">
                <Clock className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 text-center leading-tight">
                  {t("todayOrders", "Today's")}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {orders.length}
                </span>
              </div>
            </div>
            <CardContent className="p-2">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="flex flex-col gap-2">
                  {orders.map((order) => {
                    const isSelected = selectedOrder?.id === order.id;
                    const mealCount = order.meal_orders?.length || 0;
                    const orderNumber = order.order_number?.toString() || order.id?.toString() || '';
                    const customerName = order.customer?.name || 'Guest';
                    
                    const getOrderStatusColor = () => {
                      switch (order.status?.toLowerCase()) {
                        case 'completed':
                          return 'bg-green-500 dark:bg-green-600';
                        case 'processing':
                          return 'bg-blue-500 dark:bg-blue-600';
                        case 'pending':
                          return 'bg-yellow-500 dark:bg-yellow-600';
                        case 'cancelled':
                          return 'bg-red-500 dark:bg-red-600';
                        default:
                          return 'bg-slate-500 dark:bg-slate-600';
                      }
                    };

                    const getCardStyles = () => {
                      if (isSelected) {
                        return "bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700 shadow-md";
                      }
                      if (order.status?.toLowerCase() === 'completed') {
                        return "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800";
                      }
                      return "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750";
                    };

                    return (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setSelectedOrder(order);
                          }
                        }}
                        aria-selected={isSelected}
                        aria-label={`${t("common:select", "Select")} order ${orderNumber}, customer ${customerName}`}
                        className={cn(
                          "w-full h-[54px] flex-shrink-0 rounded-lg cursor-pointer transition-all duration-200 ease-out",
                          "flex flex-col items-center justify-center relative group border",
                          "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                          "active:scale-95 transform-gpu",
                          getCardStyles()
                        )}
                        title={`Order #${orderNumber}\nCustomer: ${customerName}\nItems: ${mealCount}\nStatus: ${order.status || 'Pending'}`}
                      >
                        {/* Order Number */}
                        <span className={cn(
                          "text-xs font-semibold leading-tight text-center px-1",
                          isSelected 
                            ? "text-blue-700 dark:text-blue-300" 
                            : order.status?.toLowerCase() === 'completed'
                            ? "text-green-700 dark:text-green-300"
                            : "text-slate-700 dark:text-slate-300"
                        )}>
                          {orderNumber.length > 6
                            ? `#${orderNumber.substring(0, 4)}…`
                            : `#${orderNumber}`}
                        </span>

                        {/* Meal Count Badge */}
                        {mealCount > 0 && (
                          <div
                            className={cn(
                              "absolute -top-1.5 -right-1.5 h-5 min-w-[20px] px-1.5 text-[10px] font-bold",
                              "leading-tight rounded-full shadow-sm border-2 border-white dark:border-slate-800",
                              getOrderStatusColor(),
                              "text-white flex items-center justify-center"
                            )}
                          >
                            {mealCount}
                          </div>
                        )}

                        {/* Status Indicator */}
                        {order.status?.toLowerCase() === 'completed' && (
                          <div className="absolute top-0.5 left-0.5 w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full shadow-sm"></div>
                        )}

                        {/* Paid Status Indicator */}
                        {(order.payment_status?.toLowerCase() === 'paid' || order.amount_paid > 0) && (
                          <div className="absolute -bottom-1 -left-1 p-0.5 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-200 dark:border-slate-600">
                            <div className="h-3 w-3 bg-green-500 dark:bg-green-400 rounded-full" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {orders.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Clock className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                        {t("noOrders", "No orders today")}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Mobile Navigation Footer */}
      <footer className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 flex-shrink-0">
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => setMobileView("menu")}
            variant={mobileView === "menu" ? "default" : "outline"}
            className={cn(
              "flex items-center justify-center gap-2 h-12",
              mobileView === "menu" && "bg-blue-600 hover:bg-blue-700"
            )}
          >
            <LayoutGrid className="h-5 w-5" />
            <span className="font-medium">{t("tabs.menu", "Menu")}</span>
          </Button>
          <Button
            onClick={() => setMobileView("cart")}
            variant={mobileView === "cart" ? "default" : "outline"}
            className={cn(
              "flex items-center justify-center gap-2 h-12 relative",
              mobileView === "cart" && "bg-blue-600 hover:bg-blue-700"
            )}
          >
            {/* Item count badge */}
            {selectedOrder && selectedOrder?.meal_orders?.length > 0 && (
              <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {selectedOrder?.meal_orders?.length}
              </div>
            )}
            <ShoppingCart className="h-5 w-5" />
            <span className="font-medium">{t("tabs.cart", "Cart")}</span>
          </Button>
        </div>
      </footer>

      {/* Dialogs */}
      <CustomerForm
        open={isCustomerFormOpen}
        onClose={() => setIsCustomerFormOpen(false)}
        onSubmit={handleCustomerSave}
        selectedCustomer={{} as Customer}
      />
      
      {selectedOrder && (
        <NoteDialog
          open={isNoteDialogOpen}
          handleClose={() => setIsNoteDialogOpen(false)}
          selectedOrder={selectedOrder}
          setSelectedOrder={(order) => {
            if (typeof order === 'function') {
              setSelectedOrder(order(selectedOrder));
            } else {
              setSelectedOrder(order);
            }
          }}
        />
      )}

      {/* Order Notes Dialog */}
      {selectedOrder && (
        <OrderNotesDialog
          open={isOrderNotesDialogOpen}
          onClose={() => setIsOrderNotesDialogOpen(false)}
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
        />
      )}
    </div>
  );
};

export default NewOrder;
