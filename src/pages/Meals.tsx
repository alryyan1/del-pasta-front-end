import MealTable from "@/components/MealsTable";
import MealsTableMobile from "@/components/MealsTableMobile";
import { useCategoryStore } from "@/stores/CategoryStore";
import { Category } from "@/Types/types";
import {
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  Box,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";

function Meals() {
  const isDesktop = useMediaQuery("(min-width:800px)");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { fetchCategories, categories } = useCategoryStore((state) => state);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (categories.length && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.name.localeCompare(b.name)),
    [categories]
  );

  return (
    <Stack spacing={2} sx={{ p: { xs: 1, sm: 2 } }}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          flexWrap="wrap"
          gap={1}
          sx={{ mb: 1 }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Services
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select a category to filter the meals list.
          </Typography>
        </Stack>

        <Stack direction="row" flexWrap="wrap" gap={1}>
          {sortedCategories.map((category) => (
            <Chip
              key={category.id}
              label={category.name}
              color={category.id === selectedCategory?.id ? "primary" : "default"}
              variant={category.id === selectedCategory?.id ? "filled" : "outlined"}
              onClick={() => setSelectedCategory(category)}
              sx={{ fontFamily: "Tajawal", fontWeight: 600, borderRadius: 1.5 }}
            />
          ))}
          {sortedCategories.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No categories found.
            </Typography>
          )}
        </Stack>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 1,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            {isDesktop ? (
              <MealTable selectedCategory={selectedCategory} />
            ) : (
              <MealsTableMobile />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default Meals;
