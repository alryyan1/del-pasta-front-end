import React, { useCallback } from 'react';
import BasicPopover from './Mypopover';
import { Stack, Box, Typography, IconButton, Tooltip, alpha, Divider } from '@mui/material';
import { Eye, Trash2, Settings } from 'lucide-react';
import Incremenor from './Incremenor';
import { Mealorder } from '@/Types/types';

interface CartItemOptionsPorbs {
  setColor: (color: string) => void;
  setShow: (show: boolean) => void;
  onDelete: (item: Mealorder) => void;
  item: Mealorder;
  show: boolean;
  updateQuantity: (increment: boolean, item: Mealorder) => void;
}

function CartItemOptionsMobile({
  setShow,
  onDelete,
  item,
  show,
  updateQuantity,
}: CartItemOptionsPorbs) {
  const itemTotal = (item.totalPrice * item.quantity).toFixed(3);

  const handleToggleShow = useCallback(() => {
    setShow(!show);
  }, [show, setShow]);

  const handleDelete = useCallback(() => {
    onDelete(item);
  }, [onDelete, item]);

  return (
    <BasicPopover
      title={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Settings size={18} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            الخيارات
          </Typography>
        </Box>
      }
      content={
        <Stack spacing={1.5} sx={{ minWidth: 200, p: 1 }}>
          {/* Price Display */}
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              textAlign: 'center',
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              الإجمالي
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                fontSize: '1rem',
              }}
            >
              {itemTotal} د.ك
            </Typography>
          </Box>

          <Divider />

          {/* Quantity Controls */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              الكمية
            </Typography>
            <Incremenor updateQuantity={updateQuantity} requested={item} />
          </Box>

          <Divider />

          {/* Actions */}
          <Stack spacing={1}>
            <Tooltip title="عرض التفاصيل">
              <IconButton
                onClick={handleToggleShow}
                fullWidth
                sx={{
                  justifyContent: 'flex-start',
                  color: show ? 'primary.main' : 'text.secondary',
                  bgcolor: show ? (theme) => alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.15),
                  },
                }}
              >
                <Eye size={18} style={{ marginRight: 8 }} />
                <Typography variant="body2">
                  {show ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
                </Typography>
              </IconButton>
            </Tooltip>

            <Tooltip title="حذف">
              <IconButton
                color="error"
                onClick={handleDelete}
                fullWidth
                sx={{
                  justifyContent: 'flex-start',
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                  },
                }}
              >
                <Trash2 size={18} style={{ marginRight: 8 }} />
                <Typography variant="body2">حذف</Typography>
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      }
    />
  );
}

export default CartItemOptionsMobile;
