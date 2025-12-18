import axiosClient from "@/helpers/axios-client";
import { User } from "@/Types/types";
import { create } from "zustand";

type usersStoreProps = {
  currentUser: User | null;
  addUser: (data: any) => Promise<void>;
  users: User[];
  loading: boolean;
  fetchUsers: () => Promise<void>;
  login: (data: any) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useUsersStore = create<usersStoreProps>((set) => ({
  users: [],
  loading: false,
  currentUser: null,
  addUser: async (data) => {
    const user = await axiosClient.post("signup", data);
    set((state) => ({ users: [...state.users, user.data.user] }));
  },
  fetchUsers: async () => {
    set({ loading: true });
    try {
      const users = await axiosClient.get("users");
      set({ users: users.data, loading: false });
    } catch {
      set({ loading: false });
    }
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
