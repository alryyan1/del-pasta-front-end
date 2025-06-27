// src/components/admin/JuiceRuleFormDialog.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { BuffetJuiceRule, BuffetPersonOption } from '@/Types/buffet-types';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from 'lucide-react';

const juiceRuleSchema = z.object({
  description_ar: z.string().min(5, { message: "Arabic description is required." }),
  description_en: z.string().optional(),
});

type JuiceRuleFormValues = z.infer<typeof juiceRuleSchema>;

interface JuiceRuleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: JuiceRuleFormValues, personOptionId: number) => void;
  personOption?: BuffetPersonOption | null;
  isLoading: boolean;
}

export const JuiceRuleFormDialog: React.FC<JuiceRuleFormDialogProps> = ({ open, onOpenChange, onSave, personOption, isLoading }) => {
  const form = useForm<JuiceRuleFormValues>({
    resolver: zodResolver(juiceRuleSchema),
  });

  React.useEffect(() => {
    if (personOption) {
      form.reset({
        description_ar: personOption.juiceRule?.description_ar || '',
        description_en: personOption.juiceRule?.description_en || '',
      });
    }
  }, [personOption, open, form]);

  const handleSubmit = (data: JuiceRuleFormValues) => {
    if (personOption) {
      onSave(data, personOption.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Juice Rule</DialogTitle>
          <DialogDescription>
            Update the juice description for the tier: <span className="font-semibold">{personOption?.label_ar}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="description_ar">Arabic Description</Label>
            <Textarea id="description_ar" {...form.register('description_ar')} />
            {form.formState.errors.description_ar && <p className="text-sm text-red-500">{form.formState.errors.description_ar.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description_en">English Description</Label>
            <Textarea id="description_en" {...form.register('description_en')} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Rule
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};