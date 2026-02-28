import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons"; // Dùng icon lịch rỗng cho thanh thoát
import { Badge } from "@/components/ui/badge"; // Dùng badge của Shadcn nếu cần tag
import type { EventFile } from "@/features/concerts/services/eventService";

// Interface cho props (dữ liệu đầu vào)
export interface EventProps {
  id: number;
  title: string;
  imageUrl: string;
  minPrice: number;
  date: string; // ISO String (2026-01-25)
  category?: string;
  large?: boolean;
  aspect?: '3/2' | '16/9';
  imageWidth?: number;
  imageHeight?: number;
  files?: EventFile[]; // toàn bộ files thuộc về event
}

// Hàm format tiền tệ VNĐ
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Hàm format ngày tháng (dd/MM/yyyy)
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function EventCard({ id, title, imageUrl, minPrice, date, category, aspect = '3/2' }: EventProps) {
  return (
    <Link
      to={`/event/${id}`}
      className="group block h-full w-full min-w-0"
    >
      <div
        className="
          relative h-full flex flex-col
          bg-card rounded-2xl overflow-hidden
          border border-border
          transition-all duration-300 ease-in-out
          hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1
          hover:border-primary/20
          min-h-[180px] md:min-h-[200px]"
      >
        {/* 1. IMAGE SECTION */}
        <div className={`relative ${aspect === '16/9' ? 'aspect-[16/9]' : 'aspect-[3/2]'} overflow-hidden`}>
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=800&auto=format&fit=crop";
              }}
            />

            {/* Overlay nhẹ khi hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent 
              opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Category Tag (Optional) */}
            {category && (
              <Badge className="absolute top-3 left-3 bg-background/90 text-foreground backdrop-blur-sm hover:bg-background shadow-sm border-none">
                {category}
              </Badge>
            )}
        </div>

        {/* 2. CONTENT SECTION */}
        <div className="p-4 flex flex-col flex-1 gap-3">

          {/* Title */}
          <h3 className="
            text-lg font-bold text-foreground uppercase leading-snug
            line-clamp-2
            group-hover:text-primary transition-colors
          ">
            {title}
          </h3>

          <div className="mt-auto space-y-2">
             {/* Price */}
             <div className="flex items-baseline gap-1">
                <span className="text-sm text-muted-foreground font-medium">Từ</span>
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(minPrice)}
                </span>
             </div>

             {/* Date */}
             <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium border-t border-border/50 pt-3">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-primary/70" />
                <span>{formatDate(date)}</span>
             </div>
          </div>

        </div>
      </div>
    </Link>
  );
}
