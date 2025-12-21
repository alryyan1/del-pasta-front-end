"use client";

import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import axiosClient from "@/helpers/axios-client";
import { useAuthContext } from "@/contexts/stateContext";
import { Category, Customer, Meal, Order } from "@/Types/types";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  IconButton,
  Button,
  TextField,
  Autocomplete,
  Badge,
  Tooltip,
  Fade,
  Tabs,
  Tab,
  alpha,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Divider,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  Plus,
  ShoppingCart,
  Receipt,
  Search,
  Printer,
  Trash2,
  Minus,
  Grid3X3,
  Check,
  Package,
  Clock,
  UserPlus,
  Car,
  Home,
  Map,
} from "lucide-react";
import { EditNote, Message, WhatsApp } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import printJS from "print-js";
import { toast } from "react-toastify";
import { CustomerForm } from "./Customer/CutomerForm";
import { useCustomerStore } from "./Customer/useCustomer";
import { webUrl } from "@/helpers/constants";
import RequestedServiceDialog from "@/components/RequestedServiceDialog";
import MyDateField2 from "@/components/MYDate";
import PayOptions from "@/components/PayOptions";
import StatusSelector from "@/components/StatusSelector";
import NoteDialog from "@/components/NoteDialog";

// ==================== TYPES ====================
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// ==================== SUB COMPONENTS ====================

// Tab Panel Component
const TabPanel = memo(({ children, value, index }: TabPanelProps) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    sx={{ height: "100%", display: value === index ? "flex" : "none", flexDirection: "column" }}
  >
    {value === index && children}
  </Box>
));

