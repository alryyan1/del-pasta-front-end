import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  TextField,
  IconButton,
  Tooltip,
  Avatar,
  Box,
  InputAdornment,
  Stack,
  Chip,
  alpha,
  Skeleton,
} from '@mui/material';
import { Meal } from '@/Types/types';
import MealChildrenDialog from './MealChildrenDialog';
import TdCell from '@/helpers/TdCell';
import { useMealsStore } from '@/stores/MealsStore';
import { useCategoryStore } from '@/stores/CategoryStore';
import { webUrl } from '@/helpers/constants';
import { Plus, Search, Image as ImageIcon, ChevronRight } from 'lucide-react';
import ImageGallery from '../pages/gallary';
import AddItemDialog from './AddItemDialog';

type Props = { selectedCategory?: { id: number; name?: string } | null };

const MealTable: React.FC<Props> = ({ selectedCategory }) => {
  const [search, setSearch] = useState<string>('');
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [open, setOpen] = useState(false);
  const [openAddItemDialog, setOpenAddItemDialog] = useState(false);
  const [showGallary, setShowGallary] = useState(false);
  const [uploadingMealId, setUploadingMealId] = useState<number | null>(null);
  const { fetchMeals, meals } = useMealsStore();
  const { fetchCategories, categories } = useCategoryStore((state) => state);
  const [loading, setLoading] = useState(true);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCloseItemDialog = () => {
    setOpenAddItemDialog(false);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchMeals(), fetchCategories()]).finally(() => {
      setLoading(false);
    });
  }, [fetchMeals, fetchCategories]);

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

  if (showGallary) {
    return (
      <ImageGallery
        fetchMeals={fetchMeals}
        setShowImageGallary={setShowGallary}
        selectedMeal={selectedMeal}
        setUploadingMealId={setUploadingMealId}
      />
    );
  }

  return (
    <Box>
      {/* Header Section */}
      <Box
        sx={{
          p: 2.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: (theme) => alpha(theme.palette.background.default, 0.5),
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          gap={2}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Menu Items
              {selectedCategory && (
                <Chip
                  label={selectedCategory.name}
                  size="small"
                  sx={{
                    ml: 1.5,
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    fontWeight: 500,
                  }}
                />
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {filteredMeals.length} items found
            </Typography>
          </Box>

          <Stack direction="row" gap={1.5} alignItems="center">
            <TextField
              size="small"
              placeholder="Search meals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                minWidth: 220,
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
            <Tooltip title="Add New Item">
              <Button
                variant="contained"
                startIcon={<Plus size={18} />}
                onClick={() => setOpenAddItemDialog(true)}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none',
                  },
                }}
              >
                Add Item
              </Button>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: (theme) => alpha(theme.palette.grey[100], 0.8),
              }}
            >
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  py: 1.5,
                  width: 80,
                }}
              >
                Image
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  py: 1.5,
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  py: 1.5,
                  width: 120,
                }}
              >
                Price
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  py: 1.5,
                }}
              >
                Category
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  py: 1.5,
                  width: 140,
                  textAlign: 'center',
                }}
              >
                Sub-Services
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="rounded" width={48} height={48} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="60%" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={60} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rounded" width={80} height={24} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rounded" width={100} height={32} />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredMeals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Box
                    sx={{
                      py: 8,
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    <ImageIcon
                      size={48}
                      strokeWidth={1.5}
                      style={{ opacity: 0.3, marginBottom: 16 }}
                    />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      No meals found
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {search
                        ? 'Try adjusting your search terms'
                        : 'Add your first meal to get started'}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              filteredMeals.map((meal: Meal) => (
                <TableRow
                  key={meal.id}
                  sx={{
                    transition: 'background-color 0.15s ease',
                    bgcolor:
                      meal.id === selectedMeal?.id
                        ? (theme) => alpha(theme.palette.primary.main, 0.04)
                        : 'transparent',
                    '&:hover': {
                      bgcolor: (theme) =>
                        alpha(theme.palette.action.hover, 0.04),
                    },
                  }}
                >
                  <TableCell sx={{ py: 1.5 }}>
                    <Tooltip title="Click to manage images">
                      <IconButton
                        onClick={() => {
                          setSelectedMeal(meal);
                          setShowGallary(true);
                        }}
                        sx={{
                          p: 0.5,
                          borderRadius: 2,
                          '&:hover': {
                            bgcolor: (theme) =>
                              alpha(theme.palette.primary.main, 0.08),
                          },
                        }}
                      >
                        {uploadingMealId === meal.id ? (
                          <Skeleton variant="rounded" width={48} height={48} />
                        ) : meal.image_url ? (
                          <Box
                            component="img"
                            src={`${webUrl}/images/${meal.image_url}`}
                            alt={meal.name}
                            sx={{
                              width: 48,
                              height: 48,
                              objectFit: 'cover',
                              borderRadius: 1.5,
                              border: '1px solid',
                              borderColor: 'divider',
                            }}
                          />
                        ) : (
                          <Avatar
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 1.5,
                              bgcolor: (theme) =>
                                alpha(theme.palette.primary.main, 0.1),
                              color: 'primary.main',
                              fontSize: '1rem',
                              fontWeight: 600,
                            }}
                          >
                            {meal.name?.charAt(0)?.toUpperCase() ?? '?'}
                          </Avatar>
                        )}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TdCell table="meals" colName="name" item={meal} val={meal.name}>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        color: 'text.primary',
                      }}
                    >
                      {meal.name}
                    </Typography>
                  </TdCell>
                  <TdCell
                    show
                    table="meals"
                    colName="price"
                    item={meal}
                    val={meal.price}
                    type="number"
                    sx={{ maxWidth: 100 }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: 'success.main',
                      }}
                    >
                      {meal.price}
                    </Typography>
                  </TdCell>
                  <TableCell>
                    <Chip
                      label={
                        categories.find((c) => c.id === meal.category_id)
                          ?.name ?? 'Uncategorized'
                      }
                      size="small"
                      sx={{
                        bgcolor: (theme) =>
                          alpha(theme.palette.grey[500], 0.1),
                        color: 'text.secondary',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      endIcon={<ChevronRight size={16} />}
                      onClick={() => {
                        handleClickOpen();
                        setSelectedMeal(meal);
                      }}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                        borderColor: 'divider',
                        color: 'text.secondary',
                        '&:hover': {
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, 0.04),
                        },
                      }}
                    >
                      Services
                      {meal.child_meals?.length > 0 && (
                        <Chip
                          label={meal.child_meals.length}
                          size="small"
                          sx={{
                            ml: 1,
                            height: 20,
                            minWidth: 20,
                            fontSize: '0.7rem',
                            bgcolor: 'primary.main',
                            color: 'white',
                          }}
                        />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AddItemDialog open={openAddItemDialog} handleClose={handleCloseItemDialog} />
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

export default MealTable;
