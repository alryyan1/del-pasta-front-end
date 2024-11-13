import axiosClient from "@/helpers/axios-client";
import TdCell from "@/helpers/TdCell";
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
          <TableCell>سعر</TableCell>
          {/* <TableCell>الاشخاص</TableCell> */}
          {/* <TableCell>الوزن</TableCell> */}
          <TableCell>-</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((meal, index) => {
          console.log(meal,'meal')
          return (
            <TableRow key={index}>
              <TdCell item={meal} colName={'name'}  table={'childMeals'}>{meal.name}</TdCell>
              <TdCell item={meal} colName={'quantity'}  table={'childMeals'}>{meal.quantity}</TdCell>
              <TdCell item={meal} colName={'price'}  table={'childMeals'}>{meal.price}</TdCell>
              {/* <TdCell item={meal} colName={'people_count'}  table={'childMeals'}>{meal.people_count}</TdCell> */}
              {/* <TdCell item={meal} colName={'weight'}  table={'childMeals'}>{meal.weight}</TdCell> */}
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
