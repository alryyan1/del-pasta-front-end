// src/components/admin/BuffetStepFormDialog.tsx

import React, { useState, useEffect } from "react";
import { BuffetStep } from "@/Types/buffet-types";
import axiosClient from "@/helpers/axios-client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

// Simple Category interface for the form
interface SimpleCategory {
  id: number;
  name: string;
}

interface StepFormValues {
  step_number: number;
  title_ar?: string;
  title_en?: string;
  instructions_ar?: string;
  category_id: number;
  min_selections: number;
  max_selections: number;
  is_active: boolean;
}

interface BuffetStepFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: StepFormValues, stepId?: number) => void;
  initialData?: BuffetStep | null;
  isLoading: boolean;
  existingSteps?: BuffetStep[];
}

export const BuffetStepFormDialog: React.FC<BuffetStepFormDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  initialData,
  isLoading,
  existingSteps = [],
}) => {
  const { t } = useTranslation(["buffet", "admin", "common"]);
  const [categories, setCategories] = useState<SimpleCategory[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate next available step number
  const getNextStepNumber = () => {
    if (existingSteps.length === 0) return 1;
    const maxStepNumber = Math.max(...existingSteps.map(step => step.step_number));
    return maxStepNumber + 1;
  };

  // Form state
  const [formData, setFormData] = useState<StepFormValues>({
    step_number: getNextStepNumber(),
    title_ar: "",
    title_en: "",
    instructions_ar: "",
    category_id: 1,
    min_selections: 1,
    max_selections: 1,
    is_active: true,
  });

  // Fetch meal categories when the dialog is opened
  useEffect(() => {
    if (open && categories.length === 0) {
      axiosClient
        .get("/categories")
        .then((res) => {
          const simplifiedCategories = res.data.map((cat: { id: number; name: string }) => ({
            id: cat.id,
            name: cat.name,
          }));
          setCategories(simplifiedCategories);
        })
        .catch(() =>
          toast.error(t("stepForm.fetchCategoriesError"))
        );
    }
  }, [open, categories.length, t]);

  // Reset form values when dialog opens or the data to edit changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        // We're editing: populate with existing data
        setFormData({
          step_number: initialData.step_number,
          title_ar: initialData.title_ar || "",
          title_en: initialData.title_en || "",
          instructions_ar: initialData.instructions_ar || "",
          category_id: initialData.category_id || initialData.category?.id || 1,
          min_selections: initialData.min_selections,
          max_selections: initialData.max_selections,
          is_active: initialData.is_active,
        });
      } else {
        // We're creating: reset to default values with next step number
        setFormData({
          step_number: getNextStepNumber(),
          title_ar: "",
          title_en: "",
          instructions_ar: "",
          category_id: categories.length > 0 ? categories[0].id : 1,
          min_selections: 1,
          max_selections: 1,
          is_active: true,
        });
      }
      setErrors({});
    }
  }, [initialData, open, categories, existingSteps]);

  // Handle input changes
  const handleInputChange = (field: keyof StepFormValues, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  // Simple validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.step_number || formData.step_number < 1) {
      newErrors.step_number = t('stepForm.stepNumberRequired');
    }

    if (!formData.category_id || formData.category_id < 1) {
      newErrors.category_id = t('stepForm.categoryRequired');
    }

    if (formData.min_selections < 0) {
      newErrors.min_selections = t('stepForm.minSelectionsInvalid');
    }

    if (formData.max_selections < 1) {
      newErrors.max_selections = t('stepForm.maxSelectionsInvalid');
    }

    if (formData.min_selections > formData.max_selections) {
      newErrors.min_selections = t('stepForm.selectionRangeInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form data being submitted:", formData);
    
    if (!validateForm()) {
      return;
    }
    
    // Check if categories are loaded
    if (categories.length === 0) {
      toast.error(t("stepForm.fetchCategoriesError"));
      return;
    }
    
    onSave(formData, initialData?.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? t("stepForm.editTitle")
              : t("stepForm.createTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("stepForm.description")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="step_number">
                {t("stepForm.stepNumber")}
              </Label>
              <Input
                id="step_number"
                type="number"
                value={formData.step_number}
                onChange={(e) => handleInputChange('step_number', parseInt(e.target.value) || 1)}
                disabled={isLoading}
              />
              {errors.step_number && (
                <p className="text-sm font-medium text-destructive">
                  {errors.step_number}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category_id" className="flex items-center">
                {t("stepForm.mealCategory")} <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={formData.category_id ? formData.category_id.toString() : ""}
                onValueChange={(value) => handleInputChange('category_id', parseInt(value, 10))}
                disabled={isLoading || categories.length === 0}
              >
                <SelectTrigger className={errors.category_id ? "border-red-500" : ""}>
                  <SelectValue placeholder={t("stepForm.selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category_id && (
                <p className="text-sm font-medium text-destructive">
                  {errors.category_id}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title_ar">
              {t("stepForm.arabicTitle")}
            </Label>
            <Input
              id="title_ar"
              value={formData.title_ar}
              onChange={(e) => handleInputChange('title_ar', e.target.value)}
              disabled={isLoading}
              placeholder={t("stepForm.arabicTitlePlaceholder")}
            />
            {errors.title_ar && (
              <p className="text-sm font-medium text-destructive">
                {errors.title_ar}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title_en">
              {t("stepForm.englishTitle")}
            </Label>
            <Input
              id="title_en"
              value={formData.title_en}
              onChange={(e) => handleInputChange('title_en', e.target.value)}
              disabled={isLoading}
              placeholder={t("stepForm.englishTitlePlaceholder")}
            />
            {errors.title_en && (
              <p className="text-sm font-medium text-destructive">
                {errors.title_en}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions_ar">
              {t("stepForm.arabicInstructions")}
            </Label>
            <Textarea
              id="instructions_ar"
              placeholder={t("stepForm.instructionsPlaceholder")}
              value={formData.instructions_ar}
              onChange={(e) => handleInputChange('instructions_ar', e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min_selections">
                {t("stepForm.minSelections")}
              </Label>
              <Input
                id="min_selections"
                type="number"
                value={formData.min_selections}
                onChange={(e) => handleInputChange('min_selections', parseInt(e.target.value) || 0)}
                disabled={isLoading}
              />
              {errors.min_selections && (
                <p className="text-sm font-medium text-destructive">
                  {errors.min_selections}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_selections">
                {t("stepForm.maxSelections")}
              </Label>
              <Input
                id="max_selections"
                type="number"
                value={formData.max_selections}
                onChange={(e) => handleInputChange('max_selections', parseInt(e.target.value) || 1)}
                disabled={isLoading}
              />
              {errors.max_selections && (
                <p className="text-sm font-medium text-destructive">
                  {errors.max_selections}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange('is_active', checked)}
              disabled={isLoading}
            />
            <Label htmlFor="is_active">{t("stepForm.activeStep")}</Label>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading}>
                {t("stepForm.cancel")}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("stepForm.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
