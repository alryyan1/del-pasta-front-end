import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Chip,
  Tooltip,
} from "@mui/material";
import { AxiosDataShape, Customer, Order } from "@/Types/types";
import { OrderTable } from "./orders/OrderTable";
import axiosClient from "@/helpers/axios-client";
import { Box, Stack, useMediaQuery } from "@mui/system";
import { Filter, Search } from "lucide-react";
import dayjs from "dayjs";
import { webUrl } from "@/helpers/constants";
import MyLoadingButton from "@/components/MyLoadingButton";
import {
  ArrowBack,
  ArrowForward,
  DeleteOutline,
  DeleteOutlineOutlined,
  ShoppingCart,
} from "@mui/icons-material";
type Status = [
  "Pending",
  "Confirmed",
  "Completed",
  "In Preparation",
  "Delivered",
  "Cancelled",
];

function Orders() {
  const statuses: Status = [
    "Pending",
    "Confirmed",
    "Completed",
    "In Preparation",
    "Delivered",
    "Cancelled",
  ];
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<null | string>(null);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [page, setPage] = useState(10);
  const [links, setLinks] = useState([]);

  const updateItemsTable = (link, setLoading) => {
    console.log(search);
    setLoading(true);
    axiosClient(`${link.url}&word=${search}`)
      .then(({ data }) => {
        console.log(data, "pagination data");
        setOrders(data.data);
        setLinks(data.links);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    // alert('ss')
    const timer = setTimeout(() => {
      const q = search != "" ? `?name=${search}` : "";
      const del = deliveryDate != "" ? `?delivery_date=${deliveryDate}` : "";
      axiosClient
        .post(`orders/pagination/${page}${q}${del}`, {
          status: selectedStatus,
        })
        .then(({ data: { data, links } }) => {
          console.log(data, "data from pagination");
          console.log(links);
          setOrders(data);
          // console.log(links)
          setLinks(links);
        });
    }, 300);
    return () => clearTimeout(timer);
  }, [page, search, deliveryDate, selectedStatus]);

  const isMobile = useMediaQuery("(max-width:600px)");
  return (
    <div className=" ">
      <Stack
        alignItems={"center"}
        gap={1}
        direction={isMobile ? "column" : "row"}
        justifyContent={"space-around"}
      >
        <Typography className="text-3xl font-bold mb-8">
          اداره الطلبات{" "}
        </Typography>
        <TextField
          size="small"
          variant="outlined"
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <Search size={20} className="mr-2 text-gray-500" />,
          }}
        />
        <input
          onChange={(e) => {
            setDeliveryDate(e.target.value);
          }}
          type="date"
        />
        <select
          onChange={(val) => {
            setPage(val.target.value);
          }}
        >
          <option value="5">5</option>
          <option selected value="10">
            10
          </option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <Button variant="contained" href={`${webUrl}orders`}>
          التقرير
        </Button>
        <Stack textAlign={"center"} alignItems={"center"} direction={"column"}>
          <Box>
            <Tooltip title="Filter">
              <Filter />
            </Tooltip>
          </Box>
          <Stack gap={1} direction={"row"}>
            {statuses.map((s) => {
              return (
                <Chip
                  color={s == selectedStatus ? "primary" : "default"}
                  variant={s == selectedStatus ? "filled" : "outlined"}
                  key={s}
                  onClick={() => setSelectedStatus(s)}
                  label={s}
                ></Chip>
              );
            })}
          </Stack>
        </Stack>
      </Stack>
      <Stack
        direction={"row"}
        gap={1}
        justifyContent={"space-around"}
        alignItems={"center"}
      >
        <Stack
          direction={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          alignContent={"center"}
          gap={1}
          className="shadow-lg text-center border-rounded w-[200px] items-center bg-red-100 p-2 rounded-sm "
        >
          <Typography variant="h5">  اجمالي</Typography>
          <Typography variant="h5">5</Typography>
        </Stack>
        <Stack
          direction={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          alignContent={"center"}
          gap={1}
          className="shadow-lg text-center items-center w-[200px] bg-red-100 p-2 rounded-sm "
        >
          <Typography variant="h5">  المدفوع</Typography>
          <Typography variant="h5">5</Typography>
        </Stack>
        <Stack
          direction={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          alignContent={"center"}
          gap={1}
          className="shadow-lg text-center items-center w-[200px] bg-red-100 p-2 rounded-sm "
        >
          <Typography variant="h5">  المتبقي</Typography>
          <Typography variant="h5">5</Typography>
        </Stack>
      </Stack>

      <OrderTable
        orders={orders}
        // Pass translated column headers to OrderTable component
        columnHeaders={{
          orderNumber: "رقم الطلب",
          status: "الحالة",
          paymentStatus: "حالة الدفع",
          amountPaid: "المبلغ المدفوع",
          createdAt: "تاريخ الإنشاء",
          actions: "الإجراءات",
        }}
        // Add translations for pagination and other texts
        translations={{
          rowsPerPage: "عدد الصفوف لكل صفحة",
          of: "من",
          actions: "الإجراءات",
        }}
      />

      {links.length > 0 && (
        <Grid sx={{ gap: "4px", mt: 1 }} style={{ direction: "ltr" }} container>
          {links.map((link, i) => {
            if (i == 0) {
              return (
                <Grid item xs={1} key={i}>
                  <MyLoadingButton
                    onClick={(setLoading) => {
                      updateItemsTable(link, setLoading);
                    }}
                    variant="contained"
                    key={i}
                  >
                    <ArrowBack />
                  </MyLoadingButton>
                </Grid>
              );
            } else if (links.length - 1 == i) {
              return (
                <Grid item xs={1} key={i}>
                  <MyLoadingButton
                    onClick={(setLoading) => {
                      updateItemsTable(link, setLoading);
                    }}
                    variant="contained"
                    key={i}
                  >
                    <ArrowForward />
                  </MyLoadingButton>
                </Grid>
              );
            } else
              return (
                <Grid item xs={1} key={i}>
                  <MyLoadingButton
                    active={link.active}
                    onClick={(setLoading) => {
                      updateItemsTable(link, setLoading);
                    }}
                  >
                    {link.label}
                  </MyLoadingButton>
                </Grid>
              );
          })}
        </Grid>
      )}
    </div>
  );
}

export default Orders;
