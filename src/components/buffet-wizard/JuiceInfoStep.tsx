// src/components/buffet-wizard/JuiceInfoStep.tsx
import React from 'react';
import { useBuffetStore } from '@/stores/useBuffetStore';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';

export const JuiceInfoStep: React.FC = () => {
    const { t, i18n } = useTranslation('buffet');
    const { juiceInfo } = useBuffetStore();

    return (
        <div className="text-center flex flex-col items-center justify-center h-full min-h-[40vh]">
            <h2 className="text-2xl font-bold mb-4">{t('juiceStep.title', 'Included Juices')}</h2>
            <Card className="max-w-md bg-pink-50 dark:bg-slate-800 border-pink-200 dark:border-slate-700">
               <CardContent className="p-6">
                   <Info className="mx-auto h-8 w-8 text-pink-500 mb-4" />
                   <p className="text-lg text-slate-700 dark:text-slate-300">
                       {juiceInfo 
                           ? (i18n.language === 'ar' ? juiceInfo.description_ar : (juiceInfo.description_en || juiceInfo.description_ar)) 
                           : t('juiceStep.default', 'A selection of fresh juices will be provided.')
                       }
                   </p>
               </CardContent>
            </Card>
        </div>
    );
};