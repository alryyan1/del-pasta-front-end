import MealTable from "@/components/MealsTable";
import MealsTableMobile from "@/components/MealsTableMobile";
import { useCategoryStore } from "@/stores/CategoryStore";
import { Category } from "@/Types/types";
import {
  Box,
  Chip,
  Paper,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  alpha,
  Fade,
} from "@mui/material";
import { Category as CategoryIcon } from "@mui/icons-material";
import React, { useEffect, useMemo, useState } from "react";

function Meals() {
  const isDesktop = useMediaQuery("(min-width:800px)");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { fetchCategories, categories, loading } = useCategoryStore((state) => state);

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
    <Fade in timeout={300}>
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>
        {/* Page Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              mb: 0.5,
            }}
          >
            Meals Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your menu items, prices, and sub-services
          </Typography>
        </Box>

        {/* Category Filter Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            transition: "box-shadow 0.2s ease",
            "&:hover": {
              boxShadow: (theme) => `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
            },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            gap={1.5}
            sx={{ mb: 2.5 }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
              }}
            >
              <CategoryIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Categories
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Select a category to filter meals
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" flexWrap="wrap" gap={1}>
            {loading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rounded"
                  width={80}
                  height={32}
                  sx={{ borderRadius: 2 }}
                />
              ))
            ) : sortedCategories.length > 0 ? (
              sortedCategories.map((category) => {
                const isSelected = category.id === selectedCategory?.id;
                return (
                  <Chip
                    key={category.id}
                    label={category.name}
                    onClick={() => setSelectedCategory(category)}
                    sx={{
                      px: 1,
                      height: 36,
                      fontSize: "0.875rem",
                      fontWeight: isSelected ? 600 : 500,
                      borderRadius: 2,
                      border: "1.5px solid",
                      borderColor: isSelected ? "primary.main" : "divider",
                      bgcolor: isSelected
                        ? (theme) => alpha(theme.palette.primary.main, 0.1)
                        : "transparent",
                      color: isSelected ? "primary.main" : "text.secondary",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: isSelected
                          ? (theme) => alpha(theme.palette.primary.main, 0.15)
                          : (theme) => alpha(theme.palette.action.hover, 0.08),
                        borderColor: isSelected ? "primary.main" : "text.secondary",
                      },
                    }}
                  />
                );
              })
            ) : (
              <Box
                sx={{
                  py: 3,
                  px: 4,
                  textAlign: "center",
                  color: "text.secondary",
                  width: "100%",
                }}
              >
                <Typography variant="body2">
                  No categories found. Create categories first.
                </Typography>
              </Box>
            )}
          </Stack>
        </Paper>

        {/* Meals Table Section */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            overflow: "hidden",
          }}
        >
          {isDesktop ? (
            <MealTable selectedCategory={selectedCategory} />
          ) : (
            <MealsTableMobile selectedCategory={selectedCategory} />
          )}
        </Paper>
      </Box>
    </Fade>
  );
}

export default Meals;
