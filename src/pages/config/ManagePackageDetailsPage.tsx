// src/pages/config/ManagePackageDetailsPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '@/helpers/axios-client';
import { BuffetPackage } from '@/Types/buffet-types';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

// Shadcn UI & Lucide Icons
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

// Admin Sub-Components
import { BuffetStepsManager } from '@/components/admin/BuffetStepsManager';
import { JuiceRulesManager } from '@/components/admin/JuiceRulesManager';
import { PersonOptionsManager } from '@/components/admin/PersonOptionsManager';

const ManagePackageDetailsPage: React.FC = () => {
  const { t } = useTranslation('admin'); // Assuming an 'admin' namespace for translations
  const { packageId } = useParams<{ packageId: string }>();
  
  const [pkg, setPkg] = useState<BuffetPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Using useCallback to memoize the fetch function
  const fetchPackageDetails = useCallback(async () => {
    if (!packageId) {
      toast.error(t('error.noPackageId', 'No package ID provided.'));
      return;
    }
    // No need to set loading here if called from a button, but useful for initial load
    // setIsLoading(true); 
    try {
      // The API endpoint fetches the package with its relations loaded
      const response = await axiosClient.get(`/admin/buffet-packages/${packageId}`);
      setPkg(response.data);
    } catch (error) {
      toast.error(t('error.fetchDetailsFailed', 'Failed to fetch package details.'));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [packageId, t]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchPackageDetails();
  }, [fetchPackageDetails]);

  // --- Loading State UI ---
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        <Skeleton className="h-9 w-48 rounded-md" />
        <div className="space-y-2">
            <Skeleton className="h-10 w-1/2 rounded-lg" />
            <Skeleton className="h-5 w-3/4 rounded-md" />
        </div>
        <Separator />
        <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
        <Card><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
        <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
      </div>
    );
  }

  // --- Not Found State UI ---
  if (!pkg) {
    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8 text-center">
            <h2 className="text-xl font-semibold text-destructive mb-4">{t('error.packageNotFound', 'Package Not Found')}</h2>
            <Button asChild variant="outline">
                <Link to="/config/buffet-packages">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('backToPackages', 'Go Back to All Packages')}
                </Link>
            </Button>
      </div>
    );
  }

  // --- Main Content UI ---
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div className="space-y-4">
        <Button asChild variant="outline" size="sm">
            <Link to="/config/buffet-packages">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToPackages', 'Back to All Packages')}
            </Link>
        </Button>
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{pkg.name_ar}</h1>
            <p className="text-muted-foreground">{pkg.description_ar}</p>
        </div>
        <Separator />
      </div>

      {/* Manager Components */}
      <PersonOptionsManager 
        packageId={pkg.id} 
        initialOptions={pkg.personOptions || []} 
        onDataChange={fetchPackageDetails} 
      />
      
      <BuffetStepsManager 
        packageId={pkg.id} 
        initialSteps={pkg.steps || []} 
        onDataChange={fetchPackageDetails} 
      />

      <JuiceRulesManager 
        personOptions={pkg.personOptions || []} 
        onDataChange={fetchPackageDetails} 
      />
    </div>
  );
};

export default ManagePackageDetailsPage;