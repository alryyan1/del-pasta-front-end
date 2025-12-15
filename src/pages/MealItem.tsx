import axiosClient from '@/helpers/axios-client';
import { Meal, Mealorder, Order } from '@/Types/types';
import { useState } from 'react';
import ph from './../assets/images/ph.jpg'
import { webUrl } from '@/helpers/constants';
import { Box, Typography, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface MealItemProps {
    meal: Meal;
    selectedOrder: Order | null;
    setSelectedOrder: (order: Order) => void;
    selected: boolean;
    setMealOrder: (mealOrder: Mealorder) => void;
    setShowRequestedDialog: (isOpen: boolean) => void;
}

function MealItem({ meal, selectedOrder, setSelectedOrder, selected, setMealOrder, setShowRequestedDialog }: MealItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const mealOrderHandler = () => {
    if (!selectedOrder || isLoading) return;
    
    setIsLoading(true);
    setShowRequestedDialog(true);
    
    axiosClient.post('orderMeals', {
      order_id: selectedOrder?.id,
      meal_id: meal?.id,
      quantity: 1,
      price: meal.price
    }).then(({ data }) => {
      setSelectedOrder(data.order);
      setMealOrder(data.mealOrder);
    }).catch((error) => {
      console.error('Error adding meal to order:', error);
    }).finally(() => {
      setIsLoading(false);
    });
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <Box
      onClick={mealOrderHandler}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        cursor: isLoading ? 'wait' : 'pointer',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '220px',
        minHeight: '280px',
        backgroundColor: 'background.paper',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: selected 
          ? '0 8px 24px rgba(156, 39, 176, 0.25)' 
          : isHovered 
            ? '0 12px 28px rgba(0, 0, 0, 0.15)' 
            : '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: selected 
          ? '2px solid #9c27b0' 
          : '1px solid rgba(0, 0, 0, 0.08)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        opacity: isLoading ? 0.7 : 1,
        '&:active': {
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Selected Indicator */}
      {selected && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            backgroundColor: '#9c27b0',
            borderRadius: '50%',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(156, 39, 176, 0.4)',
          }}
        >
          <CheckCircleIcon 
            sx={{ 
              color: 'white', 
              fontSize: 20 
            }} 
          />
        </Box>
      )}

      {/* Image Container */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '160px',
          overflow: 'hidden',
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        }}
      >
        <Box
          component="img"
          src={meal?.image_url === null ? ph : `${webUrl}/images/${meal?.image_url}`}
          alt={meal.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
        {/* Overlay on hover */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: selected 
              ? 'rgba(156, 39, 176, 0.1)' 
              : isHovered 
                ? 'rgba(0, 0, 0, 0.05)' 
                : 'transparent',
            transition: 'background-color 0.3s ease',
          }}
        />
      </Box>

      {/* Content Container */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: 2,
          gap: 1,
        }}
      >
        {/* Meal Name */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: '1rem',
            color: 'text.primary',
            lineHeight: 1.4,
            marginBottom: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '2.8em',
          }}
        >
          {meal.name}
        </Typography>

        {/* Price and Availability */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'auto',
            gap: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '1.1rem',
              color: 'primary.main',
            }}
          >
            ${formatPrice(meal.price)}
          </Typography>
          
          {meal.available !== undefined && (
            <Chip
              label={meal.available > 0 ? `${meal.available} available` : 'Out of stock'}
              size="small"
              sx={{
                fontSize: '0.7rem',
                height: '24px',
                backgroundColor: meal.available > 0 
                  ? 'rgba(76, 175, 80, 0.1)' 
                  : 'rgba(244, 67, 54, 0.1)',
                color: meal.available > 0 
                  ? 'rgb(76, 175, 80)' 
                  : 'rgb(244, 67, 54)',
                fontWeight: 500,
              }}
            />
          )}
        </Box>

        {/* People Count (if available) */}
        {meal.people_count && (
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: '0.75rem',
              marginTop: -0.5,
            }}
          >
            Serves {meal.people_count}
          </Typography>
        )}
      </Box>

      {/* Loading Overlay */}
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3,
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              border: '3px solid rgba(156, 39, 176, 0.2)',
              borderTopColor: '#9c27b0',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}

export default MealItem;