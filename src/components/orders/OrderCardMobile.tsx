// src/components/orders/OrderCardMobile.tsx
import React from 'react';
import { Order } from '@/Types/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { User, Phone, Calendar, Clock } from 'lucide-react';
import dayjs from 'dayjs';

interface OrderCardMobileProps {
  order: Order;
  onSelectOrder: (order: Order) => void; // Function to view details or "select" it
}

const statusVariantMap: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  pending: 'outline',
  confirmed: 'secondary',
  'in preparation': 'secondary',
  Completed: 'default',
  delivered: 'default',
  cancelled: 'destructive',
};


export const OrderCardMobile: React.FC<OrderCardMobileProps> = ({ order, onSelectOrder }) => {
  const totalPrice = Number(order.totalPrice || 0);
  const amountPaid = Number(order.amount_paid || 0);
  const remaining = totalPrice - amountPaid;

  return (
    <Card onClick={() => onSelectOrder(order)} className="cursor-pointer active:scale-[0.98]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
        <CardTitle className="text-base font-bold">#{order.order_number}</CardTitle>
        <Badge variant={statusVariantMap[order.status] || 'default'}>{order.status}</Badge>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2 text-sm">
            <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{order.customer?.name || 'N/A'}</span>
            </div>
            <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{order.customer?.phone || 'N/A'}</span>
            </div>
            <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{dayjs(order.delivery_date).format('DD MMM, YYYY')}</span>
            </div>
        </div>
        <Separator className="my-3" />
        <div className="flex justify-between items-center">
            <div className="text-sm">
                <p className="text-muted-foreground">Total</p>
                <p className="font-semibold">{totalPrice.toFixed(3)}</p>
            </div>
             <div className="text-sm text-center">
                <p className="text-muted-foreground">Paid</p>
                <p className="font-semibold">{amountPaid.toFixed(3)}</p>
            </div>
            <div className="text-sm text-right">
                <p className="text-muted-foreground">Remaining</p>
                <p className={`font-semibold ${remaining > 0 ? 'text-destructive' : 'text-green-600'}`}>{remaining.toFixed(3)}</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};