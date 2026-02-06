import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import EventCard, { type EventProps } from "@/features/concerts/components/EventCard";
import { Skeleton } from "@/components/ui/skeleton";
import { eventService, type Event } from "@/features/concerts/services/eventService";
import { categoryService, type Category } from "@/features/concerts/services/categoryService";
import { cleanImageUrl } from "@/lib/utils";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [events, setEvents] = useState<EventProps[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEventsByCategory = async () => {
      try {
        setIsLoading(true);
        
        // Lấy categoryId từ location state hoặc từ slug
        let categoryId: number | null = null;

        // Nếu có categoryId trong state (từ link click)
        if (location.state?.categoryId) {
          categoryId = location.state.categoryId;
        } else if (slug) {
          // Nếu không có categoryId, fetch tất cả categories để tìm ID từ slug
          const allCategories = await categoryService.getAll();
          const foundCategory = allCategories.find(
            (cat) => cat.name.toLowerCase().replace(/[\s\W-]+/g, "-") === slug
          );
          if (foundCategory) {
            categoryId = foundCategory.id;
            setCategory(foundCategory);
          }
        }

        if (!categoryId) {
          throw new Error("Category not found");
        }

        // Fetch events theo category
        const data: Event[] = await eventService.getByCategory(categoryId);

        // Fetch category info để hiển thị tên + mô tả (luôn cập nhật theo categoryId hiện tại)
        const allCategories = await categoryService.getAll();
        const foundCategory = allCategories.find((cat) => cat.id === categoryId);
        if (foundCategory) {
          setCategory(foundCategory);
        }

        // Transform data
        const transformedEvents: EventProps[] = data.map((item: Event) => {
          let minPrice = 0;
          const allPrices: number[] = [];

          if (item.showings && item.showings.length > 0) {
            item.showings.forEach((show) => {
              if (show.types && show.types.length > 0) {
                show.types.forEach((ticket) => allPrices.push(ticket.price));
              }
            });
          }

          if (allPrices.length > 0) {
            minPrice = Math.min(...allPrices);
          }

          const firstDate =
            item.showings && item.showings.length > 0
              ? item.showings[0].startTime
              : new Date().toISOString();

          // Lấy ảnh thumbnail: ưu tiên file type=0 có tỉ lệ gần 16/9
          const imageFiles = item.files?.filter(f => f.type === 0) ?? [];
          const preferred16x9 = imageFiles.find(
            (f) =>
              f.width &&
              f.height &&
              Math.abs(f.width / f.height - 16 / 9) < 0.2
          );
          const thumbnailFile = preferred16x9 || imageFiles[0] || item.files?.[0];
          const rawImage = thumbnailFile?.thumbUrl || thumbnailFile?.originUrl || null;
          const image = cleanImageUrl(rawImage);

          return {
            id: item.id,
            title: item.title,
            imageUrl: image,
            minPrice: minPrice,
            date: firstDate,
            category: item.categoryName,
            imageWidth: thumbnailFile?.width ?? undefined,
            imageHeight: thumbnailFile?.height ?? undefined,
            files: item.files,
          };
        });

        setEvents(transformedEvents);
      } catch (error) {
        console.error("Failed to fetch events by category:", error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventsByCategory();
  }, [slug, location]);

  return (
    <div className="bg-gray-900 min-h-screen w-full text-slate-100">
      <div className="container mx-auto px-4 py-8 space-y-12">
      {/* HEADER */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            {category?.description && (
              <p className="text-slate-300 mt-2">{category.description}</p>
            )}
          </div>
  
        </div>
      </section>

      {/* LOADING STATE */}
      {isLoading && (
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-[200px] w-full rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* DATA LIST */}
      {!isLoading && events.length > 0 ? (
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </section>
      ) : !isLoading && events.length === 0 ? (
        <section className="text-center py-12">
          <h3 className="text-xl font-semibold text-slate-200 mb-2">
            Không có sự kiện trong danh mục này
          </h3>
          <p className="text-slate-400">
            Hãy quay lại và chọn một danh mục khác
          </p>
        </section>
      ) : null}
      </div>
    </div>
  );
}
