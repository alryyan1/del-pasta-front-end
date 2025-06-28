// src/pages/NewOrder.tsx
import React, { useState, useEffect } from "react";
import axiosClient from "@/helpers/axios-client";
import { Order } from "@/Types/types";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

// Refactored Components
import OrderHeader from "./OrderrHeader";
import MealCategoryPanel from "@/components/MealCategoryPanel";
import Cart from "@/components/Cart";
import OrderList from "@/components/OrderList";
import { CustomerForm } from "./Customer/CutomerForm"; // Assuming this is also a dialog now
import NoteDialog from "@/components/NoteDialog";

// Shadcn UI & Icons
import { Button } from "@/components/ui/button";
import { LayoutGrid, ShoppingCart, Badge } from "lucide-react"; // Badge might be useful
import { cn } from "@/lib/utils";

const NewOrder: React.FC = () => {
  const { t } = useTranslation("newOrder");

  // State for managing UI and data
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);

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

  return (
    // Main container with flex layout to fill vertical space
    <div className="flex flex-col h-screen md:h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950">
      {/* Header: Controls and Info. Stays at the top. */}
      <header className="p-2 md:p-4 border-b bg-white dark:bg-slate-900 dark:border-slate-800 flex-shrink-0">
        <OrderHeader
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          newOrderHandler={newOrderHandler}
          setIsCustomerFormOpen={setIsCustomerFormOpen}
          setIsNoteDialogOpen={setIsNoteDialogOpen}
        />
      </header>

      {/* Main Content: Two-column grid for iPad and up */}
      <main className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 p-2 md:p-4 overflow-hidden">
        {/* Left Column: Menu/Categories Panel. Hidden on mobile unless `mobileView` is 'menu' */}
        <div
          className={cn(
            "md:flex flex-col h-full overflow-hidden",
            mobileView === "menu" ? "flex" : "hidden"
          )}
        >
          <MealCategoryPanel
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
          />
        </div>

        {/* Right Column: Cart and Order List. Hidden on mobile unless `mobileView` is 'cart' */}
        <div
          className={cn(
            "md:flex flex-col h-full overflow-hidden gap-4",
            mobileView === "cart" ? "flex" : "hidden"
          )}
        >
          {/* Cart takes up most of the space */}
          <div className="flex-grow h-0">
            {" "}
            {/* h-0 trick allows flex-grow to work in overflow container */}
            <Cart
              selectedOrder={selectedOrder}
              setSelectedOrder={setSelectedOrder}
            />
          </div>
          {/* Order list at the bottom */}
          <div className="flex-shrink-0 max-h-[200px] md:max-h-[250px]">
            <OrderList
              orders={orders}
              selectedOrder={selectedOrder}
              setSelectedOrder={setSelectedOrder}
            />
          </div>
        </div>
      </main>

      {/* Mobile View Toggle Buttons Footer. Hidden on medium screens and up. */}
      <footer className="md:hidden flex p-2 border-t bg-white dark:bg-slate-900 dark:border-slate-800 flex-shrink-0">
        <Button
          onClick={() => setMobileView("menu")}
          variant={mobileView === "menu" ? "default" : "outline"}
          className={cn(
            "flex-1",
            mobileView === "menu" &&
              "bg-brand-pink-DEFAULT hover:bg-brand-pink-dark"
          )}
        >
          <LayoutGrid className="mr-2 h-4 w-4" /> {t("tabs.menu", "Menu")}
        </Button>
        <Button
          onClick={() => setMobileView("cart")}
          variant={mobileView === "cart" ? "default" : "outline"}
          className={cn(
            "flex-1 relative",
            mobileView === "cart" &&
              "bg-brand-pink-DEFAULT hover:bg-brand-pink-dark"
          )}
        >
          {/* Badge to show item count on the cart tab */}
          {selectedOrder && selectedOrder?.meal_orders?.length > 0 && (
            <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {selectedOrder?.meal_orders?.length}
            </div>
          )}
          <ShoppingCart className="mr-2 h-4 w-4" />{" "}
          {t("tabs.cartAndOrders", "Cart & Orders")}
        </Button>
      </footer>

      {/* Dialogs that can be triggered from this page */}
      <CustomerForm
        open={isCustomerFormOpen}
        onClose={() => setIsCustomerFormOpen(false)}
      />
      {selectedOrder && (
        <NoteDialog
          open={isNoteDialogOpen}
          handleClose={() => setIsNoteDialogOpen(false)}
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
        />
      )}
    </div>
  );
};

export default NewOrder;
