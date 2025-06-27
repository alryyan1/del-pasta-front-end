import React from "react";
import { Box, Typography, Divider, Stack } from "@mui/material";
import { Meal, ChildMeal } from "@/Types/types"; // Use specific types
import { CURRENCY } from "@/helpers/constants";

interface FoodMenuItemVerticalProps {
  meal: Meal;
}

function FoodMenuItemVertical({ meal }: FoodMenuItemVerticalProps) {
  const hasChildMeals = meal.child_meals && meal.child_meals.length > 0;
  const hasPrice = meal.price > 0;

  // Don't render anything if there's no price and no child meals (redundant check if already filtered in parent)
   if (!hasPrice && !hasChildMeals) {
    return null;
  }

  return (
    // Removed outer div
    <Stack divider={<Divider flexItem />} spacing={1.5}> {/* Use Stack with Divider */}
      {/* Main meal price */}
      {hasPrice && (
         <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body1" component="span" sx={{ fontWeight: 'medium' }}>
             {meal.name} {/* Display main meal name */}
            </Typography>
            <Typography variant="body1" component="span" sx={{ fontWeight: 'medium', color: 'error.main' }}>
             {`${meal.price} ${CURRENCY}`}
            </Typography>
         </Box>
      )}

      {/* Child meals/services */}
      {meal.child_meals?.map((child: ChildMeal) => (
        <Box key={child.id}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
            <Typography variant="body2" component="span" sx={{ color: 'text.primary' }}>
              {child.service.name}
            </Typography>
            <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
               {`${child.price} ${CURRENCY}`}
            </Typography>
          </Box>
           {/* You could add Quantity/People/Weight here if needed, similar structure */}
           {/* Example:
           <Box display="flex" justifyContent="space-between" alignItems="center">
             <Typography variant="caption" sx={{ color: 'text.secondary' }}>{LABELS.QUANTITY}</Typography>
             <Typography variant="caption" sx={{ color: 'text.secondary' }}>{child.quantity}</Typography>
           </Box>
           */}
        </Box>
      ))}
    </Stack>
  );
}

export default FoodMenuItemVertical;