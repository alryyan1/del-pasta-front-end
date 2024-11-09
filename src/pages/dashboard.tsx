import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import axiosClient from '@/helpers/axios-client';
import { Customer } from '@/Types/types';
import InfoItem from '@/components/InfoItem';
import { Order } from '../Types/types';
import { useAuthContext } from '@/contexts/stateContext';

interface Info {
  totalRevenue: number;
  totalOrders: number;
  activeCustomers: number;
  conversionRate: number;
}

export default function Dashboard() {
  const [data,setData] = useState([])
  const [orders,setOrders] = useState([])
  const {user}= useAuthContext()
  console.log(user,'user')
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
  useEffect(()=>{
    axiosClient.get<Order[]>("orders?today=1").then(({ data }) => {
      setOrders(data);
    });

  axiosClient.get('ordersInfoGraphic').then(({data})=>{
    console.log(data,'d')
    setData(data)
  })
  },[])
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
         <InfoItem moneyTxt={true}  InfoIcon={DollarSign} name='إجمالي الإيرادات' value={info.totalRevenue}/>
         <InfoItem moneyTxt={false}  InfoIcon={ShoppingBag} name='إجمالي الطلبات' value={info.totalOrders}/>
         <InfoItem moneyTxt={false}  InfoIcon={ShoppingBag} name='طلبات اليوم' value={orders.length}/>
         <InfoItem moneyTxt={false}  InfoIcon={Users} name='العملاء النشطون' value={info.activeCustomers}/>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">نظرة عامة على المبيعات</h3>
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