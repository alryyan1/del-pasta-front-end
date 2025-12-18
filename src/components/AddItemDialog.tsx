import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ProductForm from "./forms/meal";
import { X, PlusCircle } from "lucide-react";

interface AddItemDialogProps {
  handleClose: () => void;
  open: boolean;
}

const AddItemDialog = ({ handleClose, open }: AddItemDialogProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          overflow: 'hidden',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.03),
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
            }}
          >
            <PlusCircle size={20} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
              }}
            >
              Add New Item
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Create a new menu item
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            color: 'text.secondary',
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
              color: 'error.main',
            },
          }}
        >
          <X size={20} />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: 3 }}>
        <ProductForm handleClose={handleClose} open={open} />
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
