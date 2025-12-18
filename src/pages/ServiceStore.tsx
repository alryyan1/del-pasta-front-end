import axiosClient from "@/helpers/axios-client";
import { Service } from "@/Types/types";
import { create } from "zustand";

interface ServiceStoreProps {
  serviceList: Service[];
  loading: boolean;
  addService: (service: Service) => void;
  fetchData: () => void;
}

export const useServiceStore = create<ServiceStoreProps>((set) => ({
  serviceList: [],
  loading: false,
  fetchData: () => {
    set({ loading: true });
    axiosClient
      .get<Service[]>(`services`)
      .then(({ data }) => {
        set({ serviceList: data, loading: false });
      })
      .catch(() => {
        set({ loading: false });
      });
  },
  addService: (service) => {
    axiosClient.post("services", service).then(({ data }) => {
      set((state) => ({
        serviceList: [...state.serviceList, data],
      }));
    });
  },
}));
