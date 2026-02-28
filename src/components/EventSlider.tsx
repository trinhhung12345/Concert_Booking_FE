import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { Swiper as SwiperCore } from "swiper";
import { Link } from "react-router-dom";
import { useState } from "react";
import type { EventProps } from "@/features/concerts/components/EventCard";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faTicketAlt } from "@fortawesome/free-solid-svg-icons";

interface Props {
  events: EventProps[];
}

export default function EventSlider({ events }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const sorted = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const newestEvents = sorted.slice(0, 2);

  // Luôn hiển thị "Sự kiện đặc sắc" dù có ít event,
  // nhưng tối đa 4 sự kiện trong slider.
  const specialEvents =
    sorted.length <= 5 ? sorted : sorted.slice(2, 6);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-10">
      {/* ===== SECTION HEADER ===== */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          Sự kiện nổi bật
        </h2>
        <Link 
          to="/category/0" 
          className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
        >
          Xem tất cả →
        </Link>
      </div>

      {/* ===== EVENT MỚI NHẤT (Hero Cards) ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {newestEvents.map((event, index) => {
          const imageFiles = event.files?.filter((f) => f.type === 0) ?? [];
          const preferred16x9 = imageFiles.find(
            (f) =>
              f.width &&
              f.height &&
              Math.abs(f.width / f.height - 16 / 9) < 0.2
          );
          const bannerFile = preferred16x9 || imageFiles[0];
          const bannerUrl =
            bannerFile?.thumbUrl || bannerFile?.originUrl || event.imageUrl;

          const isHorizontal =
            bannerFile?.width && bannerFile.height
              ? bannerFile.width > bannerFile.height
              : true;
          
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Link
                to={`/event/${event.id}`}
                className="group block relative"
              >
                <div
                  className={`
                    relative rounded-2xl overflow-hidden bg-black
                    ${isHorizontal ? "aspect-video" : "aspect-[3/4]"}
                    shadow-lg group-hover:shadow-2xl group-hover:shadow-primary/20
                    transition-all duration-500
                  `}
                >
                  {/* BLUR BACKGROUND */}
                  <img
                    src={bannerUrl}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-50 group-hover:opacity-60 transition-opacity duration-500"
                  />

                  {/* MAIN IMAGE */}
                  <img
                    src={bannerUrl}
                    alt={event.title}
                    className={`
                      absolute inset-0 w-full h-full
                      ${isHorizontal ? "object-cover" : "object-contain"}
                      group-hover:scale-105 transition-transform duration-700
                    `}
                  />

                  {/* OVERLAY GRADIENT */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  {/* BADGE */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      {index === 0 ? "MỚI NHẤT" : "SẮP DIỄN RA"}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                    {/* Event Info Row */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2 text-white/90 text-sm">
                        <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-primary font-bold">
                        <FontAwesomeIcon icon={faTicketAlt} className="w-4 h-4" />
                        <span>Từ {formatPrice(event.minPrice)}</span>
                      </div>
                    </div>

                    <h4 className="text-white font-bold text-xl md:text-2xl line-clamp-2 mb-4">
                      {event.title}
                    </h4>

                    <motion.div
                      className="inline-block w-fit px-6 py-2.5 text-sm font-medium bg-white text-black rounded-full"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Xem chi tiết
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* ===== SPECIAL EVENTS SLIDER WITH PAGINATION ===== */}
      {specialEvents.length > 0 && (
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              Sự kiện đặc sắc
            </h3>
            
            {/* Custom Pagination Dots */}
            {specialEvents.length > 1 && (
              <div className="flex items-center gap-2">
                {specialEvents.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const swiper = document.querySelector('.special-events-swiper') as HTMLElement & { swiper?: SwiperCore };
                      const swiperEl = document.querySelector('.special-events-swiper')?.querySelector('.swiper') as HTMLElement & { swiper?: SwiperCore };
                      if (swiperEl?.swiper) {
                        swiperEl.swiper.slideTo(idx);
                      }
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      activeIndex === idx 
                        ? 'w-8 bg-primary' 
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="overflow-hidden">
          <Swiper
            className="special-events-swiper"
            spaceBetween={20}
            slidesPerView={4}
            breakpoints={{
              0: { slidesPerView: 1.5, spaceBetween: 12 },
              640: { slidesPerView: 2, spaceBetween: 16 },
              768: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 20 },
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          >
            {specialEvents.map((event) => {
              // Ưu tiên chọn ảnh poster dọc cho khu special
              const imageFiles = event.files?.filter((f) => f.type === 0) ?? [];
              const portraitFile = imageFiles.find(
                (f) =>
                  f.width &&
                  f.height &&
                  f.height >= f.width
              );
              const bannerFile = portraitFile || imageFiles[0];
              const bannerUrl =
                bannerFile?.thumbUrl || bannerFile?.originUrl || event.imageUrl;

              return (
                <SwiperSlide key={event.id} className="!h-auto">
                  <Link
                    to={`/event/${event.id}`}
                    className="block cursor-pointer group"
                  >
                    {/* Khung poster tỉ lệ dọc */}
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-black 
                      shadow-md group-hover:shadow-xl group-hover:shadow-primary/15
                      transition-all duration-300">
                      <img
                        src={bannerUrl}
                        alt={event.title}
                        className="absolute inset-0 w-full h-full object-cover 
                          transition-transform duration-500 group-hover:scale-110"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
                        opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                      
                      {/* Content Overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <span className="text-xs font-medium text-primary bg-white/90 px-2 py-1 rounded">
                          {event.category}
                        </span>
                        <h4 className="text-white font-semibold text-sm mt-2 line-clamp-2">
                          {event.title}
                        </h4>
                        <p className="text-white/70 text-xs mt-1">
                          {formatDate(event.date)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
          </div>
        </div>
      )}
    </div>
  );
}
