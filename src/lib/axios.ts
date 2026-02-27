import axios from "axios";
import { useModalStore } from "@/store/useModalStore";
import { useAuthStore } from "@/store/useAuthStore";
import { navigateTo } from "@/lib/navigation";

// Create a non-reactive reference to the modal store
// This avoids React hooks being called in non-React context
let modalStore: any;
let authStore: any;

const getModalStore = () => {
  if (!modalStore) {
    modalStore = useModalStore.getState();
  }
  return modalStore;
};

const getAuthStore = () => {
  if (!authStore) {
    authStore = useAuthStore.getState();
  }
  return authStore;
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Request Interceptor: Gắn Token vào Header
apiClient.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (do Zustand persist lưu ở đây)
    const storage = localStorage.getItem("auth-storage");
    if (storage) {
      const { accessToken } = JSON.parse(storage).state;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Xử lý data và lỗi trả về
apiClient.interceptors.response.use(
  (response) => {
    // Always return the full response data object { code, message, data }
    // Components will access response.code, response.data, response.message
    return response.data;
  },
  (error) => {
    const status = error.response?.status;

    // Xử lý lỗi 401 (Unauthorized) - Token hết hạn hoặc chưa đăng nhập
    if (status === 401) {
      // Không hiện modal nếu đang ở trang login hoặc register
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        const auth = getAuthStore();

        // Chỉ mở modal yêu cầu đăng nhập nếu người dùng CHƯA đăng nhập
        // (không có accessToken hoặc không có user)
        if (!auth.isAuthenticated || !auth.accessToken || !auth.user) {
          const modalStore = getModalStore();
          modalStore.openLoginPrompt();
        }
        // Nếu đã đăng nhập (kể cả super admin) mà vẫn 401,
        // cứ để lỗi trả về cho UI xử lý (ví dụ: toast, thông báo lỗi quyền hạn)
      }
    }

    // Xử lý lỗi 403 (Forbidden) - Sai quyền người dùng
    if (status === 403) {
      const auth = getAuthStore();
      // Nếu đã đăng nhập mà vẫn 403 => quyền không đúng, chuyển sang trang 404 đẹp
      if (auth?.isAuthenticated) {
        navigateTo('/404');
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
