import {create} from 'zustand';
import { IUser } from '@/interfaces';

export interface IUsersStore {
  user : IUser | null;
  setUser: (user: IUser | null) => void;
}

export const useUsersStore = create<IUsersStore>((set) => ({
  user: null,
  setUser: (user:IUser | null) => set({ user }),
}));