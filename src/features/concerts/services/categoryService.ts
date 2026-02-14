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
  // API public: Lấy tất cả danh mục đang hoạt động (frontend user)
  getAll: async () => {
    return apiClient.get<any, Category[]>("/categories");
  },

  // API admin: Lấy tất cả category (bao gồm quản lý)
  getAllAdmin: async () => {
    return apiClient.get<any, Category[]>("/admin/categories");
  },

  // API: Tạo mới category (dùng chung cho admin)
  create: async (payload: CategoryCreatePayload) => {
    return apiClient.post<any, Category>("/categories", payload);
  },

  // API: Cập nhật trạng thái active (dùng chung cho admin)
  updateActive: async (id: number, active: boolean) => {
    return apiClient.put<any, void>(`/categories/${id}`, { active });
  },

  // API: Xoá category (dùng chung cho admin)
  delete: async (id: number) => {
    return apiClient.delete<void>(`/categories/${id}`);
  },
};
