// src/components/admin/BuffetOrderDetailsDialog.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axiosClient from '@/helpers/axios-client';
import { BuffetOrder } from '@/Types/buffet-types';
import { toast } from 'sonner';
import dayjs from 'dayjs';

// Shadcn UI & Icons
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  User, Phone, MapPin, Calendar, Clock, Package, Users as UsersIcon, Hash, Loader2
} from 'lucide-react';

const statusVariantMap: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  pending: 'outline',
  confirmed: 'secondary',
  delivered: 'default',
  cancelled: 'destructive',
};
const statuses = ["pending", "confirmed", "delivered", "cancelled"];

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}
const InfoRow: React.FC<InfoRowProps> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start">
    <Icon className="h-4 w-4 mt-1 mr-3 text-muted-foreground flex-shrink-0" />
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  </div>
);

interface BuffetOrderDetailsDialogProps {
  orderId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void; // To refresh the main list after an update
}

export const BuffetOrderDetailsDialog: React.FC<BuffetOrderDetailsDialogProps> = ({ orderId, open, onOpenChange, onUpdate }) => {
  const { t, i18n } = useTranslation(['buffet', 'admin', 'common']);
  const [order, setOrder] = useState<BuffetOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (orderId && open) {
      setIsLoading(true);
      axiosClient.get(`/buffet-orders/${orderId}`)
        .then(res => setOrder(res.data))
        .catch(() => toast.error(t('buffet:orderDetails.fetchError')))
        .finally(() => setIsLoading(false));
    } else {
        setOrder(null); // Clear data when dialog closes
    }
  }, [orderId, open, t]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    setIsUpdating(true);
    try {
        const response = await axiosClient.put(`/buffet-orders/${order.id}`, { status: newStatus });
        setOrder(response.data); // Update local state with the returned order
        onUpdate(); // Trigger refresh of the main list
        toast.success(t('buffet:orderDetails.updateSuccess'));
    } catch {
        toast.error(t('buffet:orderDetails.updateError'));
    } finally {
        setIsUpdating(false);
    }
  };

  const selectionsByStep = order?.selections?.reduce((acc, sel) => {
    if (!sel.buffetStep) return acc;
    
    const stepTitle = i18n.language === 'ar' ? sel.buffetStep.title_ar : (sel.buffetStep.title_en || sel.buffetStep.title_ar);
    if (!acc[stepTitle]) {
        acc[stepTitle] = [];
    }
    acc[stepTitle].push(sel.meal.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        {isLoading || !order ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-4"><Skeleton className="h-40 w-full" /><Skeleton className="h-24 w-full" /></div>
                <div className="space-y-4"><Skeleton className="h-64 w-full" /></div>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader className="p-6 border-b">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <DialogTitle className="text-2xl flex items-center gap-2">
                    <Hash className="h-6 w-6" /> {order.order_number}
                  </DialogTitle>
                  <DialogDescription>
                    <Badge variant={statusVariantMap[order.status] || 'default'}>{t(`buffet:orderDetails.status.${order.status}`)}</Badge>
                  </DialogDescription>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Select value={order.status} onValueChange={handleStatusChange} disabled={isUpdating}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder={t('buffet:orderDetails.changeStatus')} />
                        </SelectTrigger>
                        <SelectContent>
                            {statuses.map(s => <SelectItem key={s} value={s}>{t(`buffet:orderDetails.status.${s}`)}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
              </div>
            </DialogHeader>

            <div className="p-6 overflow-y-auto flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: Customer and Delivery */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold">{t('buffet:orderDetails.customerDetails')}</h3>
                            <InfoRow icon={User} label={t('buffet:orderDetails.name')} value={order.customer?.name || t('buffet:orderDetails.notProvided')} />
                            <InfoRow icon={Phone} label={t('buffet:orderDetails.phone')} value={order.customer?.phone || t('buffet:orderDetails.notProvided')} />
                            <InfoRow icon={MapPin} label={t('buffet:orderDetails.address')} value={order.customer?.address || t('buffet:orderDetails.notProvided')} />
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <h3 className="font-semibold">{t('buffet:orderDetails.deliveryDetails')}</h3>
                            <InfoRow icon={Calendar} label={t('buffet:deliveryDate')} value={dayjs(order.delivery_date).format('dddd, MMMM D, YYYY')} />
                            <InfoRow icon={Clock} label={t('buffet:deliveryTime')} value={dayjs(`1970-01-01T${order.delivery_time}`).format('h:mm A')} />
                        </div>
                    </div>
                    {/* Right Column: Order Details */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold">{t('buffet:orderDetails.packageDetails')}</h3>
                            <InfoRow icon={Package} label={t('buffet:package')} value={order.buffetPackage?.name_ar || t('buffet:orderDetails.notProvided')} />
                            <InfoRow icon={UsersIcon} label={t('buffet:orderDetails.guestCount')} value={order.buffetPersonOption?.label_ar || t('buffet:orderDetails.notProvided')} />
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <h3 className="font-semibold">{t('buffet:orderDetails.selections')}</h3>
                            {selectionsByStep && Object.entries(selectionsByStep).map(([stepTitle, meals]) => (
                                <div key={stepTitle}>
                                    <p className="font-medium text-sm text-muted-foreground">{stepTitle}</p>
                                    <ul className="list-disc list-inside ps-4 text-sm mt-1">
                                        {meals.map((mealName, idx) => <li key={idx}>{mealName}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        {order.notes && <>
                            <Separator />
                            <div className="space-y-2">
                                <h3 className="font-semibold">{t('buffet:notes')}</h3>
                                <p className="text-sm p-3 bg-slate-50 rounded-md border">{order.notes}</p>
                            </div>
                        </>}
                    </div>
                </div>
            </div>
            <DialogFooter className="p-6 border-t flex-col-reverse sm:flex-row sm:justify-between items-center">
              <DialogClose asChild><Button variant="outline">{t('buffet:orderDetails.close')}</Button></DialogClose>
              <div className="text-xl font-bold">
                {t('buffet:orderDetails.total')}: <span className="text-brand-pink-DEFAULT">{Number(order.base_price).toFixed(3)} OMR</span>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};