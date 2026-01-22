import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import EventCard, { type EventProps } from "@/features/concerts/components/EventCard";
import CategoryFilter from "@/components/layout/CategoryFilter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { eventService, type Event } from "@/features/concerts/services/eventService";
import ChatBot from "@/components/ChatBot";

export default function HomePage() {
  const location = useLocation();
  const [events, setEvents] = useState<EventProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchResults = location.state?.searchResults;
  const searchQuery = location.state?.searchQuery;

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
            : new Date().toISOString();
          const image = item.files && item.files.length > 0 && item.files[0].thumbUrl
            ? item.files[0].thumbUrl
            : "https://images.unsplash.com/photo-1459749411177-334811adbced?q=80&w=800&auto=format&fit=crop";
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

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">

      {/* SECTION: Danh mục sự kiện */}
      <CategoryFilter />

      {/* SECTION: Sự kiện nổi bật hoặc kết quả tìm kiếm */}
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

      <ChatBot />
    </div>
  );
}
