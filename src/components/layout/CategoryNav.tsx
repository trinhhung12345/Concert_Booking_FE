import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryService } from "@/features/concerts/services/categoryService";
import type { Category } from "@/features/concerts/services/categoryService";

export default function CategoryNav() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        // Kiểm tra xem data có phải là mảng không (đề phòng API thay đổi)
        if (Array.isArray(data)) {
          // Chỉ lấy những category đang active
          setCategories(data.filter((c) => c.active));
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Hàm tạo slug từ tên (VD: "Pop Concert" -> "pop-concert")
  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-");
  };

  return (
    <div className="w-full bg-[#3D3D49] border-t border-white/10 sticky top-16 z-40">
      <div className="container mx-auto px-4">
        <nav className="flex items-center gap-6 md:gap-8 overflow-x-auto py-3 md:justify-center no-scrollbar">
          
          {/* TRẠNG THÁI LOADING (Hiện Skeleton giả lập) */}
          {isLoading && (
            <div className="flex gap-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-5 w-24 bg-white/10 rounded animate-pulse" />
              ))}
            </div>
          )}

          {/* TRẠNG THÁI CÓ DỮ LIỆU */}
          {!isLoading && categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${createSlug(cat.name)}`}
              state={{ categoryId: cat.id }} // Truyền ID qua state để trang sau dễ query
              className="
                whitespace-nowrap 
                text-sm font-medium text-gray-200 
                hover:text-primary transition-colors duration-200
                border-b-2 border-transparent hover:border-primary pb-0.5
              "
              title={cat.description} // Hover vào sẽ hiện mô tả
            >
              {cat.name}
            </Link>
          ))}
          
          {/* Xử lý trường hợp không có dữ liệu */}
          {!isLoading && categories.length === 0 && (
            <span className="text-gray-400 text-sm">No categories available</span>
          )}
        </nav>
      </div>
    </div>
  );
}