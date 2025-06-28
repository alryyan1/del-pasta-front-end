// src/pages/MealItem.tsx
import React from "react";
import axiosClient from "@/helpers/axios-client";
import { Meal, Order, Mealorder } from "@/Types/types";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

// Shadcn UI & Assets
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { webUrl } from "@/helpers/constants";
import ph from "./../assets/logo.png"; // Placeholder logo
import { cn } from "@/lib/utils"; // For conditional class names

// Icons
import { Plus, Check, ShoppingCart, Star } from "lucide-react";

interface MealItemProps {
  meal: Meal;
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order) => void;
  isMealInOrder: boolean;
  onMealSelect: (mealOrder: Mealorder) => void;
}

const MealItem: React.FC<MealItemProps> = ({
  meal,
  selectedOrder,
  setSelectedOrder,
  isMealInOrder,
  onMealSelect,
}) => {
  const { t } = useTranslation("menu");

  const handleMealClick = () => {
    if (!selectedOrder) {
      toast.error(
        t("error.noOrderSelected", "Please create or select an order first.")
      );
      return;
    }

    const existingMealOrder = selectedOrder.meal_orders.find(
      (mo) => mo.meal_id === meal.id
    );
    if (existingMealOrder) {
      onMealSelect(existingMealOrder); // If it's already in the cart, just open the details dialog
      return;
    }

    // If not in the cart, add it
    axiosClient
      .post("orderMeals", {
        order_id: selectedOrder.id,
        meal_id: meal.id,
        quantity: 1, // Default quantity
        price: meal.price,
      })
      .then(({ data }) => {
        if (data.status) {
          setSelectedOrder(data.order);
          onMealSelect(data.mealOrder); // Pass the newly created mealOrder to the parent
          toast.success(
            `"${meal.name}" ${t("success.addedToOrder", "added to order.")}`
          );
        } else {
          toast.error(
            data.message || t("error.addFailed", "Failed to add meal.")
          );
        }
      })
      .catch(() =>
        toast.error(
          t("error.addFailed", "An error occurred while adding the meal.")
        )
      );
  };

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 cursor-pointer group relative",
        "hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800",
        isMealInOrder && "ring-2 ring-blue-500 dark:ring-blue-400 shadow-lg scale-[1.02]"
      )}
      onClick={handleMealClick}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <AspectRatio ratio={4 / 3} className="bg-slate-100 dark:bg-slate-800">
          <img
            src={meal.image_url ? `${webUrl}/images/${meal.image_url}` : ph}
            alt={meal.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </AspectRatio>

        {/* Status Badge */}
        {isMealInOrder && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
              <Check className="h-3 w-3 mr-1" />
              {t("inCart", "In Cart")}
            </Badge>
          </div>
        )}

        {/* Action Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="lg"
            className={cn(
              "shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300",
              isMealInOrder 
                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                : "bg-white hover:bg-slate-50 text-slate-900 border border-slate-200"
            )}
          >
            {isMealInOrder ? (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                {t("viewInCart", "View in Cart")}
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                {t("addToOrder", "Add to Order")}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 bg-white dark:bg-slate-900">
        <div className="space-y-2">
          {/* Meal Name */}
          <h3 className={cn(
            "font-semibold text-sm leading-tight transition-colors duration-200",
            isMealInOrder 
              ? "text-blue-700 dark:text-blue-300" 
              : "text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
          )}>
            {meal.name}
          </h3>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {Number(meal.price).toFixed(3)}
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                {t("currency", "OMR")}
              </span>
            </div>

            {/* Add indicator for items with extras/services */}
            {meal.child_meals && meal.child_meals.length > 0 && (
              <Badge variant="outline" className="text-xs">
                <Star className="h-3 w-3 mr-1" />
                {t("hasExtras", "Extras")}
              </Badge>
            )}
          </div>

          {/* Quick Add Button (Mobile friendly) */}
          <div className="lg:hidden">
            <Button
              size="sm"
              className={cn(
                "w-full transition-colors duration-200",
                isMealInOrder 
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : "bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100"
              )}
            >
              {isMealInOrder ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {t("inCart", "In Cart")}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("addToOrder", "Add")}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MealItem;
