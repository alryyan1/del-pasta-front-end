// src/pages/config/BuffetPackagesPage.tsx
import React, { useState, useEffect } from 'react';
import axiosClient from '@/helpers/axios-client';
import { BuffetPackage } from '@/Types/buffet-types';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { BuffetPackagesTable } from '@/components/admin/BuffetPackagesTable';
import { BuffetPackageFormDialog } from '@/components/admin/BuffetPackageFormDialog';

const BuffetPackagesPage: React.FC = () => {
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
      toast.error('Failed to fetch buffet packages.');
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
    if (!window.confirm('Are you sure you want to delete this package and all its options/steps?')) return;

    try {
      await axiosClient.delete(`/admin/buffet-packages/${packageId}`);
      toast.success('Package deleted successfully.');
      fetchPackages(); // Refetch the list
    } catch (error) {
      toast.error('Failed to delete package.');
    }
  };

  const handleSave = async (data: any, packageId?: number) => {
    setIsLoading(true);
    const apiCall = packageId 
        ? axiosClient.put(`/admin/buffet-packages/${packageId}`, data)
        : axiosClient.post('/admin/buffet-packages', data);

    try {
        await apiCall;
        toast.success(`Package ${packageId ? 'updated' : 'created'} successfully.`);
        setIsDialogOpen(false);
        fetchPackages(); // Refetch
    } catch(error) {
        toast.error(`Failed to ${packageId ? 'update' : 'create'} package.`);
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
              <CardTitle>Buffet Packages Management</CardTitle>
              <CardDescription>Create, edit, and manage your buffet offerings.</CardDescription>
            </div>
            <Button onClick={handleCreateNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Package
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
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