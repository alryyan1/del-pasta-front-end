// src/components/admin/BuffetOrderDetailsDialog.tsx

import React from 'react';
import { BuffetOrder } from '@/Types/buffet-types';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface BuffetOrderDetailsDialogProps {
  order: BuffetOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BuffetOrderDetailsDialog: React.FC<BuffetOrderDetailsDialogProps> = ({ order, open, onOpenChange }) => {
  const { t } = useTranslation(['admin', 'common']);

  if (!order) return null;

  // Group selections by step for organized display
  const selectionsByStep = order.selections?.reduce((acc, selection) => {
    const stepTitle = selection.buffetStep?.title_ar || 'Unknown Step';
    if (!acc[stepTitle]) {
      acc[stepTitle] = [];
    }
    acc[stepTitle].push(selection.meal.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('buffetOrders.detailsTitle', 'Buffet Order Details')} #{order.order_number}</DialogTitle>
          <DialogDescription>
            {t('common:package')}: <span className="font-semibold">{order.buffetPackage.name_ar}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div><strong>{t('common:customer')}:</strong> {order.customer.name}</div>
            <div><strong>{t('common:phone')}:</strong> {order.customer.phone}</div>
            <div><strong>{t('common:deliveryDate')}:</strong> {dayjs(order.delivery_date).format('DD MMM, YYYY')}</div>
            <div><strong>{t('common:deliveryTime')}:</strong> {dayjs(`1970-01-01 ${order.delivery_time}`).format('h:mm A')}</div>
            <div><strong>{t('common:price')}:</strong> <span className="font-bold text-brand-pink-DEFAULT">{Number(order.base_price).toFixed(3)} OMR</span></div>
            <div><strong>{t('common:status')}:</strong> <Badge>{order.status}</Badge></div>
          </div>

          {order.notes && (
            <div>
              <strong>{t('common:notes')}:</strong>
              <p className="p-2 bg-slate-50 rounded-md border text-muted-foreground">{order.notes}</p>
            </div>
          )}

          <Separator />

          <div>
            <h4 className="font-semibold mb-2">{t('common:selections')}</h4>
            <div className="space-y-3">
              {selectionsByStep && Object.entries(selectionsByStep).map(([stepTitle, meals]) => (
                <div key={stepTitle}>
                  <p className="font-semibold text-muted-foreground">{stepTitle}:</p>
                  <ul className="list-disc list-inside ps-4">
                    {meals.map((mealName, index) => (
                      <li key={index}>{mealName}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">{t('common:close')}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};