import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { Link } from "react-router-dom";
import type { EventProps } from "@/features/concerts/components/EventCard";

interface Props {
  events: EventProps[];
}

export default function EventSlider({ events }: Props) {
  const sorted = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const newestEvents = sorted.slice(0, 2);

  // Luôn hiển thị "Sự kiện đặc sắc" dù có ít event,
  // nhưng tối đa 4 sự kiện trong slider.
  const specialEvents =
    sorted.length <= 2 ? sorted : sorted.slice(2, 6);

  return (
    <div className="space-y-10">
      {/* ===== EVENT MỚI NHẤT ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {newestEvents.map((event) => {
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
              : true; // fallback
          
          return (
            
            <div
              key={event.id}
              className={`
          relative rounded-2xl overflow-hidden bg-black
          ${isHorizontal ? "aspect-video" : "aspect-[3/4]"}
        `}
            >
              {/* BLUR BACKGROUND */}
              <img
                src={bannerUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-60"
              />

              {/* MAIN IMAGE */}
              <img
                src={bannerUrl}
                alt={event.title}
                className={`
            absolute inset-0 w-full h-full
            ${isHorizontal ? "object-cover" : "object-contain"}
          `}
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              {/* CONTENT */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h4 className="text-white font-semibold text-lg line-clamp-2">
                  {event.title}
                </h4>

                <Link
                  to={`/event/${event.id}`}
                  className="mt-3 inline-block w-fit px-4 py-2 text-sm bg-white text-black rounded-full hover:opacity-90 transition"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          );
        })}
      </div>



      {/* ===== SPECIAL EVENTS SLIDER (CLICK CẢ POSTER) ===== */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">
          Sự kiện đặc sắc
        </h3>

        <Swiper
          spaceBetween={20}
          slidesPerView={4}
          breakpoints={{
            0: { slidesPerView: 1.5 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
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
              <SwiperSlide key={event.id}>
                <Link
                  to={`/event/${event.id}`}
                  className="block cursor-pointer group"
                >
                  {/* Khung poster tỉ lệ dọc */}
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-black">
                    <img
                      src={bannerUrl}
                      alt={event.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}
