// src/components/admin/PersonOptionsManager.tsx
import React, { useState } from "react";
import axiosClient from "@/helpers/axios-client";
import { BuffetPersonOption } from "@/Types/buffet-types";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

// Shadcn UI & Lucide Icons
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PersonOptionFormDialog } from "./PersonOptionFormDialog";

interface PersonOptionsManagerProps {
  packageId: number;
  initialOptions: BuffetPersonOption[];
  onDataChange: () => void; // Callback to refresh parent data
}

export const PersonOptionsManager: React.FC<PersonOptionsManagerProps> = ({
  packageId,
  initialOptions,
  onDataChange,
}) => {
  const { t } = useTranslation(["admin", "common"]); // Use admin and common namespaces
  console.log(packageId, "packageId", initialOptions, "initialOptions");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<BuffetPersonOption | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateNew = () => {
    setEditingOption(null); // Ensure we are in "create" mode
    setIsDialogOpen(true);
  };

  const handleEdit = (option: BuffetPersonOption) => {
    setEditingOption(option);
    setIsDialogOpen(true);
  };

  const handleDelete = async (optionId: number) => {
    // A more user-friendly confirmation dialog could be used here
    if (
      !window.confirm(
        t(
          "confirmDelete.option",
          "Are you sure you want to delete this option? This action cannot be undone."
        )
      )
    ) {
      return;
    }

    setIsLoading(true); // Can be used to show a spinner on the specific row in the future
    try {
      await axiosClient.delete(`/admin/buffet-person-options/${optionId}`);
      toast.success(t("success.optionDeleted", "Option deleted successfully."));
      onDataChange(); // Refresh data in parent component
    } catch (error) {
      toast.error(
        t("error.deleteFailed", "Failed to delete. Please try again.")
      );
      console.error("Delete failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: any, optionId?: number) => {
    setIsLoading(true);
    const apiCall = optionId
      ? axiosClient.put(`/admin/buffet-person-options/${optionId}`, data)
      : axiosClient.post(
          `/admin/buffet-packages/${packageId}/person-options`,
          data
        );

    try {
      await apiCall;
      toast.success(
        t(
          `success.${optionId ? "optionUpdated" : "optionCreated"}`,
          `Option ${optionId ? "updated" : "created"} successfully.`
        )
      );
      setIsDialogOpen(false);
      onDataChange(); // Refresh data
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        t("error.saveFailed", "Failed to save. Please try again.");
      toast.error(errorMsg);
      console.error("Save failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle>
                {t("pricingTiers.title", "Guest Count & Pricing")}
              </CardTitle>
              <CardDescription>
                {t(
                  "pricingTiers.description",
                  "Set the different pricing tiers based on number of guests."
                )}
              </CardDescription>
            </div>
            <Button onClick={handleCreateNew}>
              <PlusCircle className="mr-2 h-4 w-4" />{" "}
              {t("pricingTiers.addOption", "Add Option")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">
                    {t("common:arabicLabel", "Arabic Label")}
                  </TableHead>
                  <TableHead className="hidden md:table-cell text-center">
                    {t("common:englishLabel", "English Label")}
                  </TableHead>
                  <TableHead className="text-center">{t("common:price", "Price")} (OMR)</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    {t("common:status", "Status")}
                  </TableHead>
                  <TableHead className="text-center">
                    {t("common:actions", "Actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialOptions?.length > 0 ? (
                  initialOptions.map((opt) => (
                    <TableRow key={opt.id}>
                      <TableCell className="font-medium text-center">
                        {opt.label_ar}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-center">
                        {opt.label_en || "N/A"}
                      </TableCell>
                      <TableCell className="text-center">{Number(opt.price).toFixed(3)}</TableCell>
                      <TableCell className="hidden sm:table-cell text-center">
                        <Badge
                          variant={opt.is_active ? "default" : "destructive"}
                        >
                          {opt.is_active
                            ? t("common:active", "Active")
                            : t("common:inactive", "Inactive")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(opt)}
                          title={t("common:edit")}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(opt.id)}
                          className="text-destructive hover:text-destructive/80"
                          title={t("common:delete")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {t(
                        "pricingTiers.noOptions",
                        "No pricing options added yet."
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* The Dialog is now correctly used */}
      <PersonOptionFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
        initialData={editingOption}
        isLoading={isLoading}
      />
    </>
  );
};
