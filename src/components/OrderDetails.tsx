import axiosClient from "@/helpers/axios-client";
import TdCell from "@/helpers/TdCell";
import { ChildMeal, Meal, Mealorder, Order } from "@/Types/types";
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
interface PopOverDataPropbs {
    order: Order;
  
  }
export function OrderDetailsPopover({ order }: PopOverDataPropbs) {
    return (
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>الخدمات</TableCell>
            <TableCell>العدد</TableCell>
            {/* <TableCell>الملاحظات</TableCell> */}
            {/* <TableCell>مكان التوصيل</TableCell> */}
            {/* <TableCell>اللون</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {order.meal_orders.map((meal, index) => {
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
               
                {/* <TableCell>
                  <ColorPicker value={meal.color}></ColorPicker>
                </TableCell> */}       
                            {/* <TableCell sx={{textWrap:'nowrap'}}>
                    {order.notes}
                </TableCell> */}
                 {/* <TableCell sx={{textWrap:'nowrap'}}>
                    {order.delivery_address}
                </TableCell>
             */}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }