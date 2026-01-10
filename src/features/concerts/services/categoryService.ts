import apiClient from "@/lib/axios";

// 1. Định nghĩa kiểu dữ liệu cho Category
export interface Category {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

export const categoryService = {
  // API: Lấy tất cả danh mục
  getAll: async () => {
    // Lưu ý: API này trả về mảng trực tiếp Category[]
    return apiClient.get<any, Category[]>("/categories");
  },
};
