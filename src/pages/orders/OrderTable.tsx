import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import { Order } from "@/Types/types";
import { StatusChip } from "./StatusShip";
import { UpdateOrderDialog } from "./UpdateOrderDialog";
import dayjs from "dayjs";
import TdCell from "@/helpers/TdCell";
import StatusSelector from "@/components/StatusSelector";
import BasicPopover from "@/components/Mypopover";
import MyDateField2 from "@/components/MYDate";
import { OrderMealsTable } from "@/components/MealChildrenTable";
import MyTableCellStatusSelector from "@/components/MyTableCellStatusSelector";
import { useTranslation } from "react-i18next";
import { OrderDetails } from "./types";
import { OrderDetailsPopover } from "@/components/OrderDetails";
import { LoadingButton } from "@mui/lab";
import axiosClient from "@/helpers/axios-client";
import DeductDialog from "@/components/DeductDialog";
import { Car, Settings } from "lucide-react";
import SettingsDialog from "@/components/SettingsDialog";
import { CustomerForm } from "../Customer/CutomerForm";
import { useOutletContext } from "react-router-dom";
import Waves from "@/components/Waves";
import { Stack } from "@mui/system";
import { EditNote } from "@mui/icons-material";
import DeductButton from "./DeductButton";
import DeliveryButon from "./DeliveryButon";

interface OrderTableProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

export const OrderTable = ({ orders, setOrders,setUpdate }: OrderTableProps) => {
  const isMobile = useMediaQuery("(max-width:600px)"); // adjust based on screen size
  const { t } = useTranslation("orderTable");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  // const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { selectedOrder, setSelectedOrder } = useOutletContext();


  const handleClose = () => {
    setOpen(false);
    setIsFormOpen(false);
  };
  const handleCloseSettingsDialog = () => {
    setOpenSettings(false);
    setSelectedOrder(null);
  };

  return (
    <>
      <Paper>
        <TableContainer
          sx={{
            overflowX: "auto",
            width: isMobile ? "500px" : "auto",
          }}
        >
          <Table className=" border border-collapse order-table" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "30px" }}>
                  {t("orderTable.orderNumber")}
                </TableCell>
                <TableCell>{t("orderTable.customer")}</TableCell>
                <TableCell>{t("orderTable.area")}</TableCell>
                <TableCell>{t("orderTable.status")}</TableCell>
                <TableCell>{t("orderTable.total")}</TableCell>
                <TableCell width={"5%"}>{t("orderTable.paid")}</TableCell>
                <TableCell width={"5%"}>{t("remaining")}</TableCell>
                <TableCell>{t("orderTable.orderDate")}</TableCell>
                <TableCell>{t("orderTable.deliveryDate")}</TableCell>
                <TableCell>{t("handed")}</TableCell>
                <TableCell>{t("settings")}</TableCell>
                {/* <TableCell>{t("orderTable.deliveryLocation")}</TableCell> */}
                {/* <TableCell>{t("orderTable.notes")}</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders
                .filter((o) => {
                  // if (selectedOrder) {

                  //   return  o.id == selectedOrder?.id
                  // }else{
                  //   return true
                  // }
                  return true;
                })
                .map((order) => (
                  <TableRow key={order.updated_at} hover>
                    <TableCell sx={{ width: "30px" }}>
                      <BasicPopover
                        truncate={false}
                        title={order.id}
                        content={<OrderDetailsPopover order={order} />}
                      />
                    </TableCell>
                    <TableCell sx={{ textWrap: "nowrap" }}>
                      <Stack justifyContent={'space-between'} direction={"row"} gap={1}>
                        {order?.customer?.name}{" "}
                        {order.draft.trim().length > 0 && (
                          <IconButton
                            onClick={() => {
                              setOpen(true);
                            }}
                          >
                            <EditNote />
                          </IconButton>
                        )}
                      {order.is_delivery   ?   <IconButton color="success" >
                          <Tooltip title={t("Delivery")}>
                           <Car /> 
                          </Tooltip>
                        </IconButton> :''}
                      </Stack>
                    </TableCell>
                    <TableCell>{order?.customer?.area}</TableCell>
                    <MyTableCellStatusSelector
                      order={order}
                      setSelectedOrder={null}
                    />
                    <TableCell>{order.totalPrice.toFixed(3)}</TableCell>
                    <TdCell
                      isNum
                      sx={{ width: "50px" }}
                      table={"orders"}
                      item={order}
                      colName={"amount_paid"}
                    >
                      {order.amount_paid.toFixed(3)}
                    </TdCell>
                    <TableCell>
                      {(order.totalPrice - order.amount_paid).toFixed(3)}
                    </TableCell>

                    <TableCell sx={{ textWrap: "nowrap" }}>
                      {dayjs(new Date(order.created_at)).format(
                        "YYYY-MM-DD HH:mm A"
                      )}
                    </TableCell>
                    <TableCell>
                      <MyDateField2
                        path={`orders`}
                        item={order}
                        colName="delivery_date"
                        val={order.delivery_date}
                        label={t("orderTable.deliveryDate")}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction='column'>
                      <DeliveryButon order={order} setOpen={setOpen} setOrders={setOrders} setSelectedOrder={setSelectedOrder} setUpdate={setUpdate} />
                      <DeductButton order={order} selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} />
                      </Stack>
                    
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" gap={1}>
                        <Tooltip title="اعدادات الطلب" content="اعدادات الطلب">
                          <IconButton
                            onClick={() => {
                              setSelectedOrder(order);
                              setOpenSettings(true);
                            }}
                          >
                            <Settings />
                          </IconButton>
                        </Tooltip>
                        {order.notes.length > 0 && <Waves />}
                      </Stack>
                    </TableCell>
                    {/* <TableCell>{order.delivery_address}</TableCell> */}
                    {/* <TableCell>{order.notes}</TableCell> */}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {selectedOrder && (
          <DeductDialog
            setSelectedOrder={setSelectedOrder}
            selectedOrder={selectedOrder}
            open={open}
            handleClose={handleClose}
          />
        )}
        {selectedOrder && (
          <SettingsDialog
            setOrders={setOrders}
            setIsFormOpen={setIsFormOpen}
            setSelectedOrder={setSelectedOrder}
            selectedOrder={selectedOrder}
            open={openSettings}
            handleClose={handleCloseSettingsDialog}
          />
        )}
        {selectedOrder && (
          <CustomerForm open={isFormOpen} onClose={handleClose} />
        )}
      </Paper>
    </>
  );
};
