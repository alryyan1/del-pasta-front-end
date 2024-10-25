import ProductForm from "@/components/forms/meal";
import MealTable from "@/components/MealsTable";
import { Grid } from "@mui/material";
import React from "react";

function Customers() {
  return (
    <Grid container spacing={1}>
      
      <Grid item xs="9">
        <MealTable />
      </Grid>
      <Grid item xs="3">
        <ProductForm />
      </Grid>
    </Grid>
  );
}

export default Meals;
