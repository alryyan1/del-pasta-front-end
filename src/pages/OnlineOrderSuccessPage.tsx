import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axiosClient from "@/helpers/axios-client";
import { webUrl } from "@/helpers/constants";

// Shadcn UI & Icons
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle,
  MessageCircle,
  Phone,
  MapPin,
  ShoppingBag,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

interface OrderItem {
  id: number;
  meal_id: number;
  quantity: number;
  price: number;
  meal: {
    id: number;
    name: string;
    image_url?: string;
  };
}

interface OrderDetails {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address?: string;
  total_price: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

const OnlineOrderSuccessPage: React.FC = () => {
  const { t, i18n } = useTranslation(["checkout", "cart"]);
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [whatsappSent, setWhatsappSent] = useState(false);

  useEffect(() => {
    document.body.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError(t("error.invalidOrder", "Invalid order ID"));
        setIsLoading(false);
        return;
      }

      try {
        const response = await axiosClient.get(`/online-orders/${orderId}`);
        setOrder(response.data.data);
        // Assume WhatsApp was sent if order exists (based on backend logic)
        setWhatsappSent(true);
      } catch (err) {
        console.error("Failed to fetch order details:", err);
        setError(t("error.fetchOrder", "Failed to load order details"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, t]);

  const handleBackToMenu = () => {
    navigate("/online-order");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Skeleton className="h-8 w-64 mb-6" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="text-center">
            <CardHeader>
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <CardTitle className="text-destructive">
                {t("error.title", "Order Not Found")}
              </CardTitle>
              <CardDescription>
                {error || t("error.description", "We couldn't find your order details.")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleBackToMenu} className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("backToMenu", "Back to Menu")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {t("sent.title", "Order sent!")}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t("sent.description", "Thank you! Your order has been sent to the restaurant.")}
          </p>
        </div>

        {/* Order Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              {t("orderDetails", "Order Details")}
            </CardTitle>
            <CardDescription>
              {t("orderNumber", "Order #")}{order.order_number}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Customer Information */}
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                {t("customerInfo", "Customer Information")}
              </h4>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="font-medium">{order.customer_name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Phone className="h-4 w-4" />
                <span>{order.customer_phone}</span>
              </div>
              {order.customer_address && (
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <MapPin className="h-4 w-4" />
                  <span>{order.customer_address}</span>
                </div>
              )}
            </div>

            <Separator />

            {/* Order Items */}
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                {t("orderItems", "Order Items")}
              </h4>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex-shrink-0 w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden">
                      {item.meal.image_url ? (
                        <img
                          src={`${webUrl}/images/${item.meal.image_url}`}
                          alt={item.meal.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-6 w-6 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        {item.meal.name}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {t("quantity", "Quantity")}: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium" style={{ color: "#FF1493" }}>
                        {(Number(item.price) * item.quantity).toFixed(3)} {t("cart:currency_OMR", "OMR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Total */}
            <div className="flex justify-between items-center text-lg font-bold">
              <span>{t("total", "Total")}</span>
              <span style={{ color: "#FF1493" }}>
                {Number(order.total_price).toFixed(3)} {t("cart:currency_OMR", "OMR")}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* WhatsApp Status Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              {t("whatsappStatus", "WhatsApp Notification")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {whatsappSent ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-green-700 dark:text-green-400">
                      {t("whatsappSent", "Message Sent Successfully")}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t("whatsappDescription", "Your order has been sent to the restaurant via WhatsApp.")}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="font-medium text-amber-700 dark:text-amber-400">
                      {t("whatsappPending", "Message Pending")}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t("whatsappPendingDescription", "We're sending your order to the restaurant. Please wait a moment.")}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t("orderStatus", "Order Status")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge 
              variant={order.status === "pending" ? "secondary" : "default"}
              className="capitalize"
            >
              {order.status}
            </Badge>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              {t("statusDescription", "The restaurant will contact you shortly to confirm your order.")}
            </p>
          </CardContent>
        </Card>

        {/* Back to Menu Button */}
        <div className="text-center">
          <Button 
            onClick={handleBackToMenu}
            size="lg"
            style={{
              backgroundColor: "#FF1493",
              color: "white",
              transition: "colors 0.2s ease",
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#C71585"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#FF1493"}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToMenu", "Back to Menu")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnlineOrderSuccessPage; 