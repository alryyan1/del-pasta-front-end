// src/pages/FoodMenu.tsx
import React, { useEffect, useState, useMemo } from 'react';
import axiosClient from '@/helpers/axios-client';
import { Category as CategoryType, Meal as MealType, ChildMeal as ChildMealType } from '@/Types/types';
import { webUrl } from '@/helpers/constants';
import phCategory from '@/assets/logo.png'; // Placeholder for category image (Del Pasta logo)
import phMeal from '@/assets/logo.png';    // Placeholder for meal image (Del Pasta logo)

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Eye, Languages, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Helper to truncate text
const truncateText = (text: string | null | undefined, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

interface MealCardProps {
  meal: MealType;
  currencySymbol: string;
}

const MealCard: React.FC<MealCardProps> = ({ meal, currencySymbol }) => {
  const { t, i18n } = useTranslation('menu');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const shortDescriptionLength = 60;
  const hasChildMeals = meal.child_meals && meal.child_meals.length > 0;

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-xl bg-white dark:bg-slate-900 h-full w-full">
      <CardHeader className="p-0">
        <AspectRatio ratio={16 / 10} className="bg-slate-100 dark:bg-slate-800">
          <img
            src={meal.image_url ? `${webUrl}/images/${meal.image_url}` : phMeal}
            alt={meal.name}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-3 md:p-4 flex flex-col flex-grow">
        <CardTitle className="text-base md:text-lg font-semibold mb-1 text-slate-800 dark:text-slate-100">
          {meal.name}
        </CardTitle>
        {meal.description && (
          <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-2">
            <p>
              {showFullDescription ? meal.description : truncateText(meal.description, shortDescriptionLength)}
            </p>
            {meal.description.length > shortDescriptionLength && (
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto text-brand-pink-DEFAULT hover:text-brand-pink-dark dark:hover:text-brand-pink-light"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? t('readLess', 'Read Less') : t('readMore', 'Read More')}
                {showFullDescription ? <ChevronUp className="ms-1 h-3 w-3" /> : <ChevronDown className="ms-1 h-3 w-3" />}
              </Button>
            )}
          </div>
        )}
        {hasChildMeals && (
          <div className="mb-2">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t('includes', 'Includes')}: {meal.child_meals.slice(0,1).map(cm => cm.service?.name || cm.name).join(', ')}
              {meal.child_meals.length > 1 ? '...' : ''}
            </p>
          </div>
        )}
         {meal.people_count && meal.people_count.trim() !== '' && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                {t('serves', 'Serves')}: {meal.people_count}
            </p>
        )}
      </CardContent>
      <CardFooter className="p-3 md:p-4 mt-auto border-t border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center w-full">
          <p className="text-sm md:text-base font-bold text-brand-pink-DEFAULT dark:text-brand-pink-light">
            {meal.price > 0 ? `${meal.price.toFixed(3)} ${currencySymbol}` : t('priceOnRequest', 'Price on Request')}
          </p>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="border-brand-pink-DEFAULT text-brand-pink-DEFAULT hover:bg-brand-pink-light/10 dark:border-brand-pink-light dark:text-brand-pink-light dark:hover:bg-brand-pink-dark/20 h-8 w-8 md:h-9 md:w-auto md:px-3">
                <Eye className="h-4 w-4 md:me-1.5" />
                <span className="hidden md:inline">{t('viewDetails', 'View')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side={i18n.language === 'ar' ? 'left' : 'right'} className="w-full max-w-sm sm:max-w-md overflow-y-auto bg-white dark:bg-slate-950">
              <SheetHeader className="pb-4 border-b dark:border-slate-800">
                <AspectRatio ratio={16 / 9} className="bg-muted mb-4 rounded-md overflow-hidden">
                  <img src={meal.image_url ? `${webUrl}/images/${meal.image_url}` : phMeal} alt={meal.name} className="object-cover w-full h-full"/>
                </AspectRatio>
                <SheetTitle className="text-xl md:text-2xl text-slate-900 dark:text-white">{meal.name}</SheetTitle>
                {meal.price > 0 && (<p className="text-lg font-semibold text-brand-pink-DEFAULT dark:text-brand-pink-light mt-1">{meal.price.toFixed(3)} {currencySymbol}</p>)}
                {meal.people_count && meal.people_count.trim() !== '' && (<p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{t('serves', 'Serves')}: {meal.people_count}</p>)}
                <SheetDescription className="mt-2 text-sm text-slate-700 dark:text-slate-300">{meal.description || t('noDescription', 'No description available.')}</SheetDescription>
              </SheetHeader>
              {hasChildMeals && (
                <div className="py-4">
                  <h4 className="font-semibold mb-2 text-slate-800 dark:text-slate-200">{t('whatYouGet', "What you'll get:")}</h4>
                  <ul className="space-y-1.5 text-sm">
                    {meal.child_meals.map((child) => (
                      <li key={child.id} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
                        <span className="text-slate-700 dark:text-slate-300">{child.service?.name || child.name} (x{child.quantity})</span>
                        {child.price > 0 && <span className="font-medium text-brand-pink-DEFAULT dark:text-brand-pink-light">{`+${child.price.toFixed(3)} ${currencySymbol}`}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <SheetFooter className="mt-6 pt-4 border-t dark:border-slate-800">
                <SheetClose asChild><Button type="button" variant="outline" className="dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800">{t('close', 'Close')}</Button></SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </CardFooter>
    </Card>
  );
};


const FoodMenu: React.FC = () => {
  const { t, i18n } = useTranslation('menu');
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const currencySymbol = t('currency', 'OMR');

  useEffect(() => {
    document.body.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);
  
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  useEffect(() => {
    const fetchAllCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get<CategoryType[]>('/categories'); // Ensure meals are eager loaded
        setCategories(response.data);
      } catch (err) {
        console.error(t('error.fetchFailed', "Fetch failed:"), err);
        setError(t('error.fetchCategories', 'Failed to load menu. Please try again.'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllCategories();
  }, [t]);

  const handleSelectCategory = (category: CategoryType) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };
  
  const mealsToDisplay = useMemo(() => {
    if (!selectedCategory || !selectedCategory.meals) return [];
    // Filter out meals that have no price AND no child meals (as these might not be sellable items directly)
    return selectedCategory.meals.filter(meal => meal.price > 0 || (meal.child_meals && meal.child_meals.length > 0));
  }, [selectedCategory]);


  const CategoryCardSkeleton: React.FC = () => (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-3 md:p-4">
        <Skeleton className="h-6 w-3/4 rounded-md" />
      </div>
    </Card>
  );

  const MealCardSkeleton: React.FC = () => (
     <Card className="flex flex-col overflow-hidden w-full">
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="p-4 flex flex-col flex-grow">
        <Skeleton className="h-6 w-3/4 mb-2 rounded-md" />
        <Skeleton className="h-4 w-full mb-3 rounded-md" />
        <Skeleton className="h-4 w-1/2 mb-3 rounded-md" />
        <div className="mt-auto flex justify-between items-center">
          <Skeleton className="h-7 w-1/3 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 w-full p-4 md:p-6 lg:p-8" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="container mx-auto">
            <div className="flex justify-end space-x-2 rtl:space-x-reverse mb-6">
                <Skeleton className="h-9 w-20 rounded-md" />
                <Skeleton className="h-9 w-20 rounded-md" />
            </div>
            <Skeleton className="h-10 w-1/2 md:w-1/3 mb-8 rounded-lg" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {[...Array(selectedCategory ? 8 : 10)].map((_, i) => selectedCategory ? <MealCardSkeleton key={i} /> : <CategoryCardSkeleton key={i} />)}
            </div>
        </div>
      </div>
    );
  }
  
  if (error) {
     return (
      <div className="flex justify-center items-center min-h-[calc(100vh-150px)] p-4 text-center bg-slate-50 dark:bg-slate-950" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <Card className="w-full max-w-md bg-white dark:bg-slate-900">
          <CardHeader><CardTitle className="text-destructive">{t('error.title', 'Oops!')}</CardTitle></CardHeader>
          <CardContent>
            <p className="text-slate-700 dark:text-slate-300">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-6 bg-brand-pink-DEFAULT hover:bg-brand-pink-dark text-white dark:bg-brand-pink-dark dark:hover:bg-brand-pink-DEFAULT">
              {t('retry', 'Retry')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50/30 dark:bg-slate-950 w-full" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        {/* Language Switcher */}
        <div className="mb-6 flex justify-end space-x-2 rtl:space-x-reverse">
          <Button variant={i18n.language === 'en' ? 'default' : 'outline'} size="sm" onClick={() => changeLanguage('en')} className={`${i18n.language === 'en' ? 'bg-brand-pink-DEFAULT text-white hover:bg-brand-pink-dark' : 'text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-pink-100/50 dark:hover:bg-slate-800'} transition-colors`}>English</Button>
          <Button variant={i18n.language === 'ar' ? 'default' : 'outline'} size="sm" onClick={() => changeLanguage('ar')} className={`${i18n.language === 'ar' ? 'bg-brand-pink-DEFAULT text-white hover:bg-brand-pink-dark' : 'text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-pink-100/50 dark:hover:bg-slate-800'} transition-colors`}>العربية</Button>
        </div>

        {!selectedCategory ? (
          <>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 text-center text-slate-800 dark:text-slate-100 tracking-tight">
              {t('ourCategories', 'Our Categories')}
            </h1>
            {categories.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {categories.map((category) => (
                  <Card
                    key={category.id}
                    onClick={() => handleSelectCategory(category)}
                    className="overflow-hidden cursor-pointer transition-all hover:shadow-2xl hover:scale-105 bg-white dark:bg-slate-900 group"
                  >
                    <AspectRatio ratio={4 / 3} className="bg-slate-100 dark:bg-slate-800">
                      <img
                        src={category.image_url ? `${webUrl}/images/${category.image_url}` : phCategory}
                        alt={category.name}
                        className="object-cover w-full h-full transition-transform group-hover:scale-110 duration-300"
                        loading="lazy"
                      />
                    </AspectRatio>
                    <CardFooter className="p-3 md:p-4 bg-gradient-to-t from-black/30 to-transparent absolute bottom-0 left-0 right-0">
                        <h3 className="text-sm md:text-base font-semibold text-white text-center w-full group-hover:text-brand-pink-light transition-colors">
                            {category.name}
                        </h3>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-600 dark:text-slate-400 py-10 text-lg">{t('noCategories', 'No menu categories available at the moment.')}</p>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center mb-6 md:mb-8">
              <Button variant="ghost" onClick={handleBackToCategories} className="text-brand-pink-DEFAULT hover:text-brand-pink-dark dark:text-brand-pink-light dark:hover:text-brand-pink-DEFAULT me-2 sm:me-4">
                <ArrowLeft className={`h-5 w-5 ${i18n.language === 'ar' ? 'rotate-180' : ''}`} />
                <span className="hidden sm:inline ms-1">{t('backToCategories', 'Back to Categories')}</span>
              </Button>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                {selectedCategory.name}
              </h1>
            </div>
            {mealsToDisplay.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
                {mealsToDisplay.map((meal) => (
                  <MealCard key={meal.id} meal={meal} currencySymbol={currencySymbol} />
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-600 dark:text-slate-400 py-10 text-lg">{t('noMealsInCategory', 'No items in this category yet.')}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FoodMenu;