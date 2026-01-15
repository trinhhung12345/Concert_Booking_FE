import { create } from "zustand";
import { persist } from "zustand/middleware";

// Định nghĩa lại Role dựa trên JSON bạn gửi
interface Role {
  roleId: number;
  objectId: number;
  roleName: string; // "ADMIN", "USER", etc.
  roleType: number;
}

interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  code: string;
  role: Role; // Thêm field này
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,

      login: (token, user) =>
        set({
          accessToken: token,
          user: user,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage", // Tên key trong localStorage
    }
  )
);
