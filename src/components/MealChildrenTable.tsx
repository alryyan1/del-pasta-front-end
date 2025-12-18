import axiosClient from "@/helpers/axios-client";
import TdCell from "@/helpers/TdCell";
import { ChildMeal, Meal } from "@/Types/types";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
  IconButton,
  Tooltip,
  Box,
  alpha,
  Typography,
  Stack,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { Trash2 } from "lucide-react";
import React from "react";

interface MealTableDataProps {
  data: ChildMeal[];
  setSelectedMeal: (d: Meal | null) => void;
  selectedMeal: Meal | null;
}

function MealChildrenTable({
  data,
  setSelectedMeal,
}: MealTableDataProps) {
  const onDelete = (meal: ChildMeal) => {
    axiosClient.delete(`childMeals/${meal.id}`).then(({ data }) => {
      setSelectedMeal(data.data);
    });
  };

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Table size="small">
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
              }}
            >
              Service Name
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                py: 1.5,
                width: 80,
                textAlign: 'center',
              }}
            >
              Qty
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                py: 1.5,
                width: 100,
                textAlign: 'center',
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
                width: 80,
                textAlign: 'center',
              }}
            >
              People
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                py: 1.5,
                width: 80,
                textAlign: 'center',
              }}
            >
              Weight
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                py: 1.5,
                width: 60,
                textAlign: 'center',
              }}
            >
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((meal) => (
            <TableRow
              key={meal.id}
              sx={{
                transition: 'background-color 0.15s ease',
                '&:hover': {
                  bgcolor: (theme) => alpha(theme.palette.action.hover, 0.04),
                },
                '&:last-child td': {
                  borderBottom: 'none',
                },
              }}
            >
            <TdCell item={meal} colName="name" table="childMeals" val={meal.service?.name || meal.name}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: 'text.primary',
                }}
              >
                {meal.service?.name || meal.name}
              </Typography>
            </TdCell>
            <TdCell item={meal} colName="quantity" table="childMeals" val={meal.quantity}>
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  color: 'text.secondary',
                }}
              >
                {meal.quantity || '-'}
              </Typography>
            </TdCell>
            <TdCell
              update={setSelectedMeal}
              show
              sx={{ 
                textAlign: 'center',
                '& input': {
                  textAlign: 'center',
                },
              }}
              item={meal}
              colName="price"
              table="childMeals"
              val={meal.price}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: 'success.main',
                  textAlign: 'center',
                }}
              >
                {meal.price || '0'}
              </Typography>
            </TdCell>
            <TdCell item={meal} colName="people_count" table="childMeals" val={meal.people_count}>
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  color: 'text.secondary',
                }}
              >
                {meal.people_count || '-'}
              </Typography>
            </TdCell>
            <TdCell item={meal} colName="weight" table="childMeals" val={meal.weight}>
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  color: 'text.secondary',
                }}
              >
                {meal.weight || '-'}
              </Typography>
            </TdCell>
              <TableCell sx={{ textAlign: 'center' }}>
                <Tooltip title="Remove service">
                  <IconButton
                    onClick={() => onDelete(meal)}
                    size="small"
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                        color: 'error.main',
                      },
                    }}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

export function MealChildrenTableMobile({
  data,
  setSelectedMeal,
}: MealTableDataProps) {
  const onDelete = (meal: ChildMeal) => {
    axiosClient.delete(`childMeals/${meal.id}`).then(({ data }) => {
      setSelectedMeal(data.data);
    });
  };

  return (
    <Stack spacing={1.5}>
      {data.map((meal) => (
        <Card
          key={meal.id}
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 1,
                  }}
                >
                  {meal.service?.name || meal.name}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5}>
                  <Chip
                    label={`Price: ${meal.price || '0'}`}
                    size="small"
                    sx={{
                      bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                      color: 'success.main',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                    }}
                  />
                  {meal.quantity && (
                    <Chip
                      label={`Qty: ${meal.quantity}`}
                      size="small"
                      sx={{
                        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.1),
                        color: 'text.secondary',
                        fontSize: '0.7rem',
                      }}
                    />
                  )}
                  {meal.people_count && (
                    <Chip
                      label={`${meal.people_count} ppl`}
                      size="small"
                      sx={{
                        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.1),
                        color: 'text.secondary',
                        fontSize: '0.7rem',
                      }}
                    />
                  )}
                  {meal.weight && (
                    <Chip
                      label={meal.weight}
                      size="small"
                      sx={{
                        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.1),
                        color: 'text.secondary',
                        fontSize: '0.7rem',
                      }}
                    />
                  )}
                </Stack>
              </Box>
              <Tooltip title="Remove">
                <IconButton
                  onClick={() => onDelete(meal)}
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                      color: 'error.main',
                    },
                  }}
                >
                  <Trash2 size={16} />
                </IconButton>
              </Tooltip>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

export default MealChildrenTable;
