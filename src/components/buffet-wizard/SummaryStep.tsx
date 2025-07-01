// src/components/buffet-wizard/SummaryStep.tsx

import React from 'react';
import { useBuffetStore } from '@/stores/useBuffetStore';
import { useTranslation } from 'react-i18next';

// Shadcn UI & Icons
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Truck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface SummaryStepProps {
    isSubmitting: boolean;
    handleSubmitOrder: () => void;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({ isSubmitting, handleSubmitOrder }) => {
    const { t } = useTranslation(['buffet', 'menu']);
    const {
        customer, setCustomer,
        deliveryDate, setDeliveryDate,
        deliveryTime, setDeliveryTime,
        notes, setNotes,
        selectedPersonOption
    } = useBuffetStore();

    const handleCustomerChange = (field: 'name' | 'phone' | 'address', value: string) => {
        setCustomer({
            id: customer?.id || '',
            name: customer?.name || '',
            phone: customer?.phone || '',
            address: customer?.address || '',
            ...customer,
            [field]: value
        });
    };

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">{t('stepSummary.title', "Final Details & Confirmation")}</h2>
            <div className="space-y-6 max-w-lg mx-auto">
                
                {/* --- Customer Input Fields --- */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="customerName">{t('customerName', 'Customer Name')}</Label>
                        <Input id="customerName" placeholder={t('customerNamePlaceholder', 'Enter customer name')} value={customer?.name || ''} onChange={(e) => handleCustomerChange('name', e.target.value)} disabled={isSubmitting} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="customerPhone">{t('customerPhone', 'Customer Phone Number')}</Label>
                        <Input id="customerPhone" type="tel" placeholder={t('customerPhonePlaceholder', 'Enter phone number')} value={customer?.phone || ''} onChange={(e) => handleCustomerChange('phone', e.target.value)} disabled={isSubmitting} />
                    </div>
                    {/* New Address Field */}
                    <div className="space-y-1">
                        <Label htmlFor="customerAddress">{t('customerAddress', 'Delivery Address')}</Label>
                        <Textarea id="customerAddress" placeholder={t('customerAddressPlaceholder', 'Enter full address...')} value={customer?.address || ''} onChange={(e) => handleCustomerChange('address', e.target.value)} disabled={isSubmitting} />
                    </div>
                </div>
                
                {/* --- Delivery Info --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="deliveryDate">{t('deliveryDate', 'Delivery Date')}</Label>
                        <Input id="deliveryDate" type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} disabled={isSubmitting} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="deliveryTime">{t('deliveryTime', 'Delivery Time')}</Label>
                        <Input id="deliveryTime" type="time" value={deliveryTime} onChange={e => setDeliveryTime(e.target.value)} disabled={isSubmitting} />
                    </div>
                </div>

                {/* --- Notes --- */}
                <div className="space-y-1">
                    <Label htmlFor="notes">{t('notes', 'Additional Notes')}</Label>
                    <Textarea id="notes" placeholder={t('notesPlaceholder', 'Any special requests?')} value={notes} onChange={e => setNotes(e.target.value)} disabled={isSubmitting} />
                </div>
                
                <Separator />
                
                {/* --- Delivery Fees Alert --- */}
                <Alert variant="default" className="bg-pink-50 border-pink-200 dark:bg-slate-800 dark:border-slate-700">
                    <Truck className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                    <AlertTitle className="font-semibold text-pink-800 dark:text-pink-300">{t('delivery.title', 'Delivery Fees Notice')}</AlertTitle>
                    <AlertDescription className="text-xs space-y-2 text-slate-700 dark:text-slate-400">
                        <p><strong>{t('delivery.free', 'Free Delivery')}:</strong> {t('delivery.freeAreas', 'Sohar & Saham')}</p>
                        <p><strong>+10 </strong> {t('delivery.tier1Areas', '(Liwa, Shinas, Al Khaburah, As Suwayq, Al-Musannah)')}</p>
                        <p><strong>+15 </strong> {t('delivery.tier2Areas', 'Other areas, or as agreed upon')}</p>
                    </AlertDescription>
                </Alert>

                {/* --- Total Price & Submit Button --- */}
                <div className="pt-4 border-t space-y-4">
                    <div className="text-2xl font-bold text-right">
                        {t('totalPrice', 'Total Price')}:
                        <span className="text-brand-pink-DEFAULT ms-2">
                            {selectedPersonOption?.price ? Number(selectedPersonOption.price).toFixed(3) : "0.000"} 
                        </span>
                        <span className="text-sm font-normal text-muted-foreground block">{t('priceNote', ' (Excluding Delivery Fee)')}</span>
                    </div>

                    <Button onClick={handleSubmitOrder} disabled={isSubmitting} className="w-full  text-lg py-6">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('confirmAndSend', "Confirm & Send to WhatsApp")}
                    </Button>
                </div>
            </div>
        </div>
    );
};