// Order Header Component
const OrderHeaderV2 = memo(
  ({
    selectedOrder,
    customers,
    whatsappLoading,
    onNewOrder,
    onAssignCustomer,
    onOpenCustomerForm,
    onOpenNoteDialog,
    onPrint,
    onSendMessage,
    onSendLocation,
    onSendWhatsApp,
    onToggleDelivery,
    onDeleteOrder,
    setSelectedOrder,
  }: {
    selectedOrder: Order | null;
    customers: Customer[];
    whatsappLoading: boolean;
    onNewOrder: () => void;
    onAssignCustomer: (customerId: string | undefined) => void;
    onOpenCustomerForm: () => void;
    onOpenNoteDialog: () => void;
    onPrint: () => void;
    onSendMessage: () => void;
    onSendLocation: () => void;
    onSendWhatsApp: () => void;
    onToggleDelivery: () => void;
    onDeleteOrder: () => void;
    setSelectedOrder: (order: Order) => void;
  }) => {
    if (!selectedOrder) {
      return (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 2,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.common.black, 0.08)}`,
            background: (theme) =>
              `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
              طلب جديد
            </Typography>
            <LoadingButton
              variant="contained"
              onClick={onNewOrder}
              startIcon={<Plus size={18} />}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: "none",
                boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                "&:hover": {
                  boxShadow: (theme) => `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                },
              }}
            >
              طلب جديد
            </LoadingButton>
          </Stack>
        </Paper>
      );
    }

    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          boxShadow: (theme) => `0 2px 12px ${alpha(theme.palette.common.black, 0.08)}`,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: (theme) => `0 4px 16px ${alpha(theme.palette.common.black, 0.12)}`,
          },
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          justifyContent="space-between"
          sx={{
            overflowX: "auto",
            "&::-webkit-scrollbar": {
              height: 4,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.05),
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.2),
              borderRadius: 2,
            },
          }}
        >
          {/* Order ID */}
          <Chip
            label={`#${selectedOrder.order_number}`}
            variant="outlined"
            sx={{
              flexShrink: 0,
              fontWeight: 700,
              fontSize: "0.875rem",
              height: 36,
              borderWidth: 2,
              borderColor: "primary.main",
              color: "primary.main",
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
            }}
          />

          {/* New Order Button */}
          <LoadingButton
            variant="outlined"
            onClick={onNewOrder}
            startIcon={<Plus size={18} />}
            sx={{
              flexShrink: 0,
              borderRadius: 2,
              px: 2,
              py: 0.75,
              fontWeight: 600,
              textTransform: "none",
              borderWidth: 2,
              height: 36,
              "&:hover": {
                borderWidth: 2,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            طلب جديد
          </LoadingButton>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          {/* Customer Selection */}
          <Tooltip title="إضافة زبون جديد">
            <IconButton
              size="small"
              onClick={onOpenCustomerForm}
              sx={{
                flexShrink: 0,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                "&:hover": { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2) },
              }}
            >
              <UserPlus size={18} />
            </IconButton>
          </Tooltip>
          <Autocomplete
            size="small"
            value={selectedOrder.customer || null}
            options={customers}
            getOptionLabel={(option) => option.name || ""}
            isOptionEqualToValue={(option, val) => option.id === val.id}
            filterOptions={(options, state) =>
              options.filter(
                (c) =>
                  c.name?.toLowerCase().includes(state.inputValue.toLowerCase()) ||
                  c.phone?.includes(state.inputValue)
              )
            }
            onChange={(_, data) => onAssignCustomer(data?.id)}
            sx={{
              minWidth: 200,
              flexShrink: 0,
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="اختر زبون..."
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, height: 36 } }}
              />
            )}
          />

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          {/* Date */}
          <Box sx={{ minWidth: 180, flexShrink: 0 }}>
            <MyDateField2
              label="تاريخ التسليم"
              path="orders"
              colName="delivery_date"
              disabled={false}
              val={selectedOrder.delivery_date ?? new Date()}
              item={selectedOrder}
            />
          </Box>

          {/* Payment Options */}
          <PayOptions
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
            key={`pay-${selectedOrder.id}`}
          />

          {/* Status Selector */}
          <StatusSelector selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} />

          {/* Action Buttons - Only show if customer exists */}
          {selectedOrder.customer && (
            <>
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
              <Tooltip title="مسودة" arrow>
                <IconButton
                  size="small"
                  onClick={onOpenNoteDialog}
                  sx={{
                    flexShrink: 0,
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: (theme) => `0 2px 4px ${alpha(theme.palette.common.black, 0.05)}`,
                    "&:hover": {
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                      borderColor: "primary.main",
                      transform: "translateY(-2px)",
                      boxShadow: (theme) => `0 4px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <EditNote fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="طباعة" arrow>
                <IconButton
                  size="small"
                  onClick={onPrint}
                  sx={{
                    flexShrink: 0,
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: (theme) => `0 2px 4px ${alpha(theme.palette.common.black, 0.05)}`,
                    "&:hover": {
                      bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
                      borderColor: "info.main",
                      transform: "translateY(-2px)",
                      boxShadow: (theme) => `0 4px 8px ${alpha(theme.palette.info.main, 0.2)}`,
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <Printer size={18} />
                </IconButton>
              </Tooltip>
              <Tooltip title="إرسال رسالة" arrow>
                <IconButton
                  size="small"
                  onClick={onSendMessage}
                  sx={{
                    flexShrink: 0,
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: (theme) => `0 2px 4px ${alpha(theme.palette.common.black, 0.05)}`,
                    "&:hover": {
                      bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
                      borderColor: "info.main",
                      transform: "translateY(-2px)",
                      boxShadow: (theme) => `0 4px 8px ${alpha(theme.palette.info.main, 0.2)}`,
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <Message fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="إرسال موقع" arrow>
                <IconButton
                  size="small"
                  onClick={onSendLocation}
                  sx={{
                    flexShrink: 0,
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: (theme) => `0 2px 4px ${alpha(theme.palette.common.black, 0.05)}`,
                    "&:hover": {
                      bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.08),
                      borderColor: "secondary.main",
                      transform: "translateY(-2px)",
                      boxShadow: (theme) => `0 4px 8px ${alpha(theme.palette.secondary.main, 0.2)}`,
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <Map size={18} />
                </IconButton>
              </Tooltip>
              <Tooltip title="إرسال الفاتورة (واتساب)" arrow>
                <IconButton
                  size="small"
                  onClick={onSendWhatsApp}
                  disabled={selectedOrder.whatsapp || whatsappLoading}
                  sx={{
                    flexShrink: 0,
                    bgcolor: selectedOrder.whatsapp
                      ? (theme) => alpha(theme.palette.success.main, 0.15)
                      : "background.paper",
                    border: "1px solid",
                    borderColor: selectedOrder.whatsapp ? "success.main" : "divider",
                    color: "success.main",
                    boxShadow: (theme) => `0 2px 4px ${alpha(theme.palette.common.black, 0.05)}`,
                    "&:hover:not(:disabled)": {
                      bgcolor: (theme) => alpha(theme.palette.success.main, 0.15),
                      borderColor: "success.main",
                      transform: "translateY(-2px)",
                      boxShadow: (theme) => `0 4px 8px ${alpha(theme.palette.success.main, 0.3)}`,
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  {whatsappLoading ? <CircularProgress size={18} /> : <WhatsApp fontSize="small" />}
                </IconButton>
              </Tooltip>
              <Tooltip title={selectedOrder.is_delivery ? "توصيل" : "استلام"} arrow>
                <IconButton
                  size="small"
                  onClick={onToggleDelivery}
                  sx={{
                    flexShrink: 0,
                    bgcolor: selectedOrder.is_delivery
                      ? (theme) => alpha(theme.palette.success.main, 0.15)
                      : "background.paper",
                    border: "1px solid",
                    borderColor: selectedOrder.is_delivery ? "success.main" : "divider",
                    color: selectedOrder.is_delivery ? "success.main" : "text.secondary",
                    boxShadow: (theme) => `0 2px 4px ${alpha(theme.palette.common.black, 0.05)}`,
                    "&:hover": {
                      bgcolor: selectedOrder.is_delivery
                        ? (theme) => alpha(theme.palette.success.main, 0.2)
                        : (theme) => alpha(theme.palette.success.main, 0.08),
                      borderColor: "success.main",
                      transform: "translateY(-2px)",
                      boxShadow: (theme) => `0 4px 8px ${alpha(theme.palette.success.main, 0.2)}`,
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  {selectedOrder.is_delivery ? <Car size={18} /> : <Home size={18} />}
                </IconButton>
              </Tooltip>
              <Tooltip title="حذف الطلب" arrow>
                <IconButton
                  size="small"
                  onClick={onDeleteOrder}
                  sx={{
                    flexShrink: 0,
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    color: "error.main",
                    boxShadow: (theme) => `0 2px 4px ${alpha(theme.palette.common.black, 0.05)}`,
                    "&:hover": {
                      bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                      borderColor: "error.main",
                      transform: "translateY(-2px)",
                      boxShadow: (theme) => `0 4px 8px ${alpha(theme.palette.error.main, 0.2)}`,
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <Trash2 size={18} />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Stack>
      </Paper>
    );
  }
);

// Order Button Component
const OrderButton = memo(
  ({
    order,
    isSelected,
    onClick,
  }: {
    order: Order;
    isSelected: boolean;
    onClick: () => void;
  }) => {
    const itemCount = order.meal_orders?.length || 0;
    const isConfirmed = order.order_confirmed;

    return (
      <Badge
        badgeContent={itemCount > 0 ? itemCount : undefined}
        color="primary"
        sx={{
          width: "100%",
          "& .MuiBadge-badge": {
            fontSize: "0.65rem",
            minWidth: 18,
            height: 18,
            fontWeight: 700,
            boxShadow: (theme) => `0 2px 4px ${alpha(theme.palette.primary.main, 0.3)}`,
          },
        }}
      >
        <Button
          fullWidth
          onClick={onClick}
          variant={isSelected ? "contained" : "outlined"}
          sx={{
            py: 1.25,
            px: 2,
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.8rem",
            justifyContent: "space-between",
            bgcolor: isSelected
              ? "primary.main"
              : isConfirmed
              ? (theme) => alpha(theme.palette.success.main, 0.1)
              : "background.paper",
            borderWidth: isSelected ? 0 : 2,
            borderColor: isSelected
              ? "transparent"
              : isConfirmed
              ? "success.main"
              : "divider",
            color: isSelected ? "white" : isConfirmed ? "success.main" : "text.primary",
            boxShadow: isSelected
              ? (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
              : (theme) => `0 2px 4px ${alpha(theme.palette.common.black, 0.05)}`,
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: isSelected
                ? "primary.dark"
                : isConfirmed
                ? (theme) => alpha(theme.palette.success.main, 0.15)
                : (theme) => alpha(theme.palette.primary.main, 0.08),
              borderColor: isSelected ? "transparent" : "primary.main",
              transform: "translateY(-2px)",
              boxShadow: isSelected
                ? (theme) => `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`
                : (theme) => `0 4px 8px ${alpha(theme.palette.primary.main, 0.15)}`,
            },
          }}
        >
          <span>#{order.order_number}</span>
          {isConfirmed && (
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                bgcolor: isSelected ? "rgba(255,255,255,0.3)" : "success.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Check size={12} color={isSelected ? "white" : "white"} />
            </Box>
          )}
        </Button>
      </Badge>
    );
  }
);

// Meal Card Component
const MealCard = memo(
  ({
    meal,
    isInOrder,
    onAdd,
    isLoading,
  }: {
    meal: Meal;
    isInOrder: boolean;
    onAdd: () => void;
    isLoading: boolean;
  }) => {
    return (
      <Paper
        elevation={0}
        onClick={onAdd}
        sx={{
          p: 2,
          minHeight: 150,
          borderRadius: 2.5,
          cursor: isLoading ? "wait" : "pointer",
          border: "2px solid",
          borderColor: isInOrder ? "primary.main" : "divider",
          bgcolor: isInOrder
            ? (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.12)} 100%)`
            : "background.paper",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          opacity: isLoading ? 0.6 : 1,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: isInOrder
            ? (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`
            : (theme) => `0 2px 4px ${alpha(theme.palette.common.black, 0.05)}`,
          "&::before": isInOrder
            ? {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: (theme) =>
                  `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              }
            : {},
          "&:hover": {
            borderColor: "primary.main",
            transform: "translateY(-4px) scale(1.02)",
            boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
            bgcolor: isInOrder
              ? (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.primary.main, 0.16)} 100%)`
              : (theme) => alpha(theme.palette.primary.main, 0.04),
          },
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ width: "100%" }}>
          {/* Image */}
          {meal.image_url ? (
            <Box
              component="img"
              src={`${webUrl}/images/${meal.image_url}`}
              alt={meal.name}
              sx={{
                width: 56,
                height: 56,
                objectFit: "cover",
                borderRadius: 2,
                border: "2px solid",
                borderColor: isInOrder ? "primary.main" : "divider",
                boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}`,
                transition: "all 0.3s ease",
              }}
            />
          ) : (
            <Avatar
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                bgcolor: (theme) =>
                  `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.primary.main, 0.25)} 100%)`,
                color: "primary.main",
                fontWeight: 700,
                fontSize: "1.25rem",
                border: "2px solid",
                borderColor: isInOrder ? "primary.main" : "divider",
                boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              {meal.name?.charAt(0)?.toUpperCase()}
            </Avatar>
          )}

          {/* Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                fontSize: "0.9rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                mb: 0.5,
                color: "text.primary",
              }}
            >
              {meal.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                fontSize: "0.95rem",
                color: "primary.main",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {meal.price?.toFixed(3)}
            </Typography>
          </Box>

          {/* Status */}
          {isInOrder && (
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%, 100%": {
                    opacity: 1,
                  },
                  "50%": {
                    opacity: 0.8,
                  },
                },
              }}
            >
              <Check size={16} color="white" />
            </Box>
          )}
        </Stack>
      </Paper>
    );
  }
);

