import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { eventService, type Event, type EventFile } from "@/features/concerts/services/eventService";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import YouTube from 'react-youtube';
import type { YouTubeProps } from 'react-youtube';
import { getYouTubeId, getYouTubeThumbnail } from "@/lib/utils";
import EventSchedule from "@/features/concerts/components/EventSchedule";
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

// Cập nhật hàm check video: Chấp nhận type=1 (video từ backend) HOẶC link youtube
const isVideo = (file: EventFile) => {
  // Check type từ backend trả về (type=1 là video)
  if (file.type === 1) return true;

  // Check đường dẫn nếu backend chưa cập nhật type
  const url = (file.originUrl || file.thumbUrl || "").toLowerCase();
  return url.includes("youtube.com") || url.includes("youtu.be") || url.match(/\.(mp4|webm|ogg|mov)$/i);
};

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const [videoId, setVideoId] = useState<string | null>(null); // Lưu ID sạch
  const [heroImage, setHeroImage] = useState<string>("");

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        if (id) {
          const data = await eventService.getById(id);
          setEvent(data);

          if (data.files && data.files.length > 0) {
            // DEBUG: Log tất cả files để xem dữ liệu từ API
            console.log("🎯 All event files:", data.files);

            // 1. TÌM VIDEO & EXTRACT ID
            // Ưu tiên file có type=1 (video) hoặc link chứa youtube
            const foundVideoFile = data.files.find(f =>
                f.type === 1 ||
                (f.originUrl && (f.originUrl.includes("youtube") || f.originUrl.includes("youtu.be")))
            );

            console.log("🎥 Found video file:", foundVideoFile);
            console.log("🎥 Video originUrl:", foundVideoFile?.originUrl);
            console.log("🎥 Video thumbUrl:", foundVideoFile?.thumbUrl);

            // Bóc tách ID
            const extractedId = getYouTubeId(foundVideoFile?.originUrl);
            console.log("🔍 Extracted YouTube ID:", extractedId);

            setVideoId(extractedId);

            // 2. TÌM ẢNH BÌA (HERO IMAGE)
            // Tìm ảnh thường (không phải video - type=0 hoặc không có youtube link)
            const foundImageFile = data.files.find(f => f.type === 0 || (f.type !== 1 && !getYouTubeId(f.originUrl)));

            let finalImage = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4"; // Ảnh mặc định

            if (foundImageFile) {
                // Nếu có ảnh thật -> dùng luôn
                finalImage = foundImageFile.originUrl || foundImageFile.thumbUrl;
                console.log("🖼️ Using image file:", foundImageFile);
            } else if (extractedId) {
                // Nếu không có ảnh nhưng có video -> Lấy thumbnail chuẩn từ YouTube ID
                finalImage = getYouTubeThumbnail(extractedId);
                console.log("🖼️ Using YouTube thumbnail:", finalImage);
            }

            console.log("🎨 Final hero image:", finalImage);
            setHeroImage(finalImage);
          }
        }
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetail();
  }, [id]);

  if (loading) return <div className="container py-10"><Skeleton className="h-[400px] w-full rounded-3xl" /></div>;
  if (!event) return <div className="text-center py-20">Không tìm thấy sự kiện</div>;

  // Lấy dữ liệu hiển thị an toàn từ showing đầu tiên (cho mục đích hiển thị header)
  const firstShowing = event.showings?.[0]; // Lấy suất diễn đầu tiên
  const startTime = firstShowing?.startTime || new Date().toISOString();

  // Tính khoảng giá từ tất cả showings (cho mục đích hiển thị ở booking card)
  const allTicketPrices = event.showings?.flatMap(s => s.types?.map(t => t.price) || []) || [0];
  const minPrice = Math.min(...allTicketPrices);

  // Cấu hình cho React Youtube Player
  const videoOptions: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,      // Tự chạy
      controls: 0,      // Ẩn điều khiển
      rel: 0,           // Không gợi ý video linh tinh
      showinfo: 0,      // Ẩn tiêu đề
      mute: 1,          // Tắt tiếng (để autoplay được)
      loop: 1,          // Lặp lại
      playlist: videoId || '', // Cần thiết để loop hoạt động trên iframe youtube
      origin: window.location.origin, // Thêm origin để YouTube chấp nhận request từ mọi domain/IP
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* 1. HERO BANNER (VIDEO HOẶC ẢNH) */}
      <div className="relative h-[400px] md:h-[550px] bg-gray-900 overflow-hidden group">

        {/* LỚP MEDIA NỀN */}
        {(() => {
            // DEBUG: Log final videoId trước khi render YouTube
            console.log("🎬 Rendering YouTube with videoId:", videoId);
            return videoId ? (
                // TRƯỜNG HỢP CÓ YOUTUBE ID HỢP LỆ
                <div className="absolute inset-0 w-full h-full pointer-events-none scale-125">
                    {/* scale-125 để zoom video lên một chút, che đi viền đen nếu có */}
                    <YouTube
                        videoId={videoId}
                        opts={videoOptions}
                        className="w-full h-full absolute top-0 left-0"
                        iframeClassName="w-full h-full object-cover"
                        // host="https://www.youtube-nocookie.com"
                    />
                    {/* Lớp phủ đen */}
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
            );
        })()}

        <div className="container relative h-full flex flex-col justify-end pb-10 px-4 mx-auto z-10">
            <Link to="/" className="absolute top-8 left-4 md:left-0 text-white hover:text-primary flex items-center gap-2 transition-colors">
                <FontAwesomeIcon icon={faChevronLeft} /> Quay lại
            </Link>

            <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-primary text-white border-none px-3 py-1 text-sm shadow-lg shadow-primary/20">
                    {event.categoryName}
                </Badge>
                {videoId && (
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

                {/* LỊCH DIỄN & VÉ */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-primary" />
                        Lịch diễn & Giá vé
                    </h2>

                    {/* Gọi component EventSchedule, truyền ID sự kiện vào */}
                    {event && <EventSchedule eventId={event.id} />}
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
