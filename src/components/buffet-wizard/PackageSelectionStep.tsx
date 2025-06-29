// src/components/buffet-wizard/PackageSelectionStep.tsx
import React, { useState, startTransition }from 'react';
import { useBuffetStore } from '@/stores/useBuffetStore';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BuffetPackage } from '@/Types/buffet-types';
import axiosClient from '@/helpers/axios-client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export const PackageSelectionStep = () => {
    const { t, i18n } = useTranslation('buffet');
    const { packages, selectPackage, setCurrentStep, setPersonOptions, setSteps } = useBuffetStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleSelectPackage = (pkg: BuffetPackage) => {
        setIsLoading(true);
        selectPackage(pkg);
        
        startTransition(() => {
            const optionsPromise = axiosClient.get(`/buffet/packages/${pkg.id}/person-options`);
            const stepsPromise = axiosClient.get(`/buffet/packages/${pkg.id}/steps`);

            Promise.all([optionsPromise, stepsPromise]).then(([optionsRes, stepsRes]) => {
                setPersonOptions(optionsRes.data);
                setSteps(stepsRes.data);
                setCurrentStep(2);
            }).catch(() => {
                toast.error(t('error.packageDetails', "Failed to load package details."));
                selectPackage(null); // Revert selection on error
            }).finally(() => {
                setIsLoading(false)
            });
        });
    };
    
    if (isLoading) {
        return <div className="flex justify-center items-center min-h-[50vh]"><Loader2 className="h-10 w-10 animate-spin text-brand-pink-DEFAULT" /></div>
    }

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">{t('step1.title', "Choose Your Package")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {packages.map(pkg => (
                    <Card key={pkg.id} onClick={() => handleSelectPackage(pkg)} className="cursor-pointer hover:shadow-lg hover:border-brand-pink-DEFAULT transition-all text-center">
                        <CardHeader>
                            <CardTitle>{i18n.language === 'ar' ? pkg.name_ar : (pkg.name_en || pkg.name_ar)}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>{i18n.language === 'ar' ? pkg.description_ar : (pkg.description_ar || t('common:noDescription'))}</CardDescription>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};