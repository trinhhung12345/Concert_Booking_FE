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
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChevronRight, 
  faCalendarAlt,
  faFire
} from "@fortawesome/free-solid-svg-icons";

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
  const location = useLocation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [eventsByCategory, setEventsByCategory] = useState<
    Record<number, EventProps[]>
  >({});
  const [categoryPageIndex, setCategoryPageIndex] = useState<Record<number, number>>({});
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

  const INITIAL_VISIBLE = 6;

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
                const isExpanded = (categoryPageIndex[cat.id] ?? 0) === 1;
                const visibleEvents = isExpanded ? catEvents : catEvents.slice(0, INITIAL_VISIBLE);
                
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
                        {catEvents.length} sự kiện
                      </span>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary hover:bg-primary/10 transition-colors"
                      onClick={() => navigate(`/category/${cat.id}`)}
                    >
                      Xem tất cả
                      <FontAwesomeIcon icon={faChevronRight} className="ml-1 w-3 h-3" />
                    </Button>
                  </div>

                  {/* Event Cards - Responsive Grid */}
                  {catEvents.length ? (
                    <div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <AnimatePresence mode="wait">
                          {visibleEvents.map((event, index) => (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ delay: index * 0.05, duration: 0.3 }}
                            >
                              <EventCard {...event} />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                      
                      {/* Show More / Show Less */}
                      {catEvents.length > INITIAL_VISIBLE && (
                        <div className="flex justify-center mt-6">
                          <Button
                            variant="outline"
                            className="rounded-full px-6 hover:bg-primary hover:text-white hover:border-primary transition-all"
                            onClick={() => setCategoryPageIndex(prev => ({
                              ...prev,
                              [cat.id]: isExpanded ? 0 : 1
                            }))}
                          >
                            {isExpanded ? "Thu gọn" : `Xem thêm (${catEvents.length - INITIAL_VISIBLE})`}
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-muted-foreground italic py-8 text-center bg-muted/30 rounded-xl">
                      Chưa có sự kiện nào trong danh mục này
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
