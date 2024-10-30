import React, { useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import axiosClient from '@/helpers/axios-client';
import { Customer } from '@/Types/types';
import InfoItem from '@/components/InfoItem';
import { Order } from '../Types/types';

const data = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 6890 },
  { name: 'Sat', sales: 8390 },
  { name: 'Sun', sales: 7490 },
];

interface Info {
  totalRevenue: number;
  totalOrders: number;
  activeCustomers: number;
  conversionRate: number;
}
const stats = [
  { name: 'Total Revenue', value: '$45,231', icon: DollarSign },
  { name: 'Total Orders', value: '1,345', icon: ShoppingBag, },
  { name: 'Active Customers', value: '892', icon: Users,  },
  { name: 'Conversion Rate', value: '3.2%', icon: TrendingUp },
];

export default function Dashboard() {
  const [info, setInfo] = React.useState<Info>({
    totalRevenue: 0,
    totalOrders: 0,
    activeCustomers: 0,
    conversionRate: 0,
  });
  useEffect(()=>{
    axiosClient.get<Info>('info').then(({data})=>{
      setInfo(data)
    })
  },[])
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
         <InfoItem  InfoIcon={DollarSign} name='Total Revenue' value={info.totalRevenue}/>
         <InfoItem  InfoIcon={ShoppingBag} name='totalOrders' value={info.totalOrders}/>
         <InfoItem  InfoIcon={Users} name='activeCustomers' value={info.activeCustomers}/>
      
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Overview</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="sales" stroke="#4F46E5" fill="#EEF2FF" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}