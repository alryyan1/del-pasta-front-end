// src/components/CustomerSearch.tsx
import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { Customer } from '@/Types/types';

interface CustomerSearchProps {
  customers: Customer[];
  selectedCustomer: Customer | null;
  onCustomerSelect: (customer: Customer | null) => void;
  disabled?: boolean;
}

export const CustomerSearch: React.FC<CustomerSearchProps> = ({ customers, selectedCustomer, onCustomerSelect, disabled }) => {
  return (
    <Autocomplete
      value={selectedCustomer}
      options={customers}
      disabled={disabled}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      getOptionLabel={(option) => `${option.name} - ${option.phone}`}
      filterOptions={(options, state) =>
        options.filter(c =>
          c.name.toLowerCase().includes(state.inputValue.toLowerCase()) ||
          c.phone.includes(state.inputValue)
        )
      }
      onChange={(_, newValue) => onCustomerSelect(newValue)}
      renderInput={(params) => (
        <TextField {...params} label="Search Customer" variant="standard" size="small" />
      )}
      sx={{ minWidth: { xs: '180px', md: '250px' } }}
    />
  );
};