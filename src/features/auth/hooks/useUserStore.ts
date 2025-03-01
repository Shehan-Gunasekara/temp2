import { create } from 'zustand';

interface UserDetails {
  credits: number;
  email: string;
  username: string;
}

interface UserStore {
  userDetails: UserDetails | null;
  setUserDetails: (details: UserDetails | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userDetails: null,
  setUserDetails: (details) => set({ userDetails: details }),
}));