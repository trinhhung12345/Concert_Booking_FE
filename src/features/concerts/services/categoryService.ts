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
    const res: any = await apiClient.get("/categories");
    return res?.data || res;
  },

  // API admin: Lấy tất cả category (bao gồm quản lý)
  getAllAdmin: async () => {
    const res: any = await apiClient.get("/admin/categories");
    return res?.data || res;
  },

  // API: Tạo mới category (dùng chung cho admin)
  create: async (payload: CategoryCreatePayload) => {
    const res: any = await apiClient.post("/categories", payload);
    return res?.data || res;
  },

  // API: Cập nhật trạng thái active (dùng chung cho admin)
  updateActive: async (id: number, active: boolean) => {
    return apiClient.put(`/categories/${id}`, { active });
  },

  // API: Xoá category (dùng chung cho admin)
  delete: async (id: number) => {
    return apiClient.delete(`/categories/${id}`);
  },
};
