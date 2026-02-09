import apiClient from "@/lib/axios";

// 1. Định nghĩa kiểu dữ liệu cho Category
export interface Category {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

// Kiểu dữ liệu khi tạo mới Category (không có id)
export type CategoryCreatePayload = {
  name: string;
  description?: string;
  active?: boolean;
};

export const categoryService = {
  // API: Lấy tất cả danh mục đang hoạt động
  getAll: async () => {
    // API trả về mảng trực tiếp Category[]
    return apiClient.get<any, Category[]>("/categories");
  },

  // API: Tạo mới category
  create: async (payload: CategoryCreatePayload) => {
    return apiClient.post<any, Category>("/categories", payload);
  },

  // API: Cập nhật trạng thái active
  updateActive: async (id: number, active: boolean) => {
    return apiClient.put<any, void>(`/categories/${id}`, { active });
  },

  // API: Xoá category
  delete: async (id: number) => {
    return apiClient.delete<void>(`/categories/${id}`);
  },
};
