import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Grid,
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
  Divider,
  Chip,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Delete } from "@mui/icons-material";
import AddCostForm from "@/components/forms/cost";
import axiosClient from "@/helpers/axios-client";
import { useAuthContext } from "@/contexts/stateContext";
import { Cost } from "@/Types/types";
import { useTranslation } from "react-i18next";

function CashDenos() {
  const { t } = useTranslation("cost");
  const { data, setData, deleteItem } = useAuthContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = t("cash_denominations");
  }, [t]);

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
    const total = data.reduce((sum: number, cost: Cost) => sum + cost.amount, 0);
    return { total };
  }, [data]);

  return (
    <Grid container spacing={2}>
      <Grid item lg={3} xs={12}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
            {t("add_expense")}
          </Typography>
          <AddCostForm />
        </Paper>
      </Grid>

      <Grid item lg={9} xs={12}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            gap={1.5}
            sx={{ mb: 1 }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {t("expenses")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("cash_denominations")}
              </Typography>
            </Box>
            <Chip
              label={`${t("total")}: ${totals.total.toFixed(2)}`}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          </Stack>

          <Divider sx={{ mb: 2 }} />

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              maxHeight: 520,
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>{t("description")}</TableCell>
                  <TableCell>{t("category")}</TableCell>
                  <TableCell align="right">{t("amount")}</TableCell>
                  <TableCell align="center">{t("delete")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body2" color="text.secondary">
                        {t("no_data")}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}

                {loading && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body2" color="text.secondary">
                        {t("loading")}...
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}

                {!loading &&
                  data.map((cost: Cost) => (
                    <TableRow key={cost.id} hover>
                      <TableCell sx={{ maxWidth: 320 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {cost.description}
                        </Typography>
                        {cost.comment && (
                          <Typography variant="body2" color="text.secondary">
                            {cost.comment}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{cost?.cost_category?.name}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        {cost.amount.toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title={t("delete")}>
                          <IconButton
                            color="error"
                            onClick={() => {
                              axiosClient.delete(`costs/${cost.id}`).then(({ data }) => {
                                deleteItem(data.data);
                              });
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default CashDenos;
