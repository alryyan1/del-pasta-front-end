// src/components/admin/OnlineOrderCardMobile.tsx
import React from 'react';
import { FoodOrder } from '@/Types/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Phone, Hash } from 'lucide-react';
import dayjs from 'dayjs';

interface OnlineOrderCardMobileProps {
  order: FoodOrder;
  onClick: () => void;
}

const statusVariantMap: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  pending: 'outline',
  confirmed: 'secondary',
  preparing: 'secondary',
  delivered: 'default',
  cancelled: 'destructive',
};

export const OnlineOrderCardMobile: React.FC<OnlineOrderCardMobileProps> = ({ order, onClick }) => {
  return (
    <Card onClick={onClick} className="cursor-pointer active:scale-[0.98]">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 pb-2">
        <div>
          <CardTitle className="text-base font-bold flex items-center">
            <Hash className="h-4 w-4 mr-1 text-muted-foreground" />
            {order.order_number}
          </CardTitle>
          <p className="text-xs text-muted-foreground pt-1">
            {dayjs(order.created_at).format('DD MMM, YYYY h:mm A')}
          </p>
        </div>
        <Badge variant={statusVariantMap[order.status] || 'default'}>{order.status}</Badge>
      </CardHeader>
      <CardContent className="p-4 pt-2 text-sm">
        <div className="space-y-2">
            <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{order.customer_name}</span>
            </div>
            <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{order.customer_phone}</span>
            </div>
        </div>
        <div className="mt-3 pt-3 border-t text-right">
             <p className="font-bold text-lg text-brand-pink-DEFAULT">{Number(order.total_price).toFixed(3)} OMR</p>
        </div>
      </CardContent>
    </Card>
  );
};