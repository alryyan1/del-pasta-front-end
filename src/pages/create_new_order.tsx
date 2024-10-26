"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // Assuming you have a button component
import { Card } from "@/components/ui/card"; // Assuming you have a card component
import { FiPlusCircle } from "react-icons/fi"; // For icons
import Header from "@/components/header";
import axiosClient from "@/helpers/axios-client";
import { useAuthContext } from "@/contexts/stateContext";

interface Category {
  id: number;
  name: string;
  imgage:string;
}
const CreateNewOrder = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const {data,setData} = useAuthContext()
  const [order, setOrder] = useState<{ meals: any[]; totalPrice: number }>({
    meals: [],
    totalPrice: 0,
  });
  useEffect(()=>{
    axiosClient.get<Category>(`categories`).then(({data})=>{
      setData(data)
    })
  },[])
  
  const categories = ["مقبلات", "الطبق الرئيسي", "الحلويات", "المشروبات"];
  const meals = {
    مقبلات: [
      { name: "سلطة خضراء", price: 5, image: "/images/Egyptian-food-4.jpg" },
      { name: "شوربة", price: 8, image: "/images/sop.jpg" },
    ],
    "الطبق الرئيسي": [
      { name: "دجاج مشوي", price: 12, image: "/images/chicken.jpg" },
      { name: "ستيك", price: 18, image: "/images/steak.jpg" },
    ],
    الحلويات: [
      { name: "تشيز كيك", price: 6, image: "/images/cheesecake.jpg" },
      { name: "براوني", price: 4, image: "/images/brownie.jpg" },
    ],
    المشروبات: [
      { name: "صودا", price: 2, image: "/images/soda.png" },
      { name: "قهوة", price: 3, image: "/images/coffee.jpg" },
    ],
  };

  const addMealToOrder = (meal: { name: string; price: number }) => {
    setOrder((prevOrder) => ({
      meals: [...prevOrder.meals, meal],
      totalPrice: prevOrder.totalPrice + meal.price,
    }));
  };

  const confirmOrder = () => {
    console.log("Order confirmed:", order);
  };

  return (
    <>
      <div className="flex flex-col h-screen bg-gray-100" dir="rtl">
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-full sm:w-1/3 md:w-1/4 bg-white shadow-lg p-6 rounded-lg md:relative z-10 md:sticky md:top-0">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              أصناف الطعام
            </h2>
            <ul className="space-y-4">
              {data.map((category) => (
                <li key={category}>
                  <Button
                    onClick={() => setSelectedCategory(category)}
                    variant={
                      selectedCategory === category ? "primary" : "outline"
                    }
                    className={`w-full text-lg font-medium rounded-lg transition-all duration-300 ${
                      selectedCategory === category
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
          <div className="w-full sm:w-2/3 md:w-3/4 p-6 overflow-y-auto mt-24 md:mt-0">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">الوجبات</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedCategory ? (
                meals[selectedCategory].map((meal, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden border rounded-lg shadow-lg transition-transform transform hover:-translate-y-1"
                  >
                    <img
                      src={meal.image}
                      alt={meal.name}
                      className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="p-4 bg-white">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {meal.name}
                      </h3>
                      <p className="text-gray-600 mb-4">{meal.price}$</p>
                      <Button
                        onClick={() => addMealToOrder(meal)}
                        className="flex items-center justify-center w-full bg-green-500 text-white hover:bg-green-600 transition duration-300"
                      >
                        <FiPlusCircle className="mr-2" /> أضف إلى الطلب
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-gray-600 text-lg text-center mt-10">
                  يرجى اختيار فئة لعرض الوجبات.
                </p>
              )}
            </div>

            {/* Order Summary */}
            <div className="mt-10 p-4 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">ملخص الطلب</h3>
              {order.meals.length > 0 ? (
                <>
                  <ul className="space-y-2">
                    {order.meals.map((meal, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{meal.name}</span>
                        <span>{meal.price}$</span>
                      </li>
                    ))}
                  </ul>
                  <h4 className="mt-4 font-semibold">
                    الإجمالي: {order.totalPrice}$
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateNewOrder;
