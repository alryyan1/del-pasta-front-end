import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
  Stack,
  Chip,
  alpha,
  Fade,
  Skeleton,
} from "@mui/material";
import { Trash2, DollarSign, Plus, Receipt } from "lucide-react";
import AddCostForm from "@/components/forms/cost";
import axiosClient from "@/helpers/axios-client";
import { useAuthContext } from "@/contexts/stateContext";
import { Cost } from "@/Types/types";
import PageHeader from "@/components/PageHeader";

function Expenses() {
  const { data, setData, deleteItem } = useAuthContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get<Cost[]>(`costs`)
      .then(({ data }) => {
        setData(data);
      })
      .finally(() => setLoading(false));
  }, [setData]);

  const totals = useMemo(() => {
    const total = data.reduce(
      (sum: number, cost: Cost) => sum + (Number(cost.amount) || 0),
      0
    );
    return { total };
  }, [data]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(value);
  };

  return (
    <Fade in timeout={300}>
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>
        <PageHeader
          title="Expenses"
          subtitle="Track and manage your expenses"
          icon={<Receipt size={24} />}
          badge={data.length}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "320px 1fr" },
            gap: 3,
          }}
        >
          {/* Add Expense Form */}
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
                Add Expense
              </Typography>
            </Stack>
            <AddCostForm />
          </Paper>

          {/* Expenses List */}
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
            {/* Header */}
            <Box
              sx={{
                p: 2.5,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                gap={1.5}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    All Expenses
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {data.length} expenses recorded
                  </Typography>
                </Box>
                <Chip
                  icon={<DollarSign size={16} />}
                  label={`Total: ${formatCurrency(totals.total)} KWD`}
                  color="primary"
                  sx={{ fontWeight: 600, pl: 0.5 }}
                />
              </Stack>
            </Box>

            {/* Table */}
            <TableContainer sx={{ maxHeight: 520 }}>
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
                      Description
                    </TableCell>
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
                      Category
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 600,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        py: 1.5,
                      }}
                    >
                      Amount
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 600,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        py: 1.5,
                        width: 80,
                      }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton variant="text" width="80%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rounded" width={80} height={24} />
                        </TableCell>
                        <TableCell align="right">
                          <Skeleton variant="text" width={60} />
                        </TableCell>
                        <TableCell align="center">
                          <Skeleton variant="circular" width={32} height={32} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Box
                          sx={{ py: 6, textAlign: "center", color: "text.secondary" }}
                        >
                          <Receipt
                            size={48}
                            strokeWidth={1.5}
                            style={{ opacity: 0.3, marginBottom: 12 }}
                          />
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            No expenses recorded
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            Add your first expense using the form
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((cost: Cost) => (
                      <TableRow
                        key={cost.id}
                        sx={{
                          "&:hover": {
                            bgcolor: (theme) =>
                              alpha(theme.palette.action.hover, 0.04),
                          },
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {cost.description}
                          </Typography>
                          {cost.comment && (
                            <Typography variant="caption" color="text.secondary">
                              {cost.comment}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={cost?.cost_category?.name || "Uncategorized"}
                            size="small"
                            sx={{
                              bgcolor: (theme) =>
                                alpha(theme.palette.grey[500], 0.1),
                              color: "text.secondary",
                              fontWeight: 500,
                              fontSize: "0.75rem",
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 700, color: "error.main" }}
                          >
                            -{formatCurrency(cost.amount || 0)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Delete expense">
                            <IconButton
                              size="small"
                              onClick={() => {
                                axiosClient
                                  .delete(`costs/${cost.id}`)
                                  .then(({ data }) => {
                                    deleteItem(data.data);
                                  });
                              }}
                              sx={{
                                color: "text.secondary",
                                "&:hover": {
                                  bgcolor: (theme) =>
                                    alpha(theme.palette.error.main, 0.1),
                                  color: "error.main",
                                },
                              }}
                            >
                              <Trash2 size={18} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
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

export default Expenses;
