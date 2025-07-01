// src/components/InfoItem.tsx (Already complete and correct)

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideProps } from 'lucide-react';

interface InfoItemProps {
  name: string;
  value: number;
  InfoIcon: React.FC<LucideProps>;
  moneyTxt?: boolean;
  decimalPoints?: number;
  currency?: string;
}

export const InfoItem: React.FC<InfoItemProps> = ({ 
  name, 
  value, 
  InfoIcon, 
  moneyTxt = false, 
  decimalPoints = 3,
  currency = 'OMR'
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{name}</CardTitle>
        <InfoIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {moneyTxt ? `${Number(value).toFixed(decimalPoints)} ${currency}` : Math.round(value)}
        </div>
      </CardContent>
    </Card>
  );
};