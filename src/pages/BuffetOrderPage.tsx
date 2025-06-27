// src/pages/BuffetOrderPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import axiosClient from '@/helpers/axios-client';
import { 
    BuffetPackage, 
    BuffetPersonOption, 
    BuffetStep,
    Meal as MealType,
    Customer
} from '@/Types/buffet-types'; // We'll create this types file next
import { webUrl } from '@/helpers/constants';
import phCategory from '@/assets/logo.png'; // Placeholder image

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { Autocomplete, CircularProgress, Dialog, DialogContent, DialogTitle, TextField, TextareaAutosize } from '@mui/material';
import { useCustomerStore } from './Customer/useCustomer';
import dayjs from 'dayjs';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// --- Types (Create a new file: src/Types/buffet-types.ts) ---
/*
  // src/Types/buffet-types.ts
  export interface BuffetPackage { id: number; name_ar: string; name_en: string; description_ar: string; image_url: string; }
  export interface BuffetPersonOption { id: number; label_ar: string; label_en: string; price: number; }
  export interface BuffetStep { id: number; step_number: number; title_ar: string; title_en: string; instructions_ar: string; min_selections: number; max_selections: number; category: { id: number; name: string; meals: Meal[] }; }
  export interface Meal { id: number; name: string; description: string | null; image_url: string | null; }
  export interface Customer { id: string; name: string; phone: string; }
*/

