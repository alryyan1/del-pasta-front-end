import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  alpha,
  Fade,
  InputAdornment,
  Skeleton,
} from "@mui/material";
import { Plus, Search, BarChart3, Calendar } from "lucide-react";
import axiosClient from "@/helpers/axios-client";
import { useCategoryStore } from "@/stores/CategoryStore";
import { Category } from "@/Types/types";
import DepositDialog from "@/components/DepositDialog";
import PageHeader from "@/components/PageHeader";

function Stats() {
  const [searchQuery, setSearchQuery] = useState("");
  const [search, setSearch] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [childName, setChildName] = useState("");
  const [mealName, setMealName] = useState("");
  const [childId, setChildId] = useState<number | null>(null);
  const [update, setUpdate] = useState(0);
  const [showAddDepositDialog, setShowAddDepositDialog] = useState(false);
  const { fetchCategories, categories } = useCategoryStore((state) => state);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleClose = () => {
    setShowAddDepositDialog(false);
    setUpdate((u) => u + 1);
  };

  useEffect(() => {
    setLoading(true);
    axiosClient
      .post(`orderMealsStats?date=${searchQuery}`, {
        category: selectedCategory?.id,
      })
      .then(({ data }) => {
        setData(data);
      })
      .finally(() => setLoading(false));
  }, [searchQuery, update, selectedCategory]);

  const filteredData = data.filter((d) => {
    return (
      d.childName?.toLowerCase().includes(search.toLowerCase()) ||
      d.mealName?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <Fade in timeout={300}>
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>
        <PageHeader
          title="Statistics"
          subtitle="Track inventory and order statistics"
          icon={<BarChart3 size={24} />}
          badge={filteredData.length}
        />

        {/* Filters */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            gap={2}
            alignItems={{ xs: "stretch", sm: "center" }}
            flexWrap="wrap"
          >
            <TextField
              type="date"
              size="small"
              label="Select Date"
              InputLabelProps={{ shrink: true }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                minWidth: 180,
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Calendar size={18} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              size="small"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                minWidth: 200,
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} />
                  </InputAdornment>
                ),
              }}
            />
            <Stack direction="row" gap={1} flexWrap="wrap">
              <Chip
                label="All"
                onClick={() => setSelectedCategory(null)}
                color={selectedCategory === null ? "primary" : "default"}
                variant={selectedCategory === null ? "filled" : "outlined"}
                sx={{ borderRadius: 2, fontWeight: 500 }}
              />
              {categories.map((cat) => (
                <Chip
                  key={cat.id}
                  label={cat.name}
                  onClick={() => setSelectedCategory(cat)}
                  color={cat.id === selectedCategory?.id ? "primary" : "default"}
                  variant={cat.id === selectedCategory?.id ? "filled" : "outlined"}
                  sx={{ borderRadius: 2, fontWeight: 500 }}
                />
              ))}
            </Stack>
          </Stack>
        </Paper>

        {/* Data Table */}
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
          <TableContainer sx={{ maxHeight: 600 }}>
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
                      py: 2,
                    }}
                  >
                    Item Name
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 600,
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      py: 2,
                    }}
                  >
                    Requested
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 600,
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      py: 2,
                    }}
                  >
                    Available
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 600,
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      py: 2,
                    }}
                  >
                    Deducted
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 600,
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      py: 2,
                    }}
                  >
                    Net
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 600,
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      py: 2,
                    }}
                  >
                    Remaining
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 600,
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      py: 2,
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
                      {Array.from({ length: 7 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton variant="text" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>
                        <BarChart3 size={48} strokeWidth={1.5} style={{ opacity: 0.3, marginBottom: 12 }} />
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          No data found
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          Select a date or adjust filters
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((info, index) => {
                    const remaining = info.totalDeposit - info.totalQuantity;
                    const net = info.totalDeposit - info.totalDeduct;
                    const isPositive = remaining >= 0;

                    return (
                      <TableRow
                        key={index}
                        sx={{
                          bgcolor: isPositive
                            ? (theme) => alpha(theme.palette.success.main, 0.05)
                            : "transparent",
                          "&:hover": {
                            bgcolor: (theme) => alpha(theme.palette.action.hover, 0.04),
                          },
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {info.childName}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">{info.totalQuantity}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">{info.totalDeposit}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">{info.totalDeduct}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {net}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={remaining > 0 ? `+${remaining}` : remaining}
                            size="small"
                            color={isPositive ? "success" : "error"}
                            sx={{ fontWeight: 600, minWidth: 60 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Plus size={16} />}
                            onClick={() => {
                              setShowAddDepositDialog(true);
                              setChildId(info.serviceId);
                              setChildName(info.childName);
                              setMealName(info.mealName);
                            }}
                            sx={{
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: 500,
                            }}
                          >
                            Add
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <DepositDialog
          update
          selectedChild={childId}
          childName={childName}
          mealName={mealName}
          open={showAddDepositDialog}
          handleClose={handleClose}
        />
      </Box>
    </Fade>
  );
}

export default Stats;
