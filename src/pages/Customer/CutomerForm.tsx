import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import { useTranslation } from 'react-i18next'; // Importing i18n translation hook
import { Customer } from '@/Types/types';
import { useCustomerStore } from './useCustomer';

interface CustomerFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Customer) => void;
  initialData?: Customer;
  selectedCustomer: Customer;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  open,
  onClose,
  selectedCustomer,
  initialData,
}) => {
  const { t } = useTranslation('customerForm'); // Initializing translation function
  const { customers, addCustomer, updateCustomer } = useCustomerStore();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<Customer>({
    defaultValues: initialData,
  });

  const onSubmitHandler = (data: Customer) => {
    submitHandler(data)
    reset();
    onClose();
  };
  const submitHandler = (customer: Customer) => {
    if (selectedCustomer) {
      updateCustomer(customer);
    } else {
      addCustomer(customer);
    }
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? t('customerForm.edit') : t('customerForm.add')}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              size="small"
              {...register('name', {
                required: t('customerForm.name_required') as string,
              })}
              label={t('customerForm.name')}
              defaultValue={initialData?.name}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
            />

            <TextField
              size="small"
              {...register('phone')}
              label={t('customerForm.phone')}
              defaultValue={initialData?.phone}
              fullWidth
            />

            <TextField
              size="small"
              {...register('area')}
              label={t('customerForm.area')}
              defaultValue={initialData?.area}
              fullWidth
              multiline
            />

            <TextField
              size="small"
              {...register('state')}
              label={t('customerForm.state')}
              defaultValue={initialData?.state}
              fullWidth
              
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t('customerForm.cancel')}</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? t('customerForm.update_customer') : t('customerForm.add_customer')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
