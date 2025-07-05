// src/pages/OnlineOrderPage.tsx
import React, { useState } from "react";
import { useCartStore } from "@/stores/useCartStore";

// Local Components
import { CartSummary } from "@/components/CartSummary";
import { CheckoutDialog } from "@/components/CheckoutDialog";

// Shadcn UI & Icons for the mobile cart trigger
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FoodMenu from "./Reservation/FoodMenu";

export const OnlineOrderPage: React.FC = () => {
  // State to control the visibility of the checkout modal
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Subscribe to the cart store to get the total number of items for the badge
  const { totalItems } = useCartStore();

  return (
    <>
      <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto">
          {/* 
                        Main Grid Layout for Desktop.
                        It uses a 12-column grid system.
                    */}
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8">
            {/* Left Side (Main Content): Food Menu */}
            <div className="lg:col-span-8 xl:col-span-9">
              {/* The FoodMenu component displays all categories and meals */}
              <FoodMenu />
            </div>

            {/* Right Side (Sidebar): Cart Summary */}
            {/* This div is hidden on mobile and appears as a column on large screens */}
            <div className="hidden lg:block lg:col-span-4 xl:col-span-3">
              {/* The 'sticky' class keeps the cart in view while scrolling the menu */}
              <div className="sticky top-4 h-[calc(100vh-2rem)]">
                <CartSummary onCheckout={() => setIsCheckoutOpen(true)} />
              </div>
            </div>
          </div>
        </div>

        {/* 
                    Mobile-only Floating Cart Button & Sheet.
                    This entire section is hidden on large screens (`lg:hidden`).
                */}
        <div className="lg:hidden fixed bottom-4 right-4 z-50">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="lg"
                style={{
                  backgroundColor: "#FF1493",
                  color: "white",
                  transition: "colors 0.2s ease",
                  borderRadius: "9999px",
                  height: "4rem",
                  width: "4rem",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#C71585"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#FF1493"}
              >
                <ShoppingCart className="h-8 w-8 text-white" />
                {totalItems > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center text-xs"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              className="w-[90vw] max-w-sm p-0 flex flex-col"
              side="right"
            >
              {/* The CartSummary component is reused inside the mobile sheet */}
              <CartSummary onCheckout={() => setIsCheckoutOpen(true)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* 
                Checkout Dialog (Modal).
                This is rendered outside the main layout div to ensure it appears above all other content.
                Its visibility is controlled by the `isCheckoutOpen` state.
            */}
      <CheckoutDialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen} />
    </>
  );
};

export default OnlineOrderPage;
