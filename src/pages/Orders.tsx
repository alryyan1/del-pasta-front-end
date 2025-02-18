import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Chip,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useTranslation } from "react-i18next"; // Import i18n hook
import { OrderTable } from "./orders/OrderTable";
import axiosClient from "@/helpers/axios-client";
import { Box, Stack, useMediaQuery } from "@mui/system";
import { Filter, Search } from "lucide-react";
import dayjs from "dayjs";
import { webUrl } from "@/helpers/constants";
import MyLoadingButton from "@/components/MyLoadingButton";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import { Order } from "@/Types/types";
import MyDateField2 from "@/components/MYDate";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

type Status = [
  "Pending",
  "Confirmed",
  "Completed",
  "In Preparation",
  "Delivered",
  "Cancelled",
];

function Orders() {
  const { t } = useTranslation("orders"); // Initialize t function for translations
  const statuses: Status = [
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
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [search, setSearch] = useState(null);
  const [searchByState, setSearchByState] = useState(null);
  const [searchByCity, setSearchByCity] = useState(null);
  const [searchById, setSearchById] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState<null | string>(null);
  const [createdAt, setCreatedAt] = useState(null);
  const [page, setPage] = useState(20);
  const [links, setLinks] = useState([]);
  const { selectedOrder, setSelectedOrder } = useOutletContext();

  const updateItemsTable = (link, setLoading) => {
    setLoading(true);
    axiosClient(`${link.url}&word=${search}`)
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
          name: search,
          city: searchByCity,
          state: searchByState,
          id: searchById,

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
          name: search,
          city: searchByCity,
          state: searchByState,
        })
        .then(({ data: { data, links } }) => {
          setOrders2(data);
          // setLinks(links);
        });
    }, 300);
    return () => clearTimeout(timer);
  }, [update]);

  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <div>
      <Stack
        alignItems="center"
        gap={1}
        direction={isMobile ? "column" : "row"}
        justifyContent="space-around"
        sx={{ m: 2 }}
        className="!my-1"
      >
        <TextField
          size="small"
          variant="outlined"
          placeholder={t("searchOrders")}
          value={search}
          onChange={(e) => {
            setCreatedAt(null);
            setSearch(e.target.value);
          }}
          InputProps={{
            startAdornment: <Search size={20} className="mr-2 text-gray-500" />,
          }}
        />
        <TextField
          size="small"
          variant="outlined"
          placeholder={"بحث بالمحافظه"}
          value={searchByState}
          onChange={(e) => {
            setCreatedAt(null);
            setSearchByState(e.target.value);
          }}
          InputProps={{
            startAdornment: <Search size={20} className="mr-2 text-gray-500" />,
          }}
        />
        <TextField
          size="small"
          variant="outlined"
          placeholder={"بحث بالمنطقه"}
          value={searchByCity}
          onChange={(e) => {
            setCreatedAt(null);
            setSearchByCity(e.target.value);
          }}
          InputProps={{
            startAdornment: <Search size={20} className="mr-2 text-gray-500" />,
          }}
        />
        {/* <input
          onChange={(e) => setDeliveryDate(e.target.value)}
          type="date"
        /> */}

<TextField
          size="small"
          variant="outlined"
          placeholder={'بحث برقم الطلب'}
          value={searchById}
          onChange={(e) => {
            setCreatedAt(null)
            setSearchById(e.target.value)

          }}
          InputProps={{
            startAdornment: <Search size={20} className="mr-2 text-gray-500" />,
          }}
        />

        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateField
            onDoubleClick={() => {
              setCreatedAt(dayjs());
            }}
            label={"تاريخ"}
            format="DD-MM-YYYY"
            sx={{ width: "125px" }}
            size="small"
            defaultValue={createdAt}
            value={dayjs(createdAt)}
            onChange={(val) => {
              const dayJsObj = dayjs(val);

              setCreatedAt(dayJsObj);

              // axiosClient.post(`orders/pagination/20`,{date:createdAt.format('YYYY-MM-DD')}).then(({data})=>{
              //    setOrders(data.data)
              //    setLinks(data.links)
              // })
            }}
          />
        </LocalizationProvider> */}
        <select onChange={(val) => setPage(val.target.value)}>
          <option value="5">5</option>
          <option selected value="10">
            10
          </option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <Button
          variant="contained"
          href={`${webUrl}ordersAi?state=${searchByState}&searchByCity=${searchByCity}`}
        >
          {t("report")}
        </Button>
        <Stack
          textAlign="center"
          alignItems="center"
          direction={isMobile ? "column" : "row"}
        >
          <Box>
            <Tooltip title={t("filter")}>
              <IconButton>
                <Filter onClick={() => setSelectedStatus(null)} />
              </IconButton>
            </Tooltip>
          </Box>
          <Stack gap={1} direction={isMobile ? "column" : "row"}>
            {statuses.map((s) => (
              <Chip
                color={s === selectedStatus ? "primary" : "default"}
                variant={s === selectedStatus ? "filled" : "outlined"}
                key={s}
                onClick={() => setSelectedStatus(s)}
                label={t(`${s}`)} // Translate statuses
              />
            ))}
          </Stack>
        </Stack>
      </Stack>
      <Stack
        sx={{ m: 2 }}
        direction={isMobile ? "column" : "row"}
        gap={1}
        justifyContent="space-around"
        alignItems="center"
      >
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          className="shadow-lg text-center border-rounded-full w-[150px] items-center bg-[var(--primary)] rounded-full p-1"
        >
          <Typography variant="h6">{t("total")}</Typography>
          <Typography variant="h6">
            {orders2
              .reduce((prev, curr) => prev + curr.totalPrice, 0)
              .toFixed(3)}
          </Typography>
        </Stack>
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          className="shadow-lg text-center items-center w-[150px] bg-[var(--primary)] p-1 rounded-full"
        >
          <Typography variant="h6">{t("paid")}</Typography>
          <Typography variant="h6">
            {orders2
              .reduce((prev, curr) => prev + curr.amount_paid, 0)
              .toFixed(3)}
          </Typography>
        </Stack>
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          className="shadow-lg text-center items-center w-[150px] bg-[var(--primary)] p-1 rounded-full"
        >
          <Typography variant="h6">{t("remaining")}</Typography>
          <Typography variant="h6">
            {(
              orders2.reduce((prev, curr) => prev + curr.totalPrice, 0) -
              orders2.reduce((prev, curr) => prev + curr.amount_paid, 0)
            ).toFixed(3)}
          </Typography>
        </Stack>
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          className="shadow-lg text-center items-center w-[150px] bg-[var(--primary)] p-1 rounded-full"
        >
          <Typography variant="h6"> {t("handed")} </Typography>
          <Typography variant="h6">
            {orders2.filter((o) => o.status == "delivered").length}
          </Typography>
        </Stack>
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          className="shadow-lg text-center items-center w-[150px] bg-[var(--primary)] p-1 rounded-full"
        >
          <Typography variant="h6"> {t("notHanded")} </Typography>
          <Typography variant="h6">
            {orders2.filter((o) => o.status != "delivered").length}
          </Typography>
        </Stack>
      </Stack>
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
    </div>
  );
}

export default Orders;
