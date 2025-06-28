// src/components/RequestedServiceDialog.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Mealorder, Order } from "@/Types/types";

// Shadcn UI Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// The refactored table component
import RequestedChildrenTable from "./RequestedChildrenTable";

interface RequestedServiceDialogProps {
  open: boolean;
  handleClose: () => void;
  mealOrder: Mealorder | null;
  setSelectedOrder: (order: Order) => void;
}

const RequestedServiceDialog: React.FC<RequestedServiceDialogProps> = ({
  open,
  handleClose,
  mealOrder,
  setSelectedOrder,
}) => {
  const { t } = useTranslation("menu");

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-950">
        <DialogHeader>
          <DialogTitle>{t("dialog.title", "Customize Item")}</DialogTitle>
          <DialogDescription>
            {t("dialog.description", `Select the services for`)}{" "}
            <span className="font-semibold text-brand-pink-DEFAULT">
              {mealOrder?.meal.name}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RequestedChildrenTable
            mealOrder={mealOrder}
            setSelectedOrder={setSelectedOrder}
            onCloseDialog={handleClose}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              {t("common:done", "Done")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestedServiceDialog;
