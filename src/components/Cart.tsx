import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Meal, Mealorder, Order, Requestedchildmeal } from "@/Types/types";
import axiosClient from "@/helpers/axios-client";
import { LoadingButton } from "@mui/lab";
import CartItem from "./CartItem";
import { Plus, ShoppingCart, Receipt, MapPin, FileText } from "lucide-react";
import {
  Autocomplete,
  Button,
  TextField,
  Typography,
  useTheme,
  IconButton,
  Tooltip,
  Box,
  Stack,
  alpha,
  Paper,
  Divider,
  Chip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";

interface CartProps {
  selectedOrder: Order;
  setSelectedOrder: (order: Order) => void;
  printHandler: () => void;
}

function Cart({ selectedOrder, setSelectedOrder, printHandler }: CartProps) {
  const theme = useTheme();
  const { t } = useTranslation("cart");
  const [colName, setColName] = useState("");
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [val, setVal] = useState("");
  const { meals } = useOutletContext();

  const updateQuantity = useCallback(
    (increment: boolean, item: Requestedchildmeal) => {
      axiosClient
        .patch(`RequestedChild/${item.id}`, {
          count: increment ? item.count + 1 : Math.max(0, item.count - 1),
        })
        .then(({ data }) => {
          setSelectedOrder(data.order);
        });
    },
    [setSelectedOrder]
  );

  const updateMealOrderQuantity = useCallback(
    (increment: boolean, item: Mealorder) => {
      axiosClient
        .patch(`orderMeals/${item.id}`, {
          quantity: increment ? item.quantity + 1 : Math.max(0, item.quantity - 1),
        })
        .then(({ data }) => {
          setSelectedOrder(data.order);
        });
    },
    [setSelectedOrder]
  );

  const orderUpdateHandler = useCallback(() => {
    axiosClient
      .patch(`orders/${selectedOrder.id}`, {
        order_confirmed: 1,
      })
      .then(({ data }) => {
        if (data.status) {
          axiosClient.post(`orderConfirmed/${selectedOrder.id}`);
          printHandler();
        }
        setSelectedOrder(data.order);
      });
  }, [selectedOrder.id, setSelectedOrder, printHandler]);

  const orderItemUpdateHandler = useCallback(
    (val: string | number, orderMeal: Order, colName = "delivery_fee") => {
      axiosClient
        .patch(`orders/${orderMeal.id}`, {
          [colName]: val,
        })
        .then(({ data }) => {
          setSelectedOrder(data.order);
        });
    },
    [setSelectedOrder]
  );

  useEffect(() => {
    if (colName !== "") {
      const timer = setTimeout(() => {
        orderItemUpdateHandler(val, selectedOrder, colName);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [val, colName, selectedOrder, orderItemUpdateHandler]);

  const mealOrderHandler = useCallback(() => {
    if (!selectedMeal || !selectedOrder) return;
    axiosClient
      .post("orderMeals", {
        order_id: selectedOrder.id,
        meal_id: selectedMeal.id,
        quantity: 1,
        price: selectedMeal.price,
      })
      .then(({ data }) => {
        setSelectedOrder(data.order);
        setSelectedMeal(null);
      });
  }, [selectedMeal, selectedOrder, setSelectedOrder]);

  // Memoized calculations
  const totalAmount = useMemo(
    () => selectedOrder.totalPrice.toFixed(3),
    [selectedOrder.totalPrice]
  );
  const paidAmount = useMemo(
    () => selectedOrder.amount_paid.toFixed(3),
    [selectedOrder.amount_paid]
  );
  const remainingAmount = useMemo(
    () => (selectedOrder.totalPrice - selectedOrder.amount_paid).toFixed(3),
    [selectedOrder.totalPrice, selectedOrder.amount_paid]
  );

  const isOrderConfirmed = selectedOrder.order_confirmed;
  const hasItems = selectedOrder.meal_orders.length > 0;

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
              }}
            >
              <ShoppingCart size={20} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {t("cart") || "السلة"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {selectedOrder.meal_orders.length} {t("items") || "عنصر"}
              </Typography>
            </Box>
          </Stack>
          {isOrderConfirmed && (
            <Chip
              label={t("confirmed") || "مؤكد"}
              size="small"
              sx={{
                bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                color: "success.main",
                fontWeight: 600,
              }}
            />
          )}
        </Stack>
      </Box>

      {/* Add Meal Section */}
      {!isOrderConfirmed && (
        <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
          <Stack direction="row" spacing={1}>
            <Autocomplete
              fullWidth
              size="small"
              options={meals || []}
              getOptionLabel={(option) => option.name}
              value={selectedMeal}
              onChange={(e, val) => setSelectedMeal(val)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("meals") || "الوجبات"}
                  placeholder={t("search_meals") || "ابحث عن وجبة..."}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              )}
            />
            <Tooltip title={t("add_meal") || "إضافة وجبة"}>
              <IconButton
                onClick={mealOrderHandler}
                disabled={!selectedMeal}
                sx={{
                  bgcolor: selectedMeal ? "primary.main" : "action.disabledBackground",
                  color: selectedMeal ? "white" : "action.disabled",
                  "&:hover": {
                    bgcolor: selectedMeal ? "primary.dark" : "action.disabledBackground",
                  },
                  borderRadius: 2,
                }}
              >
                <Plus size={20} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      )}

      {/* Cart Items */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          "&::-webkit-scrollbar": {
            width: 8,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.05),
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.2),
            borderRadius: 4,
            "&:hover": {
              backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.3),
            },
          },
        }}
      >
        {hasItems ? (
          <Stack spacing={1.5}>
            {selectedOrder.meal_orders.map((item) => (
              <CartItem
                key={item.id}
                selectedOrder={selectedOrder}
                updateRequestedQuantity={updateQuantity}
                setSelectedOrder={setSelectedOrder}
                updateQuantity={updateMealOrderQuantity}
                isMultible=""
                item={item}
              />
            ))}
          </Stack>
        ) : (
          <Box
            sx={{
              py: 8,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            <ShoppingCart size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {t("empty_cart") || "السلة فارغة"}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {t("add_items_message") || "أضف عناصر من القائمة"}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Order Details & Summary */}
      {hasItems && (
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02),
          }}
        >
          {/* Notes & Address */}
          <Stack spacing={2} sx={{ mb: 2.5 }}>
            <TextField
              autoComplete="off"
              size="small"
              fullWidth
              label={t("notes") || "ملاحظات"}
              multiline
              rows={2}
              key={selectedOrder.id}
              onChange={(e) => {
                setColName("notes");
                setVal(e.target.value);
              }}
              defaultValue={selectedOrder.notes}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                    <FileText size={16} style={{ opacity: 0.5 }} />
                  </Box>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              autoComplete="off"
              size="small"
              fullWidth
              label={t("delivery_address") || "عنوان التوصيل"}
              key={selectedOrder.id}
              onChange={(e) => {
                setColName("delivery_address");
                setVal(e.target.value);
              }}
              defaultValue={selectedOrder.delivery_address}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                    <MapPin size={16} style={{ opacity: 0.5 }} />
                  </Box>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Stack>

          {/* Summary */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              mb: 2,
            }}
          >
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {t("total_amount") || "المبلغ الإجمالي"}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
                  {totalAmount} {t("currency_OMR") || "د.ك"}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {t("paid") || "المدفوع"}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: "success.main" }}>
                  {paidAmount} {t("currency_OMR") || "د.ك"}
                </Typography>
              </Stack>

              <Divider />

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {t("remaining") || "المتبقي"}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: "warning.main" }}>
                  {remainingAmount} {t("currency_OMR") || "د.ك"}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {t("delivery_fee") || "رسوم التوصيل"}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <TextField
                    onFocus={(event) => {
                      event.target.select();
                    }}
                    type="number"
                    key={selectedOrder.id}
                    size="small"
                    sx={{
                      width: "70px",
                      direction: "ltr",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                      },
                    }}
                    onChange={(e) => {
                      orderItemUpdateHandler(e.target.value, selectedOrder);
                    }}
                    defaultValue={selectedOrder.delivery_fee}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {t("currency_OMR") || "د.ك"}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>

          {/* Confirm Button */}
          {!isOrderConfirmed && (
            <LoadingButton
              fullWidth
              onClick={orderUpdateHandler}
              variant="contained"
              size="large"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                py: 1.5,
                boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                "&:hover": {
                  boxShadow: (theme) => `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                },
              }}
              startIcon={<Receipt size={20} />}
            >
              {t("confirm_order") || "تأكيد الطلب"}
            </LoadingButton>
          )}
        </Paper>
      )}
    </Box>
  );
}

export default Cart;
