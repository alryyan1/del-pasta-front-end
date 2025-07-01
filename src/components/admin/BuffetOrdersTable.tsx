// src/components/admin/BuffetOrdersTable.tsx
import React from 'react';
import { BuffetOrder } from '@/Types/buffet-types';
import dayjs from 'dayjs';
import axiosClient from '@/helpers/axios-client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Eye } from 'lucide-react';

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
  onViewDetails?: (orderId: number) => void; // Add optional prop for view details
}

export const BuffetOrdersTable: React.FC<BuffetOrdersTableProps> = ({ orders, paginationData, onPageChange, onUpdate, onViewDetails }) => {
  const { t } = useTranslation('buffet');

  const getStatusVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'delivered': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'pending': default: return 'outline';
    }
  };

  const handleViewDetails = (orderId: number) => {
    if (onViewDetails) {
        onViewDetails(orderId);
    }
  }

  const handleStatusChange = (orderId: number, newStatus: string) => {
    axiosClient.put(`/buffet-orders/${orderId}`, { status: newStatus })
        .then(() => {
            toast.success(t('ordersManagement.table.statusUpdateSuccess'));
            onUpdate(); // Trigger data refresh in the parent page
        })
        .catch(() => toast.error(t('ordersManagement.table.statusUpdateError')));
  }

  return (
    <>
        <div className="border rounded-md">
            <Table className="mx-auto">
                <TableHeader>
                    <TableRow>
                        <TableHead className='text-center'>{t('ordersManagement.table.orderNumber')}</TableHead>
                        <TableHead className='text-center'>{t('ordersManagement.table.customer')}</TableHead>
                        <TableHead className='text-center'>{t('ordersManagement.table.phone')}</TableHead>
                        <TableHead className='text-center'>{t('ordersManagement.table.address')}</TableHead>
                        <TableHead className='text-center'>{t('ordersManagement.table.package')}</TableHead>
                        <TableHead className='text-center'>{t('ordersManagement.table.price')}</TableHead>
                        <TableHead className='text-center'>{t('ordersManagement.table.deliveryDate')}</TableHead>
                        <TableHead className="w-[150px] text-center">{t('ordersManagement.table.status')}</TableHead>
                        <TableHead className="text-center">{t('ordersManagement.table.actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {orders.length > 0 ? orders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell className="font-medium text-center">{order.order_number}</TableCell>
                        <TableCell className='text-center'>{order.customer?.name || t('ordersManagement.table.notAvailable')}</TableCell>
                        <TableCell className='text-center'>{order.customer?.phone || t('ordersManagement.table.notAvailable')}</TableCell>
                        <TableCell className='text-center'>{order.customer?.address || t('ordersManagement.table.notAvailable')}</TableCell>
                        <TableCell className='text-center'>{order.buffetPackage?.name_ar || t('ordersManagement.table.notAvailable')}</TableCell>
                        <TableCell className='text-center'>{Number(order.base_price).toFixed(3)}</TableCell>
                        <TableCell className='text-center'>{dayjs(order.delivery_date).format('DD MMM, YYYY')} @ {dayjs(`1970-01-01 ${order.delivery_time}`).format('h:mm A')}</TableCell>
                        <TableCell className='text-center'>
                            <Select defaultValue={order.status} onValueChange={(value) => handleStatusChange(order.id, value)}>
                                <SelectTrigger>
                                    <SelectValue>
                                        <Badge variant={getStatusVariant(order.status)}>{t(`orderDetails.status.${order.status}`)}</Badge>
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">{t('orderDetails.status.pending')}</SelectItem>
                                    <SelectItem value="confirmed">{t('orderDetails.status.confirmed')}</SelectItem>
                                    <SelectItem value="delivered">{t('orderDetails.status.delivered')}</SelectItem>
                                    <SelectItem value="cancelled">{t('orderDetails.status.cancelled')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell className="text-center">
                            <Button variant="ghost" size="icon" onClick={() => handleViewDetails(order.id)}>
                                <Eye className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                )) : (
                    <TableRow><TableCell colSpan={9} className="h-24 text-center">{t('ordersManagement.noOrdersTable')}</TableCell></TableRow>
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
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t('ordersManagement.previous')}
                </Button>
                <span className="text-sm text-muted-foreground">
                    {t('ordersManagement.pageOf', { current: paginationData.current_page, total: paginationData.last_page })}
                </span>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => paginationData.next_page_url && onPageChange(paginationData.next_page_url)} 
                    disabled={!paginationData.next_page_url}
                >
                    {t('ordersManagement.next')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        )}

    </>
  );
};