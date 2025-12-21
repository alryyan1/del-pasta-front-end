import { Category, Mealorder, Order } from '@/Types/types';
import { useEffect, useState, useMemo, useCallback } from 'react';
import MealItem from '@/pages/MealItem';
import axiosClient from '@/helpers/axios-client';
import { useAuthContext } from '@/contexts/stateContext';
import { useTranslation } from 'react-i18next';
import RequestedServiceDialog from './RequestedServiceDialog';
import {
  Box,
  Paper,
  Typography,
  Stack,
  alpha,
  Chip,
} from '@mui/material';
import { Grid3x3, Search } from 'lucide-react';
import { TextField, InputAdornment } from '@mui/material';

interface MealCategoryPanelProps {
  setSelectedOrder: (order: Order) => void;
  selectedOrder: Order | null;
}

function MealCategoryPanel({ setSelectedOrder, selectedOrder }: MealCategoryPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation('mealCategoryPanel');
  const { data, setData } = useAuthContext();
  const [showRequestedDialog, setShowRequestedDialog] = useState(false);
  const [mealOrder, setMealOrder] = useState<Mealorder | null>(null);

  useEffect(() => {
    axiosClient.get<Category[]>(`categories`).then(({ data }) => {
      setData(data);
      if (data.length > 0 && !selectedCategory) {
        setSelectedCategory(data[0]);
      }
    });
  }, [setData, selectedCategory]);

  // Filter meals based on search query
  const filteredMeals = useMemo(() => {
    if (!selectedCategory?.meals) return [];
    if (!searchQuery.trim()) return selectedCategory.meals;
    
    const query = searchQuery.toLowerCase();
    return selectedCategory.meals.filter((meal) => {
      const nameMatch = meal.name.toLowerCase().includes(query);
      const descMatch = meal.description 
        ? String(meal.description).toLowerCase().includes(query)
        : false;
      return nameMatch || descMatch;
    });
  }, [selectedCategory, searchQuery]);

  const handleMealClick = useCallback(
    (mealOrder: Mealorder) => {
      setMealOrder(mealOrder);
      setShowRequestedDialog(true);
    },
    [setMealOrder, setShowRequestedDialog]
  );

  const categories = (data as Category[]) ?? [];

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        overflow: 'hidden',
      }}
    >
      {/* Categories Sidebar */}
      <Paper
        elevation={0}
        sx={{
          width: { xs: '100%', md: 240 },
          minWidth: { xs: 'auto', md: 240 },
          borderRight: { xs: 'none', md: '1px solid' },
          borderBottom: { xs: '1px solid', md: 'none' },
          borderColor: 'divider',
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Sidebar Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02),
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
              }}
            >
              <Grid3x3 size={18} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
              {t('category') || 'الفئات'}
            </Typography>
          </Stack>
        </Box>

        {/* Categories List */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 1.5,
            '&::-webkit-scrollbar': {
              width: 6,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.05),
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.2),
              borderRadius: 3,
              '&:hover': {
                backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.3),
              },
            },
          }}
        >
          <Stack spacing={1}>
            {categories.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {t('no_categories') || 'لا توجد فئات'}
                </Typography>
              </Box>
            ) : (
              categories.map((category: Category) => {
                const isSelected = selectedCategory?.id === category.id;
                const mealCount = category.meals?.length || 0;

                return (
                  <Box
                    key={category.id}
                    onClick={() => setSelectedCategory(category)}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      bgcolor: isSelected
                        ? (theme) => alpha(theme.palette.primary.main, 0.1)
                        : 'transparent',
                      border: '1px solid',
                      borderColor: isSelected ? 'primary.main' : 'divider',
                      '&:hover': {
                        bgcolor: isSelected
                          ? (theme) => alpha(theme.palette.primary.main, 0.15)
                          : (theme) => alpha(theme.palette.action.hover, 0.05),
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: isSelected ? 600 : 500,
                          color: isSelected ? 'primary.main' : 'text.primary',
                        }}
                      >
                        {category.name}
                      </Typography>
                      {mealCount > 0 && (
                        <Chip
                          label={mealCount}
                          size="small"
                          sx={{
                            height: 20,
                            minWidth: 20,
                            fontSize: '0.65rem',
                            bgcolor: isSelected
                              ? (theme) => alpha(theme.palette.primary.main, 0.2)
                              : (theme) => alpha(theme.palette.grey[500], 0.1),
                            color: isSelected ? 'primary.main' : 'text.secondary',
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Stack>
                  </Box>
                );
              })
            )}
          </Stack>
        </Box>
      </Paper>

      {/* Meals Display Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          bgcolor: 'background.default',
        }}
      >
        {/* Search Bar */}
        {selectedCategory && (
          <Box
            sx={{
              p: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder={t('search_meals') || 'ابحث عن وجبة...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} style={{ opacity: 0.5 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        )}

        {/* Meals Grid */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            '&::-webkit-scrollbar': {
              width: 8,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.05),
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.2),
              borderRadius: 4,
              '&:hover': {
                backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.3),
              },
            },
          }}
        >
          {selectedCategory ? (
            filteredMeals.length > 0 ? (
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: {
                    xs: 'repeat(auto-fill, minmax(160px, 1fr))',
                    sm: 'repeat(auto-fill, minmax(180px, 1fr))',
                    md: 'repeat(auto-fill, minmax(200px, 1fr))',
                  },
                }}
              >
                {filteredMeals.map((meal) => {
                  const isInOrder = selectedOrder?.meal_orders?.find(
                    (m) => m.meal.id === meal.id
                  ) !== undefined;

                  return (
                    <MealItem
                      key={meal.id}
                      setShowRequestedDialog={setShowRequestedDialog}
                      setMealOrder={handleMealClick as unknown as (meal: Mealorder) => void}
                      selected={isInOrder}
                      setSelectedOrder={setSelectedOrder}
                      selectedOrder={selectedOrder}
                      meal={meal}
                    />
                  );
                })}
              </Box>
            ) : (
              <Box
                sx={{
                  py: 8,
                  textAlign: 'center',
                  color: 'text.secondary',
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
                  {searchQuery
                    ? t('no_meals_found') || 'لم يتم العثور على وجبات'
                    : t('no_meals_in_category') || 'لا توجد وجبات في هذه الفئة'}
                </Typography>
                {searchQuery && (
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {t('try_different_search') || 'جرب البحث بكلمات مختلفة'}
                  </Typography>
                )}
              </Box>
            )
          ) : (
            <Box
              sx={{
                py: 8,
                textAlign: 'center',
                color: 'text.secondary',
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {t('select_category') || 'اختر فئة للعرض'}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Requested Service Dialog */}
      {mealOrder && (
        <RequestedServiceDialog
          setShowRequestedDialog={setShowRequestedDialog}
          setSelectedOrder={setSelectedOrder}
          mealOrder={mealOrder}
          meal={mealOrder.meal}
          open={showRequestedDialog}
          handleClose={() => {
            setShowRequestedDialog(false);
          }}
        />
      )}
    </Box>
  );
}

export default MealCategoryPanel;
