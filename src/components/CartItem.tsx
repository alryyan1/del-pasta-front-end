import { Minus, Plus } from "lucide-react";
import React from "react";
import { Meal, Mealorder } from '../Types/types';
import BasicPopover from './Mypopover';
import MealChildrenTable from "./MealChildrenTable";
interface CartItemProbs {
    item: Mealorder;
    updateQuantity: (increment: boolean, item: Mealorder) => void;
    isMultible: string;
  
}
function CartItem({isMultible,updateQuantity,item}:CartItemProbs) {
  return (
    <div
      
      className={`flex items-center justify-between px-4 py-2 bg-white rounded-xl shadow-md ${isMultible}`}
    >
      <div className="flex items-center space-x-3">
        <BasicPopover title={item.meal.name} content={<span className="text-gray-700">{<MealChildrenTable data={item.meal.child_meals}/>}</span>}/>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => updateQuantity(false, item)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Minus size={16} className="text-gray-500" />
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(true, item)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Plus size={16} className="text-gray-500" />
        </button>
        <span className="w-16 text-right">
          {(item.price * item.quantity).toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export default CartItem;
