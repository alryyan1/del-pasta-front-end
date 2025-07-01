// src/components/admin/PersonOptionFormDialog.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { BuffetPersonOption } from '@/Types/buffet-types';
import { useTranslation } from 'react-i18next';

import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from 'lucide-react';

// Define the form schema with Zod
const personOptionSchema = z.object({
  label_ar: z.string().min(1, 'Arabic label is required'),
  label_en: z.string().optional(),
  price: z.number().min(0, 'Price must be 0 or greater'),
  is_active: z.boolean().default(true),
});

type PersonOptionFormData = z.infer<typeof personOptionSchema>;

interface PersonOptionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: PersonOptionFormData, optionId?: number) => void;
  initialData?: BuffetPersonOption | null;
  isLoading: boolean;
}

export const PersonOptionFormDialog: React.FC<PersonOptionFormDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSave, 
  initialData, 
  isLoading 
}) => {
  const { t } = useTranslation(['admin', 'common']);

  const form = useForm<PersonOptionFormData>({
    resolver: zodResolver(personOptionSchema),
    defaultValues: {
      label_ar: '',
      label_en: '',
      price: 0,
      is_active: true,
    },
  });

  // This effect synchronizes the form's state with the `initialData` prop.
  // It runs whenever the dialog is opened or the data to be edited changes.
  React.useEffect(() => {
    if (open) {
      if (initialData) {
        // If we are editing, populate the form with existing data
        form.reset({
          label_ar: initialData.label_ar || '',
          label_en: initialData.label_en || '',
          price: initialData.price || 0,
          is_active: initialData.is_active ?? true,
        });
      } else {
        // If we are creating, reset to default empty values
        form.reset({
          label_ar: '',
          label_en: '',
          price: 0,
          is_active: true,
        });
      }
    }
  }, [initialData, open]);

  // This function is called by react-hook-form's handleSubmit
  // It passes the validated data to the parent component's onSave function
  const processSubmit = (data: PersonOptionFormData) => {
    console.log('Form submitted with data:', data); // Debug log
    onSave(data, initialData?.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? t('pricingTiers.editTitle') : t('pricingTiers.createTitle')}</DialogTitle>
          <DialogDescription>
            {initialData ? t('pricingTiers.editDescription') : t('pricingTiers.createDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(processSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="label_ar">{t('common:arabicLabel')} (e.g., ١٠ - ١٢ شخص)</Label>
            <Controller
              name="label_ar"
              control={form.control}
              render={({ field }) => (
                <Input 
                  id="label_ar"
                  {...field}
                  disabled={isLoading}
                  placeholder="Arabic label"
                />
              )}
            />
            {form.formState.errors.label_ar && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.label_ar.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="label_en">{t('common:englishLabel')} (e.g., 10 - 12 Persons)</Label>
            <Controller
              name="label_en"
              control={form.control}
              render={({ field }) => (
                <Input 
                  id="label_en"
                  {...field}
                  disabled={isLoading}
                  placeholder="English label"
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">{t('common:price')} (OMR)</Label>
            <Controller
              name="price"
              control={form.control}
              render={({ field }) => (
                <Input 
                  id="price"
                  type="number"
                  step="0.001"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  disabled={isLoading}
                  placeholder="0.000"
                />
              )}
            />
            {form.formState.errors.price && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.price.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Controller
              name="is_active"
              control={form.control}
              render={({ field }) => (
                <Switch 
                  id="is_active"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              )}
            />
            <Label htmlFor="is_active">{t('common:active')}</Label>
          </div>

          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isLoading}>{t('common:cancel')}</Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('common:save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};