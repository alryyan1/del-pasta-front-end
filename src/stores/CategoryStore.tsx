import axiosClient from "@/helpers/axios-client";
import { Category } from "@/Types/types";
import { create } from "zustand";

export interface CategoryStoreProps {
    categories: Category[];
    selectedCategory: Category | null;
    fetchCategories: () => void;
    add: (name: string, file?: File) => Promise<void>;
    delete: () => void;
}

export const useCategoryStore = create<CategoryStoreProps>((set, get) => {
    return {
      categories: [],
      selectedCategory: null,
      
      fetchCategories: async () => {
        try {
          const { data } = await axiosClient.get<Category[]>(`categories`);
          set({ categories: data });
        } catch (error) {
          console.error('Failed to fetch categories:', error);
        }
      },
      
      add: async (name: string, file?: File) => {
        try {
          // Create FormData for file upload
          const formData = new FormData();
          formData.append('name', name);
          
          if (file) {
            formData.append('image', file);
          }

          const { data } = await axiosClient.post("categories", formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          // Add new category to state
          set((state) => ({
            categories: [...state.categories, data.data], // data.data because backend returns {message, data}
          }));
          
          // Refresh categories to ensure we have the latest data
          get().fetchCategories();
          
        } catch (error) {
          console.error('Failed to add category:', error);
          throw error; // Let the form handle the error
        }
      },
      
      delete: () => {
        // TODO: Implement delete functionality
      },
    };
  });


