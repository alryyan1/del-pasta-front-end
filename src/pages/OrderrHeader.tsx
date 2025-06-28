// src/pages/OrderrHeader.tsx
import React, { useState } from 'react';
import axiosClient from "@/helpers/axios-client";
import { Order } from "@/Types/types";
import { useCustomerStore } from './Customer/useCustomer';
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import dayjs from 'dayjs';

// Components & Icons
import { CustomerCombobox } from '@/components/CustomerCombobox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Plus, User, Calendar, MessageSquare, Printer, Trash2, Loader2, MoreVertical
} from "lucide-react";
import { FaWhatsapp } from 'react-icons/fa';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

interface OrderHeaderProps {
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  newOrderHandler: () => void;
  setIsCustomerFormOpen: (isOpen: boolean) => void;
  setIsNoteDialogOpen: (isOpen: boolean) => void;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({
  selectedOrder,
  setSelectedOrder,
  newOrderHandler,
  setIsCustomerFormOpen,
  setIsNoteDialogOpen
}) => {
  const { t } = useTranslation("orderheader");
  const { customers, fetchData: fetchCustomers } = useCustomerStore();
  const [isSending, setIsSending] = useState<boolean>(false);

  React.useEffect(() => {
    if (customers.length === 0) {
      fetchCustomers();
    }
  }, [customers, fetchCustomers]);

  const updateOrder = (field: Partial<Order>) => {
    if (!selectedOrder) return;
    axiosClient.patch(`/orders/${selectedOrder.id}`, field)
      .then(({ data }) => {
        if (data.status) {
          setSelectedOrder(data.order);
          toast.success(`${Object.keys(field)[0]} updated.`);
        } else {
          toast.error(data.message || 'Update failed.');
        }
      })
      .catch(() => toast.error('Failed to update order.'));
  };

  const handleCustomerSelect = (customer: any) => {
    if (customer) {
      updateOrder({ customer_id: customer.id });
    }
  };

  const handlePrint = (asBase64ForWhatsApp = false) => {
    if (!selectedOrder) return;
    setIsSending(true);
    const endpoint = `printSale?order_id=${selectedOrder.id}&base64=${asBase64ForWhatsApp ? 2 : 1}`;
    
    axiosClient.get(endpoint)
      .then(({ data }) => {
        if (data.error) {
          toast.error(data.error);
          return;
        }
        if (asBase64ForWhatsApp) {
          toast.success(data.message || 'WhatsApp message sent!');
          updateOrder({ whatsapp: true });
        } else {
          // For direct printing - using printJS from global scope
          (window as any).printJS({
            printable: data.slice(data.indexOf("JVB")),
            base64: true,
            type: "pdf",
          });
        }
      })
      .catch(() => toast.error('Action failed.'))
      .finally(() => setIsSending(false));
  };

  const handleDeleteOrder = () => {
    if (!selectedOrder) return;
    if (window.confirm("Are you sure you want to delete this order?")) {
      axiosClient.delete(`/orders/${selectedOrder.id}`)
        .then(() => {
          toast.success(`Order #${selectedOrder.order_number} deleted.`);
          setSelectedOrder(null);
        })
        .catch(() => toast.error('Failed to delete order.'));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'in preparation': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300';
    }
  };

  return (
    <div className="flex flex-col gap-4 lg:gap-0 lg:flex-row lg:items-center lg:justify-between">
      {/* Left Section: New Order & Order Info */}
      <div className="flex items-center gap-3">
        <Button 
          onClick={newOrderHandler}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-md h-10"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("newOrder", "New Order")}
        </Button>

        {selectedOrder && (
          <Card className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {t("order", "Order")}:
                </span>
                <span className="font-bold text-lg text-slate-900 dark:text-slate-100">
                  #{selectedOrder.order_number}
                </span>
              </div>
              <Separator orientation="vertical" className="h-6" />
                             <Badge className={cn("text-xs font-medium", getStatusColor(selectedOrder.status || 'pending'))}>
                 {selectedOrder.status ? 
                   selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1) : 
                   'Pending'
                 }
               </Badge>
            </div>
          </Card>
        )}
      </div>

      {/* Center Section: Customer & Date (Desktop) */}
      {selectedOrder && (
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-500" />
            <CustomerCombobox
              customers={customers}
              selectedCustomer={selectedOrder.customer || null}
              onSelectCustomer={handleCustomerSelect}
              onAddNew={() => setIsCustomerFormOpen(true)}
              disabled={!selectedOrder}
            />
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-500" />
            <Input
              type="date"
              className="w-[160px] h-9"
              value={selectedOrder.delivery_date ? dayjs(selectedOrder.delivery_date).format('YYYY-MM-DD') : ''}
              onChange={(e) => updateOrder({ delivery_date: e.target.value as any })}
            />
          </div>
        </div>
      )}

      {/* Right Section: Actions */}
      {selectedOrder && (
        <div className="flex items-center gap-2">
          {/* Mobile Customer & Date */}
          <div className="lg:hidden flex flex-col gap-2 w-full">
            <CustomerCombobox
              customers={customers}
              selectedCustomer={selectedOrder.customer || null}
              onSelectCustomer={handleCustomerSelect}
              onAddNew={() => setIsCustomerFormOpen(true)}
              disabled={!selectedOrder}
            />
            <Input
              type="date"
              className="w-full h-9"
              value={selectedOrder.delivery_date ? dayjs(selectedOrder.delivery_date).format('YYYY-MM-DD') : ''}
              onChange={(e) => updateOrder({ delivery_date: e.target.value as any })}
            />
          </div>

          {/* Status Selector */}
                     <Select value={selectedOrder.status || 'pending'} onValueChange={(value) => updateOrder({ status: value })}>
             <SelectTrigger className="w-[140px] h-9">
               <SelectValue placeholder="Select Status" />
             </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  Pending
                </div>
              </SelectItem>
              <SelectItem value="confirmed">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  Confirmed
                </div>
              </SelectItem>
              <SelectItem value="in preparation">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                  In Preparation
                </div>
              </SelectItem>
              <SelectItem value="delivered">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  Delivered
                </div>
              </SelectItem>
              <SelectItem value="cancelled">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  Cancelled
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setIsNoteDialogOpen(true)} 
              title="Notes"
              className="h-9 w-9"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>

            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handlePrint(false)} 
              title="Print"
              className="h-9 w-9"
            >
              <Printer className="h-4 w-4" />
            </Button>

            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handlePrint(true)} 
              disabled={isSending} 
              title="Send WhatsApp"
              className="h-9 w-9"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FaWhatsapp className="h-4 w-4 text-green-500" />
              )}
            </Button>

            {/* More Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsNoteDialogOpen(true)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {t("editNotes", "Edit Notes")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePrint(false)}>
                  <Printer className="h-4 w-4 mr-2" />
                  {t("printReceipt", "Print Receipt")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePrint(true)} disabled={isSending}>
                  <FaWhatsapp className="h-4 w-4 mr-2 text-green-500" />
                  {t("sendWhatsApp", "Send WhatsApp")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleDeleteOrder}
                  className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t("deleteOrder", "Delete Order")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHeader;