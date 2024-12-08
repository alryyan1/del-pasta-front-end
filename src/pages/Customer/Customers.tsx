import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Stack,
  Box,
} from '@mui/material';
import { FileText, Plus, Search } from 'lucide-react';
import { Customer } from '@/Types/types';
import { CustomerList } from './CustomerList';
import { CustomerForm } from './CutomerForm';
import { useCustomerStore } from './useCustomer';
import { generateCustomerReport } from './generatePdf';

function Customers() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
  const { customers, addCustomer, updateCustomer, deleteCustomer, searchQuery, setSearchQuery ,fetchData} = useCustomerStore();
  console.log(customers,'customers')
  const handleSubmit = (customer: Customer) => {
    if (selectedCustomer) {
      updateCustomer(customer);
    } else {
      addCustomer(customer);
    }
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    console.log(customer)
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setSelectedCustomer(undefined);
  };


  const filteredCustomers = customers.filter(
    (customer) =>
      customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer?.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer?.address?.toLowerCase().includes(searchQuery.toLowerCase()) 
  );
  useEffect(()=>{
    fetchData()
  },[])
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Stack spacing={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1" gutterBottom>
              Customer Management
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<Plus size={18} />}
                onClick={() => setIsFormOpen(true)}
              >
                Add Customer
              </Button>
              {/* <Button
                variant="outlined"
                startIcon={<FileText size={18} />}
                onClick={() => generateCustomerReport(customers)}
              >
                Generate Report
              </Button> */}
            </Stack>
          </Box>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search size={20} className="mr-2 text-gray-500" />,
            }}
          />

          <CustomerList
            customers={filteredCustomers}
            onEdit={handleEdit}
            onDelete={deleteCustomer}
          />
        </Stack>

        <CustomerForm key={selectedCustomer?.id}
          open={isFormOpen}
          onClose={handleClose}
          onSubmit={handleSubmit}
          initialData={selectedCustomer}
        />
      </Paper>
    </Container>
  );
}

export default Customers;