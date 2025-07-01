import { LoadingButton } from "@mui/lab";
import { Box, Divider, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import MyCustomControlledAutocomplete from "../CostAutocomplete";
import axiosClient from "@/helpers/axios-client";
import { useDataContext } from "@/contexts/AppContext";
import { Cost } from "@/Types/types";
import { useTranslation } from "react-i18next";

function AddCostForm() {
  const { t } = useTranslation('costForm'); // Use translation hook
  const [loading, setLoading] = useState(false);
  const [costCategories, setCostCategories] = useState([]);
  const { add } = useDataContext();

  useEffect(() => {
    axiosClient.get(`CostCategories`).then(({ data }) => {
      setCostCategories(data);
    });
  }, []);

  const {
    handleSubmit,
    setValue,
    register,
    control,
    reset,
    formState: { errors, submitCount },
  } = useForm();

  const submitHandler = (data) => {
    setLoading(true);
    axiosClient
      .post<Cost>("costs", { ...data, cost_category_id: data.costCategory.id })
      .then(({ data }) => {
        if (data.status) {
          reset();
          add(data.data);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Box elevation={2}>
      <Typography textAlign={"center"}>{t("add_expense")}</Typography>
      <Divider />
      <form onSubmit={handleSubmit(submitHandler)} style={{ padding: "5px" }}>
        <Stack direction={"column"} gap={2}>
          <TextField
            error={errors?.description != null}
            helperText={errors?.description && errors.description.message}
            {...register("description", {
              required: {
                value: true,
                message: t("expense_description_required"),
              },
            })}
            multiline
            label={t("expense_description")}
          />
          <MyCustomControlledAutocomplete
            key={submitCount}
            setValue={setValue}
            control={control}
            errors={errors}
            rows={costCategories}
            setRows={setCostCategories}
            submitPath={"CostCategories"}
            isRequired={true}
            title={t("add_category")}
            label={t("expense_category")}
            controllerName={"costCategory"}
          />
          <TextField
            error={errors?.amount != null}
            helperText={errors?.amount && errors.amount.message}
            {...register("amount", {
              required: {
                value: true,
                message: t("expense_amount_required"),
              },
            })}
            label={t("amount")}
          />
          <LoadingButton variant="contained" loading={loading} type="submit">
            {t("save")}
          </LoadingButton>
        </Stack>
      </form>
    </Box>
  );
}

export default AddCostForm;
