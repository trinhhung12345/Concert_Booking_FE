import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons"; // Dùng icon lịch rỗng cho thanh thoát
import { Badge } from "@/components/ui/badge"; // Dùng badge của Shadcn nếu cần tag

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
      className="group block h-full w-full min-w-0 max-w-xs md:max-w-sm lg:max-w-md"
    >
      <div
        className="
          relative h-full flex flex-col
          bg-white rounded-2xl overflow-hidden
          border border-gray-100
          transition-all duration-300 ease-in-out
          hover:shadow-lg hover:-translate-y-1
          min-h-[180px] md:min-h-[200px]"
      >
        {/* 1. IMAGE SECTION */}
        <div className={`relative ${aspect === '16/9' ? 'aspect-[16/9]' : 'aspect-[3/2]'} overflow-hidden`}>
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                // Nếu ảnh lỗi thì thay bằng ảnh này
                e.currentTarget.src = "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=800&auto=format&fit=crop";
              }}
            />

            {/* Overlay nhẹ khi hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

            {/* Category Tag (Optional) */}
            {category && (
              <Badge className="absolute top-3 left-3 bg-white/90 text-secondary backdrop-blur-sm hover:bg-white shadow-sm">
                {category}
              </Badge>
            )}
        </div>

        {/* 2. CONTENT SECTION */}
        <div className="p-4 flex flex-col flex-1 gap-3">

          {/* Title */}
          <h3 className="
            text-lg font-bold text-gray-900 uppercase leading-snug
            line-clamp-2
            group-hover:text-primary transition-colors
          ">
            {title}
          </h3>

          <div className="mt-auto space-y-2">
             {/* Price */}
             <div className="flex items-baseline gap-1">
                <span className="text-sm text-gray-500 font-medium">Từ</span>
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(minPrice)}
                </span>
             </div>

             {/* Date */}
             <div className="flex items-center gap-2 text-gray-500 text-sm font-medium border-t border-gray-100 pt-3">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                <span>{formatDate(date)}</span>
             </div>
          </div>

        </div>
      </div>
    </Link>
  );
}
