// src/components/admin/OnlineOrderDetailsDialog.tsx
import React, { useState } from 'react';
import { FoodOrder } from '@/Types/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import dayjs from 'dayjs';
import axiosClient from '@/helpers/axios-client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface OnlineOrderDetailsDialogProps {
  order: FoodOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void; // Callback to refresh the list
}

const statusOptions = ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'];

export const OnlineOrderDetailsDialog: React.FC<OnlineOrderDetailsDialogProps> = ({ order, open, onOpenChange, onUpdate }) => {
  const { t } = useTranslation(['admin_orders', 'common']);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [status, setStatus] = useState('pending');
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (order) {
      setDeliveryFee(order.delivery_fee || 0);
      setStatus(order.status || 'pending');
    }
  }, [order]);

  // Reset state when dialog closes
  React.useEffect(() => {
    if (!open) {
      setDeliveryFee(0);
      setStatus('pending');
      setIsSaving(false);
    }
  }, [open]);

  const handleSaveChanges = async () => {
    if (!order || !order.id) {
      toast.error(t('orderDataNotAvailable'));
      return;
    }
    
    console.log('Saving order with ID:', order.id); // Debug log
    console.log('Complete order object:', order); // Debug log
    
    const url = `/online-orders/${order.id}`;
    console.log('PUT URL:', url); // Debug log
    
    setIsSaving(true);
    try {
      await axiosClient.put(url, {
        status: status,
        delivery_fee: deliveryFee,
      });
      toast.success(t('orderUpdatedSuccess'));
      onUpdate(); // Refresh the list in the parent component
      onOpenChange(false); // Close the dialog
    } catch (error: unknown) {
      console.error('Update error:', error);
      let errorMessage = t('orderUpdateFailed');
      if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as { response?: { data?: { message?: string } } }).response;
        errorMessage = response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (!order) return null;

  const totalPayable = Number(order.total_price) + Number(deliveryFee);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('orderDetails')} #{order.id}</DialogTitle>
          <DialogDescription>
            {t('receivedOn')} {dayjs(order.created_at).format('DD MMM YYYY, h:mm A')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Left Column: Details */}
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-slate-50">
              <h4 className="font-semibold mb-2">{t('customerDetails')}</h4>
              <p><strong>{t('name')}:</strong> {order.customer_name}</p>
              <p><strong>{t('phone')}:</strong> {order.customer_phone}</p>
              {order.customer_address && <p><strong>{t('address')}:</strong> {order.customer_address}</p>}
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t('orderItems')}</h4>
              <div className="border rounded-lg max-h-48 overflow-y-auto">
                {order.items?.map((item, index) => (
                  <div key={item.id} className={`p-3 ${index !== order.items.length - 1 ? 'border-b' : ''}`}>
                    <div className="flex justify-between items-center font-semibold">
                      <span>{item.quantity}x {item.meal.name}</span>
                      <span>{(item.price * item.quantity).toFixed(3)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Right Column: Actions & Pricing */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">{t('orderStatus')}</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status"><SelectValue placeholder={t('changeStatus')} /></SelectTrigger>
                <SelectContent>
                  {statusOptions.map(opt => <SelectItem key={opt} value={opt}>{t(`status.${opt}`)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="delivery_fee">{t('deliveryFee')}</Label>
              <Input id="delivery_fee" type="number" step="0.100" value={deliveryFee} onChange={e => setDeliveryFee(Number(e.target.value))} />
            </div>
            <Separator />
            <div className="space-y-2 text-right">
                <div className="flex justify-between text-sm"><span>{t('subtotal')}</span><span>{Number(order.total_price).toFixed(3)}</span></div>
                <div className="flex justify-between text-sm"><span>{t('deliveryFee')}</span><span>{Number(deliveryFee).toFixed(3)}</span></div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t"><span>{t('totalPayable')}</span><span>{totalPayable.toFixed(3)} OMR</span></div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t('cancel')}</Button>
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('saveChanges')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};