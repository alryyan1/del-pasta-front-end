import { useAuthContext } from '@/contexts/stateContext';
import axiosClient from '@/helpers/axios-client';
import { Meal, Order } from '@/Types/types';
import { Button, Card } from '@mui/material'
import 'animate.css';
import { useState } from 'react';

interface MealItemProps {
    meal: Meal;
    setOrders : (meal:Meal)=>void ;
    selectedOrder : Order|null;
    setSelectedOrder:(order)=>void;
    selected:boolean
}

function MealItem({meal,setOrder,selectedOrder,setSelectedOrder,selected}:MealItemProps) {
  const [selectEffect,setSelectEffect] = useState('')
  console.log('meal is selected',selected)
  const {add} = useAuthContext()
  
  const mealOrderHandler = ()=>{
    setSelectEffect('animate__animated animate__bounce')
      axiosClient.post('orderMeals',{
        order_id:selectedOrder?.id,
        meal_id:meal?.id,
        quantity:1,
        price:meal.price
      }).then(({data})=>{
        setSelectedOrder(data.order)
          console.log(data)
      })
   }

   const selectedColor = selected ? 'selected' : '';
    
  return (
    <div
      onClick={mealOrderHandler}
      key={meal.id}
      className={`card shadow hover:opacity-45  ${selectEffect} ${selectedColor}`}
      style={{
        cursor: 'pointer',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '16px',
        padding: '16px',
        margin: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        border: selected ? '2px solid red' : 'none'
      }}
    >
      <div className=" border">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {meal.name}
        </h3>
      </div>
    </div>
  )
}

export default MealItem