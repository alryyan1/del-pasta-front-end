import { useEffect, useMemo, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Chip,
  Tooltip,
  IconButton,
  Paper,
  Divider,
  InputAdornment,
  MenuItem,
  useMediaQuery,
  Stack,
  Box,
  alpha,
  Fade,
} from "@mui/material";
import { OrderTable } from "./orders/OrderTable";
import axiosClient from "@/helpers/axios-client";
import {
  Filter,
  Search,
  ShoppingCart,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import dayjs from "dayjs";
import { webUrl } from "@/helpers/constants";
import MyLoadingButton from "@/components/MyLoadingButton";
import { useOutletContext } from "react-router-dom";
import { Order } from "@/Types/types";
import PageHeader from "@/components/PageHeader";

const statuses = [
  "Pending",
  "Confirmed",
  "Completed",
  "In Preparation",
  "Delivered",
  "Cancelled",
];

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orders2, setOrders2] = useState<Order[]>([]);
  const [update, setUpdate] = useState(0);
  const [search, setSearch] = useState<string>("");
  const [searchByState, setSearchByState] = useState<string>("");
  const [searchByCity, setSearchByCity] = useState<string>("");
  const [searchById, setSearchById] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<dayjs.Dayjs | null>(null);
  const [page, setPage] = useState<number>(20);
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedOrder, setSelectedOrder } = useOutletContext<{
    selectedOrder: Order | null;
    setSelectedOrder: (order: Order | null) => void;
  }>();

  const isMobile = useMediaQuery("(max-width:600px)");

  const updateItemsTable = (link: any, setLoadingBtn: (v: boolean) => void) => {
    setLoadingBtn(true);
    axiosClient(`${link.url}&word=${search || ""}`)
      .then(({ data }) => {
        setOrders(data.data);
        setLinks(data.links);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    setOrders((prev) => {
      return prev.map((o) => {
        if (selectedOrder?.id === o.id) {
          return selectedOrder;
        }
        return o;
      });
    });
  }, [selectedOrder]);

  useEffect(() => {
    setSelectedOrder(null);
    setLoading(true);
    const timer = setTimeout(() => {
      axiosClient
        .post(`orders/pagination/${page}`, {
          status: selectedStatus,
          date: createdAt?.format("YYYY-MM-DD") ?? null,
          name: search || null,
          city: searchByCity || null,
          state: searchByState || null,
          id: searchById || null,
        })
        .then(({ data: { data, links } }) => {
          setOrders(data);
          setLinks(links);
        })
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [page, search, createdAt, selectedStatus, searchByState, searchByCity, searchById]);

  useEffect(() => {
    const timer = setTimeout(() => {
      axiosClient
        .post(`orders/pagination/10000`, {
          status: selectedStatus,
          date: createdAt?.format("YYYY-MM-DD") ?? null,
          name: search || null,
          city: searchByCity || null,
          state: searchByState || null,
        })
        .then(({ data: { data } }) => {
          setOrders2(data);
        });
    }, 300);
    return () => clearTimeout(timer);
  }, [update]);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      }),
    []
  );

  const summary = useMemo(() => {
    const total = orders2.reduce((prev, curr) => prev + curr.totalPrice, 0);
    const paid = orders2.reduce((prev, curr) => prev + curr.amount_paid, 0);
    const remaining = total - paid;
    const handed = orders2.filter((o) => o.status === "delivered").length;
    const notHanded = orders2.filter((o) => o.status !== "delivered").length;
    return { total, paid, remaining, handed, notHanded };
  }, [orders2]);

  const filters = [
    { placeholder: "Search by name...", value: search, onChange: setSearch },
    { placeholder: "Search by state...", value: searchByState, onChange: setSearchByState },
    { placeholder: "Search by city...", value: searchByCity, onChange: setSearchByCity },
    { placeholder: "Search by ID...", value: searchById, onChange: setSearchById },
  ];

  return (
    <Fade in timeout={300}>
      <Box sx={{ maxWidth: 1600, mx: "auto" }}>
        <PageHeader
          title="Orders"
          subtitle="Manage and track all orders"
          icon={<ShoppingCart size={24} />}
          badge={orders.length}
        />

        {/* Filters Section */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Stack spacing={2}>
            {/* Search Fields */}
            <Stack
              direction={{ xs: "column", md: "row" }}
              gap={2}
              flexWrap="wrap"
            >
              {filters.map((filter) => (
                <TextField
                  key={filter.placeholder}
                  size="small"
                  placeholder={filter.placeholder}
                  value={filter.value}
                  onChange={(e) => {
                    setCreatedAt(null);
                    filter.onChange(e.target.value);
                  }}
                  sx={{
                    flex: 1,
                    minWidth: 180,
                    "& .MuiOutlinedInput-root": { borderRadius: 2 },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={18} />
                      </InputAdornment>
                    ),
                  }}
                />
              ))}
              <TextField
                select
                size="small"
                label="Rows"
                value={page}
                onChange={(e) => setPage(Number(e.target.value))}
                sx={{
                  minWidth: 100,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              >
                {[5, 10, 20, 30, 50, 100].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="outlined"
                startIcon={<FileText size={18} />}
                href={`${webUrl}ordersAi?state=${searchByState}&searchByCity=${searchByCity}`}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                Export Report
              </Button>
            </Stack>

            <Divider />

            {/* Status Filter */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              gap={2}
            >
              <Stack direction="row" alignItems="center" gap={1}>
                <Tooltip title="Clear filter">
                  <IconButton
                    size="small"
                    onClick={() => setSelectedStatus(null)}
                    sx={{
                      bgcolor: (theme) => alpha(theme.palette.grey[500], 0.1),
                    }}
                  >
                    <Filter size={18} />
                  </IconButton>
                </Tooltip>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Filter by status:
                </Typography>
              </Stack>
              <Stack direction="row" gap={1} flexWrap="wrap">
                {statuses.map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    onClick={() => setSelectedStatus(s === selectedStatus ? null : s)}
                    color={s === selectedStatus ? "primary" : "default"}
                    variant={s === selectedStatus ? "filled" : "outlined"}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 500,
                    }}
                  />
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Paper>

        {/* Summary Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(5, 1fr)",
            },
            gap: 2,
            mb: 3,
          }}
        >
          {[
            { label: "Total", value: currencyFormatter.format(summary.total), color: "#7c3aed" },
            { label: "Paid", value: currencyFormatter.format(summary.paid), color: "#10b981" },
            { label: "Remaining", value: currencyFormatter.format(summary.remaining), color: "#f59e0b" },
            { label: "Delivered", value: summary.handed, color: "#3b82f6" },
            { label: "Pending", value: summary.notHanded, color: "#ef4444" },
          ].map((item) => (
            <Paper
              key={item.label}
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                {item.label}
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: item.color, mt: 0.5 }}
              >
                {item.value}
              </Typography>
            </Paper>
          ))}
        </Box>

        {/* Orders Table */}
        <Box sx={{ mb: 3 }}>
          <OrderTable setUpdate={setUpdate} setOrders={setOrders} orders={orders} loading={loading} />
        </Box>

        {/* Pagination */}
        {links.length > 0 && (
          <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" sx={{ gap: 1 }}>
            {links.map((link, i) => {
              if (i === 0) {
                return (
                  <MyLoadingButton
                    key={i}
                    onClick={(setLoadingBtn) => updateItemsTable(link, setLoadingBtn)}
                    variant="outlined"
                    sx={{ borderRadius: 2, minWidth: 40 }}
                  >
                    <ChevronLeft size={18} />
                  </MyLoadingButton>
                );
              } else if (i === links.length - 1) {
                return (
                  <MyLoadingButton
                    key={i}
                    onClick={(setLoadingBtn) => updateItemsTable(link, setLoadingBtn)}
                    variant="outlined"
                    sx={{ borderRadius: 2, minWidth: 40 }}
                  >
                    <ChevronRight size={18} />
                  </MyLoadingButton>
                );
              } else {
                return (
                  <MyLoadingButton
                    key={i}
                    active={link.active}
                    onClick={(setLoadingBtn) => updateItemsTable(link, setLoadingBtn)}
                    sx={{
                      borderRadius: 2,
                      minWidth: 40,
                      bgcolor: link.active ? "primary.main" : "transparent",
                      color: link.active ? "white" : "text.primary",
                    }}
                  >
                    {link.label}
                  </MyLoadingButton>
                );
              }
            })}
          </Stack>
        )}
      </Box>
    </Fade>
  );
}

export default Orders;
