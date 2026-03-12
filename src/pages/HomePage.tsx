import EventSlider from "@/components/EventSlider";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { eventService, EVENT_STATUS, type Event } from "@/features/concerts/services/eventService";
import { categoryService, type Category } from "@/features/concerts/services/categoryService";
import ChatBot from "@/components/ChatBot";
import { cleanImageUrl } from "@/lib/utils";
import type { EventProps } from "@/features/concerts/components/EventCard";
import EventCard from "@/features/concerts/components/EventCard";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChevronRight 
} from "@fortawesome/free-solid-svg-icons";
import { useLanguageStore } from "@/store/useLanguageStore";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { FreeMode, Navigation } from "swiper/modules";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const }
  }
};



export default function HomePage() {
  const { language } = useLanguageStore();
  const isVi = language === "vi";
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
        // Normalize categories response to always be an array
        const catsResponse = await categoryService.getAll();
        const normalizedCategories: Category[] = Array.isArray(catsResponse)
          ? catsResponse
          : (catsResponse as any)?.data && Array.isArray((catsResponse as any).data)
          ? (catsResponse as any).data
          : [];
        setCategories(normalizedCategories);

        // Normalize events/search results response to always be an array
        const eventsResponse = searchResults ?? (await eventService.getAll());
        const rawData: Event[] = Array.isArray(eventsResponse)
          ? eventsResponse
          : (eventsResponse as any)?.data && Array.isArray((eventsResponse as any).data)
          ? (eventsResponse as any).data
          : [];

        // Only show approved & non-deleted events on user side
        const data = rawData.filter(
          (e) => e.status === EVENT_STATUS.APPROVED && e.deleted !== true
        );

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
    <div className="bg-background min-h-screen w-full">
      <div className="container mx-auto px-4 py-6 sm:py-8 space-y-10 sm:space-y-14">
        {/* Event Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {!isLoading && allEvents.length > 0 && (
            <EventSlider events={allEvents} />
          )}
        </motion.div>

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="space-y-10">
            {[1, 2, 3].map((i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Skeleton className="h-8 w-56 mb-6 rounded-lg" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[1, 2, 3].map((j) => (
                    <motion.div
                      key={j}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: j * 0.1 }}
                    >
                      <Skeleton className="w-full aspect-[3/2] rounded-xl" />
                      <Skeleton className="h-4 w-3/4 mt-3" />
                      <Skeleton className="h-4 w-1/2 mt-2" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Category Sections with Animations */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10 sm:space-y-14"
          >
            {categories
              .filter((c) => c.active)
              .map((cat) => {
                const catEvents = eventsByCategory[cat.id] || [];
                
                return (
                <motion.section 
                  key={cat.id} 
                  className="space-y-5"
                  variants={itemVariants}
                >
                  {/* Section Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground relative">
                        {cat.name}
                        <motion.span 
                          className="absolute -bottom-1 left-0 h-0.5 bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ delay: 0.3, duration: 0.4 }}
                        />
                      </h2>
                      <span className="text-xs sm:text-sm text-muted-foreground bg-muted px-2 sm:px-2.5 py-1 rounded-full">
                        {isVi
                          ? `${catEvents.length} sự kiện`
                          : `${catEvents.length} events`}
                      </span>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary hover:bg-primary/10 transition-colors"
                      onClick={() => navigate(`/category/${cat.id}`)}
                    >
                      {isVi ? "Xem tất cả" : "View all"}
                      <FontAwesomeIcon icon={faChevronRight} className="ml-1 w-3 h-3" />
                    </Button>
                  </div>

                  {/* Event Cards - Slider */}
                  {catEvents.length ? (
                    <div className="relative group">
                      <Swiper
                        modules={[FreeMode, Navigation]}
                        spaceBetween={16}
                        slidesPerView={1.2}
                        freeMode={true}
                        navigation={{
                          nextEl: `.swiper-button-next-${cat.id}`,
                          prevEl: `.swiper-button-prev-${cat.id}`,
                        }}
                        breakpoints={{
                          640: { slidesPerView: 2.2, spaceBetween: 24 },
                          1024: { slidesPerView: 3.2, spaceBetween: 24 },
                          1280: { slidesPerView: 4.2, spaceBetween: 24 },
                        }}
                        className="!pb-6"
                      >
                        {catEvents.slice(0, 10).map((event, index) => (
                          <SwiperSlide key={event.id} className="!h-auto">
                            <motion.div
                              className="h-full"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05, duration: 0.3 }}
                            >
                              <EventCard {...event} />
                            </motion.div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      
                      {/* Custom Navigation Buttons (hidden on mobile, visible on hover on larger screens) */}
                      {catEvents.length > 4 && (
                        <>
                          <button 
                            className={`swiper-button-prev-${cat.id} absolute top-1/2 -left-4 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur border shadow-md flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity disabled:hidden`}
                            aria-label="Previous slide"
                          >
                            <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 rotate-180" />
                          </button>
                          <button 
                            className={`swiper-button-next-${cat.id} absolute top-1/2 -right-4 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur border shadow-md flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity disabled:hidden`}
                            aria-label="Next slide"
                          >
                            <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="text-muted-foreground italic py-8 text-center bg-muted/30 rounded-xl">
                      {isVi
                        ? "Chưa có sự kiện nào trong danh mục này"
                        : "No events in this category yet"}
                    </div>
                  )}
                </motion.section>
                );
              })}
          </motion.div>
        )}
        
        {/* ChatBot */}
        <ChatBot />
      </div>
    </div>
  );
}
