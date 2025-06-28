// src/pages/OrderrHeader.tsx
import React, { useState } from 'react';
import axiosClient from "@/helpers/axios-client";
import { Order } from "@/Types/types";
import { useCustomerStore } from './Customer/useCustomer';
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

// Components & Icons
import { CustomerCombobox } from '@/components/CustomerCombobox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Car, HomeIcon, MessageSquare, PenSquare, Plus, Printer, Trash2, Loader2,
} from "lucide-react";
import { FaWhatsapp } from 'react-icons/fa'; // Using react-icons for WhatsApp
import dayjs from 'dayjs';

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
          // The base64 data is already in the response to be sent
          toast.success(data.message || 'WhatsApp message sent!');
          updateOrder({ whatsapp: true });
        } else {
          // For direct printing
          printJS({
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
                setSelectedOrder(null); // Clear the selected order
                // The parent component should handle removing it from the list
            })
            .catch(() => toast.error('Failed to delete order.'));
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 md:gap-4">
      {/* Left side: Order Info & Creation */}
      <div className="flex items-center gap-2">
        <Button size="icon" variant="outline" onClick={newOrderHandler}>
          <Plus className="h-4 w-4" />
          <span className="sr-only">New Order</span>
        </Button>
        <div className="flex items-center p-2 h-10 rounded-md border bg-slate-100 dark:bg-slate-800">
          <span className="text-sm font-medium text-muted-foreground mr-2">Order:</span>
          <span className="font-bold text-lg">#{selectedOrder?.order_number || 'N/A'}</span>
        </div>
      </div>

      {/* Center: Customer & Date (only if an order is selected) */}
      {selectedOrder && (
        <div className="flex flex-wrap items-center gap-2 flex-grow justify-center">
            <CustomerCombobox
              customers={customers}
              selectedCustomer={selectedOrder.customer || null}
              onSelectCustomer={handleCustomerSelect}
              onAddNew={() => setIsCustomerFormOpen(true)}
              disabled={!selectedOrder}
            />
            <div className="flex items-center gap-2">
                <Label htmlFor="delivery-date" className="text-sm">Date:</Label>
                <Input
                  id="delivery-date"
                  type="date"
                  className="w-[150px]"
                  value={selectedOrder.delivery_date ? dayjs(selectedOrder.delivery_date).format('YYYY-MM-DD') : ''}
                  onChange={(e) => updateOrder({ delivery_date: e.target.value })}
                />
            </div>
        </div>
      )}

      {/* Right side: Actions (only if an order is selected) */}
      {selectedOrder && (
        <div className="flex items-center gap-1">
          <Select value={selectedOrder.status} onValueChange={(value) => updateOrder({ status: value })}>
              <SelectTrigger className="w-[130px] h-9">
                  <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="in preparation">In Preparation</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={() => setIsNoteDialogOpen(true)} title="Notes">
            <PenSquare className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon" onClick={() => handlePrint(false)} title="Print">
            <Printer className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon" onClick={() => handlePrint(true)} disabled={isSending} title="Send WhatsApp">
            {isSending ? <Loader2 className="h-4 w-4 animate-spin"/> : <FaWhatsapp className="h-4 w-4 text-green-500"/>}
          </Button>
          
          <Button variant="destructive" size="icon" onClick={handleDeleteOrder} title="Delete Order">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderHeader;