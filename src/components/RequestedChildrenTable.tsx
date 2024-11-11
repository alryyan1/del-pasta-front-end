import axiosClient from "@/helpers/axios-client";
import { ChildMeal, Mealorder } from "@/Types/types";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
} from "@mui/material";
import MyCheckbox from "./MyCheckbox";
interface RequestedChildrenTablePrps {
  mealOrder: Mealorder;
  setSelectedOrder: (order) => void;
}
function RequestedChildrenTable({ mealOrder ,setSelectedOrder}: RequestedChildrenTablePrps) {
  const addRequestedChildMealHandler = (child:ChildMeal)=>{
    axiosClient.post(`RequestedChild/${mealOrder.id}?child=${child.id}`).then(({data})=>{
        setSelectedOrder(data.order)
    })
  }
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>-</TableCell>
          <TableCell>اسم</TableCell>
          <TableCell>العدد</TableCell>
          <TableCell>سعر</TableCell>
          <TableCell>الاشخاص</TableCell>
          <TableCell>الوزن</TableCell>
          {/* <TableCell>-</TableCell> */}
        </TableRow>
      </TableHead>
      <TableBody>
        {mealOrder.meal.child_meals.map((child, index) => {
          console.log(child, "child");
          return (
            <TableRow key={index}>
              <TableCell>
              <MyCheckbox child={child} addRequestedChildMealHandler={addRequestedChildMealHandler} checked={mealOrder.requested_child_meals.find((req)=>req.child_meal_id == child.id)!=undefined}/>
              </TableCell>
              <TableCell>{child.name}</TableCell>
              <TableCell>{child.quantity}</TableCell>
              <TableCell>{child.price}</TableCell>
              <TableCell>{child.people_count}</TableCell>
              <TableCell>{child.weight}</TableCell>
              {/* <TableCell>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQuantity(child, -1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center">{child.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(child, 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Plus size={16} />
                  </button>
                
                </div>
              </TableCell> */}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default RequestedChildrenTable;
