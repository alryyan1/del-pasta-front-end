import axiosClient from "@/helpers/axios-client";
import { Meal } from "@/Types/types";
import { create } from "zustand";

interface MealStoreProps {
  meals: Meal[];
  selectedMeal: Meal | null;
  addMeal: (meal: Meal) => void;
  selectMeal: (meal: Meal) => void;
  deleteMeal: (id: number) => void;
  fetchMeals: () => void; // Fetch meals from the API and update the store state
  // Add any other necessary properties here
}
export const useMealsStore = create<MealStoreProps>((set) => {
  return {
    meals: [],
    selectedMeal: null,
    addMeal: (meal) => {
      axiosClient.post("meals", meal).then(({ data }) => {
        console.log(data,'data')
        set((state) => {
          return {
            meals: [ data,...state.meals],
          };
        });
      });
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
              meals: state.meals.filter((m) => m.id!== id),
            }));
          }
        });
    },
    fetchMeals:()=>{
        axiosClient.get<Meal[]>('meals').then(({data})=>{
            set({meals:data})
        })
    }
  };
});
