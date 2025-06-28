// src/pages/BuffetOrdersListPage.tsx
import React, { useState, useEffect } from 'react';
import axiosClient from '@/helpers/axios-client';
import { BuffetOrder } from '@/Types/buffet-types';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BuffetOrdersTable } from '@/components/admin/BuffetOrdersTable';

const BuffetOrdersListPage: React.FC = () => {
  const [buffetOrders, setBuffetOrders] = useState<BuffetOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paginationData, setPaginationData] = useState(null);

  const fetchBuffetOrders = async (url = '/buffet-orders') => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get(url);
      setBuffetOrders(response.data.data);
      // Omit 'data' property to store pagination links
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data: _, ...pagination } = response.data;
      setPaginationData(pagination);
    } catch {
      toast.error('Failed to fetch buffet orders.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBuffetOrders();
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Buffet Orders</CardTitle>
          <CardDescription>View and manage all submitted buffet orders.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <BuffetOrdersTable 
                orders={buffetOrders} 
                paginationData={paginationData}
                onPageChange={(url: string) => fetchBuffetOrders(url)}
                onUpdate={() => fetchBuffetOrders()}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BuffetOrdersListPage;