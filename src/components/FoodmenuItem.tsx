import React from 'react'
import { Divider, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

function FoodMenuItem({meal}) {
  return (
    <div className="details">
    <Table size="small" >
      <TableHead>
        <TableRow>
          <TableCell >الصنف</TableCell>
          {/* <TableCell >العدد</TableCell> */}
          <TableCell >السعر</TableCell>
          {/* <TableCell > الاشخاص</TableCell> */}
          {/* <TableCell >الوزن </TableCell> */}
        </TableRow>
      </TableHead>
      <TableBody>
        {meal.child_meals.map((child) => {
          return (
            <TableRow key={child.id}>
              <TableCell >{child.name}</TableCell>
              {/* <TableCell >{child.quantity}</TableCell> */}
              <TableCell >{child.price}</TableCell>
              {/* <TableCell >{child.people_count}</TableCell> */}
              {/* <TableCell >{child.weight}</TableCell> */}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
    </div>
  )
}

export default FoodMenuItem