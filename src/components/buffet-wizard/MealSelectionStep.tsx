// src/components/buffet-wizard/MealSelectionStep.tsx
import React from 'react';
import { useBuffetStore } from '@/stores/useBuffetStore';
import { useTranslation } from 'react-i18next';
import { BuffetStep, Meal } from '@/Types/buffet-types';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { webUrl } from '@/helpers/constants';
import phCategory from '@/assets/logo.png';
import { toast } from 'sonner';

interface MealSelectionStepProps {
  step: BuffetStep;
}

export const MealSelectionStep: React.FC<MealSelectionStepProps> = ({ step }) => {
  const { t, i18n } = useTranslation('buffet');
  const { selections, updateMealSelection } = useBuffetStore();
  
  const currentSelections = selections[step.id] || [];
  
  const handleSelect = (mealId: number) => {
    if (currentSelections.length >= step.max_selections && !currentSelections.includes(mealId)) {
        toast.warning(t('selectionLimitReached', { max: step.max_selections }));
    } else {
        updateMealSelection(step.id, mealId);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2">{i18n.language === 'ar' ? step.title_ar : (step.title_en || step.title_ar)}</h2>
      <p className="text-center text-muted-foreground mb-6">{step.instructions_ar}</p>
      <p className="text-center font-semibold mb-4 text-brand-pink-DEFAULT">
        {t('selectionsMade', '{{count}}/{{max}} selected', { count: currentSelections.length, max: step.max_selections })}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {step.category.meals.map((meal: Meal) => (
          <div key={meal.id} onClick={() => handleSelect(meal.id)} className={`relative rounded-lg cursor-pointer transition-all overflow-hidden ${currentSelections.includes(meal.id) ? "ring-2 ring-pink-500 shadow-lg" : "ring-1 ring-slate-200"}`}>
            <Card className="h-full border-0 shadow-none text-center">
                <AspectRatio ratio={16/10}>
                    <img src={meal.image_url ? `${webUrl}/images/${meal.image_url}` : phCategory} alt={meal.name} className="object-cover w-full h-full rounded-t-lg" />
                </AspectRatio>
                <CardContent className="p-2">
                    <Label className="font-semibold text-sm cursor-pointer block">{meal.name}</Label>
                </CardContent>
            </Card>
            {currentSelections.includes(meal.id) && (
                <div className="absolute top-2 right-2 bg-pink-500 text-white rounded-full h-6 w-6 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};