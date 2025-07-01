// src/components/admin/BuffetStepsManager.tsx
import React, { useState } from 'react';
import axiosClient from '@/helpers/axios-client';
import { BuffetStep } from '@/Types/buffet-types';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, PlusCircle, Trash2 } from 'lucide-react';
import { BuffetStepFormDialog } from './BuffetStepFormDialog';

interface BuffetStepsManagerProps {
  packageId: number;
  initialSteps: BuffetStep[];
  onDataChange: () => void; // Callback to refresh parent data
}

export const BuffetStepsManager: React.FC<BuffetStepsManagerProps> = ({ packageId, initialSteps, onDataChange }) => {
  const { t } = useTranslation('buffet');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<BuffetStep | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateNew = () => {
    setEditingStep(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (step: BuffetStep) => {
    setEditingStep(step);
    setIsDialogOpen(true);
  };

  const handleDelete = async (stepId: number) => {
    if (!window.confirm(t('stepsManagement.deleteConfirm'))) return;
    
    setIsLoading(true);
    try {
      await axiosClient.delete(`/admin/buffet-steps/${stepId}`);
      toast.success(t('stepsManagement.deleteSuccess'));
      onDataChange();
    } catch {
      toast.error(t('stepsManagement.deleteError'));
    } finally {
      setIsLoading(false);
    }
  };

  interface StepFormData {
    step_number: number;
    title_ar?: string;
    title_en?: string;
    instructions_ar?: string;
    category_id: number;
    min_selections: number;
    max_selections: number;
    is_active: boolean;
  }

  const handleSave = async (data: StepFormData, stepId?: number) => {
    setIsLoading(true);
    
    // Ensure required fields have default values for the API
    const apiData = {
      ...data,
      title_ar: data.title_ar || "",
      title_en: data.title_en || "",
      instructions_ar: data.instructions_ar || "",
    };
    
    const apiCall = stepId
      ? axiosClient.put(`/admin/buffet-steps/${stepId}`, apiData)
      : axiosClient.post(`/admin/buffet-packages/${packageId}/steps`, apiData);

    try {
      await apiCall;
      toast.success(stepId ? t('stepsManagement.updateSuccess') : t('stepsManagement.createSuccess'));
      setIsDialogOpen(false);
      onDataChange();
    } catch (error: unknown) {
      const errorResponse = error as { response?: { data?: { message?: string } } };
      const errorMsg = errorResponse?.response?.data?.message || (stepId ? t('stepsManagement.updateError') : t('stepsManagement.createError'));
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t('stepsManagement.title')}</CardTitle>
              <CardDescription>{t('stepsManagement.description')}</CardDescription>
            </div>
            <Button onClick={handleCreateNew}>
              <PlusCircle className="mr-2 h-4 w-4" /> {t('stepsManagement.addStep')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table className="mx-auto">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">{t('stepsManagement.table.stepNumber')}</TableHead>
                <TableHead className="text-center">{t('stepsManagement.table.title')}</TableHead>
                <TableHead className="text-center">{t('stepsManagement.table.category')}</TableHead>
                <TableHead className="text-center">{t('stepsManagement.table.selections')}</TableHead>
                <TableHead className="text-center">{t('stepsManagement.table.status')}</TableHead>
                <TableHead className="text-center">{t('stepsManagement.table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialSteps?.length > 0 ? (
                initialSteps.map((step) => (
                  <TableRow key={step.id}>
                    <TableCell className="text-center">{step.step_number}</TableCell>
                    <TableCell className="font-medium text-center">{step.title_ar}</TableCell>
                    <TableCell className="text-center">{step.category?.name}</TableCell>
                    <TableCell className="text-center">{step.min_selections} / {step.max_selections}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={step.is_active ? 'default' : 'outline'}>
                        {step.is_active ? t('stepsManagement.table.active') : t('stepsManagement.table.inactive')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(step)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(step.id)} className="text-red-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    {t('stepsManagement.noSteps')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <BuffetStepFormDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
        initialData={editingStep}
        isLoading={isLoading}
        existingSteps={initialSteps}
      />
    </>
  );
};