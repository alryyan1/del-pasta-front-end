// src/pages/BuffetOrderPage.tsx

import React, { useState, useEffect, useMemo, startTransition, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axiosClient from "@/helpers/axios-client";
import { useBuffetStore } from "@/stores/useBuffetStore";
import { toast } from "sonner";

// Import all the step components
import { PackageSelectionStep } from "@/components/buffet-wizard/PackageSelectionStep";
import { PersonOptionStep } from "@/components/buffet-wizard/PersonOptionStep";
import { MealSelectionStep } from "@/components/buffet-wizard/MealSelectionStep";
import { JuiceInfoStep } from "@/components/buffet-wizard/JuiceInfoStep";
import { SummaryStep } from "@/components/buffet-wizard/SummaryStep";

// Shadcn UI & Icons
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { BuffetPackage } from "@/Types/buffet-types";

const BuffetOrderPage: React.FC = () => {
  const { t, i18n } = useTranslation(["buffet", "common"]);
  const navigate = useNavigate();

  // Get all state and actions from the Zustand store
  const {
    currentStep,
    setCurrentStep,
    steps,
    selectedPackage,
    selectedPersonOption,
    selections,
    customer,
    deliveryDate,
    deliveryTime,
    setPackages,
    reset: resetBuffetState,
  } = useBuffetStore();

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // This effect runs only once on mount to fetch the initial packages
  useEffect(() => {
    setIsPageLoading(true);
    
    startTransition(() => {
      axiosClient
        .get<BuffetPackage[]>("/buffet/packages")
        .then((res) => {
          setPackages(res.data);
        })
        .catch(() => {
          toast.error(t("error.packages", "Could not load buffet packages."));
        })
        .finally(() => {
          setIsPageLoading(false);
        });
    });
  }, [setPackages, t]);

  // Set document direction based on language
  useEffect(() => {
    startTransition(() => {
      document.body.dir = i18n.language === "ar" ? "rtl" : "ltr";
    });
  }, [i18n.language]);

  // Calculate total steps and progress, memoized for performance
  const totalSteps = useMemo(
    () => (steps.length > 0 ? steps.length + 4 : 4), // Package, People, [dynamic steps], Juice, Summary
    [steps]
  );
  const progressValue = useMemo(
    () => ((currentStep - 1) / (totalSteps - 1)) * 100,
    [currentStep, totalSteps]
  );

  // Memoized validation for the "Next" button
  const canGoNext = useMemo(() => {
    if (isPageLoading) return false;
    if (currentStep === 1) return !!selectedPackage;
    if (currentStep === 2) return !!selectedPersonOption;

    const dynamicStepIndex = currentStep - 3;
    if (dynamicStepIndex >= 0 && dynamicStepIndex < steps.length) {
      const step = steps[dynamicStepIndex];
      const count = selections[step.id]?.length || 0;
      return count >= step.min_selections && count <= step.max_selections;
    }

    // Validation for the summary step is handled within the step itself
    return true;
  }, [
    isPageLoading,
    currentStep,
    selectedPackage,
    selectedPersonOption,
    steps,
    selections,
  ]);

  // --- Navigation Handlers ---
  const handleNext = () => {
    if (!canGoNext) {
      const step = steps[currentStep - 3];
      if (step) {
        toast.error(
          t("selectionValidationError", {
            min: step.min_selections,
            max: step.max_selections,
          })
        );
      }
      return;
    }
    startTransition(() => {
      setCurrentStep(currentStep + 1);
    });
  };

  const handleBack = () => {
    if (currentStep === 1) {
      // Potentially navigate away or just do nothing
      return;
    } else if (currentStep === 2) {
      startTransition(() => {
        resetBuffetState(); // Fully reset if going back from person selection
      });
    } else {
      startTransition(() => {
        setCurrentStep(currentStep - 1);
      });
    }
  };

  // Final submission logic that will be passed to SummaryStep
  const handleSubmitOrder = async () => {
    if (!customer?.name || !customer?.phone || !deliveryDate || !deliveryTime) {
      return toast.error(
        t(
          "fillRequiredFields",
          "Please fill all customer and delivery details."
        )
      );
    }

    setIsSubmitting(true);
    const {
      notes,
      selectedPackage: finalPackage,
      selectedPersonOption: finalOption,
      selections: finalSelections,
    } = useBuffetStore.getState();

    const orderData = {
      customer: { name: customer.name, phone: customer.phone },
      delivery_date: deliveryDate,
      delivery_time: deliveryTime,
      notes,
      buffet_package_id: finalPackage!.id,
      buffet_person_option_id: finalOption!.id,
      selections: Object.entries(finalSelections).flatMap(([stepId, mealIds]) =>
        mealIds.map((mealId) => ({
          buffet_step_id: parseInt(stepId),
          meal_id: mealId,
        }))
      ),
    };

    try {
      const response = await axiosClient.post("/buffet-orders", orderData);
      const newOrder = response.data.data;

      toast.success(t("orderPlacedSuccess", "Order placed successfully!"));

      resetBuffetState(); // Reset state for a new order

      // Navigate to the success page with the new order's ID
      startTransition(() => {
        navigate(`/buffet-order/success/${newOrder.id}`);
      });
    } catch (error) {
      const errorMsg =
        (error as any).response?.data?.message ||
        t("orderPlacedError", "Failed to place the order.");
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Step Renderer ---
  const renderStepContent = () => {
    if (isPageLoading && currentStep === 1) {
      return (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-10 w-10 animate-spin text-brand-pink-DEFAULT" />
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return <PackageSelectionStep />;
      case 2:
        return <PersonOptionStep />;

      // This logic needs to be before the default to catch the last two steps correctly
      case totalSteps - 1:
        return <JuiceInfoStep />;
      case totalSteps:
        return (
          <SummaryStep
            isSubmitting={isSubmitting}
            handleSubmitOrder={handleSubmitOrder}
          />
        );

      default: {
        const dynamicStepIndex = currentStep - 3;
        if (dynamicStepIndex >= 0 && dynamicStepIndex < steps.length) {
          return <MealSelectionStep step={steps[dynamicStepIndex]} />;
        }
        // Fallback for any unexpected state
        return <p>An unexpected error occurred. Please refresh the page.</p>;
      }
    }
  };

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-pink-50/30 w-full flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand-pink-DEFAULT" />
      </div>
    }>
      <div
        className="min-h-screen bg-pink-50/30 w-full"
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
      >
        <div className="container mx-auto p-4 md:p-8 max-w-4xl">
          {currentStep > 1 && (
            <Progress value={progressValue} className="w-full mb-6 md:mb-8 h-2" />
          )}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 md:p-8 rounded-lg shadow-xl min-h-[60vh] relative">
            <Suspense fallback={
              <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="h-10 w-10 animate-spin text-brand-pink-DEFAULT" />
              </div>
            }>
              {renderStepContent()}
            </Suspense>
          </div>
          <div className="flex justify-between mt-8">
            <Button
              onClick={handleBack}
              disabled={isSubmitting || currentStep === 1}
              variant="outline"
            >
              <ArrowLeft
                className={`me-2 h-4 w-4 ${i18n.language === "ar" ? "rotate-180" : ""}`}
              />
              {t("common:previous")}
            </Button>

            {currentStep < totalSteps && (
              <Button onClick={handleNext} disabled={!canGoNext || isPageLoading}>
                {t("common:next")}
                <ArrowRight
                  className={`ms-2 h-4 w-4 ${i18n.language === "ar" ? "rotate-180" : ""}`}
                />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default BuffetOrderPage;
