// src/components/admin/OnlineOrdersTable.tsx
import React from 'react';
import { useMediaQuery } from '@mui/material';
import { FoodOrder } from '@/Types/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import dayjs from 'dayjs';
import { OnlineOrderCardMobile } from './OnlineOrderCardMobile';
import { useTranslation } from 'react-i18next';

interface OnlineOrdersTableProps {
  orders: FoodOrder[];
  onOrderClick: (order: FoodOrder) => void;
}

const statusVariantMap: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  pending: 'outline',
  confirmed: 'secondary',
  preparing: 'secondary',
  delivered: 'default',
  cancelled: 'destructive',
};

export const OnlineOrdersTable: React.FC<OnlineOrdersTableProps> = ({ orders, onOrderClick }) => {
  const { t } = useTranslation(['admin_orders']);
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <div className="space-y-3">
        {orders.map(order => (
          <OnlineOrderCardMobile key={order.id} order={order} onClick={() => onOrderClick(order)} />
        ))}
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='text-center'>{t('table.orderNumber')}</TableHead>
            <TableHead className='text-center'>{t('table.customer')}</TableHead>
            <TableHead className='text-center'>{t('table.phone')}</TableHead>
            <TableHead className='text-center'>{t('table.date')}</TableHead>
            <TableHead className='text-center'>{t('table.address')}</TableHead>
            <TableHead className='text-center'>{t('table.status')}</TableHead>
            <TableHead className="text-center">{t('table.total')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} onClick={() => onOrderClick(order)} className="cursor-pointer">
              <TableCell className="font-mono font-medium text-center">{order.id}</TableCell>
              <TableCell className='text-center'>{order.customer_name}</TableCell>
              <TableCell className='text-center'>{order.customer_phone}</TableCell>
              <TableCell className='text-center'>{dayjs(order.created_at).format('DD MMM, YYYY h:mm A')}</TableCell>
              <TableCell className='text-center'>{order.customer_address}</TableCell>
              <TableCell>
                <Badge variant={statusVariantMap[order.status] || 'default'}>{t(`status.${order.status}`)}</Badge>
              </TableCell>
              <TableCell className="text-center font-semibold">{Number(order.total_price).toFixed(3)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};