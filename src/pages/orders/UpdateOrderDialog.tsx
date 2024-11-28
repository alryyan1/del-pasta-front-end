import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
} from '@mui/material';

const orderSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'in preparation', 'delivered', 'cancelled']),
  payment_status: z.string(),
  delivery_address: z.string(),
  special_instructions: z.string(),
  notes: z.string(),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface UpdateOrderDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdate: (data: OrderFormData) => void;
}

export const UpdateOrderDialog = ({
  open,
  onClose,
  order,
}: UpdateOrderDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: order || {},
  });

  const onSubmit = (data: OrderFormData) => {
    // onUpdate(data);
    onClose();
    reset();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Update Order</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              select
              label="Status"
              {...register('status')}
              error={!!errors.status}
              helperText={errors.status?.message}
              fullWidth
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="in preparation">In Preparation</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>

            <TextField
              label="Payment Status"
              {...register('payment_status')}
              error={!!errors.payment_status}
              helperText={errors.payment_status?.message}
              fullWidth
            />

            <TextField
              label="Delivery Address"
              {...register('delivery_address')}
              error={!!errors.delivery_address}
              helperText={errors.delivery_address?.message}
              fullWidth
              multiline
              rows={2}
            />

            <TextField
              label="Special Instructions"
              {...register('special_instructions')}
              error={!!errors.special_instructions}
              helperText={errors.special_instructions?.message}
              fullWidth
              multiline
              rows={2}
            />

            <TextField
              label="Notes"
              {...register('notes')}
              error={!!errors.notes}
              helperText={errors.notes?.message}
              fullWidth
              multiline
              rows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Update</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};