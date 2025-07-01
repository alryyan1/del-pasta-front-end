// src/pages/BuffetOrdersListPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import axiosClient from '@/helpers/axios-client';
import { url as baseURL } from '@/helpers/constants';
import { BuffetOrder } from '@/Types/buffet-types';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

// Shadcn UI & Icons
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Search, Calendar as CalendarIcon, X } from 'lucide-react';

// Local Components
import { BuffetOrdersTable } from '@/components/admin/BuffetOrdersTable';
import { useDebounce } from '@/hooks/use-debounce';
import { BuffetOrderDetailsDialog } from '@/components/admin/BuffetOrderDetailsDialog';

// Define the type for pagination links from Laravel
interface PaginationData {
    current_page: number;
    last_page: number;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
}

const BuffetOrdersListPage: React.FC = () => {
    const { t } = useTranslation('buffet');
    
    // State
    const [buffetOrders, setBuffetOrders] = useState<BuffetOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [paginationData, setPaginationData] = useState<PaginationData | null>(null);

    // Filters State
    const [searchTerm, setSearchTerm] = useState('');
    const [stateFilter, setStateFilter] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();

    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    
    const handleViewDetails = (orderId: number) => {
        setSelectedOrderId(orderId);
        setIsDetailOpen(true);
    };
    
    // Debounce search terms to avoid rapid API calls
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const debouncedStateFilter = useDebounce(stateFilter, 500);

    const fetchBuffetOrders = useCallback(async (url: string | null) => {
        if (!url) return;
        setIsLoading(true);
        try {
            // Use URL object to easily manage query params
            const fetchUrl = new URL(baseURL + url.replace(/^\//, ''));
            
            if (debouncedSearchTerm) fetchUrl.searchParams.set('search', debouncedSearchTerm);
            if (debouncedStateFilter) fetchUrl.searchParams.set('state', debouncedStateFilter);
            if (selectedDate) fetchUrl.searchParams.set('date', dayjs(selectedDate).format('YYYY-MM-DD'));
            
            const response = await axiosClient.get(fetchUrl.toString());
            setBuffetOrders(response.data.data);
            const { ...pagination } = response.data;
            setPaginationData(pagination);
        } catch {
            toast.error(t('ordersManagement.fetchError'));
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearchTerm, debouncedStateFilter, selectedDate]);

    useEffect(() => {
        // Trigger fetch when debounced filters change
        fetchBuffetOrders('/buffet-orders');
    }, [debouncedSearchTerm, debouncedStateFilter, selectedDate, fetchBuffetOrders]);

    const clearFilters = () => {
        setSearchTerm('');
        setStateFilter('');
        setSelectedDate(undefined);
    };

    return (
        <div className="flex justify-center w-full"> 
            <div className="container mx-auto p-2 sm:p-4 md:p-6 max-w-7xl space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('ordersManagement.title')}</CardTitle>
                        <CardDescription>{t('ordersManagement.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                            {/* Search by Name/Phone */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder={t('ordersManagement.searchPlaceholder')}
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                             {/* Search by State */}
                             <div className="relative">
                                <Input
                                    placeholder={t('ordersManagement.statePlaceholder')}
                                    value={stateFilter}
                                    onChange={e => setStateFilter(e.target.value)}
                                />
                            </div>
                            {/* Date Picker */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className="w-full justify-start text-left font-normal text-muted-foreground">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {selectedDate ? dayjs(selectedDate).format("DD MMM, YYYY") : <span>{t('ordersManagement.datePlaceholder')}</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus /></PopoverContent>
                            </Popover>
                            {/* Clear Button */}
                             <Button variant="ghost" onClick={clearFilters} className="w-full lg:w-auto">
                                <X className="h-4 w-4 mr-2" /> {t('ordersManagement.clearFilters')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {isLoading ? (
                    <div className="space-y-3">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                ) : buffetOrders.length > 0 ? (
                    <BuffetOrdersTable 
                        orders={buffetOrders} 
                        paginationData={paginationData}
                        onPageChange={fetchBuffetOrders}
                        onUpdate={() => fetchBuffetOrders('/buffet-orders')}
                        onViewDetails={handleViewDetails}
                    />
                ) : (
                    <Card>
                        <CardContent className="text-center py-16 text-muted-foreground">
                            <p>{t('ordersManagement.noOrdersFound')}</p>
                        </CardContent>
                    </Card>
                )}
            </div>
            <BuffetOrderDetailsDialog
                orderId={selectedOrderId}
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
                onUpdate={() => fetchBuffetOrders('/buffet-orders')}
            />
        </div>
    );
};

export default BuffetOrdersListPage;