// src/components/forms/meal.tsx
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useMealsStore } from "@/stores/MealsStore";
import { useCategoryStore } from "@/stores/CategoryStore";
import { Meal } from "@/Types/types";

// Shadcn UI & Icons
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const mealSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  price: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().min(0, { message: "Price must be 0 or greater." })
  ),
  category_id: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number({ required_error: "Category is required." })
  ),
  description: z.string().optional(),
});

type MealFormValues = z.infer<typeof mealSchema>;

interface ProductFormProps {
  handleClose: () => void;
  initialData?: Meal | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ handleClose, initialData }) => {
  const { t } = useTranslation('meals');
  const { categories, fetchCategories } = useCategoryStore();
  const { addMeal, updateMeal, isLoading } = useMealsStore();

  const form = useForm<MealFormValues>({
    resolver: zodResolver(mealSchema),
  });

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length, fetchCategories]);

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        price: initialData.price,
        category_id: initialData.category_id,
        description: initialData.description || '',
      });
    } else {
      form.reset({ name: '', price: 0, description: '' });
    }
  }, [initialData, form]);

  const onSubmit = async (data: MealFormValues) => {
    const success = initialData 
      ? await updateMeal(initialData.id, data)
      : await addMeal(data);
    
    if (success) {
      handleClose();
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t('form.name', 'Meal Name')}</Label>
        <Input id="name" {...form.register('name')} />
        {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">{t('form.price', 'Price')}</Label>
          <Input id="price" type="number" step="0.001" {...form.register('price')} />
          {form.formState.errors.price && <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>{t('form.category', 'Category')}</Label>
          <Controller
            name="category_id"
            control={form.control}
            render={({ field }) => (
              <Select value={field.value?.toString()} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue placeholder={t('form.selectCategory', 'Select a category...')} /></SelectTrigger>
                <SelectContent>
                  {categories.map(cat => <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />
          {form.formState.errors.category_id && <p className="text-sm text-destructive">{form.formState.errors.category_id.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t('form.description', 'Description')}</Label>
        <Textarea id="description" {...form.register('description')} />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? t('common:update', 'Update') : t('common:create', 'Create')}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;