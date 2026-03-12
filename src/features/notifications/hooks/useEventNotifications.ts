import { useEffect } from "react";
import { eventNotificationSocketService } from "@/features/notifications/services/eventNotificationSocket";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Hook khởi tạo connection WebSocket/STOMP tới backend
 * và tự subscribe topic theo role hiện tại.
 *
 * Gắn hook này một lần ở root (ví dụ trong App hoặc MainLayout).
 */
export function useEventNotifications() {
  const { user, accessToken, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const roleName = user?.role?.roleName || (isAuthenticated ? "USER" : "GUEST");

    eventNotificationSocketService.connect({
      roleName,
      accessToken: accessToken ?? null,
    });

    return () => {
      // Không disconnect ở đây để tránh tắt connection khi chuyển route,
      // chỉ disconnect khi app unmount toàn bộ.
    };
  }, [user?.role?.roleName, isAuthenticated, accessToken]);
}
