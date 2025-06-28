// src/pages/BuffetOrderPage.tsx

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import axiosClient from "@/helpers/axios-client";
import {
  BuffetPackage,
  BuffetPersonOption,
  BuffetStep,
  Customer,
  BuffetJuiceRule,
} from "@/Types/buffet-types";
import { webUrl } from "@/helpers/constants";
import phCategory from "@/assets/logo.png";

// Shadcn UI & Other Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Autocomplete,
  TextField,
} from "@mui/material";
import { CustomerForm } from "./Customer/CutomerForm";
import { useCustomerStore } from "./Customer/useCustomer";
import dayjs from "dayjs";
import { ArrowLeft, ArrowRight, Loader2, Info } from "lucide-react";

const BuffetOrderPage: React.FC = () => {
  const { t, i18n } = useTranslation(["buffet", "menu"]);
  const { customers, fetchData: fetchCustomers } = useCustomerStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [packages, setPackages] = useState<BuffetPackage[]>([]);
  const [personOptions, setPersonOptions] = useState<BuffetPersonOption[]>([]);
  const [steps, setSteps] = useState<BuffetStep[]>([]);
  const [juiceInfo, setJuiceInfo] = useState<BuffetJuiceRule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // User Selections State
  const [selectedPackage, setSelectedPackage] = useState<BuffetPackage | null>(
    null
  );
  const [selectedPersonOption, setSelectedPersonOption] =
    useState<BuffetPersonOption | null>(null);
  const [selections, setSelections] = useState<Record<number, number[]>>({}); // { stepId: [mealId1, mealId2] }
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<string>(
    dayjs().add(1, "day").format("YYYY-MM-DD")
  );
  const [deliveryTime, setDeliveryTime] = useState<string>("18:00");
  const [notes, setNotes] = useState("");
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);

  // Helper function to get current selection count for a step
  const currentSelectionCount = (stepId: number): number => {
    return selections[stepId]?.length || 0;
  };

  // Initial data fetch for packages and customers
  useEffect(() => {
    fetchCustomers();
    axiosClient
      .get("/buffet/packages")
      .then((res) => {
        setPackages(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error(t("error.packages", "Could not load buffet packages."));
      })
      .finally(() => setIsLoading(false));
  }, [fetchCustomers, t]);

  const totalSteps = useMemo(
    () => (steps.length > 0 ? steps.length + 4 : 4),
    [steps]
  ); // Package, People, Juice, Summary
  const progressValue = useMemo(
    () => ((currentStep - 1) / (totalSteps - 1)) * 100,
    [currentStep, totalSteps]
  );

  const handleSelectPackage = (pkg: BuffetPackage) => {
    setIsLoading(true);
    setSelectedPackage(pkg);
    const optionsPromise = axiosClient.get(
      `/buffet/packages/${pkg.id}/person-options`
    );
    const stepsPromise = axiosClient.get(`/buffet/packages/${pkg.id}/steps`);

    Promise.all([optionsPromise, stepsPromise])
      .then(([optionsRes, stepsRes]) => {
        setPersonOptions(optionsRes.data);
        setSteps(stepsRes.data);
        setCurrentStep(2);
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          t("error.packageDetails", "Failed to load package details.")
        );
        setCurrentStep(1);
      })
      .finally(() => setIsLoading(false));
  };

  const handleSelectPersonOption = (option: BuffetPersonOption) => {
    setSelectedPersonOption(option);
    setIsLoading(true);
    axiosClient
      .get(`/buffet/person-options/${option.id}/juice-info`)
      .then((res) => {
        setJuiceInfo(res.data);
      })
      .catch(() => {
        setJuiceInfo(null);
      })
      .finally(() => {
        setIsLoading(false);
        setCurrentStep(3);
      });
  };

  const handleMealSelection = (stepId: number, mealId: number) => {
    const step = steps.find((s) => s.id === stepId);
    if (!step) return;

    setSelections((prev) => {
      const currentStepSelections = prev[stepId] || [];
      const newSelections = { ...prev };

      // For multi-select (checkbox behavior)
      if (currentStepSelections.includes(mealId)) {
        // Deselect
        newSelections[stepId] = currentStepSelections.filter(
          (id) => id !== mealId
        );
      } else {
        // Select, but respect max limit
        if (currentStepSelections.length < step.max_selections) {
          newSelections[stepId] = [...currentStepSelections, mealId];
        } else {
          toast.warning(
            t("selectionLimitReached", { max: step.max_selections })
          );
        }
      }
      return newSelections;
    });
  };

  const canGoNext = useMemo(() => {
    if (isLoading) return false;
    if (currentStep === 1) return !!selectedPackage;
    if (currentStep === 2) return !!selectedPersonOption;

    const dynamicStepIndex = currentStep - 3;
    if (dynamicStepIndex >= 0 && dynamicStepIndex < steps.length) {
      const step = steps[dynamicStepIndex];
      const count = selections[step.id]?.length || 0;
      return count >= step.min_selections && count <= step.max_selections;
    }

    if (currentStep === totalSteps)
      return !!customer && !!deliveryDate && !!deliveryTime;
    return true;
  }, [
    isLoading,
    currentStep,
    selectedPackage,
    selectedPersonOption,
    steps,
    selections,
    totalSteps,
    customer,
    deliveryDate,
    deliveryTime,
  ]);

  const handleNext = () => {
    if (!canGoNext) {
      const dynamicStepIndex = currentStep - 3;
      if (dynamicStepIndex >= 0 && dynamicStepIndex < steps.length) {
        const step = steps[dynamicStepIndex];
        toast.error(
          t("selectionValidationError", {
            min: step.min_selections,
            max: step.max_selections,
          })
        );
      }
      return;
    }
    setCurrentStep((p) => p + 1);
  };

  const handleBack = () => setCurrentStep((p) => p - 1);

  const handleSubmitOrder = async () => {
    if (!canGoNext)
      return toast.error(
        t("fillRequiredFields", "Please fill all required fields.")
      );
    setIsSubmitting(true);

    const orderData = {
      is_buffet_order: true,
      customer_id: customer!.id,
      delivery_date: deliveryDate,
      delivery_time: deliveryTime,
      notes: notes,
      buffet_package_id: selectedPackage!.id,
      buffet_person_option_id: selectedPersonOption!.id,
      selections: Object.entries(selections).flatMap(([stepId, mealIds]) =>
        mealIds.map((mealId) => ({
          buffet_step_id: parseInt(stepId),
          meal_id: mealId,
        }))
      ),
    };

    try {
      await axiosClient.post("/orders", orderData);
      toast.success(
        t("orderPlacedSuccess", "Order has been placed successfully!")
      );
      const whatsappMessage = formatWhatsAppMessage();
      const restaurantPhone = "968XXXXXXXX"; // REPLACE WITH YOUR ACTUAL NUMBER
      window.open(
        `https://wa.me/${restaurantPhone}?text=${whatsappMessage}`,
        "_blank"
      );
      // Reset wizard for new order
      setCurrentStep(1);
      setSelectedPackage(null);
      setSelectedPersonOption(null);
      setSelections({});
      setCustomer(null);
    } catch (error) {
      toast.error(
        t("orderPlacedError", "Failed to place the order. Please try again.")
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatWhatsAppMessage = useCallback(() => {
    if (!selectedPackage || !selectedPersonOption || !customer) return "";

    let message = `*${t("newBuffetOrder")}*\n\n`;
    message += `*${t("package")}:* ${i18n.language === "ar" ? selectedPackage.name_ar : selectedPackage.name_en || selectedPackage.name_ar}\n`;
    message += `*${t("guests")}:* ${i18n.language === "ar" ? selectedPersonOption.label_ar : selectedPersonOption.label_en || selectedPersonOption.label_ar}\n`;
    message += `*${t("price")}:* ${selectedPersonOption.price} ${t("menu:currency")}\n\n`;
    message += `*${t("customer")}:* ${customer.name} - ${customer.phone}\n`;
    message += `*${t("deliveryDate")}:* ${dayjs(deliveryDate).format("DD/MM/YYYY")} @ ${deliveryTime}\n\n`;

    steps.forEach((step) => {
      message += `*${i18n.language === "ar" ? step.title_ar : step.title_en || step.title_ar}:*\n`;
      const selectedMealIds = selections[step.id] || [];
      if (selectedMealIds.length > 0) {
        selectedMealIds.forEach((mealId) => {
          const meal = step.category.meals.find((m) => m.id === mealId);
          if (meal) message += `- ${meal.name}\n`;
        });
      } else {
        message += `- ${t("common:noneSelected")}\n`;
      }
      message += `\n`;
    });

    if (notes.trim()) message += `*${t("notes")}:*\n${notes}\n`;

    return encodeURIComponent(message);
  }, [
    selectedPackage,
    selectedPersonOption,
    customer,
    deliveryDate,
    deliveryTime,
    steps,
    selections,
    notes,
    i18n.language,
    t,
  ]);

  const handleCustomerSave = (savedCustomer: Customer) => {
    setCustomer(savedCustomer);
    setIsCustomerDialogOpen(false);
    fetchCustomers();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Package Selection
        return (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
              {t("step1.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {packages.map((pkg) => (
                <Card
                  key={pkg.id}
                  onClick={() => handleSelectPackage(pkg)}
                  className="cursor-pointer hover:shadow-lg hover:border-pink-500 transition-all text-center"
                >
                  <CardHeader>
                    <CardTitle>
                      {i18n.language === "ar"
                        ? pkg.name_ar
                        : pkg.name_en || pkg.name_ar}
                    </CardTitle>
                    <CardDescription>
                      {i18n.language === "ar"
                        ? pkg.description_ar
                        : pkg.description_ar}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        );
      case 2: // Person/Price Selection
        return (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
              {t("step2.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {personOptions.map((opt) => (
                <Card
                  key={opt.id}
                  onClick={() => handleSelectPersonOption(opt)}
                  className="cursor-pointer hover:shadow-lg hover:border-pink-500 transition-all text-center"
                >
                  <CardHeader>
                    <CardTitle>
                      {i18n.language === "ar"
                        ? opt.label_ar
                        : opt.label_en || opt.label_ar}
                    </CardTitle>
                    <CardDescription className="text-lg font-semibold text-pink-600">
                      {opt.price} {t("menu:currency")}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        );
      case totalSteps - 1: // Juice Step
        return (
          <div className="text-center flex flex-col items-center justify-center h-full min-h-[40vh]">
            <h2 className="text-2xl font-bold mb-4">
              {t("juiceStep.title", "Included Juices")}
            </h2>
            <Card className="max-w-md bg-pink-50 dark:bg-slate-800 border-pink-200 dark:border-slate-700">
              <CardContent className="p-6">
                <Info className="mx-auto h-8 w-8 text-pink-500 mb-4" />
                <p className="text-lg text-slate-700 dark:text-slate-300">
                  {juiceInfo
                    ? i18n.language === "ar"
                      ? juiceInfo.description_ar
                      : juiceInfo.description_en || juiceInfo.description_ar
                    : t(
                        "juiceStep.default",
                        "A selection of fresh juices will be provided."
                      )}
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case totalSteps: // Summary Step
        return (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
              {t("stepSummary.title")}
            </h2>
            <div className="space-y-6">
              <div className="space-y-1">
                <Label>{t("customer")}</Label>
                <Autocomplete
                  freeSolo
                  options={customers}
                  getOptionLabel={(option) =>
                    typeof option === "string"
                      ? option
                      : `${option.name} - ${option.phone}`
                  }
                  value={customer}
                  onChange={(e, newValue) => setCustomer(newValue as Customer)}
                  renderInput={(params) => (
                    <TextField {...params} size="small" fullWidth />
                  )}
                />
                <Button
                  size="sm"
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => setIsCustomerDialogOpen(true)}
                >
                  {t("addNewCustomer")}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="deliveryDate">{t("deliveryDate")}</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="deliveryTime">{t("deliveryTime")}</Label>
                  <Input
                    id="deliveryTime"
                    type="time"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="notes">{t("notes")}</Label>
                <Textarea
                  id="notes"
                  placeholder={t("notesPlaceholder")}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div className="text-xl font-bold text-right">
                {t("totalPrice")}:{" "}
                <span className="text-pink-600">
                  {selectedPersonOption?.price.toFixed(3)} {t("menu:currency")}
                </span>
              </div>
            </div>
          </div>
        );
      default: {
        // Dynamic Meal Selection Steps
        const dynamicStepIndex = currentStep - 3;
        const step = steps[dynamicStepIndex];
        if (!step) return <p>Loading step...</p>;
        return (
          <div>
            <h2 className="text-2xl font-bold text-center mb-2">
              {i18n.language === "ar"
                ? step.title_ar
                : step.title_en || step.title_ar}
            </h2>
            <p className="text-center text-muted-foreground mb-6">
              {i18n.language === "ar"
                ? step.instructions_ar
                : step.instructions_ar}
            </p>
            <p className="text-center font-semibold mb-4 text-pink-600">
              {t("selectionsMade", "{{count}}/{{max}} selected", {
                count: currentSelectionCount(step.id),
                max: step.max_selections,
              })}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {step.category.meals.map((meal) => (
                <div
                  key={meal.id}
                  onClick={() => handleMealSelection(step.id, meal.id)}
                  className={`relative rounded-lg cursor-pointer transition-all ${selections[step.id]?.includes(meal.id) ? "ring-2 ring-pink-500 shadow-lg" : "ring-1 ring-slate-200"}`}
                >
                  <Card className="h-full border-0 shadow-none text-center">
                    <AspectRatio ratio={16 / 10}>
                      <img
                        src={
                          meal.image_url
                            ? `${webUrl}/images/${meal.image_url}`
                            : phCategory
                        }
                        alt={meal.name}
                        className="object-cover w-full h-full rounded-t-lg"
                      />
                    </AspectRatio>
                    <CardContent className="p-2">
                      <Label
                        htmlFor={`${step.id}-${meal.id}`}
                        className="font-semibold text-sm cursor-pointer block"
                      >
                        {meal.name}
                      </Label>
                    </CardContent>
                  </Card>
                  {selections[step.id]?.includes(meal.id) && (
                    <div className="absolute top-2 right-2 bg-pink-500 text-white rounded-full h-6 w-6 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-pink-50/30 w-full"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        {totalSteps > 4 && (
          <Progress value={progressValue} className="w-full mb-6 md:mb-8 h-2" />
        )}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg min-h-[60vh] relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-lg">
              <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
            </div>
          )}
          {renderStepContent()}
        </div>
        <div className="flex justify-between mt-8">
          <Button
            onClick={handleBack}
            disabled={currentStep === 1 || isSubmitting}
            variant="outline"
          >
            <ArrowLeft
              className={`me-2 h-4 w-4 ${i18n.language === "ar" ? "rotate-180" : ""}`}
            />
            {t("previous")}
          </Button>
          {currentStep < totalSteps ? (
            <Button onClick={handleNext} disabled={!canGoNext || isLoading}>
              {t("next")}
              <ArrowRight
                className={`ms-2 h-4 w-4 ${i18n.language === "ar" ? "rotate-180" : ""}`}
              />
            </Button>
          ) : (
            <Button
              onClick={handleSubmitOrder}
              disabled={isSubmitting || !canGoNext}
              className="bg-pink-600 hover:bg-pink-700 text-white"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("confirmAndSend")}
            </Button>
          )}
        </div>
      </div>
      <CustomerForm
        open={isCustomerDialogOpen}
        onClose={() => setIsCustomerDialogOpen(false)}
        onSubmit={handleCustomerSave}
        selectedCustomer={{} as Customer}
      />
    </div>
  );
};

export default BuffetOrderPage;
