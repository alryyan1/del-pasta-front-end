import { create } from "zustand";
import { Meal } from "@/Types/types";

export interface CartItem {
  meal: Meal;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (meal: Meal) => void;
  removeItem: (mealId: number) => void;
  updateQuantity: (mealId: number, quantity: number) => void;
  clear: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (meal) => {
    set((state) => {
      const existing = state.items.find((it) => it.meal.id === meal.id);
      if (existing) {
        return {
          items: state.items.map((it) =>
            it.meal.id === meal.id ? { ...it, quantity: it.quantity + 1 } : it
          ),
        };
      }
      return { items: [...state.items, { meal, quantity: 1 }] };
    });
  },
  removeItem: (mealId) =>
    set((state) => ({ items: state.items.filter((it) => it.meal.id !== mealId) })),
  updateQuantity: (mealId, quantity) =>
    set((state) => ({
      items: state.items
        .map((it) => (it.meal.id === mealId ? { ...it, quantity } : it))
        .filter((it) => it.quantity > 0),
    })),
  clear: () => set({ items: [] }),
  totalItems: () => get().items.reduce((sum, it) => sum + it.quantity, 0),
  totalPrice: () => get().items.reduce((sum, it) => sum + it.quantity * (it.meal.price ?? 0), 0),
}));


