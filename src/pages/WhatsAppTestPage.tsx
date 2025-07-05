import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import axiosClient from "@/helpers/axios-client";
import { toast } from "sonner";

// Shadcn UI & Icons
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MessageCircle,
  Send,
  CheckCircle,
  XCircle,
  Loader2,
  Phone,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WhatsAppResponse {
  data: {
    status: string;
    instanceId: string;
    data: {
      id: {
        fromMe: boolean;
        remote: string;
        id: string;
        _serialized: string;
      };
      body: string;
      type: string;
      timestamp: number;
      from: string;
      to: string;
      ack: number;
      hasMedia: boolean;
      deviceType: string;
      isForwarded: boolean;
      fromMe: boolean;
    };
  };
  links: {
    self: string;
  };
  status: string;
}

const WhatsAppTestPage: React.FC = () => {
  const { t, i18n } = useTranslation(["whatsapp", "common"]);
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("78622990");
  const [message, setMessage] = useState("Test message from Del Pasta ordering system");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<WhatsAppResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [testHistory, setTestHistory] = useState<Array<{
    id: string;
    phone: string;
    message: string;
    timestamp: Date;
    success: boolean;
    response?: WhatsAppResponse;
    error?: string;
  }>>([]);

  const handleSendMessage = async () => {
    if (!phoneNumber.trim() || !message.trim()) {
      toast.error(t("validation.required", "Phone number and message are required"));
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const response = await axiosClient.post("/whatsapp/test", {
        phone: phoneNumber,
        message: message,
      });

      if (response.data.success) {
        setResponse(response.data.response);
        toast.success(t("success.sent", "Message sent successfully!"));
        
        // Add to history
        const newTest = {
          id: Date.now().toString(),
          phone: phoneNumber,
          message: message,
          timestamp: new Date(),
          success: true,
          response: response.data.response,
        };
        setTestHistory(prev => [newTest, ...prev.slice(0, 9)]); // Keep last 10 tests
      } else {
        throw new Error(response.data.error || "Failed to send message");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || "Failed to send message";
      setError(errorMessage);
      toast.error(t("error.failed", "Failed to send message"));
      
      // Add to history
      const newTest = {
        id: Date.now().toString(),
        phone: phoneNumber,
        message: message,
        timestamp: new Date(),
        success: false,
        error: errorMessage,
      };
      setTestHistory(prev => [newTest, ...prev.slice(0, 9)]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: number | Date) => {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("common:back", "Back")}
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <MessageCircle className="h-8 w-8 text-green-500" />
              {t("title", "WhatsApp API Test")}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              {t("description", "Test WhatsApp API connectivity and message sending functionality")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                {t("form.title", "Send Test Message")}
              </CardTitle>
              <CardDescription>
                {t("form.description", "Enter phone number and message to test the WhatsApp API")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {t("form.phone", "Phone Number")}
                </Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-slate-500 bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-300 dark:border-slate-700 rounded-l-md">
                    +968
                  </span>
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="78622990"
                    className="rounded-l-none"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  {t("form.phoneHint", "Enter Omani phone number without country code")}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  {t("form.message", "Message")}
                </Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("form.messagePlaceholder", "Enter your test message...")}
                  rows={4}
                />
              </div>

              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !phoneNumber.trim() || !message.trim()}
                className="w-full"
                style={{
                  backgroundColor: "#25D366",
                  color: "white",
                  transition: "colors 0.2s ease",
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1DA851"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#25D366"}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("form.sending", "Sending...")}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {t("form.send", "Send Test Message")}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Response Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                {t("response.title", "API Response")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                  <span className="ml-2 text-slate-600 dark:text-slate-400">
                    {t("response.loading", "Sending message...")}
                  </span>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{t("response.error", "Error")}:</strong> {error}
                  </AlertDescription>
                </Alert>
              )}

              {response && (
                <div className="space-y-4">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>{t("response.success", "Success")}:</strong> {t("response.successMessage", "Message sent successfully!")}
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {response.status}
                      </Badge>
                      <span className="text-sm text-slate-500">
                        Instance: {response.data.instanceId}
                      </span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg space-y-2 text-sm">
                      <div><strong>Message ID:</strong> {response.data.data.id.id}</div>
                      <div><strong>To:</strong> {response.data.data.to}</div>
                      <div><strong>From:</strong> {response.data.data.from}</div>
                      <div><strong>Timestamp:</strong> {formatTimestamp(response.data.data.timestamp)}</div>
                      <div><strong>Acknowledgment:</strong> {response.data.data.ack}</div>
                      <div><strong>Device:</strong> {response.data.data.deviceType}</div>
                    </div>

                    <details className="text-sm">
                      <summary className="cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
                        {t("response.viewFull", "View Full Response")}
                      </summary>
                      <pre className="mt-2 p-3 bg-slate-100 dark:bg-slate-900 rounded text-xs overflow-auto">
                        {JSON.stringify(response, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              )}

              {!isLoading && !error && !response && (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  {t("response.empty", "No response yet. Send a test message to see the API response.")}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Test History */}
        {testHistory.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>{t("history.title", "Test History")}</CardTitle>
              <CardDescription>
                {t("history.description", "Recent WhatsApp API test results")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testHistory.map((test) => (
                  <div key={test.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {test.success ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="font-medium">+968{test.phone}</span>
                        <Badge variant={test.success ? "default" : "destructive"}>
                          {test.success ? t("history.success", "Success") : t("history.failed", "Failed")}
                        </Badge>
                      </div>
                      <span className="text-sm text-slate-500">
                        {test.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {test.message}
                    </p>
                    {test.error && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {t("history.error", "Error")}: {test.error}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WhatsAppTestPage; 