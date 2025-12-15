import { Category, Mealorder, Order } from '@/Types/types';
import { useEffect, useState } from 'react'
import { Button } from './ui/button';
import MealItem from '@/pages/MealItem';
import axiosClient from '@/helpers/axios-client';
import { useAuthContext } from '@/contexts/stateContext';
import { useTranslation } from 'react-i18next';
import RequestedServiceDialog from './RequestedServiceDialog';
import { Box } from '@mui/material';

interface MealCategoryPanelProps {
    setSelectedOrder: (order: Order) => void;
    selectedOrder: Order | null;
}
function MealCategoryPanel({ setSelectedOrder, selectedOrder }: MealCategoryPanelProps) {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null
      );
    const {t} =   useTranslation('mealCategoryPanel')

      const { data, setData } = useAuthContext();

      useEffect(() => {
        axiosClient.get<Category[]>(`categories`).then(({ data }) => {
          setData(data);
          setSelectedCategory(data[0] ?? null);
        });
      }, [setData]);
      const [showRequestedDialog,setShowRequestedDialog] = useState(false)
      const [mealOrder,setMealOrder] = useState<any>(null)
  return (
    <div
    style={{ border: "1px " }}
    className="flex flex-1 overflow-hidden "
  >
    {/* Sidebar */}
    <div className="">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        {t('category')}  
      </h2>
      <ul className="space-y-4">
        {(data as Category[] ?? []).map((category: Category) => (
          <li key={category.id}>
            <Button
              onClick={() => setSelectedCategory(category)}
              variant={
                selectedCategory?.id === category.id ? "default" : "outline"
              }
              className={`w-full text-lg font-medium rounded-lg transition-all duration-300 ${
                selectedCategory?.id === category.id
                  ? "bg-[var(--primary)] text-black"
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
    <div className=" w-full meals sm:w-2/3 md:w-3/4 p-1 overflow-y-auto  md:mt-0">
   
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          p: 2,
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          textAlign: 'center',
          alignContent: 'start',
          alignItems: 'center',
          height: 'calc(100vh - 200px)',
          overflow: 'auto',
        }}
      >
        
        {selectedCategory ? (
          selectedCategory?.meals?.map((meal) => (
            <MealItem
              key={meal.id}
              setShowRequestedDialog={setShowRequestedDialog}
              setMealOrder={setMealOrder as unknown as (meal:any)=>void}
              selected={selectedOrder?.meal_orders?.find((m) => m.meal.id == meal.id) != undefined}
              setSelectedOrder={setSelectedOrder}
              selectedOrder={selectedOrder}
              meal={meal}
            />
          ))
        ) : (
          <p className="text-gray-600 text-lg text-center mt-10">
            {t('select_category')}
          </p>
        )}
      </Box>

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
       {mealOrder &&  <RequestedServiceDialog setShowRequestedDialog={setShowRequestedDialog} setSelectedOrder={setSelectedOrder} mealOrder={mealOrder} meal={mealOrder} open={showRequestedDialog} handleClose={()=>{
      setShowRequestedDialog(false)
    }}/>}
    </div>
  </div>
  )
}

export default MealCategoryPanel