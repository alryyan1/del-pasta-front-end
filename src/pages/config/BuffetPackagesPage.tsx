// src/pages/config/BuffetPackagesPage.tsx
import React, { useState, useEffect } from 'react';
import axiosClient from '@/helpers/axios-client';
import { BuffetPackage } from '@/Types/buffet-types';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { BuffetPackagesTable } from '@/components/admin/BuffetPackagesTable';
import { BuffetPackageFormDialog } from '@/components/admin/BuffetPackageFormDialog';

interface PackageFormData {
  name_ar: string;
  name_en?: string;
  description_ar?: string;
  is_active: boolean;
}

const BuffetPackagesPage: React.FC = () => {
  const { t } = useTranslation('buffet');
  const [packages, setPackages] = useState<BuffetPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<BuffetPackage | null>(null);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get('/admin/buffet-packages');
      setPackages(response.data);
    } catch (error) {
      toast.error(t('packagesManagement.fetchError'));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleCreateNew = () => {
    setEditingPackage(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (pkg: BuffetPackage) => {
    setEditingPackage(pkg);
    setIsDialogOpen(true);
  };

  const handleDelete = async (packageId: number) => {
    if (!window.confirm(t('packagesManagement.deleteConfirm'))) return;

    try {
      await axiosClient.delete(`/admin/buffet-packages/${packageId}`);
      toast.success(t('packagesManagement.deleteSuccess'));
      fetchPackages(); // Refetch the list
    } catch {
      toast.error(t('packagesManagement.deleteError'));
    }
  };

  const handleSave = async (data: PackageFormData, packageId?: number) => {
    setIsLoading(true);
    const apiCall = packageId 
        ? axiosClient.put(`/admin/buffet-packages/${packageId}`, data)
        : axiosClient.post('/admin/buffet-packages', data);

    try {
        await apiCall;
        toast.success(packageId ? t('packagesManagement.updateSuccess') : t('packagesManagement.createSuccess'));
        setIsDialogOpen(false);
        fetchPackages(); // Refetch
    } catch {
        toast.error(packageId ? t('packagesManagement.updateError') : t('packagesManagement.createError'));
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t('packagesManagement.title')}</CardTitle>
              <CardDescription>{t('packagesManagement.description')}</CardDescription>
            </div>
            <Button onClick={handleCreateNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('packagesManagement.addNewPackage')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>{t('packagesManagement.loading')}</p>
          ) : (
            <BuffetPackagesTable packages={packages} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </CardContent>
      </Card>

      <BuffetPackageFormDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
        initialData={editingPackage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default BuffetPackagesPage;