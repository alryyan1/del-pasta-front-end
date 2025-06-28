// src/components/admin/BuffetOrdersTable.tsx
import React, { useState } from 'react';
import { BuffetOrder } from '@/Types/buffet-types';
import dayjs from 'dayjs';
import axiosClient from '@/helpers/axios-client';
import { toast } from 'sonner';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Eye } from 'lucide-react';
import { BuffetOrderDetailsDialog } from './BuffetOrderDetailsDialog'; // Import the new dialog

interface PaginationData {
  current_page: number;
  last_page: number;
  prev_page_url: string | null;
  next_page_url: string | null;
}

interface BuffetOrdersTableProps {
  orders: BuffetOrder[];
  paginationData: PaginationData | null;
  onPageChange: (url: string) => void;
  onUpdate: () => void; // Add a callback to refresh data after status update
}

export const BuffetOrdersTable: React.FC<BuffetOrdersTableProps> = ({ orders, paginationData, onPageChange, onUpdate }) => {
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<BuffetOrder | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const getStatusVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'delivered': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'pending': default: return 'outline';
    }
  };

  const handleViewDetails = async (orderId: number) => {
    try {
        const response = await axiosClient.get(`/buffet-orders/${orderId}`);
        setSelectedOrderDetails(response.data);
        setIsDetailDialogOpen(true);
    } catch {
        toast.error("Failed to fetch order details.");
    }
  }

  const handleStatusChange = (orderId: number, newStatus: string) => {
    axiosClient.put(`/buffet-orders/${orderId}`, { status: newStatus })
        .then(() => {
            toast.success("Order status updated.");
            onUpdate(); // Trigger data refresh in the parent page
        })
        .catch(() => toast.error("Failed to update status."));
  }

  return (
    <>
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Package</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Delivery Date</TableHead>
                        <TableHead className="w-[150px]">Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {orders.length > 0 ? orders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.order_number}</TableCell>
                        <TableCell>{order.customer.name}</TableCell>
                        <TableCell>{order.buffetPackage.name_ar}</TableCell>
                        <TableCell>{Number(order.base_price).toFixed(3)}</TableCell>
                        <TableCell>{dayjs(order.delivery_date).format('DD MMM, YYYY')} @ {dayjs(`1970-01-01 ${order.delivery_time}`).format('h:mm A')}</TableCell>
                        <TableCell>
                            <Select defaultValue={order.status} onValueChange={(value) => handleStatusChange(order.id, value)}>
                                <SelectTrigger>
                                    <SelectValue>
                                        <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleViewDetails(order.id)}>
                                <Eye className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                )) : (
                    <TableRow><TableCell colSpan={7} className="h-24 text-center">No buffet orders found.</TableCell></TableRow>
                )}
                </TableBody>
            </Table>
        </div>
        {/* Pagination Controls */}
        {paginationData && (
            <div className="flex items-center justify-between space-x-2 py-4">
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => paginationData.prev_page_url && onPageChange(paginationData.prev_page_url)} 
                    disabled={!paginationData.prev_page_url}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                    Page {paginationData.current_page} of {paginationData.last_page}
                </span>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => paginationData.next_page_url && onPageChange(paginationData.next_page_url)} 
                    disabled={!paginationData.next_page_url}
                >
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        )}

        <BuffetOrderDetailsDialog
            order={selectedOrderDetails}
            open={isDetailDialogOpen}
            onOpenChange={setIsDetailDialogOpen}
        />
    </>
  );
};