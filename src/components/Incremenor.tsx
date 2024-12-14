import { Mealorder, Requestedchildmeal } from '@/Types/types';
import { Stack } from '@mui/system'
import { Minus, Plus } from 'lucide-react'
import React from 'react'
interface IncremenorProbs {
    updateQuantity: (increment: boolean, request: Mealorder) => void;
    requested: Mealorder;
  
}
function Incremenor({updateQuantity,requested}:IncremenorProbs) {
  return (
    <Stack direction={"row"} justifyContent={'center'}>
     <button
      onClick={() => updateQuantity(true, requested)}
      className="p-1 text-center bg-gray-100 rounded"
    >
      <Plus size={16} />
    </button>
    <span className=" text-center p-1">
      {requested.quantity}
    </span>
   <button
      onClick={() => updateQuantity(false, requested)}
      className="p-1 text-center bg-gray-100 rounded"
    >
      <Minus size={16} />
    </button>
  </Stack>
  )
}

export default Incremenor