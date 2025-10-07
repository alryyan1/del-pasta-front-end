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
} from '@mui/material';
import axiosClient from '@/helpers/axios-client';
import { Meal } from '@/Types/types';
import MealChildrenDialog from './MealChildrenDialog';
import TdCell from '@/helpers/TdCell';
import { useMealsStore } from '@/stores/MealsStore';
import { useTranslation } from 'react-i18next';
import { webUrl } from '@/helpers/constants';
import { Plus } from 'lucide-react';
import ImageGallery from '../pages/gallary';
import AddItemDialog from './AddItemDialog';
import ph from './../assets/images/ph.jpg'

type Props = { selectedCategory?: { id: number; name?: string } };

const MealTable: React.FC<Props> = ({selectedCategory}) => {
  const { t } = useTranslation('meals'); // i18n hook for translations
  const [search, setSearch] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [open, setOpen] = useState(false);
  const [openAddItemDialog, setOpenAddItemDialog] = useState(false);
  const [showGallary, setShowGallary] = useState(false);
  const { fetchMeals, meals } = useMealsStore();

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCloseItemDialog =  ()=>{
    setOpenAddItemDialog(false);
    // setSelectedMeal(null);

  }

  // Upload column removed; images updated via gallery

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals, selectedMeal]);

  const filteredMeals = meals.filter((m) => {
    return search ? m.name.toLowerCase().includes(search.toLowerCase()) : true;
  });


  return (<>
    {showGallary ? <ImageGallery fetchMeals={fetchMeals} setShowImageGallary={setShowGallary} selectedMeal={selectedMeal}/> :<TableContainer sx={{ mt: 1 }} dir="rtl">
      <TextField
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        placeholder={t('searchPlaceholder')}
      />
       <Tooltip title='Add  New'><IconButton onClick={()=>{
        setOpenAddItemDialog(true)
       }} color='primary'><Plus/></IconButton></Tooltip> 

      <Typography variant="h5" textAlign="center">
        {t('basicServices')} <span className='text-gray-500'> ({selectedCategory?.name})</span>
      </Typography>
      <Table size="small" className="text-sm border border-gray-300">
        <TableHead className="bg-gray-100">
          <TableRow>
            <TableCell>{t('image')}</TableCell>
            <TableCell>{t('name')}</TableCell>
            <TableCell>{t('price')}</TableCell>
            <TableCell>{t('category')}</TableCell>
            <TableCell>{t('subServices')}</TableCell>
            <TableCell>{t('delete')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredMeals.filter((m)=>{
            if (selectedCategory) {
              return m.category_id == selectedCategory.id
            }else{
              return true
            }
          }).map((meal: Meal) => (
            <TableRow
              key={meal.id}
              sx={{
                background: meal.id === selectedMeal?.id ? '#f1f1f1' : 'white',
              }}
              className="hover:bg-gray-50"
            >
              <TableCell>
                <IconButton onClick={() => { setSelectedMeal(meal); setShowGallary(true); }}>
                  {meal.image_url == null ? (
                    <Avatar sx={{ width: 48, height: 48 }}>{meal.name?.charAt(0) ?? '?'}</Avatar>
                  ) : (
                    <img
                      src={meal.image_url  == null ? ph: `${webUrl}/images/${meal.image_url}`}
                      alt={meal.name}
                      style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                  )}
                </IconButton>
              </TableCell>
              <TdCell table="meals" colName="name" item={meal}>
                {meal.name}
              </TdCell>
              <TdCell table="meals" colName="price" item={meal}>
                {meal.price}
              </TdCell>
              <TableCell>{meal?.category_id}</TableCell>
              <TableCell>
                <Button
                  onClick={() => {
                    handleClickOpen();
                    setSelectedMeal(meal);
                  }}
                >
                  {t('services')}
                </Button>
              </TableCell>
              <TableCell>
                <button
                  onClick={() => {
                    axiosClient.delete(`meals/${meal.id}`).then(() => {
                      fetchMeals();
                    });
                  }}
                >
                  {t('delete')}
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AddItemDialog open={openAddItemDialog}  handleClose={handleCloseItemDialog}/>
      <MealChildrenDialog
        setSelectedMeal={setSelectedMeal}
        selectedMeal={selectedMeal}
        open={open}
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
      />
    </TableContainer>}
  </>
  
  );
};

export default MealTable;
