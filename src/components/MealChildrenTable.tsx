import axiosClient from "@/helpers/axios-client";
import { ChildMeal } from "@/Types/types";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
  IconButton,
} from "@mui/material";
import { Edit, Trash2 } from "lucide-react";
import React from "react";
interface MealTableDataProps {
  data: ChildMeal[];
  setSelectedMeal : (d)=>void
}
function MealChildrenTable({ data ,setSelectedMeal}: MealTableDataProps) {
  const onDelete = (meal: ChildMeal) => {
    axiosClient.delete(`childMeals/${meal.id}`).then(({data})=>{
      setSelectedMeal(data.data)
    })
  };
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>اسم</TableCell>
          <TableCell>العدد</TableCell>
          <TableCell>-</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((meal, index) => {
          console.log(meal,'meal')
          return (
            <TableRow key={index}>
              <TableCell>{meal.name}</TableCell>
              <TableCell>{meal.quantity}</TableCell>
              <TableCell>
           
                    <IconButton
                      color="error"
                      onClick={() => onDelete(meal)}
                      size="small"
                    >
                      <Trash2 size={18} />
                    </IconButton>
              </TableCell>
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
