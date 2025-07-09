// src/pages/OnlineOrdersListPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import axiosClient from '@/helpers/axios-client';
import { FoodOrder } from '@/Types/types'; // Using your main types file
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

// Shadcn UI & Icons
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

// Local Components
import { OnlineOrdersTable } from '@/components/admin/OnlineOrdersTable';
import { OnlineOrderDetailsDialog } from '@/components/admin/OnlineOrderDetailsDialog';

// Define the type for pagination links from Laravel
interface PaginationData {
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

const OnlineOrdersListPage: React.FC = () => {
  const { t } = useTranslation(['admin_orders', 'common']);

  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paginationData, setPaginationData] = useState<PaginationData | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<FoodOrder | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce the search input to avoid excessive API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Central function to fetch orders, handles pagination and search
  const fetchOrders = useCallback(async (url = '/online-orders') => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get(url, { 
        params: { search: debouncedSearchTerm } 
      });
      setOrders(response.data.data);
      const { data, ...pagination } = response.data;
      setPaginationData(pagination);
    } catch {
      toast.error(t('error.fetchFailed', 'Failed to fetch online orders.'));
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, t]);

  // Fetch data when the debounced search term changes
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handler to open the details dialog
  const handleOrderClick = async (order: FoodOrder) => {
    try {
      // Fetch the latest details for the selected order before showing the dialog
      const response = await axiosClient.get(`/online-orders/${order.id}`);
      console.log('Order details response:', response.data); // Debug log
      
      // Check if the response has the expected structure
      const orderData = response.data.data || response.data;
      console.log('Setting selected order:', orderData); // Debug log
      
      setSelectedOrder(orderData);
      setIsDetailsOpen(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error(t('error.fetchSingleFailed', 'Could not load order details.'));
    }
  };

  return (
    // Main container with centering for very large screens
    <div className="flex justify-center w-full">
      <div className="container mx-auto p-2 sm:p-4 md:p-6 max-w-7xl">
        <Card>
          <CardHeader>
            <CardTitle>{t('title', 'Online Food Orders')}</CardTitle>
            <CardDescription>{t('description', 'View and manage all orders submitted from the website.')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('searchPlaceholder', 'Search by order #, name, or phone...')}
                className="pl-9"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : orders.length > 0 ? (
              <OnlineOrdersTable orders={orders} onOrderClick={handleOrderClick} />
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <p>{t('noOrdersFound', 'No online orders found.')}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Pagination Controls */}
        {paginationData && paginationData.last_page > 1 && (
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchOrders(paginationData.prev_page_url!)}
              disabled={!paginationData.prev_page_url || isLoading}
            >
              {t('common:previous', 'Previous')}
            </Button>
            <div className="text-sm text-muted-foreground">
              {t('common:page', 'Page {{currentPage}} of {{lastPage}}', {
                currentPage: paginationData.current_page,
                lastPage: paginationData.last_page,
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchOrders(paginationData.next_page_url!)}
              disabled={!paginationData.next_page_url || isLoading}
            >
              {t('common:next', 'Next')}
            </Button>
          </div>
        )}

        {/* The Details Dialog */}
        <OnlineOrderDetailsDialog 
          order={selectedOrder} 
          open={isDetailsOpen} 
          onOpenChange={(open) => {
            setIsDetailsOpen(open);
            if (!open) {
              setSelectedOrder(null); // Clear selected order when dialog closes
            }
          }}
          onUpdate={fetchOrders} // Pass fetchOrders to refresh the list after an update
        />
      </div>
    </div>
  );
};

export default OnlineOrdersListPage;