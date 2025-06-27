import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box, // Import Box for potential wrapper styling
} from "@mui/material";
import { Meal } from "@/Types/types"; // Assuming Meal type is defined here
import { CURRENCY, LABELS } from "@/helpers/constants";

interface FoodMenuItemProps {
  meal: Meal; // Use specific type
}

function FoodMenuItem({ meal }: FoodMenuItemProps) {
  const hasChildMeals = meal.child_meals && meal.child_meals.length > 0;
  const hasPrice = meal.price > 0;

  // Don't render anything if there's no price and no child meals (redundant check if already filtered in parent)
  if (!hasPrice && !hasChildMeals) {
    return null;
  }

  return (
    // Removed outer div, Card will be the container in FoodMenu
    <Table size="small" aria-label={`${meal.name} details`}>
      {(hasPrice || hasChildMeals) && ( // Only show head if there's content
          <TableHead>
          <TableRow>
            {/* Use sx for subtle styling */}
            <TableCell sx={{ fontWeight: 'medium', color: 'text.secondary' }}>{LABELS.ITEM}</TableCell>
            <TableCell sx={{ fontWeight: 'medium', color: 'text.secondary' }} align="right">{LABELS.PRICE}</TableCell>
          </TableRow>
        </TableHead>
      )}
      <TableBody>
        {/* Main meal price row */}
        {hasPrice && (
          <TableRow hover>
            <TableCell component="th" scope="row">
              {meal.name} {/* Display main meal name here if it has a price */}
            </TableCell>
            <TableCell align="right">{`${meal.price} ${CURRENCY}`}</TableCell>
          </TableRow>
        )}
        {/* Child meals/services rows */}
        {meal.child_meals?.map((child) => (
          <TableRow key={child.id} hover>
            <TableCell component="th" scope="row">
              {/* Indent child items slightly for hierarchy? Optional */}
              <Box component="span" sx={{ pl: hasPrice ? 2 : 0 }}> {/* Indent if main meal price shown */}
                 {child.service.name}
              </Box>
            </TableCell>
            <TableCell align="right">{`${child.price} ${CURRENCY}`}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default FoodMenuItem;