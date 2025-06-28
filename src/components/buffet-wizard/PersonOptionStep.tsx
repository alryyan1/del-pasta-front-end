// src/components/buffet-wizard/PersonOptionStep.tsx
import React, { useState } from 'react';
import { useBuffetStore } from '@/stores/useBuffetStore';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BuffetPersonOption } from '@/Types/buffet-types';
import axiosClient from '@/helpers/axios-client';
import { Loader2 } from 'lucide-react';

export const PersonOptionStep = () => {
    const { t, i18n } = useTranslation(['buffet', 'menu']);
    const { personOptions, selectPersonOption, setCurrentStep, setJuiceInfo } = useBuffetStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleSelectPersonOption = (option: BuffetPersonOption) => {
        setIsLoading(true);
        selectPersonOption(option);
        axiosClient.get(`/buffet/person-options/${option.id}/juice-info`).then(res => {
            setJuiceInfo(res.data);
        }).catch(() => {
            setJuiceInfo(null); // Handle case where no specific rule is set
        }).finally(() => {
            setIsLoading(false);
            setCurrentStep(3);
        });
    };

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-[50vh]"><Loader2 className="h-10 w-10 animate-spin text-brand-pink-DEFAULT" /></div>
    }

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">{t('step2.title', "Select Guest Count")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {personOptions.map(opt => (
                    <Card key={opt.id} onClick={() => handleSelectPersonOption(opt)} className="cursor-pointer hover:shadow-lg hover:border-brand-pink-DEFAULT transition-all text-center">
                        <CardHeader>
                            <CardTitle>{i18n.language === 'ar' ? opt.label_ar : (opt.label_en || opt.label_ar)}</CardTitle>
                            <CardDescription className="text-lg font-semibold text-brand-pink-DEFAULT dark:text-brand-pink-light">
                                {Number(opt.price).toFixed(3)} {t('menu:currency')}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
};