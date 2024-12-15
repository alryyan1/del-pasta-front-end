import ProductForm from "@/components/forms/meal";
import MealTable from "@/components/MealsTable";
import MealsTableMobile from "@/components/MealsTableMobile";
import { useCategoryStore } from "@/stores/CategoryStore";
import { Category } from "@/Types/types";
import { Chip, Grid, IconButton } from "@mui/material";
import { Stack } from "@mui/system";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

function Meals() {
  const [width, setWidth] = useState(window.innerWidth);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const { fetchCategories, categories, add } = useCategoryStore((state) => state);
  
    // Fetch categories on component mount
    useEffect(() => {
      fetchCategories();
    }, []);
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
      <Stack direction={'row'} gap={1}>
         {categories.map((s) => (
      <Chip
        sx={{fontFamily:'cairo'}}
        color={s.id === selectedCategory?.id ? "primary" : "default"}
        variant={s.id === selectedCategory?.id ? "filled" : "outlined"}
        key={s.id}
        onClick={() => setSelectedCategory(s)}
        label={s.name} // Translate statuses
      />
    ))}
      </Stack>
       
        {/* <ProductForm /> */}
        {/* <CreateMeal/> */}
      {width > 800  ?  <MealTable selectedCategory={selectedCategory} /> : <MealsTableMobile/>}
    
    </div>
  );
}

export default Meals;
