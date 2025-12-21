"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import axiosClient from "@/helpers/axios-client";
import { useAuthContext } from "@/contexts/stateContext";
import { Customer, Order } from "@/Types/types";
import {
  Badge,
  Box,
  IconButton,
  Paper,
  Slide,
  Tooltip,
  Typography,
  Fade,
  alpha,
  Stack,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Cart from "@/components/Cart";
import MealCategoryPanel from "@/components/MealCategoryPanel";
import OrderList from "@/components/OrderList";
import OrderHeader from "./OrderrHeader";
import { Settings, ShoppingBag, ShoppingCart, Plus } from "lucide-react";
import { CustomerForm } from "./Customer/CutomerForm";
import { useCustomerStore } from "./Customer/useCustomer";
import OrderHeaderMobile from "@/components/OrderHeaderMobile";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import NoteDialog from "@/components/NoteDialog";
import printJS from "print-js";

const NewOrder = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showOrderSettings, setOrderSettings] = useState(false);
  const [showCart, setShowCart] = useState(!isMobile);
  const [showCategories, setShowCategories] = useState(!isMobile);
  const { customers, fetchData } = useCustomerStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
  const { t } = useTranslation("newOrder");

  useEffect(() => {
    document.title = "طلب جديد";
  }, []);

  // Responsive handlers
  useEffect(() => {
    if (isMobile) {
      setShowCart(false);
      setShowCategories(true);
    } else {
      setShowCart(true);
      setShowCategories(true);
      setOrderSettings(false);
    }
  }, [isMobile]);

  const [open, setOpen] = useState(false);
  const handleNoteClose = () => {
    setOpen(false);
  };

  const outletContext = useOutletContext() as {
    selectedOrder: Order | null;
    setSelectedOrder: (order: Order | null) => void;
  };
  const { selectedOrder, setSelectedOrder: setSelectedOrderFromContext } = outletContext;
  const { add } = useAuthContext();

  // Optimized setSelectedOrder wrapper
  const setSelectedOrder = useCallback(
    (order: Order | ((prev: Order) => Order)) => {
      if (typeof order === "function") {
        const currentOrder = selectedOrder;
        if (currentOrder) {
          setSelectedOrderFromContext(order(currentOrder));
        }
      } else {
        setSelectedOrderFromContext(order);
      }
    },
    [selectedOrder, setSelectedOrderFromContext]
  );

  const [orders, setOrders] = useState<Order[]>([]);

  const printHandler = useCallback(() => {
    if (!selectedOrder?.id) return;
    axiosClient.get(`printSale?order_id=${selectedOrder.id}&base64=1`).then(({ data }) => {
      printJS({
        printable: data.slice(data.indexOf("JVB")),
        base64: true,
        type: "pdf",
      });
    });
  }, [selectedOrder?.id]);

  const handleClose = useCallback(() => {
    setIsFormOpen(false);
    setSelectedCustomer(undefined);
  }, []);

  useEffect(() => {
    setOrders((prev) => {
      return prev.map((or) => {
        if (or.id === selectedOrder?.id) {
          return selectedOrder;
        }
        return or;
      });
    });
  }, [selectedOrder]);

  const newOrderHandler = useCallback(() => {
    axiosClient.post("orders").then(({ data }) => {
      setSelectedOrder(data.data);
      add(data.data, setOrders);
    });
  }, [setSelectedOrder, add]);

  useEffect(() => {
    axiosClient.get<Order[]>("orders?today=1").then(({ data }) => {
      setOrders(data);
    });
  }, []);

  // Memoized values for performance
  const cartItemCount = useMemo(
    () => selectedOrder?.meal_orders?.length ?? 0,
    [selectedOrder?.meal_orders?.length]
  );

  const hasOrderSelected = useMemo(() => !!selectedOrder, [selectedOrder]);

  return (
    <Fade in timeout={300}>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
        }}
      >
        {/* Mobile Header Controls */}
        {isMobile && (
          <Paper
            elevation={0}
            sx={{
              mb: 2,
              p: 1.5,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              boxShadow: (theme) =>
                `0 2px 8px ${alpha(theme.palette.primary.main, 0.08)}`,
            }}
          >
            <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1}>
                <Tooltip title={t("order_settings") || "إعدادات الطلب"}>
                  <IconButton
                    onClick={() => setOrderSettings(!showOrderSettings)}
                    sx={{
                      bgcolor: showOrderSettings
                        ? (theme) => alpha(theme.palette.primary.main, 0.1)
                        : "transparent",
                      color: showOrderSettings ? "primary.main" : "text.secondary",
                      "&:hover": {
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.15),
                      },
                    }}
                  >
                    <Settings size={20} />
                  </IconButton>
                </Tooltip>
                <Tooltip title={showCategories ? "السلة" : "الفئات"}>
                  <IconButton
                    onClick={() => {
                      setShowCart(showCategories);
                      setShowCategories(!showCategories);
                    }}
                    sx={{
                      bgcolor: showCategories
                        ? (theme) => alpha(theme.palette.success.main, 0.1)
                        : "transparent",
                      color: showCategories ? "success.main" : "text.secondary",
                      "&:hover": {
                        bgcolor: (theme) => alpha(theme.palette.success.main, 0.15),
                      },
                    }}
                  >
                    <Badge badgeContent={cartItemCount} color="primary" max={99}>
                      {showCategories ? <ShoppingCart size={20} /> : <ShoppingBag size={20} />}
                    </Badge>
                  </IconButton>
                </Tooltip>
              </Stack>

              {hasOrderSelected && (
                <Chip
                  label={`#${selectedOrder?.order_number || ""}`}
                  size="small"
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    color: "primary.main",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                />
              )}
            </Stack>
          </Paper>
        )}

        {/* Order Settings Slide (Mobile) */}
        {showOrderSettings && isMobile && (
          <Slide direction="up" in={showOrderSettings} mountOnEnter unmountOnExit>
            <Box sx={{ mb: 2 }}>
              <OrderHeaderMobile
                showOrderSettings={showOrderSettings}
                showNewOrderBtn={true}
                setIsFormOpen={setIsFormOpen}
                key={selectedOrder?.id}
                selectedOrder={selectedOrder}
                setSelectedOrder={setSelectedOrder}
                setOrders={setOrders}
                newOrderHandler={newOrderHandler}
              />
            </Box>
          </Slide>
        )}

        {/* Desktop Order Header */}
        {!isMobile && (
          <Box sx={{ mb: 2 }}>
            <OrderHeader
              customers={customers}
              setOpen={setOpen}
              handleClose={handleNoteClose}
              setIsFormOpen={setIsFormOpen}
              key={selectedOrder?.id}
              selectedOrder={selectedOrder}
              setSelectedOrder={setSelectedOrder}
              newOrderHandler={newOrderHandler}
            />
          </Box>
        )}

        {/* Main Content Area */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 2, md: 3 },
            overflow: "hidden",
            minHeight: 0,
          }}
        >
          {/* Categories & Meals Panel */}
          {showCategories && (
            <Box
              sx={{
                flex: { xs: "0 0 auto", md: "1 1 50%" },
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {hasOrderSelected ? (
                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: (theme) => alpha(theme.palette.grey[300], 0.5),
                    bgcolor: "background.paper",
                    overflow: "hidden",
                    boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.common.black, 0.08)}`,
                  }}
                >
                  {selectedOrder && (
                    <MealCategoryPanel
                      selectedOrder={selectedOrder}
                      setSelectedOrder={(order: Order) => setSelectedOrderFromContext(order)}
                    />
                  )}
                </Paper>
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    borderRadius: 3,
                    border: "2px dashed",
                    borderColor: "divider",
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02),
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                      mb: 2,
                    }}
                  >
                    <Plus size={40} style={{ color: theme.palette.primary.main }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}>
                    {t("create_new_order") || "إنشاء طلب جديد"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("select_order_message") || "اختر أو أنشئ طلباً جديداً للبدء"}
                  </Typography>
                </Paper>
              )}
            </Box>
          )}

          {/* Cart & Orders List Panel */}
          <Box
            sx={{
              flex: { xs: "0 0 auto", md: "1 1 50%" },
              minWidth: 0,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 2, md: 2 },
              overflow: "hidden",
            }}
          >
            {/* Cart Section */}
            {showCart && (
              <Box
                sx={{
                  flex: { xs: "0 0 auto", md: "1 1 auto" },
                  minWidth: 0,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                {cartItemCount > 0 && hasOrderSelected ? (
                  <Paper
                    elevation={0}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: (theme) => alpha(theme.palette.grey[300], 0.5),
                      bgcolor: "background.paper",
                      overflow: "hidden",
                      boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.common.black, 0.08)}`,
                    }}
                  >
                    {selectedOrder && (
                      <Cart
                        printHandler={printHandler}
                        setSelectedOrder={(order: Order) => setSelectedOrderFromContext(order)}
                        selectedOrder={selectedOrder}
                      />
                    )}
                  </Paper>
                ) : (
                  <Paper
                    elevation={0}
                    sx={{
                      height: { xs: "auto", md: "100%" },
                      minHeight: { xs: 300, md: "auto" },
                      p: 4,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 3,
                      border: "2px dashed",
                      borderColor: "divider",
                      bgcolor: (theme) => alpha(theme.palette.grey[500], 0.02),
                    }}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.1),
                        mb: 2,
                      }}
                    >
                      <ShoppingCart size={32} style={{ opacity: 0.5 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: "text.primary" }}>
                      {t("empty_cart") || "السلة فارغة"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      {t("add_items_message") || "أضف عناصر من القائمة إلى السلة"}
                    </Typography>
                  </Paper>
                )}
              </Box>
            )}

            {/* Orders List Sidebar */}
            <Box
              sx={{
                flex: { xs: "0 0 auto", md: "0 0 100px" },
                minWidth: { xs: "100%", md: 100 },
                maxWidth: { xs: "100%", md: 100 },
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  height: { xs: "auto", md: "100%" },
                  p: 1.5,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: (theme) => alpha(theme.palette.grey[300], 0.5),
                  bgcolor: "background.paper",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.common.black, 0.08)}`,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "text.secondary",
                    textAlign: "center",
                    mb: 0.5,
                  }}
                >
                  {t("orders") || "الطلبات"}
                </Typography>
                <Box
                  sx={{
                    flex: 1,
                    overflowY: "auto",
                    "&::-webkit-scrollbar": {
                      width: 6,
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.05),
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.2),
                      borderRadius: 3,
                      "&:hover": {
                        backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.3),
                      },
                    },
                  }}
                >
                  <OrderList
                    orders={orders}
                    selectedOrder={selectedOrder}
                    setSelectedOrder={setSelectedOrderFromContext}
                  />
                </Box>
              </Paper>
            </Box>
          </Box>
        </Box>

        {/* Dialogs */}
        <CustomerForm
          key={selectedCustomer?.id}
          open={isFormOpen}
          onClose={handleClose}
          selectedCustomer={selectedCustomer || ({} as Customer)}
          onSubmit={handleClose}
        />
        {hasOrderSelected && selectedOrder && (
          <NoteDialog
            handleClose={handleNoteClose}
            open={open}
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder as React.Dispatch<React.SetStateAction<Order>>}
          />
        )}
      </Box>
    </Fade>
  );
};

export default NewOrder;
