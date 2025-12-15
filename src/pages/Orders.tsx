import { useEffect, useMemo, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Chip,
  Tooltip,
  IconButton,
  Paper,
  Divider,
  InputAdornment,
  MenuItem,
  useMediaQuery,
  Stack as MuiStack,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { OrderTable } from "./orders/OrderTable";
import axiosClient from "@/helpers/axios-client";
import { Filter, Search } from "lucide-react";
import dayjs from "dayjs";
import { webUrl } from "@/helpers/constants";
import MyLoadingButton from "@/components/MyLoadingButton";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import { Order } from "@/Types/types";

function Orders() {
  const { t } = useTranslation("orders"); // Initialize t function for translations
  const statuses = [
    "Pending",
    "Confirmed",
    "Completed",
    "In Preparation",
    "Delivered",
    "Cancelled",
  ];
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
  const { selectedOrder, setSelectedOrder } = useOutletContext();

  const updateItemsTable = (link, setLoading) => {
    setLoading(true);
    axiosClient(`${link.url}&word=${search || ""}`)
      .then(({ data }) => {
        setOrders(data.data);
        setLinks(data.links);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
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
        });
    }, 300);
    return () => clearTimeout(timer);
  }, [page, search, createdAt, selectedStatus, searchByState, searchByCity,searchById]);
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
        .then(({ data: { data, links } }) => {
          setOrders2(data);
          // setLinks(links);
        });
    }, 300);
    return () => clearTimeout(timer);
  }, [update]);

  const isMobile = useMediaQuery("(max-width:600px)");

  const currencyFormatter = useMemo(() => new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }), []);

  const summary = useMemo(() => {
    const total = orders2.reduce((prev, curr) => prev + curr.totalPrice, 0);
    const paid = orders2.reduce((prev, curr) => prev + curr.amount_paid, 0);
    const remaining = total - paid;
    const handed = orders2.filter((o) => o.status === "delivered").length;
    const notHanded = orders2.filter((o) => o.status !== "delivered").length;
    return { total, paid, remaining, handed, notHanded };
  }, [orders2]);

  const filters = [
    {
      placeholder: t("searchOrders"),
      value: search,
      onChange: (val: string) => {
        setCreatedAt(null);
        setSearch(val);
      },
    },
    {
      placeholder: "بحث بالمحافظه",
      value: searchByState,
      onChange: (val: string) => {
        setCreatedAt(null);
        setSearchByState(val);
      },
    },
    {
      placeholder: "بحث بالمنطقه",
      value: searchByCity,
      onChange: (val: string) => {
        setCreatedAt(null);
        setSearchByCity(val);
      },
    },
    {
      placeholder: "بحث برقم الطلب",
      value: searchById,
      onChange: (val: string) => {
        setCreatedAt(null);
        setSearchById(val);
      },
    },
  ];

  return (
    <MuiStack spacing={2} sx={{ p: { xs: 1, sm: 2 } }}>
      {/* Filters */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <MuiStack
          alignItems="flex-start"
          gap={isMobile ? 1 : 2}
          direction={isMobile ? "column" : "row"}
          sx={{ width: "100%" }}
        >
          {filters.map((filter) => (
            <TextField
              key={filter.placeholder}
              size="small"
              variant="outlined"
              placeholder={filter.placeholder}
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} className="text-gray-500" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: isMobile ? "100%" : 200 }}
            />
          ))}

          <TextField
            select
            size="small"
            label={t("rows") || "Rows"}
            value={page}
            onChange={(e) => setPage(Number(e.target.value))}
            sx={{ minWidth: 110 }}
          >
            {[5, 10, 20, 30, 50, 100].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="contained"
            href={`${webUrl}ordersAi?state=${searchByState}&searchByCity=${searchByCity}`}
            sx={{ textTransform: "none" }}
          >
            {t("report")}
          </Button>
        </MuiStack>

        <Divider />

        <MuiStack
          textAlign="center"
          alignItems="flex-start"
          direction={isMobile ? "column" : "row"}
          gap={1}
          justifyContent="space-between"
        >
          <MuiStack direction="row" alignItems="center" gap={1}>
            <Tooltip title={t("filter")}>
              <IconButton onClick={() => setSelectedStatus(null)}>
                <Filter />
              </IconButton>
            </Tooltip>
            <Typography variant="subtitle2" color="text.secondary">
              {t("status_filter")}
            </Typography>
          </MuiStack>

          <MuiStack
            gap={1}
            direction="row"
            flexWrap="wrap"
            sx={{ width: "100%" }}
          >
            {statuses.map((s) => (
              <Chip
                key={s}
                color={s === selectedStatus ? "primary" : "default"}
                variant={s === selectedStatus ? "filled" : "outlined"}
                onClick={() => setSelectedStatus(s)}
                label={t(`${s}`)}
                sx={{
                  borderRadius: 1.5,
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
              />
            ))}
          </MuiStack>
        </MuiStack>
      </Paper>

      {/* Summary */}
      <Grid container spacing={2}>
        {[
          { label: t("total"), value: currencyFormatter.format(summary.total) },
          { label: t("paid"), value: currencyFormatter.format(summary.paid) },
          { label: t("remaining"), value: currencyFormatter.format(summary.remaining) },
          { label: t("handed"), value: summary.handed },
          { label: t("notHanded"), value: summary.notHanded },
        ].map((item, idx) => (
          <Grid key={item.label} item xs={12} sm={6} md={2.4}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: idx === 0 ? "rgba(156, 39, 176, 0.08)" : "background.paper",
                height: "100%",
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                {item.label}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                {item.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <OrderTable setUpdate={setUpdate} setOrders={setOrders} orders={orders} />
      {links.length > 0 && (
        <Grid sx={{ gap: "4px", mt: 1 }} style={{ direction: "ltr" }} container>
          {links.map((link, i) => {
            if (i === 0) {
              return (
                <Grid item xs={1} key={i}>
                  <MyLoadingButton
                    onClick={(setLoading) => updateItemsTable(link, setLoading)}
                    variant="contained"
                  >
                    <ArrowBack />
                  </MyLoadingButton>
                </Grid>
              );
            } else if (i === links.length - 1) {
              return (
                <Grid item xs={1} key={i}>
                  <MyLoadingButton
                    onClick={(setLoading) => updateItemsTable(link, setLoading)}
                    variant="contained"
                  >
                    <ArrowForward />
                  </MyLoadingButton>
                </Grid>
              );
            } else {
              return (
                <Grid item xs={1} key={i}>
                  <MyLoadingButton
                    active={link.active}
                    onClick={(setLoading) => updateItemsTable(link, setLoading)}
                  >
                    {link.label}
                  </MyLoadingButton>
                </Grid>
              );
            }
          })}
        </Grid>
      )}
    </MuiStack>
  );
}

export default Orders;