const BuffetOrderPage: React.FC = () => {
  const { t, i18n } = useTranslation(['buffet', 'menu']);
  const { customers, fetchData: fetchCustomers } = useCustomerStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [packages, setPackages] = useState<BuffetPackage[]>([]);
  const [personOptions, setPersonOptions] = useState<BuffetPersonOption[]>([]);
  const [steps, setSteps] = useState<BuffetStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // User Selections
  const [selectedPackage, setSelectedPackage] = useState<BuffetPackage | null>(null);
  const [selectedPersonOption, setSelectedPersonOption] = useState<BuffetPersonOption | null>(null);
  const [selections, setSelections] = useState<Record<number, number[]>>({}); // { stepId: [mealId1, mealId2] }
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<string>(dayjs().add(1, 'day').format('YYYY-MM-DD'));
  const [deliveryTime, setDeliveryTime] = useState<string>('18:00');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);

  useEffect(() => {
    fetchCustomers();
    axiosClient.get('/buffet/packages').then(res => {
        setPackages(res.data);
    }).finally(() => setIsLoading(false));
  }, []);

  const totalSteps = useMemo(() => steps.length + 3, [steps.length]); // 3 fixed steps (package, people, summary)
  const progressValue = useMemo(() => ((currentStep) / totalSteps) * 100, [currentStep, totalSteps]);

  const handleSelectPackage = (pkg: BuffetPackage) => {
    setSelectedPackage(pkg);
    setIsLoading(true);
    axiosClient.get(`/buffet/packages/${pkg.id}/person-options`).then(res => setPersonOptions(res.data));
    axiosClient.get(`/buffet/packages/${pkg.id}/steps`).then(res => setSteps(res.data));
    setCurrentStep(2);
    setIsLoading(false);
  };
  
  const handleSelectPersonOption = (option: BuffetPersonOption) => {
    setSelectedPersonOption(option);
    setCurrentStep(3);
  };
  
  const handleMealSelection = (stepId: number, mealId: number, maxSelections: number, isRadio: boolean) => {
    setSelections(prev => {
        const currentStepSelections = prev[stepId] || [];
        const newSelections = {...prev};

        if (isRadio) {
            newSelections[stepId] = [mealId];
        } else {
            if (currentStepSelections.includes(mealId)) {
                newSelections[stepId] = currentStepSelections.filter(id => id !== mealId);
            } else {
                if (currentStepSelections.length < maxSelections) {
                    newSelections[stepId] = [...currentStepSelections, mealId];
                } else {
                    toast.warning(`${t('selectionLimitReached')} (${maxSelections})`);
                }
            }
        }
        return newSelections;
    });
  };

  const currentSelectionCount = (stepId: number) => selections[stepId]?.length || 0;

  const getStepContent = () => {
    // Step 1: Package Selection
    if (currentStep === 1) {
      return (
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">{t('step1.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packages.map(pkg => (
              <Card key={pkg.id} onClick={() => handleSelectPackage(pkg)} className="cursor-pointer hover:shadow-lg hover:border-pink-500 transition-all">
                <CardHeader>
                  <CardTitle>{i18n.language === 'ar' ? pkg.name_ar : pkg.name_en || pkg.name_ar}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      );
    }
    
    // Step 2: Person/Price Selection
    if (currentStep === 2) {
      return (
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">{t('step2.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {personOptions.map(opt => (
              <Card key={opt.id} onClick={() => handleSelectPersonOption(opt)} className="cursor-pointer hover:shadow-lg hover:border-pink-500 transition-all text-center">
                <CardHeader>
                  <CardTitle>{i18n.language === 'ar' ? opt.label_ar : opt.label_en || opt.label_ar}</CardTitle>
                  <CardDescription className="text-lg font-semibold text-pink-600">{opt.price} {t('menu:currency')}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    // Dynamic Steps (Main, Salad, Desserts)
    const dynamicStepIndex = currentStep - 3;
    if (dynamicStepIndex < steps.length) {
      const step = steps[dynamicStepIndex];
      const isRadio = step.max_selections === 1;
      return (
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">{i18n.language === 'ar' ? step.title_ar : step.title_en || step.title_ar}</h2>
          <p className="text-center text-muted-foreground mb-6">{i18n.language === 'ar' ? step.instructions_ar : step.instructions_en || step.instructions_ar}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {step.category.meals.map(meal => (
              <Card key={meal.id} className={`transition-all ${selections[step.id]?.includes(meal.id) ? 'border-2 border-pink-500' : ''}`}>
                <CardHeader className="p-0">
                  <AspectRatio ratio={16/10}><img src={meal.image_url ? `${webUrl}/images/${meal.image_url}` : phCategory} alt={meal.name} className="object-cover w-full h-full rounded-t-md" /></AspectRatio>
                </CardHeader>
                <CardContent className="p-3">
                  <Label htmlFor={`${step.id}-${meal.id}`} className="font-semibold text-sm cursor-pointer block">{meal.name}</Label>
                  {isRadio ? (
                      <RadioGroup onValueChange={() => handleMealSelection(step.id, meal.id, step.max_selections, true)} value={(selections[step.id]?.[0] || '').toString()}>
                        <div className="flex items-center space-x-2 mt-2">
                           <RadioGroupItem value={meal.id.toString()} id={`${step.id}-${meal.id}`} />
                           <Label htmlFor={`${step.id}-${meal.id}`}>{t('select')}</Label>
                        </div>
                      </RadioGroup>
                  ) : (
                      <div className="flex items-center space-x-2 mt-2">
                         <Checkbox id={`${step.id}-${meal.id}`} checked={selections[step.id]?.includes(meal.id)} onCheckedChange={() => handleMealSelection(step.id, meal.id, step.max_selections, false)} />
                         <Label htmlFor={`${step.id}-${meal.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t('select')}</Label>
                      </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }
    
    // Last Step: Summary and Confirmation
    if (currentStep === totalSteps) {
      // Logic for summary
      return <BuffetSummary />;
    }

    return null;
  };

  const canGoNext = () => {
    if (currentStep < 3) return true; // Package and Person steps
    const dynamicStepIndex = currentStep - 3;
    if (dynamicStepIndex < steps.length) {
        const step = steps[dynamicStepIndex];
        const count = currentSelectionCount(step.id);
        return count >= step.min_selections && count <= step.max_selections;
    }
    return true; // For summary step
  }

  const handleNext = () => {
    if(canGoNext()) {
        setCurrentStep(prev => prev + 1);
    } else {
        const step = steps[currentStep - 3];
        toast.error(`${t('selectionValidationError', {min: step.min_selections, max: step.max_selections})}`);
    }
  };

  const handleBack = () => {
    if(currentStep === 3) {
      // Reset selections if going back from first dynamic step
      setSelections({});
    }
    setCurrentStep(prev => prev - 1);
  };
  
  const BuffetSummary = () => {
    const formatWhatsAppMessage = () => {
        let message = `*${t('newBuffetOrder')}*\n\n`;
        message += `*${t('package')}:* ${i18n.language === 'ar' ? selectedPackage?.name_ar : selectedPackage?.name_en}\n`;
        message += `*${t('guests')}:* ${i18n.language === 'ar' ? selectedPersonOption?.label_ar : selectedPersonOption?.label_en}\n`;
        message += `*${t('price')}:* ${selectedPersonOption?.price} ${t('menu:currency')}\n\n`;
        message += `*${t('customer')}:* ${customer?.name} - ${customer?.phone}\n`;
        message += `*${t('deliveryDate')}:* ${dayjs(deliveryDate).format('DD/MM/YYYY')} - ${deliveryTime}\n\n`;
        
        steps.forEach(step => {
            message += `*${i18n.language === 'ar' ? step.title_ar : step.title_en}:*\n`;
            const selectedMealIds = selections[step.id] || [];
            selectedMealIds.forEach(mealId => {
                const meal = step.category.meals.find(m => m.id === mealId);
                if (meal) message += `- ${meal.name}\n`;
            });
            message += `\n`;
        });

        if(notes.trim()) message += `*${t('notes')}:*\n${notes}\n`;

        return encodeURIComponent(message);
    };

    const handleSubmitOrder = async () => {
        if(!customer) {
            toast.error(t('selectCustomerError'));
            setIsCustomerDialogOpen(true);
            return;
        }

        setIsSubmitting(true);
        const orderData = {
            is_buffet_order: true,
            customer_id: customer.id,
            delivery_date: deliveryDate,
            delivery_time: deliveryTime,
            notes: notes,
            buffet_package_id: selectedPackage?.id,
            buffet_person_option_id: selectedPersonOption?.id,
            selections: Object.entries(selections).flatMap(([stepId, mealIds]) => 
                mealIds.map(mealId => ({ buffet_step_id: parseInt(stepId), meal_id: mealId }))
            ),
        };

        try {
            const response = await axiosClient.post('/orders', orderData);
            toast.success(t('orderPlacedSuccess'));
            const whatsappMessage = formatWhatsAppMessage();
            const restaurantPhone = "96800000000"; // REPLACE WITH ACTUAL NUMBER
            window.open(`https://wa.me/${restaurantPhone}?text=${whatsappMessage}`, '_blank');
            // Reset state
            setCurrentStep(1);
            setSelectedPackage(null);
            // ... reset other states
        } catch(error) {
            toast.error(t('orderPlacedError'));
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">{t('stepSummary.title')}</h2>
            <Card>
                <CardHeader>
                    <CardTitle>{t('summary')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Customer and Delivery Info */}
                    <div>
                        <Label>{t('customer')}</Label>
                        <Autocomplete 
                            options={customers}
                            getOptionLabel={(option) => `${option.name} - ${option.phone}`}
                            value={customer}
                            onChange={(e, newValue) => setCustomer(newValue)}
                            renderInput={(params) => <TextField {...params} variant="standard" />}
                        />
                        <Button size="sm" variant="link" onClick={() => setIsCustomerDialogOpen(true)}>{t('addNewCustomer')}</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                          <Label>{t('deliveryDate')}</Label>
                          <TextField type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} fullWidth variant="standard"/>
                      </div>
                      <div>
                          <Label>{t('deliveryTime')}</Label>
                          <TextField type="time" value={deliveryTime} onChange={e => setDeliveryTime(e.target.value)} fullWidth variant="standard"/>
                      </div>
                    </div>
                    <div>
                      <Label>{t('notes')}</Label>
                      <TextareaAutosize minRows={3} value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-2 border rounded-md" />
                    </div>

                    <p><strong>{t('totalPrice')}:</strong> {selectedPersonOption?.price.toFixed(3)} {t('menu:currency')}</p>
                    <Button onClick={handleSubmitOrder} disabled={isSubmitting} className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : t('confirmAndSend')}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><CircularProgress /></div>
  }

  return (
    <div className="min-h-screen bg-pink-50/30 w-full" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto p-4 md:p-8">
        <Progress value={progressValue} className="w-full mb-8 h-2" />
        
        <div className="bg-white p-6 rounded-lg shadow-md min-h-[60vh]">
          {getStepContent()}
        </div>

        <div className="flex justify-between mt-8">
          <Button onClick={handleBack} disabled={currentStep === 1 || isSubmitting} variant="outline">
            <ArrowLeft className={`me-2 h-4 w-4 ${i18n.language === 'ar' ? 'rotate-180' : ''}`} />
            {t('previous')}
          </Button>
          {currentStep < totalSteps && (
            <Button onClick={handleNext} disabled={!canGoNext() || isSubmitting}>
              {t('next')}
              <ArrowRight className={`ms-2 h-4 w-4 ${i18n.language === 'ar' ? 'rotate-180' : ''}`} />
            </Button>
          )}
        </div>
      </div>
      {/* Add New Customer Dialog can go here */}
      <Dialog open={isCustomerDialogOpen} onClose={() => setIsCustomerDialogOpen(false)}>
        <DialogTitle>{t('addNewCustomer')}</DialogTitle>
        <DialogContent>
            {/* You can embed your CustomerForm component here */}
            <p>Customer form goes here...</p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuffetOrderPage;