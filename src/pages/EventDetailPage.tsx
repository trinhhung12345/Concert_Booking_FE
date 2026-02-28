import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { eventService, EVENT_STATUS, type Event, type EventFile } from "@/features/concerts/services/eventService";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import YouTube from "react-youtube";
import type { YouTubeProps } from "react-youtube";
import { getYouTubeId, getYouTubeThumbnail } from "@/lib/utils";
import EventSchedule from "@/features/concerts/components/EventSchedule";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faCalendarAlt,
  faClock,
  faTicketAlt,
  faChevronLeft,
  faChevronRight,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const decodeHtmlEntities = (text: string) => {
  if (!text) return "";
  const t = document.createElement("textarea");
  t.innerHTML = text;
  return t.value;
};

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

const formatTime = (d: string) =>
  new Date(d).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

const formatScheduleShort = (start: string, end: string) => {
  const s = new Date(start);
  return {
    time: `${formatTime(start)} - ${formatTime(end)}`,
    date: s.toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  };
};

const isVideo = (f: EventFile) => {
  if (f.type === 1) return true;
  const u = (f.originUrl || f.thumbUrl || "").toLowerCase();
  return u.includes("youtube") || u.includes("youtu.be");
};

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [heroImage, setHeroImage] = useState("");
  const [showingModalOpen, setShowingModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        const response: any = await eventService.getById(id);
        
        let data: Event;
        // Handle wrapped response { code: 200, data: {...}, message: "..." }
        if (response?.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
          data = response.data;
        } else {
          // Handle direct response {...}
          data = response;
        }
        
        // Block access to non-approved or deleted events
        if (data.status !== EVENT_STATUS.APPROVED || data.deleted === true) {
          setEvent(null);
          setLoading(false);
          return;
        }

        setEvent(data);

        if (data) {
          const videoFile = data.files?.find(
            (f) => f.type === 1 || (f.originUrl && getYouTubeId(f.originUrl))
          );
          const ytId = getYouTubeId(videoFile?.originUrl);
          setVideoId(ytId);

          const imageFile = data.files?.find((f) => f.type === 0 && !isVideo(f));
          if (imageFile?.originUrl) setHeroImage(imageFile.originUrl);
          else if (ytId) setHeroImage(getYouTubeThumbnail(ytId));
        }
      } catch (error) {
        console.error("Failed to fetch event details:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading)
    return (
      <div className="container py-10">
        <Skeleton className="h-[420px] w-full rounded-3xl" />
      </div>
    );

  if (!event)
    return <div className="py-20 text-center text-foreground">Không tìm thấy sự kiện</div>;

  const firstShowing = event.showings?.[0];
  const hasSalableShowing = event.showings?.some((s) => s.isSalable !== false) ?? false;
  const isSingleShowingLocked =
    (event.showings?.length ?? 0) === 1 && firstShowing?.isSalable === false;
  const startTime = firstShowing?.startTime || new Date().toISOString();
  const prices =
    event.showings?.flatMap((s) => s.types?.map((t) => t.price) || []) || [0];
  const minPrice = Math.min(...prices);

  // ✅ ẢNH GIỚI THIỆU
  const introImages =
    event.files?.filter((f) => f.type === 0 && !isVideo(f)) || [];

  const videoOpts: YouTubeProps["opts"] = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      mute: 1,
      controls: 0,
      rel: 0,
      loop: 1,
      playlist: videoId || "",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <div className="relative h-[420px] md:h-[520px] overflow-hidden bg-black">
        {videoId ? (
          <div className="absolute inset-0 scale-125">
            <YouTube videoId={videoId} opts={videoOpts} className="w-full h-full" />
            <div className="absolute inset-0 bg-black/70" />
          </div>
        ) : (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center blur-xl scale-110 opacity-40"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            <div
              className="absolute inset-0 bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            <div className="absolute inset-0 bg-black/70" />
          </>
        )}

        <div className="container relative z-10 h-full flex flex-col justify-end pb-10">
          <Link
            to="/"
            className="absolute top-8 left-4 flex items-center gap-2 text-slate-300 hover:text-pink-400"
          >
            <FontAwesomeIcon icon={faChevronLeft} /> Quay lại
          </Link>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">
            {/* GIỚI THIỆU */}
            <div className="rounded-2xl bg-[#0d0616] border border-pink-500/10 p-8">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Giới thiệu sự kiện
              </h2>

              {/* DESCRIPTION */}
              <div
                className="
    text-slate-300 leading-relaxed text-[15px]

    break-words
    whitespace-pre-wrap
    overflow-hidden

    [&_img]:rounded-xl
    [&_img]:my-4
    [&_img]:border
    [&_img]:border-pink-500/20
    [&_img]:max-w-full
    [&_img]:h-auto

    [&_table]:max-w-full
    [&_table]:block
    [&_table]:overflow-x-auto

    [&_iframe]:max-w-full
  "
              >

                {parse(
                  DOMPurify.sanitize(
                    decodeHtmlEntities(event.description || ""),
                    {
                      FORBID_ATTR: ["style", "bgcolor"],
                    }
                  )
                )}

              </div>

              {/* IMAGE GALLERY - CAROUSEL */}
              {introImages.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4 text-white">
                    Hình ảnh
                  </h3>
                  
                  {/* Carousel Container */}
                  <div className="relative">
                    {/* Main Image Display */}
                    <div 
                      className="relative aspect-video rounded-xl overflow-hidden border border-pink-500/20 bg-black/50 cursor-pointer"
                      onClick={() => setSelectedImage(introImages[currentSlide]?.originUrl || null)}
                    >
                      <img
                        src={introImages[currentSlide]?.originUrl}
                        alt={`gallery-${currentSlide}`}
                        className="w-full h-full object-contain"
                      />
                      
                      {/* Navigation Arrows */}
                      {introImages.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentSlide((prev) => (prev === 0 ? introImages.length - 1 : prev - 1));
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-pink-500 text-white flex items-center justify-center transition-colors"
                          >
                            <FontAwesomeIcon icon={faChevronLeft} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentSlide((prev) => (prev === introImages.length - 1 ? 0 : prev + 1));
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-pink-500 text-white flex items-center justify-center transition-colors"
                          >
                            <FontAwesomeIcon icon={faChevronRight} />
                          </button>
                        </>
                      )}
                      
                      {/* Image Counter */}
                      <div className="absolute bottom-2 right-2 px-3 py-1 rounded-full bg-black/60 text-white text-sm">
                        {currentSlide + 1} / {introImages.length}
                      </div>
                    </div>

                    {/* Thumbnail Strip */}
                    {introImages.length > 1 && (
                      <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                        {introImages.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                              idx === currentSlide
                                ? "border-pink-500 opacity-100"
                                : "border-pink-500/20 opacity-60 hover:opacity-100"
                            }`}
                          >
                            <img
                              src={img.originUrl}
                              alt={`thumb-${idx}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* LỊCH DIỄN */}
            <div className="rounded-2xl bg-[#0d0616] border border-pink-500/10 p-8">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-white mb-6">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-pink-400" />
                Lịch diễn & Giá vé
              </h2>

              <div
                className="rounded-xl bg-[#0a0312] p-4
                [&_*]:bg-[#12061f]
                [&_*]:border-pink-500/20
                [&_*]:text-slate-200
                [&_button]:bg-pink-500
                [&_button]:text-white"
              >
                <EventSchedule eventId={event.id} />
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-[#0a0312] border border-pink-500/20 p-6">
              <h3 className="text-center text-lg font-semibold text-pink-400 mb-1">
                {event.title}
              </h3>
              <p className="text-center text-xs text-slate-400 mb-1">Giá vé từ</p>
              <p className="text-center text-3xl font-bold text-pink-500 mb-6">
                {formatCurrency(minPrice)}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 rounded-xl bg-[#12061f] px-4 py-3">
                  <FontAwesomeIcon icon={faClock} className="text-pink-400" />
                  <span className="text-sm">{formatTime(startTime)}</span>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-[#12061f] px-4 py-3">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-pink-400" />
                  <span className="text-sm truncate">{event.venue}</span>
                </div>
              </div>

              <Button
                className="w-full h-12 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-semibold"
                disabled={!hasSalableShowing || isSingleShowingLocked}
                onClick={() => {
                  if (event.showings?.length === 1) {
                    if (event.showings[0].isSalable === false) {
                      return;
                    }
                    navigate(`/booking/${event.id}?showingId=${event.showings[0].id}`);
                    return;
                  }
                  setShowingModalOpen(true);
                }}
              >
                {!hasSalableShowing || isSingleShowingLocked
                  ? "Suất diễn đã hết vé"
                  : "Đặt vé ngay"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL - Chọn suất diễn */}
      <Dialog open={showingModalOpen} onOpenChange={setShowingModalOpen}>
        <DialogContent className="bg-[#0a0312] border border-pink-500/20 text-white">
          <DialogHeader>
            <DialogTitle>Chọn suất diễn</DialogTitle>
            <DialogDescription className="text-slate-400">
              Vui lòng chọn suất diễn
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            {event.showings?.map((s) => {
              const { time, date } = formatScheduleShort(s.startTime, s.endTime);
              const isShowingLocked = s.isSalable === false;
              return (
                <div
                  key={s.id}
                  onClick={() => {
                    if (isShowingLocked) {
                      return;
                    }
                    setShowingModalOpen(false);
                    navigate(`/booking/${event.id}?showingId=${s.id}`);
                  }}
                  className={`rounded-xl border px-4 py-3 ${
                    isShowingLocked
                      ? "cursor-not-allowed border-pink-500/10 bg-[#12061f]/60 opacity-60"
                      : "cursor-pointer border-pink-500/20 hover:border-pink-400 bg-[#12061f]"
                  }`}
                  title={isShowingLocked ? "Suất diễn đã hết vé" : undefined}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white">{time}</p>
                      <p className="text-sm text-slate-400">{date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isShowingLocked && (
                        <span className="rounded bg-black/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-300">
                          Đã hết vé
                        </span>
                      )}
                      <FontAwesomeIcon icon={faTicketAlt} className="text-pink-400" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL - Xem ảnh full-size */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="bg-transparent border-0 p-0 max-w-[90vw] max-h-[90vh] overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/60 hover:bg-pink-500 text-white flex items-center justify-center transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>

            {/* Navigation buttons */}
            {introImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newIndex = currentSlide === 0 ? introImages.length - 1 : currentSlide - 1;
                    setCurrentSlide(newIndex);
                    setSelectedImage(introImages[newIndex]?.originUrl || null);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-black/60 hover:bg-pink-500 text-white flex items-center justify-center transition-colors"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="text-xl" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newIndex = currentSlide === introImages.length - 1 ? 0 : currentSlide + 1;
                    setCurrentSlide(newIndex);
                    setSelectedImage(introImages[newIndex]?.originUrl || null);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-black/60 hover:bg-pink-500 text-white flex items-center justify-center transition-colors"
                >
                  <FontAwesomeIcon icon={faChevronRight} className="text-xl" />
                </button>
              </>
            )}

            {/* Full-size image */}
            {selectedImage && (
              <img
                src={selectedImage}
                alt={`fullscreen-${currentSlide}`}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 text-white text-sm">
              {currentSlide + 1} / {introImages.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
