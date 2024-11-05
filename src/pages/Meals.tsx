import ProductForm from "@/components/forms/meal";
import MealTable from "@/components/MealsTable";
import { Grid } from "@mui/material";
import React from "react";

function Meals() {
  return (
    <Grid container spacing={1}>
      
      <Grid item={true} xs={9}>
        <MealTable />
      </Grid>
      <Grid  sx={{p:1}} item={true} xs={3}>
        <ProductForm />
        {/* <CreateMeal/> */}
      </Grid>
    </Grid>
  );
}

export default Meals;
