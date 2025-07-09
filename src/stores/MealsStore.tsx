import axiosClient from "@/helpers/axios-client";
import { Meal } from "@/Types/types";
import { create } from "zustand";

interface MealStoreProps {
  meals: Meal[];
  selectedMeal: Meal | null;
  isLoading: boolean;
  addMeal: (meal: Partial<Meal>) => Promise<boolean>;
  updateMeal: (id: number, meal: Partial<Meal>) => Promise<boolean>;
  selectMeal: (meal: Meal | null) => void;
  deleteMeal: (id: number) => void;
  fetchMeals: () => void; // Fetch meals from the API and update the store state
  // Add any other necessary properties here
}

export const useMealsStore = create<MealStoreProps>((set, get) => {
  return {
    meals: [],
    selectedMeal: null,
    isLoading: false,
    addMeal: async (meal) => {
      set({ isLoading: true });
      try {
        const { data } = await axiosClient.post("meals", meal);
        console.log(data,'data')
        set((state) => ({
          meals: [data, ...state.meals],
          isLoading: false,
        }));
        return true;
      } catch (error) {
        console.error('Error adding meal:', error);
        set({ isLoading: false });
        return false;
      }
    },
    updateMeal: async (id, meal) => {
      set({ isLoading: true });
      try {
        const { data } = await axiosClient.put(`meals/${id}`, meal);
        set((state) => ({
          meals: state.meals.map(m => m.id === id ? data : m),
          isLoading: false,
        }));
        return true;
      } catch (error) {
        console.error('Error updating meal:', error);
        set({ isLoading: false });
        return false;
      }
    },
    selectMeal: (meal) => {
        set(() => ({
          selectedMeal: meal
        }));
    },
    deleteMeal: (id) => {
        axiosClient.delete(`meals/${id}`).then(({ data }) => {
          if (data.status) {
            set((state) => ({
              meals: state.meals.filter((m) => m.id !== id),
            }));
          }
        });
    },
    fetchMeals: () => {
        axiosClient.get<Meal[]>('meals').then(({data}) => {
            set({meals: data})
        })
    }
  };
});
