import ProductForm from "@/components/forms/meal";
import MealTable from "@/components/MealsTable";
import { Grid } from "@mui/material";
import React from "react";

function Meals() {
  return (
    <div className="gird gap-1">
        <ProductForm />
        {/* <CreateMeal/> */}
        <MealTable />
    
    </div>
  );
}

export default Meals;
