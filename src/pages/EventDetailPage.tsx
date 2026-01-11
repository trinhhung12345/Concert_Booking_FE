import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { eventService, type Event, type EventFile } from "@/features/concerts/services/eventService";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import ReactPlayer from 'react-player';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faCalendarAlt,
  faClock,
  faTicketAlt,
  faChevronLeft,
  faPlay
} from "@fortawesome/free-solid-svg-icons";

// Hàm format tiền và ngày (tái sử dụng)
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("vi-VN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const formatTime = (dateString: string) =>
  new Date(dateString).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });

// Cập nhật hàm check video: Chấp nhận type=2 HOẶC link youtube
const isVideo = (file: EventFile) => {
  // Check type từ backend trả về
  if (file.type === 2) return true;

  // Check đường dẫn nếu backend chưa cập nhật type
  const url = (file.originUrl || file.thumbUrl || "").toLowerCase();
  return url.includes("youtube.com") || url.includes("youtu.be") || url.match(/\.(mp4|webm|ogg|mov)$/i);
};

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  // State lưu trữ media đã lọc
  const [heroVideo, setHeroVideo] = useState<EventFile | null>(null);
  const [heroImage, setHeroImage] = useState<string>("");

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        if (id) {
          const data = await eventService.getById(id);
          setEvent(data);

          // LOGIC XỬ Lý FRONTEND: Tách Video và Ảnh
          if (data.files && data.files.length > 0) {
            // 1. Tìm file Video
            const foundVideo = data.files.find(f => isVideo(f));
            setHeroVideo(foundVideo || null);

            // 2. Tìm file Ảnh (ưu tiên cái không phải video)
            const foundImage = data.files.find(f => !isVideo(f));
            // Nếu không có ảnh riêng thì dùng luôn thumbUrl của video hoặc ảnh placeholder
            setHeroImage(foundImage?.thumbUrl || foundVideo?.thumbUrl || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4");
          }
        }
      } catch (error) {
        console.error("Lỗi lấy chi tiết sự kiện:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetail();
  }, [id]);

  if (loading) return <div className="container py-10"><Skeleton className="h-[400px] w-full rounded-3xl" /></div>;
  if (!event) return <div className="text-center py-20">Không tìm thấy sự kiện</div>;

  // Lấy dữ liệu hiển thị an toàn
  const showing = event.showings?.[0]; // Lấy suất diễn đầu tiên
  const startTime = showing?.startTime || new Date().toISOString();

  // Tính khoảng giá
  const prices = showing?.types?.map(t => t.price) || [0];
  const minPrice = Math.min(...prices);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* 1. HERO BANNER (VIDEO HOẶC ẢNH) */}
      <div className="relative h-[400px] md:h-[550px] bg-gray-900 overflow-hidden group">

        {/* LỚP MEDIA NỀN */}
        {heroVideo && heroVideo.originUrl ? (
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                {/* pointer-events-none: Để user không click pause video được, giữ nó làm nền */}

                {/* SỬ DỤNG REACT PLAYER */}
                <ReactPlayer
                    src={heroVideo.originUrl} // Link YouTube hoặc MP4 đều chạy được
                    width="100%"
                    height="100%"
                    playing={true} // Tự động chạy
                    loop={true}    // Lặp lại
                    muted={true}   // Tắt tiếng (Bắt buộc để Autoplay chạy trên Chrome/Safari)
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        objectFit: 'cover'
                    }}
                />

                {/* Lớp phủ đen làm tối video để chữ trắng nổi bật */}
                <div className="absolute inset-0 bg-black/50 z-10" />
            </div>
        ) : (
            // TRƯỜNG HỢP CHỈ CÓ ẢNH
            <>
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 blur-xl scale-110"
                    style={{ backgroundImage: `url(${heroImage})` }}
                />
                <div
                    className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-100 z-0"
                    style={{ backgroundImage: `url(${heroImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
            </>
        )}

        <div className="container relative h-full flex flex-col justify-end pb-10 px-4 mx-auto z-10">
            <Link to="/" className="absolute top-8 left-4 md:left-0 text-white hover:text-primary flex items-center gap-2 transition-colors">
                <FontAwesomeIcon icon={faChevronLeft} /> Quay lại
            </Link>

            <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-primary text-white border-none px-3 py-1 text-sm shadow-lg shadow-primary/20">
                    {event.categoryName}
                </Badge>
                {heroVideo && (
                     <Badge variant="outline" className="text-white border-white/50 backdrop-blur-md gap-1">
                         <FontAwesomeIcon icon={faPlay} className="text-[10px]" /> Trailer
                     </Badge>
                )}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight shadow-sm">
                {event.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-200 text-sm md:text-base">
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-primary" />
                    <span>{formatDate(startTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary" />
                    <span>{event.venue} - {event.address}</span>
                </div>
            </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT (2 Columns) */}
      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* CỘT TRÁI: THÔNG TIN CHI TIẾT (70%) */}
            <div className="lg:col-span-2 space-y-8">

                {/* Giới thiệu */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Giới thiệu sự kiện</h2>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {event.description}
                    </p>

                    {/* Gallery ảnh (loại bỏ video) */}
                    {event.files && event.files.length > 0 && (
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            {event.files
                                .filter(f => !isVideo(f)) // Chỉ hiện ảnh ở đây
                                .map((file) => (
                                    <img
                                        key={file.id}
                                        src={file.originUrl || file.thumbUrl}
                                        alt="Gallery"
                                        className="rounded-xl object-cover h-48 w-full border border-gray-100"
                                    />
                            ))}
                        </div>
                    )}
                </div>

                {/* Danh sách loại vé (Ticket Types) */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <FontAwesomeIcon icon={faTicketAlt} className="text-primary" />
                        Thông tin vé
                    </h2>

                    <div className="space-y-4">
                        {showing?.types?.map((ticket) => (
                            <div key={ticket.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-pink-50/30 transition-all bg-gray-50">
                                <div className="flex items-start gap-4 mb-2 sm:mb-0">
                                    {/* Dấu chấm màu vé */}
                                    <div
                                        className="w-3 h-3 rounded-full mt-2 shadow-sm"
                                        style={{ backgroundColor: ticket.color || '#FF0082' }}
                                    />
                                    <div>
                                        <h4 className="font-bold text-lg text-gray-800">{ticket.name}</h4>
                                        <p className="text-sm text-gray-500 line-clamp-1">{ticket.description}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-xl text-primary">{formatCurrency(ticket.price)}</div>
                                    {ticket.originalPrice > ticket.price && (
                                        <div className="text-xs text-gray-400 line-through">
                                            {formatCurrency(ticket.originalPrice)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CỘT PHẢI: BOOKING CARD (Sticky) (30%) */}
            <div className="lg:col-span-1">
                <div className="sticky top-24 bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
                    <div className="text-center mb-6">
                        <p className="text-gray-500 text-sm mb-1">Giá vé từ</p>
                        <div className="text-3xl font-bold text-primary">
                            {formatCurrency(minPrice)}
                        </div>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                            <FontAwesomeIcon icon={faClock} className="text-primary" />
                            <div>
                                <p className="text-xs text-gray-400">Thời gian bắt đầu</p>
                                <p className="font-medium text-sm">{formatTime(startTime)} - {formatDate(startTime)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                             <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary" />
                             <div>
                                <p className="text-xs text-gray-400">Địa điểm</p>
                                <p className="font-medium text-sm line-clamp-1">{event.venue}</p>
                            </div>
                        </div>
                    </div>

                    <Button className="w-full h-12 text-lg font-bold rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 animate-in fade-in zoom-in duration-300">
                        Đặt vé ngay
                    </Button>

                    <p className="text-xs text-center text-gray-400 mt-4">
                        * Vé đã mua không được hoàn trả. Vui lòng kiểm tra kỹ thông tin.
                    </p>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
