// src/pages/Meals.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useMealsStore } from "@/stores/MealsStore";
import { useCategoryStore } from "@/stores/CategoryStore";
import { Meal } from "@/Types/types";
import { toast } from 'sonner';

// Shadcn UI & Icons
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Local Components
import { MealsTable } from "@/components/MealsTable";
import ProductForm from "@/components/forms/meal";
import MealChildrenDialog from "@/components/MealChildrenDialog";
import ImageGallery from "./gallary"; // Assuming this is your image gallery component

const Meals: React.FC = () => {
  const { t } = useTranslation("meals");
  
  const { meals, fetchMeals, deleteMeal, selectMeal, selectedMeal } = useMealsStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubItemsOpen, setIsSubItemsOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  
  const refreshData = useCallback(() => {
    setIsLoading(true);
    Promise.all([fetchMeals(), fetchCategories()]).finally(() => setIsLoading(false));
  }, [fetchMeals, fetchCategories]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);
  
  const handleCreateNew = () => {
    selectMeal(null);
    setIsFormOpen(true);
  };

  const handleEdit = (meal: Meal) => {
    selectMeal(meal);
    setIsFormOpen(true);
  };
  
  const handleManageSubItems = (meal: Meal) => {
    selectMeal(meal);
    setIsSubItemsOpen(true);
  };

  const handleImageSelect = (meal: Meal) => {
    selectMeal(meal);
    setIsGalleryOpen(true);
  };

  const handleDelete = (meal: Meal) => {
    if (!window.confirm(t('confirm.delete', { mealName: meal.name }))) return;
    deleteMeal(meal.id);
    toast.success(t('success.deleted', { mealName: meal.name }));
  };
  
  const filteredMeals = useMemo(() => {
    return meals.filter(meal => {
        const matchesCategory = selectedCategoryId === 'all' || meal.category_id?.toString() === selectedCategoryId;
        const matchesSearch = !searchTerm || meal.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });
  }, [meals, selectedCategoryId, searchTerm]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle>{t('title', 'Manage Meals')}</CardTitle>
              <CardDescription>{t('description', 'Add, edit, and organize your food items.')}</CardDescription>
            </div>
            <Button onClick={handleCreateNew}>
              <PlusCircle className="mr-2 h-4 w-4" /> {t('addNewMeal', 'Add New Meal')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder={t('searchPlaceholder', 'Search meals by name...')} className="pl-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                <SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder={t('filterByCategory', 'Filter by category...')} /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {isLoading ? (
        <div className="space-y-3"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
      ) : (
        <MealsTable 
            meals={filteredMeals} 
            onEdit={handleEdit} 
            onDelete={handleDelete}
            onManageSubItems={handleManageSubItems}
            onImageSelect={handleImageSelect}
        />
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
            <DialogHeader><DialogTitle>{selectedMeal ? t('editMeal', 'Edit Meal') : t('addNewMeal', 'Add New Meal')}</DialogTitle></DialogHeader>
            <ProductForm handleClose={() => setIsFormOpen(false)} initialData={selectedMeal} />
        </DialogContent>
      </Dialog>
      
      <MealChildrenDialog 
        open={isSubItemsOpen} 
        handleClose={() => setIsSubItemsOpen(false)} 
        handleClickOpen={() => setIsSubItemsOpen(true)}
        selectedMeal={selectedMeal} 
        setSelectedMeal={selectMeal} 
      />
      
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-4xl">
            <DialogHeader><DialogTitle>Select Image for {selectedMeal?.name}</DialogTitle></DialogHeader>
            <ImageGallery selectedMeal={selectedMeal} setShowImageGallary={setIsGalleryOpen} fetchMeals={fetchMeals} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Meals;