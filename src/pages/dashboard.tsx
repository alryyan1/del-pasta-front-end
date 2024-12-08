import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import axiosClient from '@/helpers/axios-client';
import { Customer } from '@/Types/types';
import InfoItem from '@/components/InfoItem';
import { Order } from '../Types/types';
import { useAuthContext } from '@/contexts/stateContext';
import { FormControl, InputLabel, Menu, MenuItem, Select } from '@mui/material';
import dayjs from 'dayjs';
import i18n from '@/i18n';

interface Info {
  totalRevenue: number;
  totalOrders: number;
  activeCustomers: number;
  conversionRate: number;
}

export default function Dashboard() {
  const [data,setData] = useState([])
  const [selectedMonth,setSelectedMonth] = useState(dayjs().format('MMMM'))
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
    axiosClient(`ordersInfoGraphic?month=${selectedMonth}`).then(({data})=>{
      console.log(data,'d')
      setData(data)
    })
    axiosClient.get<Info>(`info?month=${selectedMonth}`).then(({data})=>{
      setInfo(data)
    })


    


  },[selectedMonth])
  // useEffect(()=>{
  //   alert('s')
  //   i18n.on('loaded', (loaded) => {
  //     alert('loaded')
  //     console.log('Translations loaded:', loaded);
  //   });
    
  //   i18n.on('failedLoading', (lng, ns, msg) => {
  //     console.error(`Failed to load ${ns} for ${lng}: ${msg}`);
  //   });
    
  //   i18n.on('initialized', (options) => {
  //     console.log('i18next initialized with options:', options);
  //   });
  // },[])
  useEffect(()=>{
    axiosClient.get<Order[]>("orders?today=1").then(({ data }) => {
      setOrders(data);
    });

 
  },[])
  const handleChange = (e)=>{
      console.log(e.target.value,'change')
      setSelectedMonth(e.target.value)
      
  }
  const startOfYear = dayjs().startOf('year');
  const monthArr = [];
  // Loop over all months
for (let i = 0; i < 12; i++) {
  const month = startOfYear.add(i, 'month');
  monthArr.push(month.format('MMMM'));
}
  return (
    <div className="space-y-8">
     <FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">Month</InputLabel>
  <Select
    id="demo-simple-select"
    value={selectedMonth}
    label="Month"
    onChange={handleChange}
  >
    {monthArr.map((m,i)=>{
      return <MenuItem value={i+1}>{m}</MenuItem>
    })}
  </Select>
</FormControl>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
         <InfoItem moneyTxt={true}  InfoIcon={DollarSign} name='إجمالي الإيرادات' value={info.totalRevenue}/>
         <InfoItem moneyTxt={false} decimalPoins={0} InfoIcon={ShoppingBag} name='إجمالي الطلبات' value={info.totalOrders}/>
         <InfoItem moneyTxt={false} decimalPoins={0}  InfoIcon={ShoppingBag} name='طلبات اليوم' value={orders.length}/>
         <InfoItem moneyTxt={false} decimalPoins={0}  InfoIcon={Users} name='العملاء ' value={info.activeCustomers}/>
      </div>

      <div className=" p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">نظرة عامة على الايرادات</h3>
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