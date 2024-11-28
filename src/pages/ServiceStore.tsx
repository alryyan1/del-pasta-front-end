import axiosClient from "@/helpers/axios-client";
import { Service } from "@/Types/types";
import { create } from "zustand";

interface ServiceStorePropbs {
    serviceList: Service[];
    addService: (service: Service) => void;
    fetchData: () => void; // Function to fetch data from API and update the state with the fetched data.  // Replace with actual API endpoint when using AxiosClient.  // This function is called in App.vue's mounted hook.  // AxiosClient is a custom axios client setup in axios-client.ts file.  // This function is called in App.vue's mounted hook.  // AxiosClient is a custom axios client setup in axios-client.ts file.
  
}
export const useServiceStore = create<ServiceStorePropbs>((state) => {
  return {
    serviceList: [],
    fetchData:()=>{
        axiosClient.get<Service[]>(`services`).then(({ data }) => {
             state((prev)=>{
                return {
                    serviceList:data
                }
             })
          });
    },
    addService: (service) => {
      axiosClient.post("services", service).then(({ data }) => {
          state((prev)=>{
            return {
                serviceList:[...prev.serviceList,data]
            
            }
          })
      });
    },
  };
});
