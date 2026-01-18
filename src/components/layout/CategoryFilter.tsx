import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryService, type Category } from "@/features/concerts/services/categoryService";

export default function CategoryFilter() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        if (Array.isArray(data)) {
          setCategories(data.filter((c) => c.active).slice(0, 6)); // Lấy 6 danh mục đầu
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const createSlug = (name: string) => {
    return name.toLowerCase().trim().replace(/[\s\W-]+/g, "-");
  };

  return (
    <section className="mb-12">
      <h3 className="text-2xl font-bold text-secondary mb-6">
        Khám phá theo danh mục
        <span className="block w-16 h-1.5 bg-primary mt-2 rounded-full"></span>
      </h3>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${createSlug(category.name)}`}
              state={{ categoryId: category.id }}
              className="
                group relative h-24 rounded-lg overflow-hidden
                bg-gradient-to-br from-primary to-primary/70
                hover:shadow-lg hover:scale-105 transition-all duration-300
                flex items-center justify-center text-center
              "
              title={category.description}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <div className="relative px-3">
                <p className="text-white font-bold text-sm line-clamp-2 group-hover:translate-y-0.5 transition-transform">
                  {category.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
