// src/components/admin/BuffetPackageFormDialog.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
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

const createPackageSchema = (t: any) => z.object({
  name_ar: z.string().min(3, { message: t('packageForm.arabicNameRequired') }),
  name_en: z.string().optional(),
  description_ar: z.string().optional(),
  is_active: z.boolean().default(true),
});

interface BuffetPackageFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any, packageId?: number) => void;
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
  }, [initialData]);

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
            <Input id="name_ar" {...form.register('name_ar')} />
            {form.formState.errors.name_ar && <p className="text-sm text-red-500">{form.formState.errors.name_ar.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="name_en">{t('packageForm.englishName')}</Label>
            <Input id="name_en" {...form.register('name_en')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description_ar">{t('packageForm.arabicDescription')}</Label>
            <Textarea id="description_ar" {...form.register('description_ar')} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="is_active" checked={form.watch('is_active')} onCheckedChange={(checked) => form.setValue('is_active', checked)} />
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