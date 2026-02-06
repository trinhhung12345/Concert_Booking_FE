import EventSlider from "@/components/EventSlider";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { eventService, type Event } from "@/features/concerts/services/eventService";
import { categoryService, type Category } from "@/features/concerts/services/categoryService";
import ChatBot from "@/components/ChatBot";
import { cleanImageUrl } from "@/lib/utils";
import type { EventProps } from "@/features/concerts/components/EventCard";


export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [eventsByCategory, setEventsByCategory] = useState<
    Record<number, EventProps[]>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const searchResults = location.state?.searchResults;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const cats = await categoryService.getAll();
        setCategories(cats);

        const data: Event[] = searchResults
          ? searchResults
          : await eventService.getAll();

        const grouped: Record<number, EventProps[]> = {};

        data.forEach((item) => {
          const prices: number[] = [];
          item.showings?.forEach((s) =>
            s.types?.forEach((t) => prices.push(t.price))
          );

          const imageFiles = item.files?.filter((f) => f.type === 0) ?? [];
          const preferred16x9 = imageFiles.find(
            (f) =>
              f.width &&
              f.height &&
              Math.abs(f.width / f.height - 16 / 9) < 0.2
          );
          const thumbnailFile = preferred16x9 || imageFiles[0] || item.files?.[0];
          const rawImage = thumbnailFile?.thumbUrl || thumbnailFile?.originUrl || null;
          const imageUrl = cleanImageUrl(rawImage);

          const eventObj: EventProps = {
            id: item.id,
            title: item.title,
            minPrice: prices.length ? Math.min(...prices) : 0,
            date:
              item.showings?.[0]?.startTime ??
              new Date().toISOString(),
            imageUrl: imageUrl,
            category: item.categoryName,
            imageWidth: thumbnailFile?.width ?? undefined,
            imageHeight: thumbnailFile?.height ?? undefined,
            files: item.files,
          };

          if (!grouped[item.categoryId]) grouped[item.categoryId] = [];
          grouped[item.categoryId].push(eventObj);
        });

        setEventsByCategory(grouped);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchResults]);

  const allEvents = Object.values(eventsByCategory).flat();

  return (
    <div className="bg-gray-900 min-h-screen w-full">
      <div className="container mx-auto px-4 py-8 space-y-14">
        {!isLoading && allEvents.length > 0 && (
          <EventSlider events={allEvents} />
        )}

        {isLoading ? (
          <div className="space-y-10">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <Skeleton className="h-7 w-48 mb-4" />
                <div className="flex gap-6">
                  {[1, 2, 3].map((j) => (
                    <Skeleton
                      key={j}
                      className="w-[320px] h-[280px] rounded-xl"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          categories
            .filter((c) => c.active)
            .map((cat) => (
              <section key={cat.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    {cat.name}
                  </h2>
                  <Button
                    variant="ghost"
                    className="text-primary"
                    onClick={() => navigate(`/category/${cat.id}`)}
                  >
                    Xem tất cả →
                  </Button>
                </div>

                {eventsByCategory[cat.id]?.length ? (
                  <div className="flex gap-6 overflow-x-auto pb-3">
                    {eventsByCategory[cat.id].slice(0, 6).map((event) => (
                      <div
                        key={event.id}
                        className="min-w-[320px] w-[320px] bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition"
                        onClick={() =>
                          navigate(`/event/${event.id}`)
                        }
                      >
                        {/* IMAGE */}
                        <div className="aspect-[16/9] w-full overflow-hidden">
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://images.unsplash.com/photo-1459749411177-334811adbced?q=80&w=800";
                            }}
                          />
                        </div>

                        {/* CONTENT */}
                        <div className="p-4 space-y-1">
                          <span className="text-xs text-gray-400 uppercase">
                            {event.category ?? "EVENT"}
                          </span>

                          <h3 className="text-white font-semibold text-base line-clamp-2">
                            {event.title}
                          </h3>

                          <p className="text-green-400 font-semibold text-sm">
                            From{" "}
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                              maximumFractionDigits: 0
                            }).format(event.minPrice)}
                          </p>

                          <div className="flex items-center gap-1 text-gray-400 text-xs">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 16 16"
                              fill="currentColor"
                            >
                              <path d="M5 1a.75.75 0 0 1 .75.75V3h4.5V1.75a.75.75 0 0 1 1.5 0V3H13a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1.25V1.75A.75.75 0 0 1 5 1z" />
                            </svg>
                            <span>
                              {new Date(event.date).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric"
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 italic py-6">
                    Chưa có sự kiện nào
                  </div>
                )}
              </section>
            ))
        )}
        
        <ChatBot />
      </div>
    </div>
  );
}
