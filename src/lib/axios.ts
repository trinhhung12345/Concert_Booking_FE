import axios from "axios";
import { useModalStore } from "@/store/useModalStore";

// Create a non-reactive reference to the modal store
// This avoids React hooks being called in non-React context
let modalStore: any;

const getModalStore = () => {
  if (!modalStore) {
    modalStore = useModalStore.getState();
  }
  return modalStore;
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
  (response) => response.data,
  (error) => {
    // Xử lý lỗi 401 (Unauthorized) - Token hết hạn hoặc chưa đăng nhập
    if (error.response?.status === 401) {
      const modalStore = getModalStore();
      modalStore.openLoginPrompt();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
