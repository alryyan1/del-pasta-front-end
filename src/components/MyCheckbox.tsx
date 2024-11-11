import { ChildMeal, Mealorder } from "@/Types/types";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import React, { useState } from "react";

interface MyCheckboxProps {
  addRequestedChildMealHandler: (child: ChildMeal) => void;
  child: ChildMeal;
  checked : boolean;
}
function MyCheckbox({
  
  addRequestedChildMealHandler,
  child,
  checked

}: MyCheckboxProps) {
    const [selected,setSelected]= useState(checked)
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Checkbox
           
            checked={
                selected     
            }
            onChange={() => {
              addRequestedChildMealHandler(child);
              setSelected(!selected)
            }}
          />
        }
        label=""
      />
    </FormGroup>
  );
}

export default MyCheckbox;
