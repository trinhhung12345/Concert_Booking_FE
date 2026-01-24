import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import EventCard, { type EventProps } from "@/features/concerts/components/EventCard";
import CategoryFilter from "@/components/layout/CategoryFilter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { eventService, type Event } from "@/features/concerts/services/eventService";
import ChatBot from "@/components/ChatBot";
import { Link } from "react-router-dom";
import { categoryService, type Category } from "@/features/concerts/services/categoryService";
import { cleanImageUrl } from "@/lib/utils";

// Component to handle events for each category
function CategoryEvents({ categoryId, transformEvents }: { categoryId: number; transformEvents: (events: Event[]) => EventProps[] }) {
  const [categoryEvents, setCategoryEvents] = useState<EventProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryEvents = async () => {
      try {
        const data: Event[] = await eventService.getByCategory(categoryId);
        const transformed = transformEvents(data).slice(0, 4); // Limit to 4 events
        setCategoryEvents(transformed);
      } catch (error) {
        console.error("Failed to fetch category events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryEvents();
  }, [categoryId, transformEvents]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-[200px] w-full rounded-2xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (categoryEvents.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Chưa có sự kiện nào trong danh mục này.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categoryEvents.map((event) => (
        <EventCard key={event.id} {...event} />
      ))}
    </div>
  );
}

export default function HomePage() {
  const location = useLocation();
  const [events, setEvents] = useState<EventProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchResults = location.state?.searchResults;
  const searchQuery = location.state?.searchQuery;
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    // Nếu có kết quả tìm kiếm thì set luôn, không gọi API
    if (searchResults) {
      setEvents(searchResults);
      setIsLoading(false);
      return;
    }
    const fetchEvents = async () => {
      try {
        const data: Event[] = await eventService.getAll();
        const transformedEvents: EventProps[] = data.map((item: Event) => {
          let minPrice = 0;
          const allPrices: number[] = [];
          if (item.showings && item.showings.length > 0) {
            item.showings.forEach(show => {
              if (show.types && show.types.length > 0) {
                show.types.forEach(ticket => allPrices.push(ticket.price));
              }
            });
          }
          if (allPrices.length > 0) {
            minPrice = Math.min(...allPrices);
          }
          const firstDate = item.showings && item.showings.length > 0
            ? item.showings[0].startTime
            : new Date().toISOString(); // Fallback nếu chưa có lịch

          // 3. Lấy ảnh thumbnail (Ưu tiên type = 0, fallback file đầu tiên)
          const thumbnailFile = item.files?.find(f => f.type === 0) || item.files?.[0];
          const rawImage = thumbnailFile?.thumbUrl || thumbnailFile?.originUrl || null;
          const image = cleanImageUrl(rawImage);

          return {
            id: item.id,
            title: item.title,
            imageUrl: image,
            minPrice: minPrice,
            date: firstDate,
            category: item.categoryName
          };
        });
        setEvents(transformedEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [searchResults]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        if (Array.isArray(data)) {
          setCategories(data.filter((c) => c.active));
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Helper function to create slug from category name
  const createSlug = (name: string) => {
    return name.toLowerCase().trim().replace(/[\s\W-]+/g, "-");
  };

  // Helper function to transform events data
  const transformEvents = (eventsData: Event[]): EventProps[] => {
    return eventsData.map((item: Event) => {
      let minPrice = 0;
      const allPrices: number[] = [];

      if (item.showings && item.showings.length > 0) {
        item.showings.forEach(show => {
          if (show.types && show.types.length > 0) {
            show.types.forEach(ticket => allPrices.push(ticket.price));
          }
        });
      }

      if (allPrices.length > 0) {
        minPrice = Math.min(...allPrices);
      }

      const firstDate = item.showings && item.showings.length > 0
        ? item.showings[0].startTime
        : new Date().toISOString();

      const thumbnailFile = item.files?.find(f => f.type === 0) || item.files?.[0];
      const rawImage = thumbnailFile?.thumbUrl || thumbnailFile?.originUrl || null;
      const image = cleanImageUrl(rawImage);

      {/* SECTION: Sự kiện nổi bật hoặc kết quả tìm kiếm */}
      return {
        id: item.id,
        title: item.title,
        imageUrl: image,
        minPrice: minPrice,
        date: firstDate,
        category: item.categoryName
      };
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* SECTION: Sự kiện mới nhất */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-secondary">
            {searchQuery
              ? `Kết quả tìm kiếm cho "${searchQuery}"`
              : "Sự kiện mới nhất"}
            <span className="block w-16 h-1.5 bg-primary mt-2 rounded-full"></span>
          </h2>
          {!searchQuery && (
            <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/5">
              Xem tất cả &rarr;
            </Button>
          )}
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-[200px] w-full rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* DATA LIST */}
        {!isLoading && events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className="text-center py-20 text-gray-500">
              Hiện chưa có sự kiện nào.
            </div>
          )
        )}
      </section>

      {/* SECTIONS: Sự kiện theo danh mục */}
      {categoriesLoading ? (
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <section key={i}>
              <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-24" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="space-y-3">
                    <Skeleton className="h-[200px] w-full rounded-2xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        categories.map((category) => (
          <section key={category.id}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-secondary">
                {category.name}
                <span className="block w-16 h-1.5 bg-primary mt-2 rounded-full"></span>
              </h2>
              <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/5" asChild>
                <Link to={`/category/${createSlug(category.name)}`} state={{ categoryId: category.id }}>
                  Xem tất cả &rarr;
                </Link>
              </Button>
            </div>
            <CategoryEvents categoryId={category.id} transformEvents={transformEvents} />
          </section>
        ))
      )}

      {/* Chatbot */}
      <ChatBot />
    </div>
  );
}
