// src/components/admin/BuffetPackagesTable.tsx
import React from 'react';
import { BuffetPackage } from '@/Types/buffet-types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Settings, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface BuffetPackagesTableProps {
  packages: BuffetPackage[];
  onEdit: (pkg: BuffetPackage) => void;
  onDelete: (pkgId: number) => void;
}

export const BuffetPackagesTable: React.FC<BuffetPackagesTableProps> = ({ packages, onEdit, onDelete }) => {
  const { t } = useTranslation('buffet');
  const navigate = useNavigate();
  
  const handleManage = (packageId: number) => {
    // Navigate to a details page for managing steps and options
    // We'll create this page in the next step.
    navigate(`/config/buffet-packages/${packageId}/manage`);
  };

  return (
    <Table className="mx-auto">
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">{t('packagesManagement.table.arabicName')}</TableHead>
          <TableHead className="text-center">{t('packagesManagement.table.englishName')}</TableHead>
          <TableHead className="text-center">{t('packagesManagement.table.status')}</TableHead>
          <TableHead className="text-center">{t('packagesManagement.table.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {packages.map((pkg) => (
          <TableRow key={pkg.id}>
            <TableCell className="font-medium text-center">{pkg.name_ar}</TableCell>
            <TableCell className="text-center">{pkg.name_en}</TableCell>
            <TableCell className="text-center">
              <Badge variant={pkg.is_active ? 'default' : 'outline'}>
                {pkg.is_active ? t('packagesManagement.table.active') : t('packagesManagement.table.inactive')}
              </Badge>
            </TableCell>
            <TableCell className="text-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleManage(pkg.id)}>
                <Settings className="mr-2 h-4 w-4" /> {t('packagesManagement.table.manage')}
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