// src/components/admin/CustomersTable.tsx

import React from 'react';
import { useMediaQuery } from '@mui/material'; // A simple media query hook is fine here.
import { Customer } from '@/Types/types'; // Assuming this is your main Customer type

// Shadcn UI & Lucide Icons
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Pencil, Phone, MapPin, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// --- Mobile Card Sub-component ---
interface CustomerCardMobileProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

const CustomerCardMobile: React.FC<CustomerCardMobileProps> = ({ customer, onEdit, onDelete }) => {
  const { t } = useTranslation("customers");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-2">
        <CardTitle className="text-base font-bold">{customer.name}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(customer)}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>{t('common:edit', 'Edit')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(customer)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>{t('common:delete', 'Delete')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-3 pt-0 text-sm text-muted-foreground space-y-1">
        <div className="flex items-center">
            <Phone className="mr-2 h-3.5 w-3.5" />
            <span>{customer.phone || t('noPhone', 'No phone number')}</span>
        </div>
        <div className="flex items-center">
            <MapPin className="mr-2 h-3.5 w-3.5" />
            <span>{customer.state || t('noState', 'N/A')}, {customer.area || t('noArea', 'N/A')}</span>
        </div>
      </CardContent>
    </Card>
  );
};


// --- Main Responsive Table Component ---
interface CustomersTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export const CustomersTable: React.FC<CustomersTableProps> = ({ customers, onEdit, onDelete }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { t } = useTranslation("customers");

  // Render the mobile-friendly card list on small screens
  if (isMobile) {
    return (
      <div className="space-y-3">
        {customers.map(customer => (
          <CustomerCardMobile 
            key={customer.id} 
            customer={customer} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        ))}
      </div>
    );
  }

  // Render the full data table on larger screens
  return (
    <Card>
        <CardContent className="p-0">
            <div className="overflow-x-auto">
                <Table className="mx-auto">
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('table.name', 'Name')}</TableHead>
                            <TableHead>{t('table.phone', 'Phone')}</TableHead>
                            <TableHead>{t('table.state', 'State')}</TableHead>
                            <TableHead>{t('table.area', 'Area')}</TableHead>
                            <TableHead className="text-right">{t('table.actions', 'Actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.map((customer) => (
                            <TableRow key={customer.id}>
                                <TableCell className="font-medium">{customer.name}</TableCell>
                                <TableCell>{customer.phone}</TableCell>
                                <TableCell>{customer.state}</TableCell>
                                <TableCell>{customer.area}</TableCell>
                                <TableCell className="text-right space-x-1">
                                <Button variant="ghost" size="icon" onClick={() => onEdit(customer)} aria-label={`Edit ${customer.name}`}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => onDelete(customer)} className="text-destructive hover:text-destructive/80" aria-label={`Delete ${customer.name}`}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
    </Card>
  );
};