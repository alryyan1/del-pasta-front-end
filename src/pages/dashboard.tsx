import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  LayoutDashboard,
} from "lucide-react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  alpha,
  Fade,
  Skeleton,
} from "@mui/material";
import axiosClient from "@/helpers/axios-client";
import dayjs from "dayjs";
import PageHeader from "@/components/PageHeader";

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
  loading?: boolean;
}

function InfoCard({ icon, title, value, color, loading }: InfoCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: (theme) => `0 4px 20px ${alpha(theme.palette.grey[500], 0.15)}`,
        },
      }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
        <Box>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontWeight: 500, mb: 1 }}
          >
            {title}
          </Typography>
          {loading ? (
            <Skeleton variant="text" width={80} height={40} />
          ) : (
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              {value}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: alpha(color, 0.1),
            color: color,
          }}
        >
          {icon}
        </Box>
      </Stack>
    </Paper>
  );
}

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeCustomers: 0,
    conversionRate: 0,
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axiosClient(`ordersInfoGraphic?month=${selectedMonth}`),
      axiosClient.get(`info?month=${selectedMonth}`),
    ])
      .then(([graphRes, infoRes]) => {
        setData(graphRes.data);
        setInfo(infoRes.data);
      })
      .finally(() => setLoading(false));
  }, [selectedMonth]);

  useEffect(() => {
    axiosClient.get("orders?today=1").then(({ data }) => {
      setOrders(data);
    });
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(value);
  };

  return (
    <Fade in timeout={300}>
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>
        <PageHeader
          title="Dashboard"
          subtitle="Overview of your business performance"
          icon={<LayoutDashboard size={24} />}
        />

        {/* Month Selector */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Select Month</InputLabel>
            <Select
              value={selectedMonth}
              label="Select Month"
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              sx={{ borderRadius: 2 }}
            >
              {months.map((month, i) => (
                <MenuItem key={i} value={i + 1}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>

        {/* Stats Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
            mb: 3,
          }}
        >
          <InfoCard
            icon={<DollarSign size={24} />}
            title="Total Revenue"
            value={`${formatCurrency(info.totalRevenue)} KWD`}
            color="#7c3aed"
            loading={loading}
          />
          <InfoCard
            icon={<ShoppingBag size={24} />}
            title="Total Orders"
            value={info.totalOrders}
            color="#10b981"
            loading={loading}
          />
          <InfoCard
            icon={<TrendingUp size={24} />}
            title="Orders Today"
            value={orders.length}
            color="#f59e0b"
            loading={loading}
          />
          <InfoCard
            icon={<Users size={24} />}
            title="Active Customers"
            value={info.activeCustomers}
            color="#3b82f6"
            loading={loading}
          />
        </Box>

        {/* Chart */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Revenue Overview
          </Typography>
          <Box sx={{ height: 350 }}>
            {loading ? (
              <Skeleton variant="rectangular" height="100%" sx={{ borderRadius: 2 }} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    fill="url(#colorSales)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
}
