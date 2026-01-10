import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để xử lý response (Optional: giúp debug dễ hơn)
apiClient.interceptors.response.use(
  (response) => response.data, // Trả về thẳng data, đỡ phải .data nhiều lần
  (error) => {
    // Xử lý lỗi chung (ví dụ 401, 500)
    return Promise.reject(error);
  }
);

export default apiClient;