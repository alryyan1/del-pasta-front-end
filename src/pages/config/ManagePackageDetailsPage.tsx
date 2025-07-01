// src/pages/config/ManagePackageDetailsPage.tsx

import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "@/helpers/axios-client";
import { BuffetPackage } from "@/Types/buffet-types";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

// Shadcn UI & Lucide Icons
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

// Admin Sub-Components that this page will render
import { PersonOptionsManager } from "@/components/admin/PersonOptionsManager";
import { BuffetStepsManager } from "@/components/admin/BuffetStepsManager";
import { JuiceRulesManager } from "@/components/admin/JuiceRulesManager";

const ManagePackageDetailsPage: React.FC = () => {
  const { t } = useTranslation("buffet");
  const { packageId } = useParams<{ packageId: string }>();

  const [pkg, setPkg] = useState<BuffetPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Using useCallback ensures this function's identity is stable across re-renders
  // It will be passed as a prop to child components to trigger a data refresh.
  const fetchPackageDetails = useCallback(async () => {
    if (!packageId) {
      toast.error(t("packageDetails.noPackageId"));
      return;
    }

    // Set loading to true only for the initial fetch, not for background refreshes
    if (!pkg) setIsLoading(true);

    try {
      // The backend controller for this route eager-loads all necessary relationships
      const response = await axiosClient.get(
        `/admin/buffet-packages/${packageId}`
      );
      setPkg(response.data);
    } catch (error) {
      toast.error(t("packageDetails.fetchDetailsFailed"));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [packageId, t, pkg]); // Added pkg to dependencies to control initial loading state

  // Initial data fetch when the component mounts
  useEffect(() => {
    fetchPackageDetails();
    // The dependency array ensures this runs only once when packageId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageId]);

  // --- RENDER LOADING STATE ---
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6 animate-pulse">
        <Skeleton className="h-9 w-48 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-10 w-1/2 md:w-1/3 rounded-lg" />
          <Skeleton className="h-5 w-3/4 md:w-1/2 rounded-md" />
        </div>
        <Separator />
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- RENDER NOT FOUND STATE ---
  if (!pkg) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 text-center">
        <h2 className="text-xl font-semibold text-destructive mb-4">
          {t("packageDetails.packageNotFound")}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t("packageDetails.packageNotFoundDescription")}
        </p>
        <Button asChild variant="outline">
          <Link to="/config/buffet-packages">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("packageDetails.goBackToPackages")}
          </Link>
        </Button>
      </div>
    );
  }

  // --- RENDER MAIN CONTENT ---
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      {/* Page Header with Back Button and Title */}
      <div className="space-y-4">
        <Button asChild variant="outline" size="sm" className="mb-4">
          <Link to="/config/buffet-packages">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("packageDetails.backToPackages")}
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {pkg.name_ar}
          </h1>
          <p className="text-muted-foreground mt-1">{pkg.description_ar}</p>
        </div>
        <Separator />
      </div>

      {/* Render the manager components, passing down the fetched data and the refresh callback */}

      <PersonOptionsManager
        packageId={pkg.id}
        initialOptions={pkg.person_options || []}
        onDataChange={fetchPackageDetails}
      />

      <BuffetStepsManager
        packageId={pkg.id}
        initialSteps={pkg.steps || []}
        onDataChange={fetchPackageDetails}
      />

      <JuiceRulesManager
        personOptions={pkg.person_options || []}
        onDataChange={fetchPackageDetails}
      />
    </div>
  );
};

export default ManagePackageDetailsPage;
