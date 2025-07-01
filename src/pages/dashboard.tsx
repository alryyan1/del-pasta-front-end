// src/pages/dashboard.tsx

import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, Users, Utensils } from 'lucide-react';
import axiosClient from '@/helpers/axios-client';
import dayjs from 'dayjs';
import { toast } from 'sonner';

// Shadcn UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

// Local Components
import { InfoItem } from '@/components/InfoItem';

// Define types for the data we expect from the API
interface DashboardInfo {
  totalRevenue: number;
  totalOrders: number;
  activeCustomers: number;
}
interface ChartData {
  name: string; // Represents the day of the month, e.g., "01", "02"
  sales: number;
}

// --- Main Dashboard Component ---
const Dashboard: React.FC = () => {
  const { t } = useTranslation('dashboard');

  // --- State Management ---
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [info, setInfo] = useState<DashboardInfo>({ totalRevenue: 0, totalOrders: 0, activeCustomers: 0 });
  const [ordersToday, setOrdersToday] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState<string>(dayjs().format('M')); // Month number as a string (e.g., "1" for Jan)
  const [isLoading, setIsLoading] = useState(true);

  // --- Data and Options ---
  // Memoize month options to prevent re-creation on every render
  const monthOptions = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      value: (i + 1).toString(),
      label: dayjs().month(i).format('MMMM'),
    })), []);

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const params = { month: selectedMonth };
        
        // Fetch all data points in parallel for better performance
        const [infoRes, chartRes, todayRes] = await Promise.all([
          axiosClient.get('/info', { params }),
          axiosClient.get('/ordersInfoGraphic', { params }),
          axiosClient.get('/orders?today=1')
        ]);
        
        setInfo(infoRes.data);
        setChartData(chartRes.data);
        setOrdersToday(Array.isArray(todayRes.data) ? todayRes.data.length : 0);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast.error(t('error.fetchFailed', 'Failed to load dashboard data.'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, t]); // Re-run effect when selectedMonth or language changes

  // --- Loading Skeleton UI ---
  if (isLoading) {
    return (
        <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-10 w-full sm:w-48" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28 rounded-lg" />
                <Skeleton className="h-28 rounded-lg" />
                <Skeleton className="h-28 rounded-lg" />
                <Skeleton className="h-28 rounded-lg" />
            </div>
            <Card>
                <CardContent className="p-2 sm:p-6">
                    <Skeleton className="h-80 w-full" />
                </CardContent>
            </Card>
        </div>
    );
  }

  // --- Main Component Render ---
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header: Stacks on mobile, space-between on desktop */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('title', 'Dashboard')}</h1>
        <div className="w-full sm:w-[200px]">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger>
              <SelectValue placeholder={t('selectMonth', 'Select Month')} />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards: Stacks on mobile, grid on larger screens */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <InfoItem name={t('totalRevenue', 'Total Revenue')} value={info.totalRevenue} InfoIcon={DollarSign} moneyTxt decimalPoints={3}/>
        <InfoItem name={t('totalOrders', 'Total Orders')} value={info.totalOrders} InfoIcon={ShoppingBag} decimalPoints={0} />
        <InfoItem name={t('ordersToday', 'Orders Today')} value={ordersToday} InfoIcon={Utensils} decimalPoints={0} />
        <InfoItem name={t('activeCustomers', 'Active Customers')} value={info.activeCustomers} InfoIcon={Users} decimalPoints={0} />
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t('revenueOverview', 'Revenue Overview')}</CardTitle>
          <CardDescription>{t('revenueDescription', 'Monthly revenue based on daily sales.')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D946EF" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="#D946EF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.5} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} dy={5} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(value: number) => `${value}`} allowDecimals={false} />
                <Tooltip
                  cursor={{ stroke: '#D946EF', strokeWidth: 1, strokeDasharray: '3 3' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                  }}
                />
                <Area type="monotone" dataKey="sales" stroke="#D946EF" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// **This is the crucial part that fixes the error.**
export default Dashboard;