// src/components/admin/BuffetPackageFormDialog.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { BuffetPackage } from '@/Types/buffet-types';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const packageSchema = z.object({
  name_ar: z.string().min(3, { message: "Arabic name is required." }),
  name_en: z.string().optional(),
  description_ar: z.string().optional(),
  is_active: z.boolean().default(true),
});

type PackageFormValues = z.infer<typeof packageSchema>;

interface BuffetPackageFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: PackageFormValues, packageId?: number) => void;
  initialData?: BuffetPackage | null;
  isLoading: boolean;
}

export const BuffetPackageFormDialog: React.FC<BuffetPackageFormDialogProps> = ({ open, onOpenChange, onSave, initialData, isLoading }) => {
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
    form.reset(initialData || { name_ar: '', name_en: '', description_ar: '', is_active: true });
  }, [initialData, form]);

  const handleSubmit = (data: PackageFormValues) => {
    onSave(data, initialData?.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Package' : 'Create New Package'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Update the details for this buffet package.' : 'Fill out the details for the new buffet package.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name_ar">Arabic Name</Label>
            <Input id="name_ar" {...form.register('name_ar')} />
            {form.formState.errors.name_ar && <p className="text-sm text-red-500">{form.formState.errors.name_ar.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="name_en">English Name</Label>
            <Input id="name_en" {...form.register('name_en')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description_ar">Arabic Description</Label>
            <Textarea id="description_ar" {...form.register('description_ar')} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="is_active" checked={form.watch('is_active')} onCheckedChange={(checked) => form.setValue('is_active', checked)} />
            <Label htmlFor="is_active">Active</Label>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Package'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};