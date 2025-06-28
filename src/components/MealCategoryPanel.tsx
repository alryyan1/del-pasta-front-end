// src/components/MealCategoryPanel.tsx
import React, { useEffect, useState } from 'react';
import axiosClient from '@/helpers/axios-client';
import { Category, Mealorder, Order } from '@/Types/types';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

// Components
import MealItem from '@/pages/MealItem';
import RequestedServiceDialog from './RequestedServiceDialog';

// Shadcn UI & Icons
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Grid3X3, ChefHat } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState("");
  
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

  // Filter meals based on search query
  const filteredMeals = selectedCategory?.meals.filter(meal =>
    meal.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <>
      <div className="h-full flex flex-col bg-white dark:bg-slate-950">
        {/* Header with Categories and Search */}
        <div className="border-b bg-slate-50 dark:bg-slate-900/50 flex-shrink-0">
          {/* Category Tabs */}
          <div className="p-4 pb-2">
            <div className="flex items-center gap-2 mb-3">
              <ChefHat className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                {t("menuCategories", "Menu Categories")}
              </h2>
            </div>
            <ScrollArea className="w-full">
              <div className="flex gap-2 pb-2">
                {isLoading ? (
                  // Skeleton for category buttons
                  [...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-28 rounded-lg flex-shrink-0" />)
                ) : (
                  categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory?.id === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "transition-all duration-200 flex-shrink-0 relative",
                        selectedCategory?.id === category.id 
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md" 
                          : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      )}
                    >
                      {category.name}
                      {category.meals.length > 0 && (
                        <Badge 
                          variant="secondary" 
                          className="ml-2 h-5 w-5 p-0 text-xs bg-slate-200 dark:bg-slate-700"
                        >
                          {category.meals.length}
                        </Badge>
                      )}
                    </Button>
                  ))
                )}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {/* Search Bar */}
          <div className="px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={t("searchMeals", "Search meals...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Meals Grid */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4">
              {isLoading ? (
                // Skeleton for meal grid
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {[...Array(15)].map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="aspect-square w-full" />
                      <div className="p-3 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : selectedCategory && filteredMeals.length > 0 ? (
                <>
                  {/* Category Info */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                          {selectedCategory.name}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {filteredMeals.length} {t("items", "items")}
                          {searchQuery && ` • ${t("searchResults", "Search results")}`}
                        </p>
                      </div>
                      <Grid3X3 className="h-5 w-5 text-slate-400" />
                    </div>
                  </div>

                  {/* Meals Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredMeals.map((meal) => {
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
                </>
              ) : (
                // Empty state
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  {searchQuery ? (
                    <>
                      <Search className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        {t("noSearchResults", "No meals found")}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 mb-4">
                        {t("tryDifferentSearch", `No meals match "${searchQuery}". Try a different search term.`)}
                      </p>
                      <Button variant="outline" onClick={() => setSearchQuery("")}>
                        {t("clearSearch", "Clear search")}
                      </Button>
                    </>
                  ) : selectedCategory ? (
                    <>
                      <ChefHat className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        {t("noCategoryMeals", "No meals in this category")}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400">
                        {t("noCategoryMealsDesc", `"${selectedCategory.name}" doesn't have any meals yet.`)}
                      </p>
                    </>
                  ) : (
                    <>
                      <Grid3X3 className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        {t("noCategories", "No categories available")}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400">
                        {t("noCategoriesDesc", "Menu categories will appear here once they're added.")}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

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