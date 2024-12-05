import React from "react";
import { Stack } from "@mui/system";
import { ChildMeal } from "@/Types/types";
import { Typography } from "@mui/material";

function FoodMenuItemVertical({ meal }) {
  return (
    <div className="details">
      {meal.child_meals.map((child:ChildMeal) => {
        return (
          <Stack direction={"column"} gap={1}>
            <Stack className='border-amber-600 border  shadow-md' justifyContent={'space-around'} direction={"row"} gap={1}>
              <Typography sx={{flex:1}} className="text-right " >الصنف</Typography>
              <Typography sx={{flex:1}}>{child.name}</Typography>
            </Stack>
            <Stack justifyContent={'space-around'} direction={"row"} gap={1}>
              <Typography sx={{flex:1}} className="text-right">السعر</Typography>
              <Typography sx={{flex:1}}> {child.price} ريال</Typography>
            </Stack>
            {/* <Stack justifyContent={'space-around'} direction={"row"} gap={1}>
              <Typography sx={{flex:1}}>العدد</Typography>
              <Typography sx={{flex:1}}>{child.quantity}</Typography>
            </Stack> */}
            {/* <Stack justifyContent={'space-around'} direction={"row"} gap={1}>
              <Typography sx={{flex:1}}>الاشخاص</Typography>
              <Typography sx={{flex:1}}>{child.people_count}</Typography>
            </Stack> */}
          </Stack>
        );
      })}
    </div>
  );
}

export default FoodMenuItemVertical;
