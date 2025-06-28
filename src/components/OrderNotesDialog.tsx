import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import axiosClient from "@/helpers/axios-client";
import { Order } from "@/Types/types";

// Shadcn UI Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, FileText, MapPin } from "lucide-react";

interface OrderNotesDialogProps {
  open: boolean;
  onClose: () => void;
  selectedOrder: Order;
  setSelectedOrder: (order: Order) => void;
}

const OrderNotesDialog: React.FC<OrderNotesDialogProps> = ({
  open,
  onClose,
  selectedOrder,
  setSelectedOrder,
}) => {
  const { t } = useTranslation("cart");
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Initialize form with current order data
  useEffect(() => {
    if (selectedOrder) {
      setNotes(selectedOrder.notes || "");
      setDeliveryAddress(selectedOrder.delivery_address || "");
      setSpecialInstructions(selectedOrder.special_instructions || "");
    }
  }, [selectedOrder, open]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updateData = {
        notes: notes.trim(),
        delivery_address: deliveryAddress.trim(),
        special_instructions: specialInstructions.trim(),
      };

      const response = await axiosClient.put(`orders/${selectedOrder.id}`, updateData);
      
      if (response.data.status) {
        // Update the selected order with new data
        const updatedOrder = {
          ...selectedOrder,
          ...updateData,
        };
        setSelectedOrder(updatedOrder);
        
        toast.success(t("orderUpdated", "Order updated successfully"));
        onClose();
      } else {
        toast.error(t("updateFailed", "Failed to update order"));
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(t("updateError", "Error updating order"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form to original values
    setNotes(selectedOrder.notes || "");
    setDeliveryAddress(selectedOrder.delivery_address || "");
    setSpecialInstructions(selectedOrder.special_instructions || "");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t("orderDetails", "Order Details")}
          </DialogTitle>
          <DialogDescription>
            {t("orderDetailsDescription", "Add notes and delivery information for order")} #{selectedOrder?.order_number}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Order Notes */}
          <div className="space-y-2">
            <Label htmlFor="order_notes" className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t("notes", "Order Notes")}
            </Label>
            <Textarea
              id="order_notes"
              placeholder={t("notesPlaceholder", "Add notes for this order...")}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t("notesHint", "Internal notes for kitchen or staff")}
            </p>
          </div>

          {/* Delivery Address */}
          <div className="space-y-2">
            <Label htmlFor="delivery_address" className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {t("delivery_address", "Delivery Address")}
            </Label>
            <Textarea
              id="delivery_address"
              placeholder={t("deliveryAddressPlaceholder", "Enter full delivery address...")}
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              rows={2}
              className="resize-none"
            />
          </div>

          {/* Special Instructions */}
          <div className="space-y-2">
            <Label htmlFor="special_instructions" className="text-sm font-medium">
              {t("specialInstructions", "Special Instructions")}
            </Label>
            <Textarea
              id="special_instructions"
              placeholder={t("specialInstructionsPlaceholder", "Any special cooking or delivery instructions...")}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={2}
              className="resize-none"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t("specialInstructionsHint", "Special requests for preparation or delivery")}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isLoading}
          >
            {t("common:cancel", "Cancel")}
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isLoading}
            className="min-w-[100px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {t("saving", "Saving...")}
              </>
            ) : (
              t("common:save", "Save")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderNotesDialog; 