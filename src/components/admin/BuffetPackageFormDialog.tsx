// src/components/admin/BuffetPackageFormDialog.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { BuffetPackage } from '@/Types/buffet-types';
import { useTranslation } from 'react-i18next';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const createPackageSchema = (t: (key: string) => string) => z.object({
  name_ar: z.string().min(3, { message: t('packageForm.arabicNameRequired') }),
  name_en: z.string().optional(),
  description_ar: z.string().optional(),
  is_active: z.boolean().default(true),
});

type PackageFormValues = {
  name_ar: string;
  name_en?: string;
  description_ar?: string;
  is_active: boolean;
};

interface BuffetPackageFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: PackageFormValues, packageId?: number) => void;
  initialData?: BuffetPackage | null;
  isLoading: boolean;
}

export const BuffetPackageFormDialog: React.FC<BuffetPackageFormDialogProps> = ({ open, onOpenChange, onSave, initialData, isLoading }) => {
  const { t } = useTranslation('buffet');
  const packageSchema = createPackageSchema(t);
  type PackageFormValues = z.infer<typeof packageSchema>;
  
  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name_ar: initialData?.name_ar || '',
      name_en: initialData?.name_en || '',
      description_ar: initialData?.description_ar || '',
      is_active: initialData ? initialData.is_active : true,
    },
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset({
        name_ar: initialData.name_ar,
        name_en: initialData.name_en || '',
        description_ar: initialData.description_ar || '',
        is_active: initialData.is_active,
      });
    } else {
      form.reset({ name_ar: '', name_en: '', description_ar: '', is_active: true });
    }
  }, [initialData, form]);

  const handleSubmit = (data: PackageFormValues) => {
    onSave(data, initialData?.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? t('packageForm.editTitle') : t('packageForm.createTitle')}</DialogTitle>
          <DialogDescription>
            {initialData ? t('packageForm.editDescription') : t('packageForm.createDescription')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name_ar">{t('packageForm.arabicName')}</Label>
            <Controller
              name="name_ar"
              control={form.control}
              render={({ field }) => (
                <Input
                  id="name_ar"
                  placeholder={t('packageForm.arabicNamePlaceholder')}
                  {...field}
                />
              )}
            />
            {form.formState.errors.name_ar && (
              <p className="text-sm text-red-500">{form.formState.errors.name_ar.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name_en">{t('packageForm.englishName')}</Label>
            <Controller
              name="name_en"
              control={form.control}
              render={({ field }) => (
                <Input
                  id="name_en"
                  placeholder={t('packageForm.englishNamePlaceholder')}
                  {...field}
                />
              )}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description_ar">{t('packageForm.arabicDescription')}</Label>
            <Controller
              name="description_ar"
              control={form.control}
              render={({ field }) => (
                <Textarea
                  id="description_ar"
                  placeholder={t('packageForm.descriptionPlaceholder')}
                  {...field}
                />
              )}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Controller
              name="is_active"
              control={form.control}
              render={({ field }) => (
                <Switch
                  id="is_active"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="is_active">{t('packageForm.active')}</Label>
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t('packageForm.saving') : t('packageForm.savePackage')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};