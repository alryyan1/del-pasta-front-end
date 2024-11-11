import React, { useEffect, useState } from 'react';
import { Utensils, Calendar as CalendarIcon } from 'lucide-react';
import { MenuItem as MenuItemType, CartItem, Reservation } from './types';
import MenuItem from './MenuItem';
import Cart from './Cart';
import Calendar from './Calendar';
import ReservationForm from './ReservationForm';
import { Meal } from '@/Types/types';
import axiosClient from '@/helpers/axios-client';

function FoodMenu() {
  const [activeTab, setActiveTab] = useState<'order' | 'reserve'>('order');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [menuItems ,setMenuItems] = useState<Meal[]>([])

  useEffect(()=>{
    axiosClient.get<Meal>('meals').then(({data})=>{
      setMenuItems(data)
    })
  },[])

  const handleAddToCart = (item: MenuItemType) => {
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId: string, change: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedDate(slotInfo.start);
    setShowReservationForm(true);
  };

  const handleReservationSubmit = (formData: {
    customerName: string;
    customerEmail: string;
    guests: number;
    specialRequests: string;
  }) => {
    if (selectedDate) {
      const newReservation: Reservation = {
        id: Date.now().toString(),
        title: `${formData.customerName} (${formData.guests} guests)`,
        start: selectedDate,
        end: new Date(selectedDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours duration
        ...formData,
      };
      setReservations((prev) => [...prev, newReservation]);
      setShowReservationForm(false);
      setSelectedDate(null);
    }
  };

  return (
    <div className=" bg-gray-100">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Utensils className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">قائمه الطعام </h1>
            </div>
           
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'order' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <h2 className="text-2xl font-semibold mb-6">Menu</h2>
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    onAddToCart={handleAddToCart}
                  />
                ))}
          
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Restaurant Reservations</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <CalendarIcon className="h-5 w-5" />
                <span>Click on a time slot to make a reservation</span>
              </div>
            </div>
            <Calendar
              reservations={reservations}
              onSelectSlot={handleSelectSlot}
            />
          </div>
        )}
      </div>

      {showReservationForm && (
        <ReservationForm
          selectedDate={selectedDate}
          onClose={() => setShowReservationForm(false)}
          onSubmit={handleReservationSubmit}
        />
      )}
    </div>
  );
}

export default FoodMenu;