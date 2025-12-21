import { Order } from '@/Types/types';
import { LoadingButton } from '@mui/lab';
import { Badge, Typography, Box, alpha, Chip } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useMemo } from 'react';

interface OrderListProps {
    orders: Order[];
    selectedOrder: Order | null;
    setSelectedOrder: (order: Order | null) => void;
}

function OrderList({ orders, selectedOrder, setSelectedOrder }: OrderListProps) {
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      // Show selected order first, then by confirmation status, then by ID
      if (a.id === selectedOrder?.id) return -1;
      if (b.id === selectedOrder?.id) return 1;
      if (a.order_confirmed !== b.order_confirmed) {
        return a.order_confirmed ? 1 : -1;
      }
      return b.id - a.id;
    });
  }, [orders, selectedOrder?.id]);

  return (
    <Stack direction="column" gap={1} sx={{ width: '100%' }}>
      {sortedOrders.length === 0 ? (
        <Box
          sx={{
            py: 3,
            textAlign: 'center',
            color: 'text.secondary',
          }}
        >
          <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
            لا توجد طلبات
          </Typography>
        </Box>
      ) : (
        sortedOrders.map((order) => {
          const isSelected = selectedOrder?.id === order.id;
          const isConfirmed = order.order_confirmed;
          const itemCount = order?.meal_orders?.length || 0;

          return (
            <Badge
              key={order.id}
              color="primary"
              variant="standard"
              badgeContent={itemCount > 0 ? itemCount : undefined}
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.65rem',
                  minWidth: 18,
                  height: 18,
                  fontWeight: 600,
                },
              }}
            >
              <LoadingButton
                onClick={() => setSelectedOrder(order)}
                size="small"
                fullWidth
                variant={isSelected ? "contained" : "outlined"}
                sx={{
                  minHeight: 40,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  position: 'relative',
                  bgcolor: isSelected
                    ? (theme) => theme.palette.primary.main
                    : isConfirmed
                    ? (theme) => alpha(theme.palette.success.main, 0.1)
                    : 'transparent',
                  color: isSelected
                    ? 'white'
                    : isConfirmed
                    ? 'success.main'
                    : 'text.primary',
                  borderColor: isSelected
                    ? 'primary.main'
                    : isConfirmed
                    ? 'success.main'
                    : 'divider',
                  '&:hover': {
                    bgcolor: isSelected
                      ? (theme) => theme.palette.primary.dark
                      : (theme) => alpha(theme.palette.primary.main, 0.08),
                    borderColor: 'primary.main',
                  },
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected
                    ? (theme) => `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`
                    : 'none',
                }}
              >
                <Stack direction="column" spacing={0.25} alignItems="center" sx={{ width: '100%' }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      lineHeight: 1,
                    }}
                  >
                    #{order.order_number}
                  </Typography>
                  {isConfirmed && (
                    <Chip
                      label="✓"
                      size="small"
                      sx={{
                        height: 14,
                        minWidth: 14,
                        fontSize: '0.6rem',
                        bgcolor: 'success.main',
                        color: 'white',
                        '& .MuiChip-label': {
                          px: 0.25,
                        },
                      }}
                    />
                  )}
                </Stack>
              </LoadingButton>
            </Badge>
          );
        })
      )}
    </Stack>
  );
}

export default OrderList;
