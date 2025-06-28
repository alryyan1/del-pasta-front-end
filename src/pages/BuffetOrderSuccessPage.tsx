// src/pages/BuffetOrderSuccessPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axiosClient from '@/helpers/axios-client';
import { BuffetOrder } from '@/Types/buffet-types'; // Make sure BuffetOrder is exported from your types
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, PartyPopper } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import dayjs from 'dayjs';

const OrderDetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between items-start py-2">
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <p className="text-sm text-right font-medium">{value}</p>
    </div>
);

const BuffetOrderSuccessPage: React.FC = () => {
    const { t, i18n } = useTranslation(['buffet', 'menu']);
    const { orderId } = useParams<{ orderId: string }>();
    const [order, setOrder] = useState<BuffetOrder | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (orderId) {
            setIsLoading(true);
            axiosClient.get(`/buffet-orders/${orderId}`)
                .then(response => {
                    setOrder(response.data);
                })
                .catch(() => {
                    setError(t('error.fetchOrder', 'Could not retrieve order details.'));
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [orderId, t]);

    if (isLoading) {
        return (
            <div className="container mx-auto max-w-2xl p-4 md:p-8">
                <Card>
                    <CardHeader className="items-center text-center">
                        <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                        <Skeleton className="h-8 w-48 mt-4 mx-auto" />
                        <Skeleton className="h-4 w-64 mt-2 mx-auto" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-12 w-full mt-4" />
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    if (error || !order) {
        return (
             <div className="container mx-auto max-w-2xl p-4 md:p-8 text-center">
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive">{t('error.title', 'An Error Occurred')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{error || t('error.generic', 'Something went wrong.')}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const selectionsByStep = order.selections?.reduce((acc, sel) => {
        const stepTitle = sel.buffetStep?.title_ar || 'Unknown Step';
        if (!acc[stepTitle]) {
            acc[stepTitle] = [];
        }
        acc[stepTitle].push(sel.meal.name);
        return acc;
    }, {} as Record<string, string[]>);


    return (
        <div className="min-h-screen bg-pink-50/30 flex items-center justify-center p-4" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <Card className="w-full max-w-2xl shadow-2xl">
                <CardHeader className="text-center items-center bg-green-50 dark:bg-green-900/20 pt-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                    <CardTitle className="text-3xl font-bold mt-4 text-green-700 dark:text-green-400">{t('success.title', 'Order Placed Successfully!')}</CardTitle>
                    <CardDescription className="mt-2 text-base">
                        {t('success.description', 'Thank you! Your buffet order has been received. A confirmation has been sent via WhatsApp.')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <OrderDetailRow label={t('orderNumber', 'Order Number')} value={`#${order.order_number}`} />
                        <Separator className="my-2" />
                        <OrderDetailRow label={t('customerName', 'Customer')} value={order.customer.name} />
                        <OrderDetailRow label={t('customerPhone', 'Phone')} value={order.customer.phone} />
                         <Separator className="my-2" />
                        <OrderDetailRow label={t('deliveryDate', 'Delivery')} value={`${dayjs(order.delivery_date).format('dddd, MMMM D, YYYY')} @ ${dayjs(`1970-01-01T${order.delivery_time}`).format('h:mm A')}`} />
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold mb-3">{t('summary', 'Your Selections')}</h3>
                        {selectionsByStep && Object.entries(selectionsByStep).map(([stepTitle, meals]) => (
                            <div key={stepTitle} className="mb-3">
                                <p className="font-bold text-sm text-brand-pink-DEFAULT">{stepTitle}:</p>
                                <ul className="list-disc list-inside ps-4">
                                    {meals.map((mealName, index) => <li key={index} className="text-sm text-muted-foreground">{mealName}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="text-center pt-6">
                        <Button asChild size="lg" className="bg-brand-pink-DEFAULT hover:bg-brand-pink-dark text-white">
                            <Link to="/buffet-order">
                                <PartyPopper className="mr-2 h-5 w-5" />
                                {t('createNewOrder', 'Create Another Buffet Order')}
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default BuffetOrderSuccessPage;