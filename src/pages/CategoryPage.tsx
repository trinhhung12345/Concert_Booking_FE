import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import EventCard, { type EventProps } from "@/features/concerts/components/EventCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { eventService, type Event } from "@/features/concerts/services/eventService";
import { categoryService, type Category } from "@/features/concerts/services/categoryService";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
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

        // Fetch category info nếu chưa lấy được
        if (!category) {
          const allCategories = await categoryService.getAll();
          const foundCategory = allCategories.find((cat) => cat.id === categoryId);
          if (foundCategory) {
            setCategory(foundCategory);
          }
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

          const image =
            item.files &&
            item.files.length > 0 &&
            item.files[0].thumbUrl
              ? item.files[0].thumbUrl
              : "https://images.unsplash.com/photo-1459749411177-334811adbced?q=80&w=800&auto=format&fit=crop";

          return {
            id: item.id,
            title: item.title,
            imageUrl: image,
            minPrice: minPrice,
            date: firstDate,
            category: item.categoryName,
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
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* HEADER */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-secondary mb-2">
              {category ? category.name : "Danh mục"}
              <span className="block w-24 h-1.5 bg-primary mt-2 rounded-full"></span>
            </h1>
            {category?.description && (
              <p className="text-gray-600 mt-2">{category.description}</p>
            )}
          </div>
          <Button 
            variant="ghost" 
            className="text-primary hover:text-primary/80 hover:bg-primary/5"
            onClick={() => navigate(-1)}
          >
            ← Quay lại
          </Button>
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
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Không có sự kiện trong danh mục này
          </h3>
          <p className="text-gray-500">
            Hãy quay lại và chọn một danh mục khác
          </p>
        </section>
      ) : null}
    </div>
  );
}
