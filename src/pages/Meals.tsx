import ProductForm from "@/components/forms/meal";
import MealTable from "@/components/MealsTable";
import MealsTableMobile from "@/components/MealsTableMobile";
import { Grid, IconButton } from "@mui/material";
import { Stack } from "@mui/system";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

function Meals() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);

      if (window.innerWidth < 700) {
        // alert('width lest than 700 and width is '+window.innerWidth);

      } else {
        // alert('width more than 700 and width is '+window.innerWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="">
        {/* <ProductForm /> */}
        {/* <CreateMeal/> */}
      {width > 800  ?  <MealTable /> : <MealsTableMobile/>}
    
    </div>
  );
}

export default Meals;
