import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Meal } from "@/Types/types"; // Using your main Meal type
import { toast } from "sonner";

// Define the structure of an item within our cart
export interface CartItem extends Meal {
  quantity: number;
  itemNotes?: string;
}

// Define the state and actions for our store
interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (meal: Meal, quantity?: number) => void;
  removeItem: (mealId: number) => void;
  updateQuantity: (mealId: number, newQuantity: number) => void;
  updateItemNotes: (mealId: number, notes: string) => void;
  clearCart: () => void;
}

// Helper function to calculate totals, keeping logic separate
const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  return { totalItems, totalPrice };
};

// Create the store with persist middleware to save to localStorage
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial State
      items: [],
      totalItems: 0,
      totalPrice: 0,

      // --- Actions ---

      addItem: (meal, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === meal.id);

        let updatedItems;
        if (existingItem) {
          // If item exists, update its quantity
          updatedItems = currentItems.map((item) =>
            item.id === meal.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          toast.success(`"${meal.name}" quantity updated in cart.`);
        } else {
          // If item is new, add it
          updatedItems = [
            ...currentItems,
            { ...meal, quantity, itemNotes: "" },
          ];
          toast.success(`"${meal.name}" added to cart.`);
        }

        set({
          items: updatedItems,
          ...calculateTotals(updatedItems),
        });
      },

      removeItem: (mealId) => {
        const itemToRemove = get().items.find((item) => item.id === mealId);
        const updatedItems = get().items.filter((item) => item.id !== mealId);

        if (itemToRemove) {
          toast.info(`"${itemToRemove.name}" removed from cart.`);
        }

        set({
          items: updatedItems,
          ...calculateTotals(updatedItems),
        });
      },

      updateQuantity: (mealId, newQuantity) => {
        // Automatically remove the item if quantity drops to 0 or less
        if (newQuantity <= 0) {
          get().removeItem(mealId);
          return;
        }

        const updatedItems = get().items.map((item) =>
          item.id === mealId ? { ...item, quantity: newQuantity } : item
        );

        set({
          items: updatedItems,
          ...calculateTotals(updatedItems),
        });
      },

      updateItemNotes: (mealId, notes) => {
        const updatedItems = get().items.map((item) =>
          item.id === mealId ? { ...item, itemNotes: notes } : item
        );
        set({ items: updatedItems });
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0 });
        toast.info("Cart has been cleared.");
      },
    }),
    {
      name: "del-pasta-online-cart", // Unique key for localStorage
    }
  )
);
