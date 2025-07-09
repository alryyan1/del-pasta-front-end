import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/useCartStore';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosClient from '@/helpers/axios-client';
import { toast } from 'sonner';

// Shadcn UI & Icons
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, ShoppingCart } from 'lucide-react';
import { Separator } from './ui/separator';

// Zod schema with conditional validation
const checkoutSchema = z.object({
  name: z.string().min(2, { message: "Name is required." }),
  phone: z.string().min(8, { message: "A valid phone number is required." }),
  order_type: z.enum(['pickup', 'delivery'], { required_error: "Please select an order type." }),
  address: z.string().optional(),
  state: z.string().optional(),
  area: z.string().optional(),
}).refine(data => {
    // If order type is delivery, state and area must not be empty
    if (data.order_type === 'delivery') {
        return !!data.state && !!data.area;
    }
    return true;
}, {
    message: "State and Area are required for delivery.",
    path: ["state"], // Show error on the 'state' field
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CheckoutDialog: React.FC<CheckoutDialogProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const { t } = useTranslation(['checkout', 'menu']);
  const { items, totalPrice, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '', phone: '', address: '',
      order_type: 'pickup', // Default to pickup
      state: '', area: ''
    },
  });

  const orderType = form.watch('order_type');

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    
    const orderPayload = {
      customer: { name: data.name, phone: data.phone, address: data.address },
      order_type: data.order_type,
      state: data.state,
      area: data.area,
      items: items.map(item => ({ id: item.id, quantity: item.quantity, price: item.price })),
    };

    try {
        const response = await axiosClient.post('/online-orders', orderPayload);
        const newOrder = response.data.order;
        toast.success(t('sent.title'));
        clearCart();
        onOpenChange(false);
        form.reset();
        navigate(`/online-order/success/${newOrder.id}`);
    } catch (error) {
        console.error('Checkout error:', error);
        toast.error(t('sent.title'));
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-2xl"><ShoppingCart className="h-6 w-6" />{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        
        {/* Make the content area scrollable */}
        <ScrollArea className="max-h-[70vh]">
            <div className="px-6 space-y-4">
                {/* Order Summary */}
                <div>
                    <h4 className="mb-2 font-semibold">{t('orderSummary')}</h4>
                    <div className="max-h-32 overflow-y-auto space-y-2 rounded-md border p-2 bg-slate-50">
                        {items.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                                <p><span className="font-medium">{item.quantity}x</span> {item.name}</p>
                                <p>{(item.price * item.quantity).toFixed(3)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                        <span>{t('total')}</span>
                        <span>{totalPrice.toFixed(3)} {t('menu:currency')}</span>
                    </div>
                </div>
                <Separator />
            </div>

            {/* Customer Form */}
            <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-6">
                <div className="space-y-2 pt-4">
                    <Label>{t('form.orderType', 'Order Type')}</Label>
                    <Controller
                        name="order_type"
                        control={form.control}
                        render={({ field }) => (
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="pickup" id="pickup" />
                                    <Label htmlFor="pickup">{t('form.pickup', 'استلام من المحل')}</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="delivery" id="delivery" />
                                    <Label htmlFor="delivery">{t('form.delivery', 'توصيل')}</Label>
                                </div>
                            </RadioGroup>
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="name">{t('form.name')}</Label>
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field }) => (
                            <Input id="name" {...field} />
                        )}
                    />
                    {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">{t('form.phone')}</Label>
                    <Controller
                        name="phone"
                        control={form.control}
                        render={({ field }) => (
                            <Input id="phone" type="tel" {...field} />
                        )}
                    />
                    {form.formState.errors.phone && <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>}
                </div>

                {/* Conditional Fields for Delivery */}
                {orderType === 'delivery' && (
                    <div className="space-y-4 p-4 border rounded-md bg-slate-50">
                        <div className="space-y-2">
                            <Label htmlFor="state">{t('form.state', 'الولاية')}</Label>
                            <Controller
                                name="state"
                                control={form.control}
                                render={({ field }) => (
                                    <Input id="state" {...field} />
                                )}
                            />
                            {form.formState.errors.state && <p className="text-sm text-destructive">{form.formState.errors.state.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="area">{t('form.area', 'المنطقة')}</Label>
                            <Controller
                                name="area"
                                control={form.control}
                                render={({ field }) => (
                                    <Input id="area" {...field} />
                                )}
                            />
                            {form.formState.errors.area && <p className="text-sm text-destructive">{form.formState.errors.area.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">{t('form.address', 'Full Address')}</Label>
                            <Controller
                                name="address"
                                control={form.control}
                                render={({ field }) => (
                                    <Textarea id="address" {...field} placeholder={t('form.addressPlaceholder')} />
                                )}
                            />
                        </div>
                    </div>
                )}
            </form>
        </ScrollArea>

        <DialogFooter className="p-6 pt-4 border-t">
            <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>{t('common:cancel')}</Button>
            </DialogClose>
            <Button type="submit" form="checkout-form" disabled={isSubmitting || items.length === 0} className=" ">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('submitAndConfirm')}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};