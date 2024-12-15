import axiosClient from '@/helpers/axios-client';
import { Meal, Mealorder, Order } from '@/Types/types';
import 'animate.css';
import { useState } from 'react';
import ph from './../assets/images/ph.jpg'
import { webUrl } from '@/helpers/constants';
import RequestedServiceDialog from '@/components/RequestedServiceDialog';
interface MealItemProps {
    meal: Meal;
    setOrders : (meal:Meal)=>void ;
    selectedOrder : Order|null;
    setSelectedOrder:(order:Order)=>void;
    selected:boolean;
    setMealOrder:(meal:Meal)=>void;
    setShowRequestedDialog:(isOpen:boolean)=>void;
}

function MealItem({meal,selectedOrder,setSelectedOrder,selected,setMealOrder,setShowRequestedDialog}:MealItemProps) {
  const [selectEffect,setSelectEffect] = useState('')
  // const [showRequestedDialog,setShowRequestedDialog] = useState(false)
  // const [mealOrder,setMealOrder] = useState<Mealorder|null>(null)
  console.log('meal is selected',selected)
  
  const mealOrderHandler = ()=>{
    setShowRequestedDialog(true)
    setSelectEffect('')
      axiosClient.post('orderMeals',{
        order_id:selectedOrder?.id,
        meal_id:meal?.id,
        quantity:1,
        price:meal.price
      }).then(({data})=>{
        setSelectedOrder(data.order)
        setMealOrder(data.mealOrder)
          console.log(data)
      })
   }

   const selectedColor = selected ? 'selected' : '';
    
  return (
 <>
    <div
      onClick={mealOrderHandler}
      key={meal.id}
      className={`card shadow hover:opacity-45  ${selectEffect} ${selectedColor}`}
      style={{
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        gap:'5px' ,
        padding:'5px',
        alignItems: 'center',
        // display: 'grid',
        // gridTemplateColumns: '1fr',
        flexDirection: 'column',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        border: selected ? '2px dashed #cf060559' : 'none'
      }}
    >
      {/* <div className=" "> */}
            <img src={`${webUrl}/images/${meal?.image_url}`} alt={meal.name} className="w-20 h-20 object-cover" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {meal.name}
        </h3>
      {/* </div> */}
    </div>
 
 </>
  )
}

export default MealItem