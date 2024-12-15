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
} from '@mui/material';
import axiosClient from '@/helpers/axios-client';
import { useAuthContext } from '@/contexts/stateContext';
import { Meal } from '@/Types/types';
import MealChildrenDialog from './MealChildrenDialog';
import placeHolder from './../assets/images/ph.jpg';
import TdCell from '@/helpers/TdCell';
import { useMealsStore } from '@/stores/MealsStore';
import { useTranslation } from 'react-i18next';
import { webUrl } from '@/helpers/constants';
import { Plus, Upload } from 'lucide-react';
import { Stack } from '@mui/system';
import ImageGallery from '../pages/gallary';
import AddItemDialog from './AddItemDialog';
import ph from './../assets/images/ph.jpg'

const MealTable: React.FC = () => {
  const { t } = useTranslation('meals'); // i18n hook for translations
  const [search, setSearch] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [open, setOpen] = useState(false);
  const [openAddItemDialog, setOpenAddItemDialog] = useState(false);
  const [showGallary, setShowGallary] = useState(false);
  const { addMeal, fetchMeals, deleteMeal, meals } = useMealsStore();

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCloseItemDialog =  ()=>{
    setOpenAddItemDialog(false);
    // setSelectedMeal(null);

  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, meal: Meal) => {
    if (e.target.files) {
      encodeImageFileAsURL(e.target.files[0], meal);
      const url = URL.createObjectURL(e.target.files[0]);
      setSrc(url);
      setFile(e.target.files[0]);
    }
  };

  const encodeImageFileAsURL = (file: File, meal: Meal) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      saveToDb(reader.result as string, meal);
    };
    reader.readAsDataURL(file);
  };

  const saveToDb = (data: string, meal: Meal) => {
    axiosClient.post(`saveImage/${meal.id}`, { image: data }).then(() => fetchMeals());
  };

  useEffect(() => {
    fetchMeals();
  }, [selectedMeal]);

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
        {t('basicServices')}
      </Typography>
      <Table size="small" className="text-sm border border-gray-300">
        <TableHead className="bg-gray-100">
          <TableRow>
            <TableCell>{t('code')}</TableCell>
            <TableCell>{t('name')}</TableCell>
            <TableCell>{t('category')}</TableCell>
            <TableCell>{t('image')}</TableCell>
            <TableCell>{t('uploadImage')}</TableCell>
            <TableCell>{t('subServices')}</TableCell>
            <TableCell>{t('delete')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredMeals.map((meal: Meal) => (
            <TableRow
              key={meal.id}
              sx={{
                background: meal.id === selectedMeal?.id ? '#f1f1f1' : 'white',
              }}
              className="hover:bg-gray-50"
            >
              <TableCell>{meal.id}</TableCell>
              <TdCell table="meals" colName="name" item={meal}>
                {meal.name}
              </TdCell>
              <TableCell>{meal?.category?.name}</TableCell>
              <TableCell>
                <img
                  src={meal.image_url  == null ? ph: `${webUrl}/images/${meal.image_url}`}
                  alt={meal.name}
                  style={{ width: '100px' }}
                />
              </TableCell>
              <TableCell>
                <Stack direction={'row'}>
      <input
                  type="file"
                  onChange={(e) => handleFileChange(e, meal)}
                />
                <Tooltip title='choose from gallary'><IconButton onClick={()=>{
                  setSelectedMeal(meal)
                  setShowGallary(true)
                }}><Upload/></IconButton></Tooltip>
                </Stack>
          
              </TableCell>
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
