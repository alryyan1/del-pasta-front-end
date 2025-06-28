// src/components/admin/BuffetStepFormDialog.tsx

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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

// Zod schema for robust form validation
const stepSchema = z
  .object({
    step_number: z.preprocess(
      (val) => parseInt(String(val || "1"), 10),
      z.number().min(1, "Step number must be at least 1.")
    ),
    title_ar: z.string().min(3, { message: "Arabic title is required." }),
    title_en: z.string().optional(),
    instructions_ar: z.string().optional(),
    category_id: z.preprocess(
      (val) => parseInt(String(val), 10),
      z.number({ required_error: "Please select a category." })
    ),
    min_selections: z.preprocess(
      (val) => parseInt(String(val || "0"), 10),
      z.number().min(0, "Min selections cannot be negative.")
    ),
    max_selections: z.preprocess(
      (val) => parseInt(String(val || "1"), 10),
      z.number().min(1, "Max selections must be at least 1.")
    ),
    is_active: z.boolean().default(true),
  })
  .refine((data) => data.min_selections <= data.max_selections, {
    message: "Min selections cannot be greater than max selections.",
    path: ["min_selections"],
  });

type StepFormValues = z.infer<typeof stepSchema>;

interface BuffetStepFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: StepFormValues, stepId?: number) => void;
  initialData?: BuffetStep | null;
  isLoading: boolean;
}

export const BuffetStepFormDialog: React.FC<BuffetStepFormDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  initialData,
  isLoading,
}) => {
  const { t } = useTranslation(["admin", "common"]);
  const [categories, setCategories] = useState<SimpleCategory[]>([]);

  const form = useForm<StepFormValues>({
    resolver: zodResolver(stepSchema),
    defaultValues: {
      is_active: true,
      min_selections: 1,
      max_selections: 1,
      step_number: 1,
      title_ar: "",
      title_en: "",
      instructions_ar: "",
    },
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
          toast.error(
            t("error.fetchCategories", "Could not load meal categories.")
          )
        );
    }
  }, [open, categories.length, t]);

  // Reset form values when dialog opens or the data to edit changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        // We're editing: prepare the data for form reset
        const formData: StepFormValues = {
          step_number: initialData.step_number,
          title_ar: initialData.title_ar,
          title_en: initialData.title_en || "",
          instructions_ar: initialData.instructions_ar || "",
          category_id: initialData.category_id || initialData.category?.id || 0,
          min_selections: initialData.min_selections,
          max_selections: initialData.max_selections,
          is_active: initialData.is_active,
        };
        form.reset(formData);
      } else {
        // We're creating: reset to default values
        form.reset({
          step_number: 1,
          title_ar: "",
          title_en: "",
          instructions_ar: "",
          is_active: true,
          min_selections: 1,
          max_selections: 1,
        });
      }
    }
  }, [initialData, open, form]);

  // Form submission handler
  const handleSubmit = (data: StepFormValues) => {
    console.log("Form data being submitted:", data); // Debug log
    onSave(data, initialData?.id);
  };

  // Debug form errors
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      console.log("Form validation errors:", form.formState.errors);
    }
  }, [form.formState.errors]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? t("buffetSteps.editTitle", "Edit Step")
              : t("buffetSteps.createTitle", "Create New Step")}
          </DialogTitle>
          <DialogDescription>
            {t("buffetSteps.description", "Define a choice for the customer to make during buffet selection.")}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 pt-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="step_number">
                {t("buffetSteps.stepNumber", "Step Number")}
              </Label>
              <Input
                id="step_number"
                type="number"
                {...form.register("step_number")}
                disabled={isLoading}
              />
              {form.formState.errors.step_number && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.step_number.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category_id">
                {t("buffetSteps.mealCategory", "Meal Category")}
              </Label>
              <Controller
                name="category_id"
                control={form.control}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString()}
                    onValueChange={field.onChange}
                    disabled={isLoading || categories.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("buffetSteps.selectCategory", "Select a category...")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.category_id && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.category_id.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title_ar">{t("common:arabicTitle", "Arabic Title")}</Label>
            <Input
              id="title_ar"
              {...form.register("title_ar")}
              disabled={isLoading}
            />
            {form.formState.errors.title_ar && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.title_ar.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions_ar">
              {t("buffetSteps.arabicInstructions", "Arabic Instructions")}
            </Label>
            <Textarea
              id="instructions_ar"
              placeholder={t("buffetSteps.instructionsPlaceholder", "Enter instructions for this step...")}
              {...form.register("instructions_ar")}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min_selections">
                {t("buffetSteps.minSelections", "Min Selections")}
              </Label>
              <Input
                id="min_selections"
                type="number"
                {...form.register("min_selections")}
                disabled={isLoading}
              />
              {form.formState.errors.min_selections && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.min_selections.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_selections">
                {t("buffetSteps.maxSelections", "Max Selections")}
              </Label>
              <Input
                id="max_selections"
                type="number"
                {...form.register("max_selections")}
                disabled={isLoading}
              />
              {form.formState.errors.max_selections && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.max_selections.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="is_active"
              checked={form.watch("is_active")}
              onCheckedChange={(checked) => form.setValue("is_active", checked)}
              disabled={isLoading}
            />
            <Label htmlFor="is_active">{t("common:activeStep", "Active Step")}</Label>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading}>
                {t("common:cancel", "Cancel")}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("common:save", "Save Step")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
