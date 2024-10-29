import { Chip } from '@mui/material';

interface StatusChipProps {
  status: string;
}

const statusColors = {
  pending: 'warning',
  confirmed: 'info',
  'in preparation': 'secondary',
  delivered: 'success',
  cancelled: 'error',
} as const;

export const StatusChip = ({ status }: StatusChipProps) => {
  return (
    <Chip
      label={status.toUpperCase()}
      color={statusColors[status as keyof typeof statusColors]}
      size="small"
    />
  );
};