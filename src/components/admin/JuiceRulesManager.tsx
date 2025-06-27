// src/components/admin/JuiceRulesManager.tsx
import React, { useState } from 'react';
import axiosClient from '@/helpers/axios-client';
import { BuffetPersonOption } from '@/Types/buffet-types';
import { toast } from 'sonner';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit } from 'lucide-react';
import { JuiceRuleFormDialog } from './JuiceRuleFormDialog';

interface JuiceRulesManagerProps {
  personOptions: BuffetPersonOption[];
  onDataChange: () => void; // Callback to refresh parent data
}

export const JuiceRulesManager: React.FC<JuiceRulesManagerProps> = ({ personOptions, onDataChange }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<BuffetPersonOption | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = (option: BuffetPersonOption) => {
    setEditingOption(option);
    setIsDialogOpen(true);
  };

  const handleSave = async (data: any, personOptionId: number) => {
    setIsLoading(true);
    try {
      await axiosClient.post(`/admin/buffet-person-options/${personOptionId}/juice-rule`, data);
      toast.success('Juice rule updated successfully.');
      setIsDialogOpen(false);
      onDataChange();
    } catch (error) {
      toast.error('Failed to update juice rule.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Juice Configuration</CardTitle>
          <CardDescription>Define the included juices for each pricing tier.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pricing Tier</TableHead>
                <TableHead>Juice Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {personOptions?.map((opt) => (
                <TableRow key={opt.id}>
                  <TableCell className="font-medium">{opt.label_ar}</TableCell>
                  <TableCell className="text-muted-foreground">{opt.juiceRule?.description_ar || 'Not set'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(opt)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <JuiceRuleFormDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
        personOption={editingOption}
        isLoading={isLoading}
      />
    </>
  );
};