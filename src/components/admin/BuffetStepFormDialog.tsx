// src/components/admin/BuffetStepFormDialog.tsx
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { BuffetStep, Category } from '@/Types/buffet-types';
import axiosClient from '@/helpers/axios-client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const stepSchema = z.object({
  step_number: z.preprocess(val => parseInt(z.string().parse(val), 10), z.number().min(1, "Step number must be at least 1.")),
  title_ar: z.string().min(3, { message: "Arabic title is required." }),
  title_en: z.string().optional(),
  instructions_ar: z.string().optional(),
  category_id: z.preprocess(val => parseInt(z.string().parse(val), 10), z.number({ required_error: "Please select a category." })),
  min_selections: z.preprocess(val => parseInt(z.string().parse(val), 10), z.number().min(0)),
  max_selections: z.preprocess(val => parseInt(z.string().parse(val), 10), z.number().min(1)),
  is_active: z.boolean().default(true),
});

type StepFormValues = z.infer<typeof stepSchema>;

interface BuffetStepFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: StepFormValues, stepId?: number) => void;
  initialData?: BuffetStep | null;
  isLoading: boolean;
}

export const BuffetStepFormDialog: React.FC<BuffetStepFormDialogProps> = ({ open, onOpenChange, onSave, initialData, isLoading }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const form = useForm<StepFormValues>({
    resolver: zodResolver(stepSchema),
    defaultValues: { is_active: true, min_selections: 1, max_selections: 1 },
  });

  useEffect(() => {
    // Fetch categories when the dialog is opened for the first time
    if (open && categories.length === 0) {
      axiosClient.get('/categories').then(res => {
        // We only need basic category info here, not nested meals.
        setCategories(res.data.map((cat: any) => ({id: cat.id, name: cat.name})));
      }).catch(() => toast.error("Could not load meal categories."));
    }
  }, [open, categories.length]);

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        category_id: initialData.category_id || initialData.category?.id,
      });
    } else {
      form.reset({ is_active: true, min_selections: 1, max_selections: 1, title_ar: '', title_en: '', instructions_ar: '', step_number: 1 });
    }
  }, [initialData, open, form]);

  const handleSubmit = (data: StepFormValues) => {
    if (data.min_selections > data.max_selections) {
        form.setError("min_selections", { message: "Min cannot be greater than Max."});
        return;
    }
    onSave(data, initialData?.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Step' : 'Create New Step'}</DialogTitle>
          <DialogDescription>Define a choice for the customer to make during buffet selection.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="step_number">Step Number</Label>
                <Input id="step_number" type="number" {...form.register('step_number')} />
                {form.formState.errors.step_number && <p className="text-sm text-red-500">{form.formState.errors.step_number.message}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="category_id">Meal Category</Label>
                <Controller
                  name="category_id"
                  control={form.control}
                  render={({ field }) => (
                     <Select value={field.value?.toString()} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue placeholder="Select a category..." /></SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                 {form.formState.errors.category_id && <p className="text-sm text-red-500">{form.formState.errors.category_id.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title_ar">Arabic Title</Label>
            <Input id="title_ar" {...form.register('title_ar')} />
            {form.formState.errors.title_ar && <p className="text-sm text-red-500">{form.formState.errors.title_ar.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions_ar">Arabic Instructions</Label>
            <Textarea id="instructions_ar" {...form.register('instructions_ar')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="min_selections">Min Selections</Label>
                <Input id="min_selections" type="number" {...form.register('min_selections')} />
                {form.formState.errors.min_selections && <p className="text-sm text-red-500">{form.formState.errors.min_selections.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="max_selections">Max Selections</Label>
                <Input id="max_selections" type="number" {...form.register('max_selections')} />
                {form.formState.errors.max_selections && <p className="text-sm text-red-500">{form.formState.errors.max_selections.message}</p>}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch id="is_active" checked={form.watch('is_active')} onCheckedChange={(checked) => form.setValue('is_active', checked)} />
            <Label htmlFor="is_active">Active Step</Label>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Step
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};