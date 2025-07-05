// src/pages/FoodMenu.tsx
import React, { useEffect, useState, useMemo } from "react";
import axiosClient from "@/helpers/axios-client";
import {
  Category as CategoryType,
  Meal as MealType,
  ChildMeal as ChildMealType,
} from "@/Types/types";
import { webUrl } from "@/helpers/constants";
import phCategory from "@/assets/logo.png"; // Placeholder for category image
import phMeal from "@/assets/logo.png"; // Placeholder for meal image

// Shadcn UI Components & Icons
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Eye,
  Languages,
  Menu as MenuIcon,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCartStore } from "@/stores/useCartStore";

// Helper to truncate text
const truncateText = (
  text: string | null | undefined,
  maxLength: number
): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// --- Reusable Meal Card Component ---
interface MealCardProps {
  meal: MealType;
  currencySymbol: string;
}

const MealCard: React.FC<MealCardProps> = ({ meal, currencySymbol }) => {
  const { t, i18n } = useTranslation("menu");
  const { addItem } = useCartStore();
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
              {showFullDescription
                ? meal.description
                : truncateText(meal.description, shortDescriptionLength)}
            </p>
            {meal.description.length > shortDescriptionLength && (
              <Button
                variant="link"
                size="sm"
                style={{
                  padding: 0,
                  height: "auto",
                  color: "#FF1493",
                }}
                onMouseOver={(e) => e.currentTarget.style.color = "#C71585"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#FF1493"}
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription
                  ? t("readLess", "Read Less")
                  : t("readMore", "Read More")}
                {showFullDescription ? (
                  <ChevronUp className="ms-1 h-3 w-3" />
                ) : (
                  <ChevronDown className="ms-1 h-3 w-3" />
                )}
              </Button>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-3 md:p-4 mt-auto border-t border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center w-full gap-2">
          <p className="text-sm md:text-base font-bold"
            style={{ color: "#FF1493" }}>
            {meal.price > 0
              ? `${Number(meal.price).toFixed(3)} ${currencySymbol}`
              : t("priceOnRequest", "Price on Request")}
          </p>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 h-9 w-9"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side={i18n.language === "ar" ? "left" : "right"}
                className="w-full max-w-sm sm:max-w-md overflow-y-auto bg-white dark:bg-slate-950"
              >
                <SheetHeader className="pb-4 border-b dark:border-slate-800">
                  <AspectRatio
                    ratio={16 / 9}
                    className="bg-muted mb-4 rounded-md overflow-hidden"
                  >
                    <img
                      src={
                        meal.image_url
                          ? `${webUrl}/images/${meal.image_url}`
                          : phMeal
                      }
                      alt={meal.name}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                  <SheetTitle className="text-xl md:text-2xl text-slate-900 dark:text-white">
                    {meal.name}
                  </SheetTitle>
                  {meal.price > 0 && (
                    <p className="text-lg font-semibold mt-1"
                      style={{ color: "#FF1493" }}>
                      {Number(meal.price).toFixed(3)} {currencySymbol}
                    </p>
                  )}
                  <SheetDescription className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                    {meal.description ||
                      t("noDescription", "No description available.")}
                  </SheetDescription>
                </SheetHeader>
                {hasChildMeals && (
                  <div className="py-4">
                    <h4 className="font-semibold mb-2 text-slate-800 dark:text-slate-200">
                      {t("whatYouGet", "What's Included:")}
                    </h4>
                    <ul className="space-y-1.5 text-sm">
                      {meal.child_meals.map((child) => (
                        <li
                          key={child.id}
                          className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded-md"
                        >
                          <span className="text-slate-700 dark:text-slate-300">
                            {child.service?.name || child.name} (x
                            {child.quantity})
                          </span>
                          {child.price > 0 && (
                            <span className="font-medium text-brand-pink-DEFAULT dark:text-brand-pink-light">{`+${Number(child.price).toFixed(3)} ${currencySymbol}`}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <SheetFooter className="mt-6 pt-4 border-t dark:border-slate-800">
                  <SheetClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      {t("close", "Close")}
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            <Button
              size="icon"
              className="h-9 w-9 "
              onClick={() => addItem(meal)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

// --- Main Page Component ---
const FoodMenu: React.FC = () => {
  const { t, i18n } = useTranslation("menu");
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);

  const currencySymbol = t("currency", "OMR");

  useEffect(() => {
    document.body.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  useEffect(() => {
    const fetchCategoriesAndMeals = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get<CategoryType[]>("/categories");
        setCategories(response.data);
        if (response.data.length > 0) {
          setSelectedCategory(response.data[0]);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
        setError(
          t("error.fetchCategories", "Failed to load menu. Please try again.")
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategoriesAndMeals();
  }, [t]);

  const handleSelectCategory = (category: CategoryType) => {
    setSelectedCategory(category);
    setIsCategorySheetOpen(false); // Close mobile sheet on selection
  };

  const mealsToDisplay = useMemo(() => {
    if (!selectedCategory || !selectedCategory.meals) return [];
    return selectedCategory.meals;
  }, [selectedCategory]);

  if (isLoading) {
    // --- Loading Skeletons ---
    return (
      <div className="w-full">
        <div className="container mx-auto px-4 pt-4 flex justify-between items-center">
          <Skeleton className="h-10 w-32 rounded-md md:hidden" />
          <div className="flex space-x-2 rtl:space-x-reverse">
            <Skeleton className="h-9 w-20 rounded-md" />
            <Skeleton className="h-9 w-20 rounded-md" />
          </div>
        </div>
        <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm hidden md:block">
          <div className="container mx-auto px-2 sm:px-4">
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex space-x-3 p-3">
                <Skeleton className="h-10 w-28 rounded-full" />
                <Skeleton className="h-10 w-28 rounded-full" />
                <Skeleton className="h-10 w-28 rounded-full" />
              </div>
            </ScrollArea>
          </div>
        </div>
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          <Skeleton className="h-10 w-1/2 md:w-1/3 my-4 md:my-8 rounded-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-72 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    // --- Error State ---
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-150px)] p-4 text-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">
              {t("error.title", "Oops!")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-6">
              {t("retry", "Retry")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      {/* Top Bar: Language Switcher & Mobile Category Trigger */}
      <div className="container mx-auto px-4 pt-4 flex justify-between items-center">
        {/* Mobile Category Sheet Trigger */}
        <div className="md:hidden">
          <Sheet
            open={isCategorySheetOpen}
            onOpenChange={setIsCategorySheetOpen}
          >
            <SheetTrigger asChild>
              <Button variant="outline">
                <MenuIcon className="me-2 h-4 w-4" />{" "}
                {t("categories", "Categories")}
              </Button>
            </SheetTrigger>
            <SheetContent
              side={i18n.language === "ar" ? "right" : "left"}
              className="w-[280px] p-0"
            >
              <SheetHeader className="p-4 border-b">
                <SheetTitle>
                  {t("selectCategory", "Select Category")}
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-1 p-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory?.id === category.id ? "default" : "ghost"
                    }
                    onClick={() => handleSelectCategory(category)}
                    style={{
                      backgroundColor: selectedCategory?.id === category.id ? "#FF1493" : "transparent",
                      color: selectedCategory?.id === category.id ? "white" : "inherit",
                      transition: "colors 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      if (selectedCategory?.id === category.id) {
                        e.currentTarget.style.backgroundColor = "#C71585";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedCategory?.id === category.id) {
                        e.currentTarget.style.backgroundColor = "#FF1493";
                      }
                    }}
                    className={`w-full justify-start ${selectedCategory?.id === category.id ? "bg-brand-pink-DEFAULT text-white hover:bg-brand-pink-dark" : ""}`}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex space-x-2 rtl:space-x-reverse">
          <Button
            variant={i18n.language === "en" ? "default" : "outline"}
            size="sm"
            onClick={() => changeLanguage("en")}
            style={{
              backgroundColor: i18n.language === "en" ? "#FF1493" : "transparent",
              color: i18n.language === "en" ? "white" : "inherit",
              transition: "colors 0.2s ease",
            }}
            onMouseOver={(e) => {
              if (i18n.language === "en") {
                e.currentTarget.style.backgroundColor = "#C71585";
              }
            }}
            onMouseLeave={(e) => {
              if (i18n.language === "en") {
                e.currentTarget.style.backgroundColor = "#FF1493";
              }
            }}
          >
            English
          </Button>
          <Button
            variant={i18n.language === "ar" ? "default" : "outline"}
            size="sm"
            onClick={() => changeLanguage("ar")}
            style={{
              backgroundColor: i18n.language === "ar" ? "#FF1493" : "transparent",
              color: i18n.language === "ar" ? "white" : "inherit",
              transition: "colors 0.2s ease",
            }}
            onMouseOver={(e) => {
              if (i18n.language === "ar") {
                e.currentTarget.style.backgroundColor = "#C71585";
              }
            }}
            onMouseLeave={(e) => {
              if (i18n.language === "ar") {
                e.currentTarget.style.backgroundColor = "#FF1493";
              }
            }}
          >
            العربية
          </Button>
        </div>
      </div>

      {/* Desktop Category Selection */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm hidden md:block">
        <div className="container mx-auto px-2 sm:px-4">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max space-x-3 rtl:space-x-reverse p-3 md:p-4">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory?.id === category.id ? "default" : "ghost"
                  }
                  onClick={() => handleSelectCategory(category)}
                  style={{
                    backgroundColor: selectedCategory?.id === category.id ? "#FF1493" : "transparent",
                    color: selectedCategory?.id === category.id ? "white" : "inherit",
                    transition: "colors 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    if (selectedCategory?.id === category.id) {
                      e.currentTarget.style.backgroundColor = "#C71585";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory?.id === category.id) {
                      e.currentTarget.style.backgroundColor = "#FF1493";
                    }
                  }}
                  className="shrink-0 px-4 py-2 h-auto text-sm md:text-base rounded-full"
                >
                  {category.name}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        {selectedCategory && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-0 mb-4 md:my-8 text-center text-slate-800 dark:text-slate-100">
            {selectedCategory.name}
          </h2>
        )}

        {categories.length === 0 && !isLoading && (
          <div className="flex justify-center items-center min-h-[calc(100vh-250px)] p-4 text-center">
            <p className="text-muted-foreground text-lg">
              {t("noCategories", "No categories found.")}
            </p>
          </div>
        )}

        {selectedCategory && mealsToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
            {mealsToDisplay.map((meal: MealType) => (
              <MealCard
                key={meal.id}
                meal={meal}
                currencySymbol={currencySymbol}
              />
            ))}
          </div>
        ) : selectedCategory && !isLoading ? (
          <p className="text-center text-slate-600 dark:text-slate-400 py-10 text-lg">
            {t("noMealsInCategory", "No items in this category yet.")}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default FoodMenu;
