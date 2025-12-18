import React, { useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  alpha,
  Fade,
  Skeleton,
} from "@mui/material";
import { Plus, Wrench, Save } from "lucide-react";
import { Service } from "@/Types/types";
import { useForm, SubmitHandler } from "react-hook-form";
import { useServiceStore } from "./ServiceStore";
import TdCell from "@/helpers/TdCell";
import PageHeader from "@/components/PageHeader";

function Services() {
  const { serviceList, addService, fetchData, loading } = useServiceStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm<Service>();

  const submitHandler: SubmitHandler<Service> = (data) => {
    addService(data);
    reset();
  };

  return (
    <Fade in timeout={300}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <PageHeader
          title="Services"
          subtitle="Manage your service items"
          icon={<Wrench size={24} />}
          badge={serviceList.length}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "300px 1fr" },
            gap: 3,
          }}
        >
          {/* Add Service Form */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              height: "fit-content",
            }}
          >
            <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 3 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                }}
              >
                <Plus size={18} />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Add New Service
              </Typography>
            </Stack>

            <form onSubmit={handleSubmit(submitHandler)}>
              <Stack spacing={2}>
                <TextField
                  autoComplete="off"
                  size="small"
                  {...register("name", {
                    required: "Service name is required",
                  })}
                  fullWidth
                  label="Service Name"
                  placeholder="Enter service name..."
                  error={errors.name != null}
                  helperText={errors.name?.message}
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: 2 },
                  }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  startIcon={<Save size={18} />}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    py: 1.25,
                    boxShadow: "none",
                    "&:hover": { boxShadow: "none" },
                  }}
                >
                  Save Service
                </Button>
              </Stack>
            </form>
          </Paper>

          {/* Services List */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              overflow: "hidden",
            }}
          >
            <Box sx={{ p: 2.5, borderBottom: "1px solid", borderColor: "divider" }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                All Services
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click on a name to edit it
              </Typography>
            </Box>

            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow
                    sx={{ bgcolor: (theme) => alpha(theme.palette.grey[100], 0.8) }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        py: 1.5,
                      }}
                    >
                      Service Name
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton variant="text" width="60%" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : serviceList.length === 0 ? (
                    <TableRow>
                      <TableCell>
                        <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>
                          <Wrench size={48} strokeWidth={1.5} style={{ opacity: 0.3, marginBottom: 12 }} />
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            No services yet
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            Add your first service using the form
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    serviceList.map((service: Service) => (
                      <TableRow
                        key={service.id}
                        sx={{
                          "&:hover": {
                            bgcolor: (theme) => alpha(theme.palette.action.hover, 0.04),
                          },
                        }}
                      >
                        <TdCell item={service} colName="name" table="services" val={service.name}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {service.name}
                          </Typography>
                        </TdCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>
    </Fade>
  );
}

export default Services;
