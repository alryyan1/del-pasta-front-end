// src/components/MealCategoryPanel.tsx
import React, { useEffect, useState } from 'react';
import axiosClient from '@/helpers/axios-client';
import { Category, Mealorder, Order } from '@/Types/types';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

// Components
import MealItem from '@/pages/MealItem'; // Ensure the path is correct
import RequestedServiceDialog from './RequestedServiceDialog';

// Shadcn UI & Icons
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MealCategoryPanelProps {
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order) => void;
}

const MealCategoryPanel: React.FC<MealCategoryPanelProps> = ({ selectedOrder, setSelectedOrder }) => {
  const { t } = useTranslation("menu");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for the meal details/services dialog
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [activeMealOrder, setActiveMealOrder] = useState<Mealorder | null>(null);

  useEffect(() => {
    setIsLoading(true);
    axiosClient.get<Category[]>(`categories`)
      .then(({ data }) => {
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0]); // Default to the first category
        }
      })
      .catch(() => toast.error(t('error.fetchCategories', "Failed to load meal categories.")))
      .finally(() => setIsLoading(false));
  }, [t]);

  const handleMealSelect = (mealOrder: Mealorder) => {
    setActiveMealOrder(mealOrder);
    setIsDetailDialogOpen(true);
  };
  
  return (
    <>
      <Card className="h-full flex flex-col">
        {/* Category Buttons Header */}
        <CardHeader className="p-2 border-b dark:border-slate-800 flex-shrink-0">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max space-x-2 rtl:space-x-reverse p-1">
              {isLoading ? (
                // Skeleton for category buttons
                [...Array(5)].map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-md" />)
              ) : (
                categories.map((category) => (
                  <Button
                    key={category.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                        "transition-colors",
                        selectedCategory?.id === category.id 
                            ? "bg-brand-pink-DEFAULT text-white hover:bg-brand-pink-dark" 
                            : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    {category.name}
                  </Button>
                ))
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardHeader>

        {/* Meals Grid */}
        <CardContent className="flex-grow overflow-y-auto p-4">
          {isLoading ? (
            // Skeleton for meal grid
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(12)].map((_, i) => <Skeleton key={i} className="h-40 rounded-lg"/>)}
            </div>
          ) : selectedCategory && selectedCategory.meals.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedCategory.meals.map((meal) => {
                // Determine if this meal is already in the current order
                const isMealInOrder = !!selectedOrder?.meal_orders.find(mo => mo.meal_id === meal.id);
                return (
                  <MealItem
                    key={meal.id}
                    meal={meal}
                    selectedOrder={selectedOrder}
                    setSelectedOrder={setSelectedOrder}
                    isMealInOrder={isMealInOrder}
                    onMealSelect={handleMealSelect}
                  />
                );
              })}
            </div>
          ) : (
            // Empty state for when category has no meals
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">{t('noMealsInCategory', 'No meals in this category.')}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* The dialog for adding/editing services for a meal in the cart */}
      <RequestedServiceDialog
        open={isDetailDialogOpen}
        handleClose={() => setIsDetailDialogOpen(false)}
        mealOrder={activeMealOrder}
        setSelectedOrder={setSelectedOrder}
      />
    </>
  );
};

export default MealCategoryPanel;