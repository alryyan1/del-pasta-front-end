import axiosClient from "@/helpers/axios-client";
import { Customer } from "@/Types/types";
import { create } from "zustand";

interface CustomerStore {
  loading: boolean;
  customers: Customer[];
  searchQuery: string;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  setSearchQuery: (query: string) => void;
  fetchData: () => void; // Fetch data from API and update the customers array in the store.
}

export const useCustomerStore = create<CustomerStore>((set) => ({
  loading: false,
  customers: [],
  fetchData: () => {
    axiosClient.get<Customer[]>("customers").then(({ data }) => {
      console.log(data, "data");
      set({ customers: data });
    });
  },
  searchQuery: "",
  addCustomer: (customer) => {
    axiosClient.post("customers", { ...customer }).then(({ data }) => {
      set((state) => ({
        customers: [...state.customers, data.data],
      }));
    });
  },

  updateCustomer: (customer) => {
    axiosClient
      .put(`customers/${customer.id}`, { ...customer })
      .then(({ data }) => {
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === customer.id ? data.data : c
          ),
        }));
      });
  },
  deleteCustomer: (id) => {
    axiosClient.delete(`customers/${id}`).then(({data}) => {
      if (data.status) {
         set((state) => ({
        customers: state.customers.filter((c) => c.id!== id),
      }));
      }
     
    });
  
  },
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
