import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  TextField,
  Typography,
  Box,
  alpha,
  Chip,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useForm } from "react-hook-form";
import axiosClient from "@/helpers/axios-client";
import { AxiosResponseProps, Meal, Service } from "@/Types/types";
import MealChildrenTable, { MealChildrenTableMobile } from "./MealChildrenTable";
import { useServiceStore } from "@/pages/ServiceStore";
import { X, Plus, Package } from "lucide-react";

interface MealChildrenDialogProps {
  open: boolean;
  handleClose: () => void;
  handleClickOpen: () => void;
  selectedMeal: Meal | null;
  setSelectedMeal: (meal: Meal | null) => void;
}

const MealChildrenDialog = ({
  handleClose,
  open,
  selectedMeal,
  setSelectedMeal,
}: MealChildrenDialogProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const { serviceList, fetchData } = useServiceStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const { handleSubmit, reset } = useForm();

  const submitHandler = () => {
    if (!selectedService) return;
    
    axiosClient
      .post<AxiosResponseProps<Meal>>(`childMeals`, {
        meal_id: selectedMeal?.id,
        service_id: selectedService?.id,
      })
      .then(({ data }) => {
        if (data.status) {
          setSelectedMeal(data.data);
          setSelectedService(null);
          reset();
        }
      });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
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
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
              }}
            >
              Manage Sub-Services
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                For:
              </Typography>
              <Chip
                label={selectedMeal?.name || 'Unknown'}
                size="small"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontWeight: 600,
                }}
              />
              {selectedMeal?.child_meals && (
                <Typography variant="body2" color="text.secondary">
                  • {selectedMeal.child_meals.length} services
                </Typography>
              )}
            </Stack>
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
        </Stack>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {/* Add Service Form */}
        <Box
          sx={{
            p: 3,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
              }}
            >
              <Plus size={18} />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Add New Service
            </Typography>
          </Stack>

          <form onSubmit={handleSubmit(submitHandler)}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Autocomplete
                fullWidth
                options={serviceList}
                getOptionLabel={(option) => option.name}
                value={selectedService}
                onChange={(_, val) => setSelectedService(val)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select a service to add..."
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                        }}
                      />
                      <Typography variant="body2">{option.name}</Typography>
                    </Stack>
                  </Box>
                )}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={!selectedService}
                startIcon={<Plus size={18} />}
                sx={{
                  minWidth: 140,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none',
                  },
                }}
              >
                Add Service
              </Button>
            </Stack>
          </form>
        </Box>

        {/* Services List */}
        <Box sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                color: 'info.main',
              }}
            >
              <Package size={18} />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Current Services
            </Typography>
          </Stack>

          {!selectedMeal?.child_meals || selectedMeal.child_meals.length === 0 ? (
            <Box
              sx={{
                py: 6,
                textAlign: 'center',
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.grey[100], 0.5),
              }}
            >
              <Package
                size={40}
                strokeWidth={1.5}
                style={{ opacity: 0.3, marginBottom: 12 }}
              />
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                No services added yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Use the form above to add services to this meal
              </Typography>
            </Box>
          ) : isMobile ? (
            <MealChildrenTableMobile
              selectedMeal={selectedMeal}
              setSelectedMeal={setSelectedMeal}
              data={selectedMeal.child_meals}
            />
          ) : (
            <MealChildrenTable
              selectedMeal={selectedMeal}
              setSelectedMeal={setSelectedMeal}
              data={selectedMeal.child_meals}
            />
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            px: 3,
            py: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: (theme) => alpha(theme.palette.grey[100], 0.5),
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
            }}
          >
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default MealChildrenDialog;
