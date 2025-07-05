// src/components/CheckoutDialog.tsx
import React, { useState } from "react";
import { useCartStore } from "@/stores/useCartStore";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosClient from "@/helpers/axios-client";
import { toast } from "sonner";

// Shadcn UI & Icons
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ShoppingCart } from "lucide-react";
import { Separator } from "./ui/separator";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { t } = useTranslation(["checkout", "menu"]);
  const { items, totalPrice, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Zod schema for the checkout form validation
  const checkoutSchema = z.object({
    name: z.string().min(2, { message: t("validation.nameRequired", "Name must be at least 2 characters.") }),
    phone: z.string().min(8, { message: t("validation.phoneRequired", "A valid phone number is required.") }),
    address: z.string().optional(),
    notes: z.string().optional(),
  });

  type CheckoutFormValues = z.infer<typeof checkoutSchema>;

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      notes: "",
    },
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);

    const orderPayload = {
      customer: {
        name: data.name,
        phone: data.phone,
        address: data.address,
      },
      notes: data.notes,
      items: items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        notes: item.itemNotes || "",
      })),
    };

    try {
      const response = await axiosClient.post("/online-orders", orderPayload);
      
      if (response.data.status && response.data.order) {
        // Clear cart and close dialog
        clearCart();
        onOpenChange(false);
        form.reset();
        
        // Redirect to success page with order ID
        navigate(`/online-order/success/${response.data.order.id}`);
      } else {
        throw new Error("Order creation failed");
      }
    } catch (error) {
      toast.error(t("error.title", "Submission Failed"), {
        description: t("error.description", "There was a problem sending your order. Please try again."),
      });
      console.error("Order submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <ShoppingCart className="h-6 w-6" />
            {t("title", "Complete Your Order")}
          </DialogTitle>
          <DialogDescription>
            {t("description", "Please provide your details below. Your order will be sent to the restaurant via WhatsApp.")}
          </DialogDescription>
        </DialogHeader>

        {/* Final Order Summary */}
        <div className="py-4">
          <h4 className="mb-2 font-semibold">
            {t("orderSummary", "Order Summary")}
          </h4>
          <div className="max-h-32 overflow-y-auto space-y-2 rounded-md border p-2 bg-slate-50 dark:bg-slate-800/50">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center text-sm"
              >
                <p>
                  <span className="font-medium">{item.quantity}x</span>{" "}
                  {item.name}
                </p>
                <p>{(item.price * item.quantity).toFixed(3)}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
            <span>{t("total", "Total")}</span>
            <span>
              {totalPrice.toFixed(3)} {t('currency_OMR', 'OMR')}
            </span>
          </div>
        </div>

        <Separator />

        {/* Customer Information Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("form.name", "Your Name")}</Label>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    id="name"
                    placeholder={t("form.namePlaceholder", "e.g., Ali Al-Habsi")}
                    className={error ? "border-destructive" : ""}
                    {...field}
                  />
                  {error && (
                    <p className="text-sm text-destructive">{error.message}</p>
                  )}
                </>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t("form.phone", "Phone Number")}</Label>
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t("form.phonePlaceholder", "e.g., 9xxxxxxx")}
                    className={error ? "border-destructive" : ""}
                    {...field}
                  />
                  {error && (
                    <p className="text-sm text-destructive">{error.message}</p>
                  )}
                </>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">
              {t("form.address", "Address (for delivery)")}
            </Label>
            <Controller
              name="address"
              control={form.control}
              render={({ field }) => (
                <Textarea
                  id="address"
                  placeholder={t("form.addressPlaceholder", "Enter your full address if you require delivery...")}
                  {...field}
                />
              )}
            />
          </div>
          {/* <div className="space-y-2">
            <Label htmlFor="notes">
              {t("form.notes", "General Order Notes")}
            </Label>
            <Textarea
              id="notes"
              {...form.register("notes")}
              placeholder={t(
                "form.notesPlaceholder",
                "Any special requests for your whole order?"
              )}
            />
          </div> */}

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                {t("cancel", "Cancel")}
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              style={{
                backgroundColor: "#FF1493",
                color: "white",
                transition: "colors 0.2s ease",
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#C71585"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#FF1493"}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("submit", "Send Order to Restaurant")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
