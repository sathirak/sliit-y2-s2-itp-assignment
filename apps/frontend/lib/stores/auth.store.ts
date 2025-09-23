import { create } from 'zustand';
import type { UserDto } from '@/lib/dtos/user';


interface AuthState {
  user: UserDto | null;
  setUser: (user: UserDto | null) => void;
  removeUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  removeUser: () => set({ user: null }),
}));