// Cart Item Component
const CartItemV2 = memo(
  ({
    item,
    onDelete,
    onQuantityChange,
    disabled,
  }: {
    item: any;
    onDelete: () => void;
    onQuantityChange: (increment: boolean) => void;
    disabled: boolean;
  }) => {
    const total = (item.totalPrice + item.quantity * item.price).toFixed(3);

    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2.5,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.common.black, 0.06)}`,
          transition: "all 0.2s ease",
          "&:hover": {
            boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
            borderColor: "primary.main",
          },
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          {/* Name & Price */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                fontSize: "0.95rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                mb: 0.75,
                color: "text.primary",
              }}
            >
              {item.meal?.name}
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.75 }}>
              <Chip
                label={`${item.quantity} × ${item.price?.toFixed(3)}`}
                size="small"
                sx={{
                  height: 22,
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  bgcolor: (theme) => alpha(theme.palette.grey[500], 0.1),
                  color: "text.secondary",
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main", fontSize: "0.95rem" }}>
                = {total}
              </Typography>
            </Stack>
            {item.requested_child_meals?.length > 0 && (
              <Chip
                label={`${item.requested_child_meals.length} خدمة`}
                size="small"
                sx={{
                  height: 22,
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.15),
                  color: "secondary.main",
                  border: "1px solid",
                  borderColor: "secondary.main",
                }}
              />
            )}
          </Box>

          {/* Controls */}
          {!disabled && (
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton
                size="small"
                onClick={() => onQuantityChange(false)}
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: (theme) => alpha(theme.palette.grey[500], 0.1),
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": {
                    bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                    borderColor: "error.main",
                    color: "error.main",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <Minus size={16} />
              </IconButton>
              <Box
                sx={{
                  minWidth: 36,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  borderRadius: 1.5,
                  border: "1px solid",
                  borderColor: "primary.main",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main" }}>
                  {item.quantity}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => onQuantityChange(true)}
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: (theme) => alpha(theme.palette.grey[500], 0.1),
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": {
                    bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                    borderColor: "success.main",
                    color: "success.main",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <Plus size={16} />
              </IconButton>
              <IconButton
                size="small"
                onClick={onDelete}
                sx={{
                  width: 32,
                  height: 32,
                  color: "error.main",
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                  border: "1px solid",
                  borderColor: "error.main",
                  "&:hover": {
                    bgcolor: "error.main",
                    color: "white",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <Trash2 size={16} />
              </IconButton>
            </Stack>
          )}
        </Stack>
      </Paper>
    );
  }
);

// ==================== MAIN COMPONENT ====================
const NewOrderV2 = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation("newOrder");

  // States
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingMealId, setLoadingMealId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [currentMealOrder, setCurrentMealOrder] = useState<any>(null);
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [whatsappLoading, setWhatsappLoading] = useState(false);

  // Context
  const outletContext = useOutletContext() as {
    selectedOrder: Order | null;
    setSelectedOrder: (order: Order | null) => void;
    meals: Meal[];
  };
  const { selectedOrder, setSelectedOrder, meals } = outletContext;
  const { add } = useAuthContext();
  const { customers, fetchData: fetchCustomers } = useCustomerStore();

  // ==================== EFFECTS ====================
  useEffect(() => {
    document.title = "طلب جديد";
    fetchCustomers();
  }, [fetchCustomers]);

  // Fetch orders and categories
  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      axiosClient.get<Order[]>("orders?today=1"),
      axiosClient.get<Category[]>("categories"),
    ])
      .then(([ordersRes, categoriesRes]) => {
        setOrders(ordersRes.data);
        setCategories(categoriesRes.data);
        if (categoriesRes.data.length > 0) {
          setSelectedCategory(categoriesRes.data[0]);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Update orders when selected order changes
  useEffect(() => {
    if (selectedOrder) {
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? selectedOrder : o))
      );
    }
  }, [selectedOrder]);

  // ==================== HANDLERS ====================
  const handleNewOrder = useCallback(() => {
    axiosClient.post("orders").then(({ data }) => {
      setSelectedOrder(data.data);
      add(data.data, setOrders);
    });
  }, [setSelectedOrder, add]);

  const handleAddMeal = useCallback(
    (meal: Meal) => {
      if (!selectedOrder || loadingMealId) return;
      setLoadingMealId(meal.id);

      axiosClient
        .post("orderMeals", {
          order_id: selectedOrder.id,
          meal_id: meal.id,
          quantity: 1,
          price: meal.price,
        })
        .then(({ data }) => {
          setSelectedOrder(data.order);
          setCurrentMealOrder(data.mealOrder);
          setShowServiceDialog(true);
        })
        .finally(() => setLoadingMealId(null));
    },
    [selectedOrder, loadingMealId, setSelectedOrder]
  );

  const handleDeleteMealOrder = useCallback(
    (itemId: number) => {
      axiosClient.delete(`orderMeals/${itemId}`).then(({ data }) => {
        setSelectedOrder(data.order);
      });
    },
    [setSelectedOrder]
  );

  const handleQuantityChange = useCallback(
    (itemId: number, increment: boolean, currentQty: number) => {
      axiosClient
        .patch(`orderMeals/${itemId}`, {
          quantity: increment ? currentQty + 1 : Math.max(1, currentQty - 1),
        })
        .then(({ data }) => {
          setSelectedOrder(data.order);
        });
    },
    [setSelectedOrder]
  );

  const handleConfirmOrder = useCallback(() => {
    if (!selectedOrder) return;
    axiosClient
      .patch(`orders/${selectedOrder.id}`, { order_confirmed: 1 })
      .then(({ data }) => {
        if (data.status) {
          axiosClient.post(`orderConfirmed/${selectedOrder.id}`);
          // Print
          axiosClient.get(`printSale?order_id=${selectedOrder.id}&base64=1`).then(({ data }) => {
            printJS({
              printable: data.slice(data.indexOf("JVB")),
              base64: true,
              type: "pdf",
            });
          });
        }
        setSelectedOrder(data.order);
      });
  }, [selectedOrder, setSelectedOrder]);

  const handleUpdateOrderField = useCallback(
    (field: string, value: string | number) => {
      if (!selectedOrder) return;
      axiosClient.patch(`orders/${selectedOrder.id}`, { [field]: value }).then(({ data }) => {
        setSelectedOrder(data.order);
      });
    },
    [selectedOrder, setSelectedOrder]
  );

  // Print handler
  const handlePrint = useCallback(() => {
    if (!selectedOrder) return;
    axiosClient.get(`printSale?order_id=${selectedOrder.id}&base64=1`).then(({ data }) => {
      printJS({
        printable: data.slice(data.indexOf("JVB")),
        base64: true,
        type: "pdf",
      });
    });
  }, [selectedOrder]);

  // Send WhatsApp invoice
  const handleSendWhatsApp = useCallback(() => {
    if (!selectedOrder) return;
    setWhatsappLoading(true);
    axiosClient
      .get(`printSale?order_id=${selectedOrder.id}&base64=2`)
      .then(({ data }) => {
        if (data.error) {
          toast.error(data.error);
          return;
        }
        axiosClient.patch(`orders/${selectedOrder.id}`, { whatsapp: 1 }).then(({ data }) => {
          setSelectedOrder(data.order);
        });
        toast.success(data.message);
      })
      .finally(() => setWhatsappLoading(false));
  }, [selectedOrder, setSelectedOrder]);

  // Send message
  const handleSendMessage = useCallback(() => {
    if (!selectedOrder) return;
    axiosClient.post(`sendMsgWa/${selectedOrder.id}`);
  }, [selectedOrder]);

  // Send location
  const handleSendLocation = useCallback(() => {
    if (!selectedOrder) return;
    axiosClient.post(`sendMsgWaLocation/${selectedOrder.id}`);
  }, [selectedOrder]);

  // Toggle delivery
  const handleToggleDelivery = useCallback(() => {
    if (!selectedOrder) return;
    axiosClient
      .patch(`orders/${selectedOrder.id}`, { is_delivery: !selectedOrder.is_delivery })
      .then(({ data }) => {
        setSelectedOrder(data.order);
      });
  }, [selectedOrder, setSelectedOrder]);

  // Delete order
  const handleDeleteOrder = useCallback(() => {
    if (!selectedOrder) return;
    const confirmed = confirm("هل أنت متأكد من حذف هذا الطلب؟");
    if (!confirmed) return;
    axiosClient.delete(`orders/${selectedOrder.id}`).then(({ data }) => {
      if (data.status) {
        setSelectedOrder(null);
        setOrders((prev) => prev.filter((o) => o.id !== selectedOrder.id));
        toast.success("تم حذف الطلب بنجاح");
      }
    });
  }, [selectedOrder, setSelectedOrder]);

  // Assign customer
  const handleAssignCustomer = useCallback(
    (customerId: string | undefined) => {
      if (!selectedOrder) return;
      axiosClient.patch(`orders/${selectedOrder.id}`, { customer_id: customerId }).then(({ data }) => {
        setSelectedOrder(data.order);
      });
    },
    [selectedOrder, setSelectedOrder]
  );

  // ==================== MEMOIZED VALUES ====================
  const filteredMeals = useMemo(() => {
    if (!selectedCategory?.meals) return [];
    if (!searchQuery.trim()) return selectedCategory.meals;
    const query = searchQuery.toLowerCase();
    return selectedCategory.meals.filter((meal) =>
      meal.name.toLowerCase().includes(query)
    );
  }, [selectedCategory, searchQuery]);

  const cartTotal = useMemo(() => {
    if (!selectedOrder?.meal_orders) return 0;
    return selectedOrder.totalPrice || 0;
  }, [selectedOrder]);

  const cartItemCount = useMemo(() => {
    return selectedOrder?.meal_orders?.length || 0;
  }, [selectedOrder]);

  const isOrderConfirmed = selectedOrder?.order_confirmed || false;

  // ==================== RENDER SECTIONS ====================

  // Orders List Section
  const OrdersListSection = (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: { xs: 0, md: 3 },
        border: { xs: "none", md: "1px solid" },
        borderColor: { xs: "transparent", md: (theme) => alpha(theme.palette.grey[300], 0.5) },
        bgcolor: "background.paper",
        overflow: "hidden",
        boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.common.black, 0.08)}`,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          borderBottom: "2px solid",
          borderColor: "divider",
          bgcolor: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.primary.main, 0.06)} 100%)`,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Package size={20} style={{ color: "var(--mui-palette-primary-main)" }} />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: "1rem" }}>
              الطلبات
            </Typography>
            <Chip
              label={orders.length}
              size="small"
              sx={{
                height: 24,
                fontSize: "0.7rem",
                fontWeight: 700,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.15),
                color: "primary.main",
                border: "1px solid",
                borderColor: "primary.main",
              }}
            />
          </Stack>
          <Tooltip title="طلب جديد" arrow>
            <IconButton
              onClick={handleNewOrder}
              size="medium"
              sx={{
                bgcolor: "primary.main",
                color: "white",
                boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                "&:hover": {
                  bgcolor: "primary.dark",
                  transform: "scale(1.1)",
                  boxShadow: (theme) => `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                },
                transition: "all 0.2s ease",
              }}
            >
              <Plus size={20} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Orders List */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
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
        {orders.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>
            <Clock size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              لا توجد طلبات اليوم
            </Typography>
          </Box>
        ) : (
          orders.map((order) => (
            <OrderButton
              key={order.id}
              order={order}
              isSelected={selectedOrder?.id === order.id}
              onClick={() => setSelectedOrder(order)}
            />
          ))
        )}
      </Box>
    </Paper>
  );

  // Meals Section
  const MealsSection = (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: { xs: 0, md: 3 },
        border: { xs: "none", md: "1px solid" },
        borderColor: { xs: "transparent", md: (theme) => alpha(theme.palette.grey[300], 0.5) },
        bgcolor: "background.paper",
        overflow: "hidden",
        boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.common.black, 0.08)}`,
      }}
    >
      {/* Categories */}
      <Box
        sx={{
          borderBottom: "2px solid",
          borderColor: "divider",
          bgcolor: (theme) => alpha(theme.palette.grey[50], 0.5),
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            p: 2,
            overflowX: "auto",
            "&::-webkit-scrollbar": { height: 6 },
            "&::-webkit-scrollbar-track": {
              backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.05),
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.2),
              borderRadius: 3,
            },
          }}
        >
          {categories.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.name}
              onClick={() => setSelectedCategory(cat)}
              sx={{
                flexShrink: 0,
                fontWeight: 700,
                fontSize: "0.85rem",
                height: 32,
                px: 2,
                bgcolor:
                  selectedCategory?.id === cat.id
                    ? "primary.main"
                    : "background.paper",
                color: selectedCategory?.id === cat.id ? "white" : "text.primary",
                border: "1px solid",
                borderColor: selectedCategory?.id === cat.id ? "primary.main" : "divider",
                boxShadow: selectedCategory?.id === cat.id
                  ? (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
                  : (theme) => `0 2px 4px ${alpha(theme.palette.common.black, 0.05)}`,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor:
                    selectedCategory?.id === cat.id
                      ? "primary.dark"
                      : (theme) => alpha(theme.palette.primary.main, 0.08),
                  borderColor: "primary.main",
                  transform: "translateY(-2px)",
                  boxShadow: (theme) => `0 4px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Search */}
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <TextField
          fullWidth
          size="small"
          placeholder="بحث عن وجبة..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} style={{ opacity: 0.5 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2.5,
              bgcolor: (theme) => alpha(theme.palette.grey[50], 0.5),
              "&:hover": {
                bgcolor: "background.paper",
              },
              "&.Mui-focused": {
                bgcolor: "background.paper",
                boxShadow: (theme) => `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
              },
            },
          }}
        />
      </Box>

      {/* Meals Grid */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "grid",
          gap: 1.5,
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          alignContent: "start",
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
        {!selectedOrder ? (
          <Box sx={{ gridColumn: "1 / -1", py: 8, textAlign: "center" }}>
            <Package size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
            <Typography variant="body1" sx={{ fontWeight: 500, color: "text.secondary" }}>
              اختر طلباً أو أنشئ طلباً جديداً
            </Typography>
          </Box>
        ) : filteredMeals.length === 0 ? (
          <Box sx={{ gridColumn: "1 / -1", py: 8, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              لا توجد وجبات
            </Typography>
          </Box>
        ) : (
          filteredMeals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              isInOrder={selectedOrder?.meal_orders?.some((m) => m.meal.id === meal.id) || false}
              onAdd={() => handleAddMeal(meal)}
              isLoading={loadingMealId === meal.id}
            />
          ))
        )}
      </Box>
    </Paper>
  );

  // Cart Section
  const CartSection = (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: { xs: 0, md: 3 },
        border: { xs: "none", md: "1px solid" },
        borderColor: { xs: "transparent", md: (theme) => alpha(theme.palette.grey[300], 0.5) },
        bgcolor: "background.paper",
        overflow: "hidden",
        boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.common.black, 0.08)}`,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          borderBottom: "2px solid",
          borderColor: "divider",
          bgcolor: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)} 0%, ${alpha(theme.palette.success.main, 0.1)} 100%)`,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.success.main, 0.15),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShoppingCart size={20} style={{ color: "var(--mui-palette-success-main)" }} />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: "1rem" }}>
              السلة
            </Typography>
            {cartItemCount > 0 && (
              <Chip
                label={cartItemCount}
                size="small"
                sx={{
                  height: 24,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  bgcolor: "success.main",
                  color: "white",
                  boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.success.main, 0.3)}`,
                }}
              />
            )}
          </Stack>
        </Stack>
      </Box>

      {/* Cart Items */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
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
        {!selectedOrder ? (
          <Box sx={{ py: 8, textAlign: "center" }}>
            <ShoppingCart size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              اختر طلباً للبدء
            </Typography>
          </Box>
        ) : cartItemCount === 0 ? (
          <Box sx={{ py: 8, textAlign: "center" }}>
            <ShoppingCart size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              السلة فارغة
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {selectedOrder.meal_orders.map((item) => (
              <CartItemV2
                key={item.id}
                item={item}
                onDelete={() => handleDeleteMealOrder(item.id)}
                onQuantityChange={(inc) => handleQuantityChange(item.id, inc, item.quantity)}
                disabled={isOrderConfirmed}
              />
            ))}
          </Stack>
        )}
      </Box>

      {/* Order Details & Summary */}
      {selectedOrder && cartItemCount > 0 && (
        <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
          {/* Notes */}
          <TextField
            fullWidth
            size="small"
            label="ملاحظات"
            multiline
            rows={2}
            defaultValue={selectedOrder.notes}
            onChange={(e) => {
              const val = e.target.value;
              setTimeout(() => handleUpdateOrderField("notes", val), 500);
            }}
            sx={{ mb: 1.5, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          {/* Summary */}
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
              border: "1px solid",
              borderColor: "divider",
              mb: 2,
            }}
          >
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  المجموع
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "primary.main" }}>
                  {cartTotal.toFixed(3)}
                </Typography>
              </Stack>
              <Divider />
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  رسوم التوصيل
                </Typography>
                <TextField
                  size="small"
                  type="number"
                  defaultValue={selectedOrder.delivery_fee}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTimeout(() => handleUpdateOrderField("delivery_fee", Number(val)), 500);
                  }}
                  sx={{
                    width: 80,
                    "& .MuiOutlinedInput-root": { borderRadius: 1.5 },
                    "& input": { textAlign: "center", py: 0.5 },
                  }}
                />
              </Stack>
            </Stack>
          </Paper>

          {/* Confirm Button */}
          {!isOrderConfirmed && (
            <LoadingButton
              fullWidth
              variant="contained"
              size="large"
              onClick={handleConfirmOrder}
              startIcon={<Receipt size={20} />}
              sx={{
                borderRadius: 2,
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              تأكيد الطلب
            </LoadingButton>
          )}

          {isOrderConfirmed && (
            <Chip
              label="تم تأكيد الطلب ✓"
              sx={{
                width: "100%",
                py: 2.5,
                bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                color: "success.main",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            />
          )}
        </Box>
      )}
    </Paper>
  );

  // ==================== MAIN RENDER ====================
  if (isLoading) {
    return (
      <Box
        sx={{
          height: "calc(100vh - 100px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Mobile Layout with Tabs
  if (isMobile) {
    return (
      <Fade in timeout={300}>
        <Box sx={{ height: "calc(100vh - 80px)", display: "flex", flexDirection: "column" }}>
          {/* Order Header */}
          <OrderHeaderV2
            selectedOrder={selectedOrder}
            customers={customers}
            whatsappLoading={whatsappLoading}
            onNewOrder={handleNewOrder}
            onAssignCustomer={handleAssignCustomer}
            onOpenCustomerForm={() => setIsCustomerFormOpen(true)}
            onOpenNoteDialog={() => setIsNoteDialogOpen(true)}
            onPrint={handlePrint}
            onSendMessage={handleSendMessage}
            onSendLocation={handleSendLocation}
            onSendWhatsApp={handleSendWhatsApp}
            onToggleDelivery={handleToggleDelivery}
            onDeleteOrder={handleDeleteOrder}
            setSelectedOrder={setSelectedOrder as (order: Order) => void}
          />
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="fullWidth"
            sx={{
              bgcolor: "background.paper",
              borderBottom: "1px solid",
              borderColor: "divider",
              "& .MuiTab-root": { fontWeight: 600, textTransform: "none" },
            }}
          >
            <Tab
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Package size={16} />
                  <span>الطلبات</span>
                </Stack>
              }
            />
            <Tab
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Grid3X3 size={16} />
                  <span>الوجبات</span>
                </Stack>
              }
            />
            <Tab
              label={
                <Badge badgeContent={cartItemCount} color="primary">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ShoppingCart size={16} />
                    <span>السلة</span>
                  </Stack>
                </Badge>
              }
            />
          </Tabs>

          {/* Tab Panels */}
          <Box sx={{ flex: 1, overflow: "hidden" }}>
            <TabPanel value={activeTab} index={0}>
              {OrdersListSection}
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              {MealsSection}
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
              {CartSection}
            </TabPanel>
          </Box>

          {/* Dialogs */}
          {currentMealOrder && (
            <RequestedServiceDialog
              setShowRequestedDialog={setShowServiceDialog}
              setSelectedOrder={setSelectedOrder}
              mealOrder={currentMealOrder}
              meal={currentMealOrder.meal}
              open={showServiceDialog}
              handleClose={() => setShowServiceDialog(false)}
            />
          )}
          <CustomerForm
            open={isCustomerFormOpen}
            onClose={() => setIsCustomerFormOpen(false)}
            selectedCustomer={{} as Customer}
            onSubmit={() => setIsCustomerFormOpen(false)}
          />
          {selectedOrder && (
            <NoteDialog
              handleClose={() => setIsNoteDialogOpen(false)}
              open={isNoteDialogOpen}
              selectedOrder={selectedOrder}
              setSelectedOrder={setSelectedOrder as React.Dispatch<React.SetStateAction<Order>>}
            />
          )}
        </Box>
      </Fade>
    );
  }

  // Desktop Layout
  return (
    <Fade in timeout={300}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 100px)" }}>
        {/* Order Header */}
        <OrderHeaderV2
          selectedOrder={selectedOrder}
          customers={customers}
          whatsappLoading={whatsappLoading}
          onNewOrder={handleNewOrder}
          onAssignCustomer={handleAssignCustomer}
          onOpenCustomerForm={() => setIsCustomerFormOpen(true)}
          onOpenNoteDialog={() => setIsNoteDialogOpen(true)}
          onPrint={handlePrint}
          onSendMessage={handleSendMessage}
          onSendLocation={handleSendLocation}
          onSendWhatsApp={handleSendWhatsApp}
          onToggleDelivery={handleToggleDelivery}
          onDeleteOrder={handleDeleteOrder}
          setSelectedOrder={setSelectedOrder as (order: Order) => void}
        />
        {/* Main Content Grid */}
        <Box
          sx={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "160px 1fr 340px",
            gap: 2,
            overflow: "hidden",
            minHeight: 0,
          }}
        >
          {/* Orders Column */}
          {OrdersListSection}

          {/* Meals Column */}
          {MealsSection}

          {/* Cart Column */}
          {CartSection}
        </Box>

        {/* Dialogs */}
        {currentMealOrder && (
          <RequestedServiceDialog
            setShowRequestedDialog={setShowServiceDialog}
            setSelectedOrder={setSelectedOrder}
            mealOrder={currentMealOrder}
            meal={currentMealOrder.meal}
            open={showServiceDialog}
            handleClose={() => setShowServiceDialog(false)}
          />
        )}
        <CustomerForm
          open={isCustomerFormOpen}
          onClose={() => setIsCustomerFormOpen(false)}
          selectedCustomer={{} as Customer}
          onSubmit={() => setIsCustomerFormOpen(false)}
        />
        {selectedOrder && (
          <NoteDialog
            handleClose={() => setIsNoteDialogOpen(false)}
            open={isNoteDialogOpen}
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder as React.Dispatch<React.SetStateAction<Order>>}
          />
        )}
      </Box>
    </Fade>
  );
};

export default NewOrderV2;
