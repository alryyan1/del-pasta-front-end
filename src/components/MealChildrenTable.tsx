import { ChildMeal } from "@/Types/types";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
} from "@mui/material";
import React from "react";
interface MealTableDataProps {
  data: ChildMeal[];
}
function MealChildrenTable({ data }: MealTableDataProps) {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>اسم</TableCell>
          <TableCell>العدد</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((meal, index) => {
          console.log(meal,'meal')
          return (
            <TableRow key={index}>
              <TableCell>{meal.name}</TableCell>
              <TableCell>{meal.quantity}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  );
}
export function OrderMealsTable({ data }: MealTableDataProps) {
    return (
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>اسم</TableCell>
            <TableCell>العدد</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((meal, index) => {
            console.log(meal,'meal')
            return (
              <TableRow key={index}>
                <TableCell>{meal.meal.name}</TableCell>
                <TableCell>{meal.quantity}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    );
  }



export default MealChildrenTable;
