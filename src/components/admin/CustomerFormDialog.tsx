// src/components/admin/CustomerFormDialog.tsx

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Customer } from '@/Types/types';

// Shadcn UI & Lucide Icons
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
import { Loader2 } from 'lucide-react';

// Zod schema for form validation
const customerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(8, { message: "A valid phone number is required." }), // Common length for Omani numbers
  state: z.string().optional(),
  area: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CustomerFormValues, customerId?: string) => void;
  initialData?: Customer | null;
  isLoading: boolean;
}

export const CustomerFormDialog: React.FC<CustomerFormDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  initialData,
  isLoading,
}) => {
  const { t } = useTranslation("customers");

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      phone: '',
      state: '',
      area: '',
    },
  });

  // Effect to reset the form when the dialog opens or initialData changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          phone: initialData.phone,
          state: initialData.state || '',
          area: initialData.area || '',
        });
      } else {
        form.reset({ name: '', phone: '', state: '', area: '' });
      }
    }
  }, [initialData, open, form]);

  const handleSubmit = (data: CustomerFormValues) => {
    onSave(data, initialData?.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? t('form.editTitle', 'Edit Customer') : t('form.createTitle', 'Create New Customer')}
          </DialogTitle>
          <DialogDescription>
            {initialData ? t('form.editDescription', 'Update the customer\'s details.') : t('form.createDescription', 'Add a new customer to your records.')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('form.name', 'Name')}</Label>
            <Input 
              id="name" 
              {...form.register('name')} 
              placeholder="e.g., Ali Al-Habsi"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t('form.phone', 'Phone')}</Label>
            <Input 
              id="phone" 
              type="tel" 
              {...form.register('phone')}
              placeholder="e.g., 9xxxxxxx"
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">{t('form.state', 'State / Governorate')}</Label>
            <Input 
              id="state" 
              {...form.register('state')}
              placeholder="e.g., Muscat"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">{t('form.area', 'Area / Wilayat')}</Label>
            <Input 
              id="area" 
              {...form.register('area')}
              placeholder="e.g., Seeb"
            />
          </div>
          
          <DialogFooter className="pt-4">
            <DialogClose asChild>
                <Button type="button" variant="outline">
                    {t('common:cancel', 'Cancel')}
                </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('form.save', 'Save Customer')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};