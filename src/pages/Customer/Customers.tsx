import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Stack,
  Box,
  Divider,
  Chip,
  InputAdornment,
} from "@mui/material";
import { Plus, Search } from "lucide-react";
import { Customer } from "@/Types/types";
import { CustomerList } from "./CustomerList";
import { CustomerForm } from "./CutomerForm";
import { useCustomerStore } from "./useCustomer";

function Customers() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
  const {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    searchQuery,
    setSearchQuery,
    fetchData,
  } = useCustomerStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredCustomers = useMemo(
    () =>
      customers.filter(
        (customer) =>
          customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer?.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer?.address?.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [customers, searchQuery]
  );

  const handleSubmit = (customer: Customer) => {
    if (selectedCustomer) {
      updateCustomer(customer);
    } else {
      addCustomer(customer);
    }
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setSelectedCustomer(undefined);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Stack spacing={3}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Customer Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage customers, search, and edit records.
              </Typography>
            </Box>
            <Chip
              label={`Total: ${customers.length}`}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={() => setIsFormOpen(true)}
              sx={{ textTransform: "none" }}
            >
              Add Customer
            </Button>
          </Stack>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} className="text-gray-500" />
                </InputAdornment>
              ),
            }}
          />

          <Divider />

          <CustomerList customers={filteredCustomers} onEdit={handleEdit} onDelete={deleteCustomer} />
        </Stack>

        <CustomerForm
          key={selectedCustomer?.id}
          open={isFormOpen}
          onClose={handleClose}
          selectedCustomer={selectedCustomer}
          onSubmit={handleSubmit}
          initialData={selectedCustomer}
        />
      </Paper>
    </Container>
  );
}

export default Customers;