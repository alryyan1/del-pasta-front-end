// src/components/admin/BuffetStepsManager.tsx
import React, { useState } from 'react';
import axiosClient from '@/helpers/axios-client';
import { BuffetStep } from '@/Types/buffet-types';
import { toast } from 'sonner';

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
    if (!window.confirm('Are you sure you want to delete this step?')) return;
    
    setIsLoading(true);
    try {
      await axiosClient.delete(`/admin/buffet-steps/${stepId}`);
      toast.success('Step deleted successfully.');
      onDataChange();
    } catch (error) {
      toast.error('Failed to delete step.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: any, stepId?: number) => {
    setIsLoading(true);
    const apiCall = stepId
      ? axiosClient.put(`/admin/buffet-steps/${stepId}`, data)
      : axiosClient.post(`/admin/buffet-packages/${packageId}/steps`, data);

    try {
      await apiCall;
      toast.success(`Step ${stepId ? 'updated' : 'created'} successfully.`);
      setIsDialogOpen(false);
      onDataChange();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || `Failed to ${stepId ? 'update' : 'create'} step.`;
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
              <CardTitle>Buffet Customization Steps</CardTitle>
              <CardDescription>Define the sequence of choices for the customer.</CardDescription>
            </div>
            <Button onClick={handleCreateNew}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Step
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Step#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Selections (Min/Max)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialSteps?.length > 0 ? (
                initialSteps.map((step) => (
                  <TableRow key={step.id}>
                    <TableCell>{step.step_number}</TableCell>
                    <TableCell className="font-medium">{step.title_ar}</TableCell>
                    <TableCell>{step.category?.name}</TableCell>
                    <TableCell>{step.min_selections} / {step.max_selections}</TableCell>
                    <TableCell>
                      <Badge variant={step.is_active ? 'default' : 'outline'}>
                        {step.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
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
                    No steps have been configured for this package yet.
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
      />
    </>
  );
};