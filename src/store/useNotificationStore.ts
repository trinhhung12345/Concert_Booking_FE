import { create } from "zustand";

export interface EventNotification {
  id: string;
  eventId: number | string;
  title: string;
  message: string;
  createdAt: string; // ISO string
  read: boolean;
}

interface NotificationState {
  notifications: EventNotification[];
  addNotification: (notification: EventNotification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.read ? n : { ...n, read: true }
      ),
    })),

  clearAll: () => set({ notifications: [] }),
}));
