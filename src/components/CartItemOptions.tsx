import { IconButton, Tooltip, Box, Typography, Stack, alpha } from '@mui/material';
import { Eye, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import React, { useCallback } from 'react';
import Incremenor from './Incremenor';
import { Mealorder, Order } from '@/Types/types';

interface CartItemOptionsPorbs {
  setColor: (color: string) => void;
  setShow: (show: boolean) => void;
  onDelete: (item: Mealorder) => void;
  item: Mealorder;
  show: boolean;
  updateQuantity: (increment: boolean, item: Mealorder) => void;
  selectedOrder: Order;
}

function CartItemOptions({
  setShow,
  onDelete,
  item,
  show,
  updateQuantity,
  selectedOrder,
}: CartItemOptionsPorbs) {
  const isOrderConfirmed = selectedOrder.order_confirmed;
  const itemTotal = (item.totalPrice + item.quantity * item.price).toFixed(3);

  const handleToggleShow = useCallback(() => {
    setShow(!show);
  }, [show, setShow]);

  const handleDelete = useCallback(() => {
    onDelete(item);
  }, [onDelete, item]);

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {/* Price Display */}
      <Box
        sx={{
          minWidth: 70,
          textAlign: 'center',
          px: 1.5,
          py: 0.5,
          borderRadius: 1.5,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            fontSize: '0.75rem',
          }}
        >
          {itemTotal}
        </Typography>
      </Box>

      {/* Quantity Controls */}
      {!isOrderConfirmed && (
        <Incremenor updateQuantity={updateQuantity} requested={item} />
      )}

      {/* Toggle Services View */}
      {item.requested_child_meals.length > 0 && (
        <Tooltip title={show ? 'إخفاء الخدمات' : 'عرض الخدمات'}>
          <IconButton
            onClick={handleToggleShow}
            size="small"
            sx={{
              color: show ? 'primary.main' : 'text.secondary',
              bgcolor: show ? (theme) => alpha(theme.palette.primary.main, 0.1) : 'transparent',
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.15),
              },
            }}
          >
            {show ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </IconButton>
        </Tooltip>
      )}

      {/* View Details */}
      <Tooltip title="عرض التفاصيل">
        <IconButton
          onClick={handleToggleShow}
          size="small"
          sx={{
            color: 'text.secondary',
            '&:hover': {
              color: 'primary.main',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <Eye size={18} />
        </IconButton>
      </Tooltip>

      {/* Delete Button */}
      {!isOrderConfirmed && (
        <Tooltip title="حذف">
          <IconButton
            color="error"
            onClick={handleDelete}
            size="small"
            sx={{
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
              },
            }}
          >
            <Trash2 size={18} />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
}

export default CartItemOptions;
