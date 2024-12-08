import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, Users } from 'lucide-react';
import axiosClient from '@/helpers/axios-client';
import InfoItem from '@/components/InfoItem';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import dayjs from 'dayjs';

export default function Dashboard() {
  const { t } = useTranslation('dashboard'); // Import t function
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('MMMM'));
  const [orders, setOrders] = useState([]);
  const [info, setInfo] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeCustomers: 0,
    conversionRate: 0,
  });

  useEffect(() => {
    axiosClient(`ordersInfoGraphic?month=${selectedMonth}`).then(({ data }) => {
      setData(data);
    });
    axiosClient.get(`info?month=${selectedMonth}`).then(({ data }) => {
      setInfo(data);
    });
  }, [selectedMonth]);

  useEffect(() => {
    axiosClient.get('orders?today=1').then(({ data }) => {
      setOrders(data);
    });
  }, []);

  const handleChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const startOfYear = dayjs().startOf('year');
  const monthArr = [];
  for (let i = 0; i < 12; i++) {
    const month = startOfYear.add(i, 'month');
    monthArr.push(month.format('MMMM'));
  }

  return (
    <div className="space-y-8">
      <FormControl fullWidth>
        <InputLabel id="month-label">{t('month')}</InputLabel>
        <Select id="month-select" value={selectedMonth} label={t('month')} onChange={handleChange}>
          {monthArr.map((m, i) => (
            <MenuItem key={i} value={i + 1}>
              {m}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <InfoItem moneyTxt={true} InfoIcon={DollarSign} name={t('totalRevenue')} value={info.totalRevenue} />
        <InfoItem moneyTxt={false} decimalPoins={0} InfoIcon={ShoppingBag} name={t('totalOrders')} value={info.totalOrders} />
        <InfoItem moneyTxt={false} decimalPoins={0} InfoIcon={ShoppingBag} name={t('ordersToday')} value={orders.length} />
        <InfoItem moneyTxt={false} decimalPoins={0} InfoIcon={Users} name={t('customers')} value={info.activeCustomers} />
      </div>

      <div className="p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{t('revenueOverview')}</h3>
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
