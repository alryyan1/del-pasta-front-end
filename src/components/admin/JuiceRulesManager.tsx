// src/components/admin/JuiceRulesManager.tsx

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
import { Edit, Droplets } from "lucide-react";

// Import the dialog component we will create
import { JuiceRuleFormDialog } from "./JuiceRuleFormDialog";

interface JuiceRulesManagerProps {
  personOptions: BuffetPersonOption[];
  onDataChange: () => void; // Callback to refresh the parent component's data
}

export const JuiceRulesManager: React.FC<JuiceRulesManagerProps> = ({
  personOptions,
  onDataChange,
}) => {
  const { t } = useTranslation(["admin", "common"]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<BuffetPersonOption | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = (option: BuffetPersonOption) => {
    setEditingOption(option);
    setIsDialogOpen(true);
  };

  // This function will be passed to the dialog to handle saving the data
  const handleSave = async (
    data: { description_ar: string; description_en?: string },
    personOptionId: number
  ) => {
    setIsLoading(true);
    try {
      // Use the "storeOrUpdate" endpoint we created
      await axiosClient.post(
        `/admin/buffet-person-options/${personOptionId}/juice-rule`,
        data
      );
      toast.success(
        t("success.juiceRuleUpdated", "Juice rule updated successfully.")
      );
      setIsDialogOpen(false);
      onDataChange(); // Important: Refresh the data on the parent page
    } catch (error) {
      toast.error(t("error.saveFailed", "Failed to save. Please try again."));
      console.error("Failed to update juice rule:", error);
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
              <CardTitle className="flex items-center">
                <Droplets className="mr-2 h-5 w-5 text-brand-pink-DEFAULT" />
                {t("juiceConfig.title", "Juice Configuration")}
              </CardTitle>
              <CardDescription>
                {t(
                  "juiceConfig.description",
                  "Define the included juices for each pricing tier."
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {t("common:pricingTier", "Pricing Tier")}
                  </TableHead>
                  <TableHead>
                    {t("juiceConfig.juiceDescription", "Juice Description")}
                  </TableHead>
                  <TableHead className="text-right">
                    {t("common:actions", "Actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {personOptions && personOptions.length > 0 ? (
                  personOptions.map((opt) => (
                    <TableRow key={opt.id}>
                      <TableCell className="font-medium">
                        {opt.label_ar}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {opt.juiceRule?.description_ar ||
                          t("common:notSet", "Not set")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(opt)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> {t("common:edit")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {t(
                        "pricingTiers.noOptionsWarning",
                        "Add a pricing tier first to configure its juice rule."
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* The Dialog is now correctly used and controlled */}
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
