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
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChevronLeft, 
  faChevronRight, 
  faMapMarkerAlt,
  faCalendarAlt,
  faFire
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

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

// Badge component for event status
function EventBadge({ date, minPrice }: { date: string; minPrice: number }) {
  const eventDate = new Date(date);
  const now = new Date();
  const daysUntil = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntil > 7) {
    return (
      <span className="absolute top-3 left-3 bg-primary/90 text-white text-xs font-medium px-2.5 py-1 rounded-full">
        Sắp diễn ra
      </span>
    );
  } else if (daysUntil > 0 && daysUntil <= 7) {
    return (
      <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
        <FontAwesomeIcon icon={faFire} className="w-3 h-3" />
        Còn {daysUntil} ngày
      </span>
    );
  }
  return null;
}


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

  const VISIBLE_EVENTS_PER_CATEGORY = 3;

  const handleNextCategoryPage = (categoryId: number) => {
    setCategoryPageIndex((prev) => {
      const current = prev[categoryId] ?? 0;
      const total = eventsByCategory[categoryId]?.length ?? 0;
      if (total === 0) return prev;

      const maxStart = Math.max(total - VISIBLE_EVENTS_PER_CATEGORY, 0);
      const next = Math.min(current + VISIBLE_EVENTS_PER_CATEGORY, maxStart);
      if (next === current) return prev;
      return { ...prev, [categoryId]: next };
    });
  };

  const handlePrevCategoryPage = (categoryId: number) => {
    setCategoryPageIndex((prev) => {
      const current = prev[categoryId] ?? 0;
      const next = Math.max(current - VISIBLE_EVENTS_PER_CATEGORY, 0);
      if (next === current) return prev;
      return { ...prev, [categoryId]: next };
    });
  };

  return (
    <div className="bg-background min-h-screen w-full">
      <div className="container mx-auto px-4 py-8 space-y-14">
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
                <div className="flex gap-6">
                  {[1, 2, 3].map((j) => (
                    <motion.div
                      key={j}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: j * 0.1 }}
                    >
                      <Skeleton className="w-[320px] h-[300px] rounded-xl" />
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
          >
            {categories
              .filter((c) => c.active)
              .map((cat, sectionIndex) => (
                <motion.section 
                  key={cat.id} 
                  className="space-y-6"
                  variants={itemVariants}
                >
                  {/* Section Header */}
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-foreground relative">
                        {cat.name}
                        <motion.span 
                          className="absolute -bottom-1 left-0 h-0.5 bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ delay: 0.3, duration: 0.4 }}
                        />
                      </h2>
                      <span className="text-sm text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                        {eventsByCategory[cat.id]?.length || 0} sự kiện
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {eventsByCategory[cat.id]?.length > VISIBLE_EVENTS_PER_CATEGORY && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                            onClick={() => handlePrevCategoryPage(cat.id)}
                          >
                            <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                            onClick={() => handleNextCategoryPage(cat.id)}
                          >
                            <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        className="text-primary hover:text-primary hover:bg-primary/10 transition-colors"
                        onClick={() => navigate(`/category/${cat.id}`)}
                      >
                        Xem tất cả
                        <FontAwesomeIcon icon={faChevronRight} className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Event Cards */}
                  {eventsByCategory[cat.id]?.length ? (
                    <div className="relative pb-3">
                      <div className="flex gap-6">
                        <AnimatePresence mode="wait">
                          {eventsByCategory[cat.id]
                            .slice(
                              categoryPageIndex[cat.id] ?? 0,
                              (categoryPageIndex[cat.id] ?? 0) + VISIBLE_EVENTS_PER_CATEGORY
                            )
                            .map((event, index) => (
                              <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.1, duration: 0.3 }}
                                className="min-w-[320px] w-[320px]"
                              >
                                <div
                                  className="group bg-card rounded-xl overflow-hidden cursor-pointer 
                                    hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300
                                    border border-transparent hover:border-primary/20
                                    transform hover:-translate-y-1"
                                  onClick={() => navigate(`/event/${event.id}`)}
                                >
                                  {/* IMAGE with Badge */}
                                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                                    {/* Badge */}
                                    <EventBadge date={event.date} minPrice={event.minPrice} />
                                    
                                    <img
                                      src={event.imageUrl}
                                      alt={event.title}
                                      className="w-full h-full object-cover 
                                        transition-transform duration-500 
                                        group-hover:scale-110"
                                      onError={(e) => {
                                        e.currentTarget.src =
                                          "https://images.unsplash.com/photo-1459749411177-334811adbced?q=80&w=800";
                                      }}
                                    />
                                    
                                    {/* Gradient Overlay on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  </div>

                                  {/* CONTENT */}
                                  <div className="p-5 space-y-3">
                                    <span className="text-xs font-medium text-primary uppercase tracking-wider">
                                      {event.category ?? "EVENT"}
                                    </span>

                                    <h3 className="text-foreground font-bold text-lg line-clamp-2 
                                      group-hover:text-primary transition-colors duration-300">
                                      {event.title}
                                    </h3>

                                    {/* Price & Date Row */}
                                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                      <p className="text-primary font-bold text-base">
                                        {new Intl.NumberFormat("vi-VN", {
                                          style: "currency",
                                          currency: "VND",
                                          maximumFractionDigits: 0
                                        }).format(event.minPrice)}
                                      </p>

                                      <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 text-primary/70" />
                                        <span>
                                          {new Date(event.date).toLocaleDateString(
                                            "vi-VN",
                                            {
                                              day: "2-digit",
                                              month: "2-digit",
                                              year: "numeric"
                                            }
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground italic py-8 text-center bg-muted/30 rounded-xl">
                      Chưa có sự kiện nào trong danh mục này
                    </div>
                  )}
                </motion.section>
              ))}
          </motion.div>
        )}
        
        {/* ChatBot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <ChatBot />
        </motion.div>
      </div>
    </div>
  );
}
