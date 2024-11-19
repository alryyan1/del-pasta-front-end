import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import { Customer } from '@/Types/types';

interface CustomerFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Customer) => void;
  initialData?: Customer;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  console.log(initialData,'initial data')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Customer>({
    defaultValues: initialData });

  const onSubmitHandler = (data: Customer) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? ' تعديل' : 'اضافه  '}
      </DialogTitle>
      <form  onSubmit={handleSubmit(onSubmitHandler)}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              
              size='small'
              {...register('name', { required: 'First name is required' })}
              label="الاسم"
              defaultValue={initialData?.name}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
            />
         
       
            <TextField
              defaultValue={initialData?.phone}

              size='small'
              {...register('phone')}
              label="الهاتف"
              fullWidth
            />
            {/* <TextField
              defaultValue={initialData?.address}

              size='small'
              {...register('address')}
              label="العنوان"
              fullWidth
              multiline
            /> */}
              <TextField
              defaultValue={initialData?.address}

              size='small'
              {...register('area')}
              label="المنطقه"
              fullWidth
              multiline
            />  <TextField
            defaultValue={initialData?.address}

            size='small'
            {...register('state')}
            label="الولايه"
            fullWidth
            multiline
          />
         
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>الغاء</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'تعديل' : 'اضافه'} الزبون
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};