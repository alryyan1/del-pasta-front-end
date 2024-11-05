import { Category, Order } from '@/Types/types';
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import MealItem from '@/pages/MealItem';
import axiosClient from '@/helpers/axios-client';
import { useAuthContext } from '@/contexts/stateContext';

interface MealCategoryPanelProps {
    setSelectedOrder: () => void;
    selectedOrder :Order|null;
    setOrders:(orders:Order[])=>void
}
function MealCategoryPanel({setSelectedOrder,selectedOrder,setOrders}:MealCategoryPanelProps) {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null
      );
      const { data, setData ,add,deleteItem} = useAuthContext();

      useEffect(() => {
        axiosClient.get<Category>(`categories`).then(({ data }) => {
          setData(data);
        });
      }, []);
    
  return (
    <div
    style={{ border: "1px solid" }}
    className="flex flex-1 overflow-hidden"
  >
    {/* Sidebar */}
    <div className="w-full sm:w-1/3 md:w-1/3 bg-white shadow-lg p-6 rounded-lg  z-10 md:sticky md:top-0">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        أصناف الطعام
      </h2>
      <ul className="space-y-4">
        {data.map((category: Category) => (
          <li key={category.id}>
            <Button
              onClick={() => setSelectedCategory(category)}
              variant={
                selectedCategory?.id === category.id
                  ? "primary"
                  : "outline"
              }
              className={`w-full text-lg font-medium rounded-lg transition-all duration-300 ${
                selectedCategory?.id === category.id
                  ? "bg-primary text-white"
                  : "border-gray-300 text-gray-800 hover:bg-gray-200"
              }`}
              style={{ borderRadius: "10px" }}
            >
              {category.name}
            </Button>
          </li>
        ))}
      </ul>
    </div>

    {/* Meals Display */}
    <div className=" w-full sm:w-2/3 md:w-3/4 p-1 overflow-y-auto mt-24 md:mt-0">
   
      <div className="meal-container grid grid-cols-1 gap-1">
        {selectedCategory ? (
          selectedCategory.meals.map((meal, index) => (
            <MealItem  selected={selectedOrder?.meal_orders.find((m)=>m.meal.id==meal.id)!=undefined} setSelectedOrder={setSelectedOrder} selectedOrder={selectedOrder}  meal={meal} setOrders={setOrders} />
          ))
        ) : (
          <p className="text-gray-600 text-lg text-center mt-10">
            يرجى اختيار فئة لعرض الوجبات.
          </p>
        )}
      </div>

      {/* Order Summary */}
      {/* <div className="mt-10 p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">ملخص الطلب</h3>
        {orders.length > 0 ? (
          <>
            <ul className="space-y-2">
              {orders.map((meal, index) => (
                <li key={index} className="flex justify-between">
                  <span>{meal.name}</span>
                  <span>{meal.price}$</span>
                </li>
              ))}
            </ul>
            <h4 className="mt-4 font-semibold">
              الإجمالي: {orders.totalPrice}$
            </h4>
            <Button
              onClick={confirmOrder}
              variant="primary"
              className="mt-4 w-full bg-blue-500 hover:bg-blue-600"
            >
              تأكيد الطلب
            </Button>
          </>
        ) : (
          <p className="text-gray-600">لم تقم بإضافة أي وجبات بعد.</p>
        )}
      </div> */}
    </div>
  </div>
  )
}

export default MealCategoryPanel