// src/components/MealsTable.tsx
import React from "react";
import { useMediaQuery } from "@mui/material";
import { Meal } from "@/Types/types";
import { webUrl } from "@/helpers/constants";
import ph from "@/assets/images/ph.jpg";

// Shadcn UI & Icons
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Settings, Trash2, Upload } from "lucide-react";

// Local Components
import { MealCardAdmin } from "./admin/MealCardAdmin";
import TdCell from "@/helpers/TdCell";

interface MealsTableProps {
  meals: Meal[];
  onEdit: (meal: Meal) => void;
  onManageSubItems: (meal: Meal) => void;
  onDelete: (meal: Meal) => void;
  onImageSelect: (meal: Meal) => void;
}

export const MealsTable: React.FC<MealsTableProps> = ({
  meals,
  onEdit,
  onManageSubItems,
  onDelete,
  onImageSelect,
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return (
      <div className="space-y-3">
        {meals.map((meal) => (
          <MealCardAdmin
            key={meal.id}
            meal={meal}
            onEdit={onEdit}
            onManageSubItems={onManageSubItems}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price (OMR)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meals.map((meal) => (
            <TableRow key={meal.id}>
              <TableCell>
                <Avatar>
                  <AvatarImage
                    src={
                      meal.image_url ? `${webUrl}/images/${meal.image_url}` : ph
                    }
                    alt={meal.name}
                  />
                  <AvatarFallback>{meal.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">
                <TdCell
                  table="meals"
                  colName="name"
                  item={meal}
                  update={null}
                >
                  {meal.name}
                </TdCell>
              </TableCell>
              <TableCell>Category {meal.category_id}</TableCell>
              <TableCell>
                <TdCell
                  isNum
                  table="meals"
                  colName="price"
                  item={meal}
                  update={null}
                >
                  {meal.price}
                </TdCell>
              </TableCell>
              <TableCell className="text-right space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onImageSelect(meal)}
                >
                  <Upload className="mr-2 h-4 w-4" /> Image
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onManageSubItems(meal)}
                >
                  <Settings className="mr-2 h-4 w-4" /> Sub-Items
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(meal)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(meal)}
                  className="text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
