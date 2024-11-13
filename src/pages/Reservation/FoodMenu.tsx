import React, { useEffect, useState } from "react";
import { Category } from "@/Types/types";
import axiosClient from "@/helpers/axios-client";
import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import FoodMenuItem from "@/components/FoodmenuItem";
import FoodMenuItemVertical from "@/components/FoodMenuItemVertical";
import logo from './../../assets/images/logo.png';
function FoodMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    axiosClient.get(`categories`).then(({ data }) => {
      setCategories(data);
    });
  }, []);
  console.log(categories, "categories");

  return (
    <div className="  p-1">
      {/* <img width={'100%'} src={logo} alt="logo" className="logo"/> */}
      {categories.map((category) => {
        return (
          <div key={category.id}>
            <Typography sx={{ m:1 }} className="meal-category " variant="h5">
              {category.name}
            </Typography>

            <div className="category-grid ">
              {category.meals.map((meal) => {
                return (
                  <Stack
                    direction={"column"}
                    gap={1}
                    sx={{ p: 2 }}
                    className="shadow-lg bg-white"
                    key={meal.id}
                  >
                    <Typography
                      variant="h5"
                      className="text-center text-gray-400"
                    >
                      {meal.name}
                    </Typography>
                    {width > 700 ? (
                      <FoodMenuItem meal={meal} />
                    ) : (
                      <FoodMenuItemVertical meal={meal} />
                    )}
                  </Stack>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FoodMenu;
