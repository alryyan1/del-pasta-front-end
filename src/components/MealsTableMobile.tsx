import React, { useEffect, useState } from 'react';
import {
  Typography,
  TextField,
  Box,
  InputAdornment,
  Stack,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Chip,
  alpha,
  Skeleton,
  Button,
  Tooltip,
} from '@mui/material';
import { Meal } from '@/Types/types';
import MealChildrenDialog from './MealChildrenDialog';
import TdCell from '@/helpers/TdCell';
import { useMealsStore } from '@/stores/MealsStore';
import { useCategoryStore } from '@/stores/CategoryStore';
import { webUrl } from '@/helpers/constants';
import { Search, ChevronRight, Plus } from 'lucide-react';
import AddItemDialog from './AddItemDialog';

type Props = { selectedCategory?: { id: number; name?: string } | null };

const MealsTableMobile: React.FC<Props> = ({ selectedCategory }) => {
  const [search, setSearch] = useState<string>('');
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [open, setOpen] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { fetchMeals, meals } = useMealsStore();
  const { categories } = useCategoryStore((state) => state);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    setLoading(true);
    fetchMeals().finally(() => setLoading(false));
  }, [fetchMeals]);

  useEffect(() => {
    if (selectedMeal) {
      fetchMeals();
    }
  }, [selectedMeal, fetchMeals]);

  const filteredMeals = meals.filter((m) => {
    const matchesSearch = search
      ? m.name.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesCategory = selectedCategory
      ? m.category_id === selectedCategory.id
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box>
      {/* Header Section */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: (theme) => alpha(theme.palette.background.default, 0.5),
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Menu Items
              {selectedCategory && (
                <Chip
                  label={selectedCategory.name}
                  size="small"
                  sx={{
                    ml: 1,
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    fontWeight: 500,
                  }}
                />
              )}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {filteredMeals.length} items
            </Typography>
          </Box>
          <Tooltip title="Add New">
            <IconButton
              color="primary"
              onClick={() => setOpenAddDialog(true)}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              <Plus size={20} />
            </IconButton>
          </Tooltip>
        </Stack>

        <TextField
          fullWidth
          size="small"
          placeholder="Search meals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: 'background.paper',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} color="#9CA3AF" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Meals List */}
      <Box sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <Card
                key={index}
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Skeleton variant="rounded" width={56} height={56} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="70%" height={24} />
                      <Skeleton variant="text" width="40%" height={20} />
                    </Box>
                    <Skeleton variant="rounded" width={80} height={32} />
                  </Stack>
                </CardContent>
              </Card>
            ))
          ) : filteredMeals.length === 0 ? (
            <Box
              sx={{
                py: 8,
                textAlign: 'center',
                color: 'text.secondary',
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                No meals found
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {search ? 'Try adjusting your search' : 'Add meals to get started'}
              </Typography>
            </Box>
          ) : (
            filteredMeals.map((meal: Meal) => (
              <Card
                key={meal.id}
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor:
                    meal.id === selectedMeal?.id ? 'primary.main' : 'divider',
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  bgcolor:
                    meal.id === selectedMeal?.id
                      ? (theme) => alpha(theme.palette.primary.main, 0.02)
                      : 'background.paper',
                  '&:hover': {
                    borderColor: 'primary.light',
                  },
                }}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    {/* Image */}
                    {meal.image_url ? (
                      <Box
                        component="img"
                        src={`${webUrl}/images/${meal.image_url}`}
                        alt={meal.name}
                        sx={{
                          width: 56,
                          height: 56,
                          objectFit: 'cover',
                          borderRadius: 1.5,
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 1.5,
                          bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                          fontSize: '1.25rem',
                          fontWeight: 600,
                        }}
                      >
                        {meal.name?.charAt(0)?.toUpperCase() ?? '?'}
                      </Avatar>
                    )}

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: 'text.primary',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {meal.name}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mt: 0.5 }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: 'success.main',
                          }}
                        >
                          {meal.price} KWD
                        </Typography>
                        <Chip
                          label={
                            categories.find((c) => c.id === meal.category_id)
                              ?.name ?? 'N/A'
                          }
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            bgcolor: (theme) =>
                              alpha(theme.palette.grey[500], 0.1),
                            color: 'text.secondary',
                          }}
                        />
                      </Stack>
                    </Box>

                    {/* Action */}
                    <Button
                      variant="outlined"
                      size="small"
                      endIcon={<ChevronRight size={14} />}
                      onClick={() => {
                        handleClickOpen();
                        setSelectedMeal(meal);
                      }}
                      sx={{
                        borderRadius: 1.5,
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        minWidth: 'auto',
                        px: 1.5,
                        borderColor: 'divider',
                        color: 'text.secondary',
                        '&:hover': {
                          borderColor: 'primary.main',
                          color: 'primary.main',
                        },
                      }}
                    >
                      Services
                      {meal.child_meals?.length > 0 && (
                        <Box
                          component="span"
                          sx={{
                            ml: 0.5,
                            bgcolor: 'primary.main',
                            color: 'white',
                            borderRadius: '50%',
                            width: 18,
                            height: 18,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.65rem',
                          }}
                        >
                          {meal.child_meals.length}
                        </Box>
                      )}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      </Box>

      <AddItemDialog open={openAddDialog} handleClose={() => setOpenAddDialog(false)} />
      <MealChildrenDialog
        setSelectedMeal={setSelectedMeal}
        selectedMeal={selectedMeal}
        open={open}
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
      />
    </Box>
  );
};

export default MealsTableMobile;
