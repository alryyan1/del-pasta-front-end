// src/components/admin/MealCardAdmin.tsx
import React from 'react';
import { Meal } from '@/Types/types';
import { webUrl } from '@/helpers/constants';
import ph from '@/assets/images/ph.jpg';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Pencil, Settings, Trash2 } from 'lucide-react';

interface MealCardAdminProps {
  meal: Meal;
  onEdit: (meal: Meal) => void;
  onManageSubItems: (meal: Meal) => void;
  onDelete: (meal: Meal) => void;
}

export const MealCardAdmin: React.FC<MealCardAdminProps> = ({ meal, onEdit, onManageSubItems, onDelete }) => {
  return (
    <Card className="flex items-center p-3 gap-3">
      <div className="w-20 h-20 flex-shrink-0">
        <AspectRatio ratio={1 / 1} className="bg-muted rounded-md">
          <img
            src={meal.image_url ? `${webUrl}/images/${meal.image_url}` : ph}
            alt={meal.name}
            className="rounded-md object-cover w-full h-full"
          />
        </AspectRatio>
      </div>

      <div className="flex-grow space-y-1">
        <p className="font-semibold text-sm">{meal.name}</p>
        <p className="text-xs text-muted-foreground">{meal.category?.name || 'No Category'}</p>
        <p className="text-sm font-bold text-brand-pink-DEFAULT">{Number(meal.price).toFixed(3)} OMR</p>
      </div>
      
      <div className="flex-shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(meal)}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onManageSubItems(meal)}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Manage Sub-Items</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(meal)} className="text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};