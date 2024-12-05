import axiosClient from "@/helpers/axios-client";
import TdCell from "@/helpers/TdCell";
import { ChildMeal, Meal, Mealorder } from "@/Types/types";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Download, Edit, Trash2 } from "lucide-react";
import { ColorPicker } from "primereact/colorpicker";
import React from "react";
import BasicPopover from "./Mypopover";
import RequestedChildrenTable from "./RequestedChildrenTable";
import RequestedServices from "./RequestedServices";
interface MealTableDataProps {
  data: ChildMeal[];
  setSelectedMeal: (d) => void;
  selectedMeal: Meal;
}
interface PopOverDataPropbs {
  data: Mealorder[];
  setSelectedMeal: (d) => void;
  selectedMeal: Meal;
}
function MealChildrenTable({
  data,
  setSelectedMeal,
  selectedMeal,
}: MealTableDataProps) {
  const onDelete = (meal: ChildMeal) => {
    axiosClient.delete(`childMeals/${meal.id}`).then(({ data }) => {
      setSelectedMeal(data.data);
    });
  };

  return (
    <>
      <Tooltip title="اضافه الخدمات">
        <IconButton
          onClick={() => {
            axiosClient
              .post(`defineServices/${selectedMeal.id}`)
              .then(({ data }) => {
                console.log(data.data, "data");
                setSelectedMeal(data.data);
                
              });
          }}
        >
          <Download />
        </IconButton>
      </Tooltip>

      <Table style={{direction:'ltr'}} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            {/* <TableCell>العدد</TableCell> */}
            <TableCell>Price</TableCell>
            {/* <TableCell>الاشخاص</TableCell> */}
            {/* <TableCell>الوزن</TableCell> */}
            <TableCell>-</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((meal, index) => {
            console.log(meal, "meal");
            return (
              <TableRow key={meal.id}>
                <TdCell item={meal} colName={"name"} table={"childMeals"}>
                  {meal.name}
                </TdCell>
                {/* <TdCell item={meal} colName={"quantity"} table={"childMeals"}>
                  {meal.quantity}
                </TdCell> */}
                <TdCell
                 update={setSelectedMeal}
                  show
                  sx={{ width: "60px", textAlign: "center" }}
                  item={meal}
                  colName={"price"}
                  table={"childMeals"}
                >
                  {meal.price}
                </TdCell>
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
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
export function MealChildrenTableMobile({
  data,
  setSelectedMeal,
  selectedMeal,
}: MealTableDataProps) {
  const onDelete = (meal: ChildMeal) => {
    axiosClient.delete(`childMeals/${meal.id}`).then(({ data }) => {
      setSelectedMeal(data.data);
    });
  };

  return (
    <>
      <Tooltip title="اضافه الخدمات">
        <IconButton
          onClick={() => {
            axiosClient
              .post(`defineServices/${selectedMeal.id}`)
              .then(({ data }) => {
                console.log(data.data, "data");
                setSelectedMeal(data.data);
                
              });
          }}
        >
          <Download />
        </IconButton>
      </Tooltip>

      <Table style={{direction:'ltr'}} size="small">
        <TableHead>
          <TableRow>
            <TableCell>اسم</TableCell>
            <TableCell>سعر</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((meal, index) => {
            console.log(meal, "meal");
            return (
              <TableRow key={meal.id}>
                <TdCell item={meal} colName={"name"} table={"childMeals"}>
                  {meal.name}
                </TdCell>
          
                <TdCell
                  show
                  sx={{ width: "60px", textAlign: "center" }}
                  item={meal}
                  colName={"price"}
                  table={"childMeals"}
                >
                  {meal.price}
                </TdCell>
               
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
export function OrderMealsTable({ data }: PopOverDataPropbs) {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>الخدمات</TableCell>
          <TableCell>العدد</TableCell>
          <TableCell>اللون</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((meal, index) => {
          console.log(meal, "meal");
          return (
            <TableRow key={index}>
               <TableCell>
                <BasicPopover
                  title={meal.meal.name}
                  content={
                    <span className="text-gray-700">
                      {
                        <RequestedServices
                        details={false}
                          item={meal}
                          show={true}
                          updateQuantity={() => {}}
                        />
                      }
                    </span>
                  }
                />
              </TableCell>
              <TableCell>{meal.quantity}</TableCell>
             
              <TableCell>
                <ColorPicker value={meal.color}></ColorPicker>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default MealChildrenTable;
