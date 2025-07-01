import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import AddCostForm from "@/components/forms/cost";
import axiosClient from "@/helpers/axios-client";
import { useDataContext } from "@/contexts/AppContext";
import { Cost } from "@/Types/types";
import { useTranslation } from "react-i18next";

function CashDenos() {
  const { t } = useTranslation('cost'); // Use the translation hook for dynamic text
  const { data, setData, deleteItem } = useDataContext();

  useEffect(() => {
    document.title = t("cash_denominations"); // Dynamic page title
  }, [t]);

  useEffect(() => {
    axiosClient.get<Cost[]>(`costs`).then(({ data }) => {
      setData(data);
    });
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item lg={3} xs={12}>
          <AddCostForm />
        </Grid>
        <Grid item lg={8} xs={12}>
          <Box sx={{ p: 1 }}>
            <Typography variant="h6" textAlign={"center"}>
              {t("expenses")} {/* Translated 'المصروفات' */}
            </Typography>
            <Table size="small" style={{ direction: "rtl", margin: "auto" }}>
              <TableHead>
                <TableRow>
                  <TableCell>{t("description")}</TableCell>
                  <TableCell>{t("category")}</TableCell>
                  <TableCell>{t("amount")}</TableCell>
                  <TableCell>{t("delete")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((cost: Cost) => (
                  <TableRow key={cost.id}>
                    <TableCell>{cost.description}</TableCell>
                    <TableCell>{cost?.cost_category?.name}</TableCell>
                    <TableCell>{cost.amount}</TableCell>
                    <TableCell>
                      <LoadingButton
                        onClick={() => {
                          axiosClient.delete(`costs/${cost.id}`).then(({ data }) => {
                            deleteItem(data.data);
                          });
                        }}
                      >
                        {t("delete")}
                      </LoadingButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default CashDenos;
