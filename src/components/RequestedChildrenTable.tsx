// src/components/RequestedChildrenTable.tsx
import React from 'react';
import axiosClient from "@/helpers/axios-client";
import { ChildMeal, Mealorder, Order } from "@/Types/types";
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

// Shadcn UI Components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from '@/components/ui/label';

interface RequestedChildrenTableProps {
  mealOrder: Mealorder | null;
  setSelectedOrder: (order: Order) => void;
  onCloseDialog: () => void; // Callback to close the parent dialog
}

const RequestedChildrenTable: React.FC<RequestedChildrenTableProps> = ({ mealOrder, setSelectedOrder, onCloseDialog }) => {
  const { t } = useTranslation("menu");
  
  if (!mealOrder) return null;

  const handleChildMealToggle = (childMeal: ChildMeal) => {
    // This endpoint in our API toggles the item: adds if not present, removes if present.
    axiosClient.post(`RequestedChild/${mealOrder.id}?child=${childMeal.id}`)
      .then(({ data }) => {
        if (data.status) {
          setSelectedOrder(data.order);
        } else {
            toast.error(t('error.toggleServiceFailed', "Failed to update service."));
        }
      })
      .catch(() => toast.error(t('error.toggleServiceFailed', "Failed to update service.")));
  };

  const handleToggleAll = (isChecked: boolean) => {
    if (!isChecked) {
        // This is a complex operation (removing all). 
        // A dedicated backend endpoint would be best, but for now we can do it one-by-one.
        // Or, for simplicity, we can just implement the "Add All" functionality.
        toast.info("Clearing all services is not yet supported in one click.");
        return;
    }

    axiosClient.post(`RequestedChildAddAll/${mealOrder.id}`)
      .then(({ data }) => {
        if (data.status) {
          setSelectedOrder(data.order);
          toast.success(t('success.allServicesAdded', "All default services added."));
          onCloseDialog(); // Close dialog after adding all
        } else {
            toast.error(data.message || t('error.addAllFailed', "Failed to add all services."));
        }
      })
      .catch(() => toast.error(t('error.addAllFailed', "Failed to add all services.")));
  };

  const allChildMeals = mealOrder.meal.child_meals;
  const selectedChildMealIds = new Set(mealOrder.requested_child_meals.map(req => req.child_meal_id));
  const areAllSelected = allChildMeals.length > 0 && allChildMeals.every(child => selectedChildMealIds.has(child.id));

  return (
    <div className="border rounded-md">
      <Table className="mx-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all-services"
                  checked={areAllSelected}
                  onCheckedChange={(checked) => handleToggleAll(Boolean(checked))}
                />
                <Label htmlFor="select-all-services" className="sr-only">Select All</Label>
              </div>
            </TableHead>
            <TableHead>{t('service', 'Service')}</TableHead>
            <TableHead className="text-right">{t('price', 'Price')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allChildMeals.length > 0 ? (
            allChildMeals.map((child) => (
              <TableRow 
                key={child.id} 
                data-state={selectedChildMealIds.has(child.id) ? "selected" : ""}
                className="data-[state=selected]:bg-slate-50 dark:data-[state=selected]:bg-slate-900"
              >
                <TableCell>
                  <Checkbox
                    checked={selectedChildMealIds.has(child.id)}
                    onCheckedChange={() => handleChildMealToggle(child)}
                  />
                </TableCell>
                <TableCell className="font-medium">{child.service.name}</TableCell>
                <TableCell className="text-right">{Number(child.price).toFixed(3)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    {t('noServicesForMeal', 'No additional services for this item.')}
                </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RequestedChildrenTable;