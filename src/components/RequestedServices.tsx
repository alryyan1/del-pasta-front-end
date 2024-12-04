import { Eye, Minus, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import {  Mealorder } from "../Types/types";

import {
  Slide,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
interface RequestedServicesProbs {
 
    updateQuantity:(() => void) | null;
    item:Mealorder;
    show:boolean;
    details?:boolean
}
function RequestedServices({updateQuantity,item,show,details=true}:RequestedServicesProbs) {
  return (
    <Slide unmountOnExit  in={show} >
          <div className="border-red-100 bg-blue-300 requested-meal p-2 rounded-md shadow-sm">
          <Table>
            {/* <TableRow> */}
            {/* <TableCell>اسم الوجبه</TableCell> */}
            {/* <TableCell>الصنف</TableCell> */}
            {/* <TableCell>السعر</TableCell> */}

            {/* <TableCell>الكميه</TableCell> */}
            {/* <TableCell>العدد</TableCell> */}
            {/* <TableCell>الاجمالي</TableCell> */}
            {/* </TableRow> */}
            <TableBody>
              {item.requested_child_meals.map((requested) => (
                <TableRow key={requested.id}>
                  {/* <TableCell>{requested.order_meal.meal.name}</TableCell> */}
                  <TableCell>{requested.child_meal.name}</TableCell>
                 {details && <TableCell>{requested.child_meal.price}</TableCell>}

                  {/* <TableCell>{requested.child_meal.quantity}</TableCell> */}
                  {/* {details &&     <TableCell className="text-center"> */}
                    {/* <Stack direction={"column"} justifyContent={'center'}>
                      <button
                        onClick={() => updateQuantity(false, requested)}
                        className="p-1 text-center bg-gray-100 rounded"
                      >
                        <Minus size={16} />
                      </button>
                      <span className=" text-center p-1">
                        {requested.count}
                      </span>
                      <button
                        onClick={() => updateQuantity(true, requested)}
                        className="p-1 text-center bg-gray-100 rounded"
                      >
                        <Plus size={16} />
                      </button>
                    </Stack> */}
                  {/* </TableCell>} */}
                  {/* {details &&     <TableCell>
                    {(requested.child_meal.price * requested.count).toFixed(3)}   
                  </TableCell>} */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        </Slide>
  )
}

export default RequestedServices