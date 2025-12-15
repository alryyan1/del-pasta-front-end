import axiosClient from "@/helpers/axios-client";
import { Category } from "@/Types/types";
import { create } from "zustand";

export interface CategoryStoreProps {
    categories: Category[];
    selectedCategory: Category | null;
    fetchCategories: () => void;
    add: (name:string,img:string) => void;
    updateVisibility: (categoryId: number, isVisible: boolean) => void;
    updateOrder: (categoryId: number, orderId: number) => void;
    delete: () => void;
  
}
export  const useCategoryStore = create<CategoryStoreProps>((set) => {
    return {
      categories: [],
      selectedCategory: null,
      fetchCategories: async () => {
        axiosClient.get<Category[]>(`categories`).then(({ data }) => {
          set({
            categories: data,
          });
        });
      },
      add: (name,image) => {
        axiosClient
        .post("categories", {
          name: name,
          image: image,
        })
        .then(({ data }) => {
          set((state) => ({
            categories: [...state.categories, data],
          }));
        });
      },
      updateVisibility: (categoryId, isVisible) => {
        axiosClient
        .patch(`categories/${categoryId}/visibility`, {
          is_visible: isVisible,
        })
        .then(() => {
          set((state) => ({
            categories: state.categories.map(cat => 
              cat.id === categoryId ? { ...cat, is_visible: isVisible } : cat
            ),
          }));
        });
      },
      updateOrder: (categoryId, orderId) => {
        axiosClient
        .patch(`categories/${categoryId}/order`, {
          order_id: orderId,
        })
        .then(() => {
          set((state) => ({
            categories: state.categories.map(cat => 
              cat.id === categoryId ? { ...cat, order_id: orderId } : cat
            ),
          }));
        });
      },
      delete: () => {},
    };
  });


