// src/components/admin/BuffetPackagesTable.tsx
import React from 'react';
import { BuffetPackage } from '@/Types/buffet-types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Settings, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BuffetPackagesTableProps {
  packages: BuffetPackage[];
  onEdit: (pkg: BuffetPackage) => void;
  onDelete: (pkgId: number) => void;
}

export const BuffetPackagesTable: React.FC<BuffetPackagesTableProps> = ({ packages, onEdit, onDelete }) => {
  const navigate = useNavigate();
  
  const handleManage = (packageId: number) => {
    // Navigate to a details page for managing steps and options
    // We'll create this page in the next step.
    navigate(`/config/buffet-packages/${packageId}/manage`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Arabic Name</TableHead>
          <TableHead>English Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {packages.map((pkg) => (
          <TableRow key={pkg.id}>
            <TableCell className="font-medium">{pkg.name_ar}</TableCell>
            <TableCell>{pkg.name_en}</TableCell>
            <TableCell>
              <Badge variant={pkg.is_active ? 'default' : 'outline'}>
                {pkg.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleManage(pkg.id)}>
                <Settings className="mr-2 h-4 w-4" /> Manage
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onEdit(pkg)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(pkg.id)} className="text-red-500 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};