import axiosClient from "@/helpers/axios-client";
import { User } from "@/Types/types";
import { create } from "zustand";

type usersStoreProps = {
  currentUser: User | null;
  addUser: (data: any) => Promise<void>;
  users: User[];
  fetchUsers: () => Promise<void>;
  login: (data) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useUsersStore = create<usersStoreProps>((set) => ({
  users: [],
  
  currentUser: null,
  addUser: async (data) => {
    const user = await axiosClient.post("signup",  data );
    set((state) => ({ users: [...state.users, user.data.user] }));
  },
  fetchUsers: async () => {
    const users = await axiosClient.get("users");
    set({ users: users.data });
  },
  login: async (data) => {
    const user = await axiosClient.post("login", data);
    set({ currentUser: user.data });
  },
  signOut: async () => {
    await axiosClient.post("logout");
    set({ currentUser: null });
  },
 
}));
