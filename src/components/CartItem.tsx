import { Eye, Minus, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Meal, Mealorder, Order, Requestedchildmeal } from "../Types/types";
import BasicPopover from "./Mypopover";
import MealChildrenTable from "./MealChildrenTable";
import {
  Badge,
  IconButton,
  Slide,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Box,
  Typography,
  Chip,
  alpha,
  Paper,
  Tooltip,
} from "@mui/material";
import axiosClient from "@/helpers/axios-client";
import RequestedChildrenTable from "./RequestedChildrenTable";
import RequestedServices from "./RequestedServices";
import Incremenor from "./Incremenor";
import CartItemOptions from "./CartItemOptions";
import { useOutletContext } from "react-router-dom";
import CartItemOptionsMobile from "./CartItemOptionsMobile";
import { useTranslation } from "react-i18next";

interface CartItemProbs {
  item: Mealorder;
  selectedOrder: Order;
  updateQuantity: (increment: boolean, item: Mealorder) => void;
  isMultible: string;
  setSelectedOrder: (order: Order) => void;
  updateRequestedQuantity: (increment: boolean, item: Requestedchildmeal) => void;
}

function CartItem({
  isMultible,
  updateQuantity,
  item,
  setSelectedOrder,
  updateRequestedQuantity,
  selectedOrder,
}: CartItemProbs) {
  const { t } = useTranslation("cart");
  const [show, setShow] = useState(false);
  const [color, setColor] = useState("");
  const { isIpadPro } = useOutletContext();

  const onDelete = useCallback(() => {
    axiosClient.delete(`orderMeals/${item.id}`).then(({ data }) => {
      setSelectedOrder(data.order);
    });
  }, [item.id, setSelectedOrder]);

  useEffect(() => {
    if (color !== "") {
      const timer = setTimeout(() => {
        axiosClient
          .patch(`orderMeals/${item.id}`, {
            color: color,
          })
          .then(({ data }) => {
            setSelectedOrder(data.order);
          });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [color, item.id, setSelectedOrder]);

  // Memoized calculations
  const itemTotal = useMemo(() => {
    return (item.totalPrice + item.quantity * item.price).toFixed(3);
  }, [item.totalPrice, item.quantity, item.price]);

  const hasServices = item.requested_child_meals.length > 0;
  const isOrderConfirmed = selectedOrder.order_confirmed;

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.primary.main, 0.1)}`,
          borderColor: "primary.main",
        },
      }}
    >
      <Badge
        color="primary"
        badgeContent={hasServices ? item.requested_child_meals.length : 0}
        sx={{
          "& .MuiBadge-badge": {
            fontSize: "0.65rem",
            minWidth: 18,
            height: 18,
            fontWeight: 600,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            gap: 2,
          }}
        >
          {/* Meal Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
              <BasicPopover
                selectedOrder={selectedOrder}
                title={item.meal.name}
                content={
                  <Box sx={{ minWidth: 300, maxWidth: 400 }}>
                    <RequestedChildrenTable setSelectedOrder={setSelectedOrder} mealOrder={item} />
                  </Box>
                }
              />
              {hasServices && (
                <Chip
                  label={`${item.requested_child_meals.length} ${hasServices ? "خدمة" : ""}`}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.65rem",
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    color: "primary.main",
                    fontWeight: 600,
                  }}
                />
              )}
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="body2" color="text.secondary">
                {t("quantity") || "الكمية"}: {item.quantity}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "primary.main",
                }}
              >
                {itemTotal} {t("currency_OMR") || "د.ك"}
              </Typography>
            </Stack>
          </Box>

          {/* Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {isIpadPro ? (
              <CartItemOptionsMobile
                item={item}
                onDelete={onDelete}
                setShow={setShow}
                show={show}
                setColor={setColor}
                updateQuantity={updateQuantity}
              />
            ) : (
              <CartItemOptions
                selectedOrder={selectedOrder}
                item={item}
                onDelete={onDelete}
                setShow={setShow}
                show={show}
                setColor={setColor}
                updateQuantity={updateQuantity}
              />
            )}
          </Box>
        </Box>
      </Badge>

      {/* Services Section */}
      {hasServices && (
        <Slide direction="down" in={show} mountOnEnter unmountOnExit>
          <Box
            sx={{
              borderTop: "1px solid",
              borderColor: "divider",
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02),
            }}
          >
            <RequestedServices
              item={item}
              show={show}
              updateRequestedQuantity={updateRequestedQuantity}
            />
          </Box>
        </Slide>
      )}
    </Paper>
  );
}

export default CartItem;
