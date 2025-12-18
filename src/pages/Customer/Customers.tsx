import React, { useEffect, useMemo, useState } from "react";
import {
  Paper,
  Typography,
  Button,
  TextField,
  Stack,
  Box,
  Divider,
  Chip,
  InputAdornment,
  alpha,
  Fade,
} from "@mui/material";
import { Plus, Search, Users } from "lucide-react";
import { Customer } from "@/Types/types";
import { CustomerList } from "./CustomerList";
import { CustomerForm } from "./CutomerForm";
import { useCustomerStore } from "./useCustomer";
import PageHeader from "@/components/PageHeader";

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
    <Fade in timeout={300}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <PageHeader
          title="Customers"
          subtitle="Manage your customer database"
          icon={<Users size={24} />}
          badge={customers.length}
          action={{
            label: "Add Customer",
            icon: <Plus size={18} />,
            onClick: () => setIsFormOpen(true),
          }}
        />

        {/* Search Bar */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search customers by name, phone, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {/* Customer List */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              p: 2.5,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                All Customers
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredCustomers.length} of {customers.length} customers
              </Typography>
            </Stack>
          </Box>

          <CustomerList
            customers={filteredCustomers}
            onEdit={handleEdit}
            onDelete={deleteCustomer}
          />
        </Paper>

        <CustomerForm
          key={selectedCustomer?.id}
          open={isFormOpen}
          onClose={handleClose}
          selectedCustomer={selectedCustomer}
          onSubmit={handleSubmit}
          initialData={selectedCustomer}
        />
      </Box>
    </Fade>
  );
}

export default Customers;
