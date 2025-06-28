// src/pages/MealItem.tsx (or components folder)
import React from "react";
import axiosClient from "@/helpers/axios-client";
import { Meal, Order, Mealorder } from "@/Types/types";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

// Shadcn UI & Assets
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { webUrl } from "@/helpers/constants";
import ph from "./../assets/logo.png"; // Placeholder logo
import { cn } from "@/lib/utils"; // For conditional class names

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
      onClick={handleMealClick}
      className={cn(
        "overflow-hidden transition-all cursor-pointer group hover:shadow-lg hover:scale-105",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", // Accessibility
        isMealInOrder &&
          "ring-2 ring-brand-pink-DEFAULT dark:ring-brand-pink-dark" // Visual feedback
      )}
    >
      <AspectRatio ratio={4 / 3}>
        <img
          src={meal.image_url ? `${webUrl}/images/${meal.image_url}` : ph}
          alt={meal.name}
          className="object-cover w-full h-full transition-transform group-hover:scale-110"
          loading="lazy"
        />
      </AspectRatio>
      <div className="p-3">
        <h3 className="font-semibold text-sm truncate group-hover:text-brand-pink-dark dark:group-hover:text-brand-pink-light">
          {meal.name}
        </h3>
        <p className="text-xs font-bold text-muted-foreground mt-1">
          {Number(meal.price).toFixed(3)} {t("currency", "OMR")}
        </p>
      </div>
    </Card>
  );
};

export default MealItem;
