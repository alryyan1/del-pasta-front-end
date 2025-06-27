import React, { useEffect, useState } from "react";
import { Category, Meal } from "@/Types/types";
import axiosClient from "@/helpers/axios-client";
import { Divider, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

function FoodMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    axiosClient.get(`categories`).then(({ data }) => {
      setCategories(data);
    });
  }, []);
  console.log(categories, "categories");

  return (
    <div className="menu  bg-white p-1">
      {categories.map((category) => {
        return (
          <div  key={category.id}>
            <Typography sx={{mb:3}} className="meal-category " variant="h5">{category.name}</Typography>
            {category.meals.map((meal) => {
              return (
              
                <div className="mealDiv" key={meal.id}>
                  <Typography variant="h5" >{meal.name}</Typography>
                  <Table size="small" >
                    <TableHead>
                      <TableRow>
                        <TableCell >الصنف</TableCell>
                        <TableCell >العدد</TableCell>
                        <TableCell >السعر</TableCell>
                        <TableCell > الاشخاص</TableCell>
                        <TableCell >الوزن </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {meal.child_meals.map((child) => {
                        return (
                          <TableRow key={child.id}>
                            <TableCell >{child.service.name}</TableCell>
                            <TableCell >{child.quantity}</TableCell>
                            <TableCell >{child.price}</TableCell>
                            <TableCell >{child.people_count}</TableCell>
                            <TableCell >{child.weight}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default FoodMenu;