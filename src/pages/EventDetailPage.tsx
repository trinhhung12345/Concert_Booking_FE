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
  faShareAlt,
} from "@fortawesome/free-solid-svg-icons";

const decodeHtmlEntities = (text: string) => {
  if (!text) return "";
  const t = document.createElement("textarea");
  t.innerHTML = text;
  return t.value;
};

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n);

const formatTime = (d: string) =>
  new Date(d).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });

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
        if (response?.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
          data = response.data;
        } else {
          data = response;
        }
        
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
      <div className="container py-10 space-y-6">
        <Skeleton className="h-[280px] sm:h-[360px] lg:h-[420px] w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-8 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );

  if (!event)
    return (
      <div className="py-20 text-center text-foreground">
        <FontAwesomeIcon icon={faTicketAlt} className="text-5xl text-muted-foreground mb-4" />
        <p className="text-lg">Không tìm thấy sự kiện</p>
      </div>
    );

  const firstShowing = event.showings?.[0];
  const hasSalableShowing = event.showings?.some((s) => s.isSalable !== false) ?? false;
  const isSingleShowingLocked =
    (event.showings?.length ?? 0) === 1 && firstShowing?.isSalable === false;
  const startTime = firstShowing?.startTime || new Date().toISOString();
  const prices =
    event.showings?.flatMap((s) => s.types?.map((t) => t.price) || []) || [0];
  const minPrice = Math.min(...prices);

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

  const handleBooking = () => {
    if (event.showings?.length === 1) {
      if (event.showings[0].isSalable === false) return;
      navigate(`/booking/${event.id}?showingId=${event.showings[0].id}`);
      return;
    }
    setShowingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* HERO - Responsive height */}
      <div className="relative h-[280px] sm:h-[360px] md:h-[420px] lg:h-[480px] overflow-hidden bg-black">
        {videoId ? (
          <div className="absolute inset-0 scale-125">
            <YouTube videoId={videoId} opts={videoOpts} className="w-full h-full" />
            <div className="absolute inset-0 bg-black/60" />
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          </>
        )}

        {/* Hero content overlay */}
        <div className="container relative z-10 h-full flex flex-col justify-between py-4 sm:py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white bg-black/30 backdrop-blur-sm px-3 py-2 rounded-full w-fit text-sm transition-colors"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-xs" /> Quay lại
          </Link>

          {/* Event title on hero - visible on mobile */}
          <div className="lg:hidden">
            <h1 className="text-white font-bold text-xl sm:text-2xl line-clamp-2 mb-2">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-white/80 text-sm">
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-primary" />
                {formatDate(startTime)}
              </span>
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary" />
                {event.venue}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container mx-auto px-4 -mt-8 sm:-mt-12 lg:-mt-16 relative z-20 pb-28 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* LEFT - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Title Card - Desktop */}
            <div className="hidden lg:block rounded-2xl bg-card border border-border p-6 sm:p-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-primary" />
                  {formatDate(startTime)}
                </span>
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="text-primary" />
                  {formatTime(startTime)}
                </span>
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary" />
                  {event.venue}
                </span>
              </div>
            </div>

            {/* GIỚI THIỆU */}
            <div className="rounded-2xl bg-card border border-border p-5 sm:p-8">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-foreground">
                Giới thiệu sự kiện
              </h2>

              <div
                className="
                  text-muted-foreground leading-relaxed text-[14px] sm:text-[15px]
                  break-words whitespace-pre-wrap overflow-hidden
                  [&_img]:rounded-xl [&_img]:my-4 [&_img]:border [&_img]:border-border [&_img]:max-w-full [&_img]:h-auto
                  [&_table]:max-w-full [&_table]:block [&_table]:overflow-x-auto
                  [&_iframe]:max-w-full
                "
              >
                {parse(
                  DOMPurify.sanitize(
                    decodeHtmlEntities(event.description || ""),
                    { FORBID_ATTR: ["style", "bgcolor"] }
                  )
                )}
              </div>

              {/* IMAGE GALLERY */}
              {introImages.length > 0 && (
                <div className="mt-6 sm:mt-8">
                  <h3 className="text-base sm:text-lg font-semibold mb-4 text-foreground">
                    Hình ảnh
                  </h3>
                  
                  <div className="relative">
                    <div 
                      className="relative aspect-video rounded-xl overflow-hidden border border-border bg-black/50 cursor-pointer"
                      onClick={() => setSelectedImage(introImages[currentSlide]?.originUrl || null)}
                    >
                      <img
                        src={introImages[currentSlide]?.originUrl}
                        alt={`gallery-${currentSlide}`}
                        className="w-full h-full object-contain"
                      />
                      
                      {introImages.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentSlide((prev) => (prev === 0 ? introImages.length - 1 : prev - 1));
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-primary text-white flex items-center justify-center transition-colors"
                          >
                            <FontAwesomeIcon icon={faChevronLeft} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentSlide((prev) => (prev === introImages.length - 1 ? 0 : prev + 1));
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-primary text-white flex items-center justify-center transition-colors"
                          >
                            <FontAwesomeIcon icon={faChevronRight} />
                          </button>
                        </>
                      )}
                      
                      <div className="absolute bottom-2 right-2 px-3 py-1 rounded-full bg-black/60 text-white text-xs sm:text-sm">
                        {currentSlide + 1} / {introImages.length}
                      </div>
                    </div>

                    {introImages.length > 1 && (
                      <div className="flex gap-2 mt-3 overflow-x-auto pb-2 no-scrollbar">
                        {introImages.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`flex-shrink-0 w-16 h-11 sm:w-20 sm:h-14 rounded-lg overflow-hidden border-2 transition-all ${
                              idx === currentSlide
                                ? "border-primary opacity-100"
                                : "border-border opacity-60 hover:opacity-100"
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
            <div className="rounded-2xl bg-card border border-border p-5 sm:p-8">
              <h2 className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-foreground mb-6">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-primary" />
                Lịch diễn & Giá vé
              </h2>

              <div
                className="rounded-xl bg-muted p-3 sm:p-4
                [&_*]:bg-card
                [&_*]:border-border
                [&_*]:text-foreground
                [&_button]:bg-primary
                [&_button]:text-primary-foreground"
              >
                <EventSchedule eventId={event.id} />
              </div>
            </div>
          </div>

          {/* RIGHT - Desktop sticky sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-card border border-border p-6">
              <p className="text-center text-xs text-muted-foreground mb-1 uppercase tracking-wider">Giá vé từ</p>
              <p className="text-center text-3xl font-bold text-primary mb-6">
                {formatCurrency(minPrice)}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 rounded-xl bg-muted px-4 py-3">
                  <FontAwesomeIcon icon={faClock} className="text-primary" />
                  <span className="text-sm">{formatTime(startTime)}</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-muted px-4 py-3">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-primary" />
                  <span className="text-sm">{formatDate(startTime)}</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-muted px-4 py-3">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary" />
                  <span className="text-sm truncate">{event.venue}</span>
                </div>
              </div>

              <Button
                className="w-full h-12 rounded-xl font-semibold text-base"
                disabled={!hasSalableShowing || isSingleShowingLocked}
                onClick={handleBooking}
              >
                {!hasSalableShowing || isSingleShowingLocked
                  ? "Suất diễn đã hết vé"
                  : "Đặt vé ngay"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM BAR - Fixed booking bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Giá vé từ</p>
            <p className="text-xl font-bold text-primary">{formatCurrency(minPrice)}</p>
          </div>
          <Button
            className="h-11 px-6 rounded-xl font-semibold"
            disabled={!hasSalableShowing || isSingleShowingLocked}
            onClick={handleBooking}
          >
            {!hasSalableShowing || isSingleShowingLocked
              ? "Hết vé"
              : "Đặt vé ngay"}
          </Button>
        </div>
      </div>

      {/* MODAL - Chọn suất diễn */}
      <Dialog open={showingModalOpen} onOpenChange={setShowingModalOpen}>
        <DialogContent className="bg-card border border-border text-foreground max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Chọn suất diễn</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Vui lòng chọn suất diễn bạn muốn tham gia
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
                    if (isShowingLocked) return;
                    setShowingModalOpen(false);
                    navigate(`/booking/${event.id}?showingId=${s.id}`);
                  }}
                  className={`rounded-xl border px-4 py-3 transition-all ${
                    isShowingLocked
                      ? "cursor-not-allowed border-border bg-muted/60 opacity-60"
                      : "cursor-pointer border-border hover:border-primary hover:shadow-sm bg-muted"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-foreground">{time}</p>
                      <p className="text-sm text-muted-foreground">{date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isShowingLocked && (
                        <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-destructive">
                          Hết vé
                        </span>
                      )}
                      <FontAwesomeIcon icon={faTicketAlt} className="text-primary" />
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
        <DialogContent className="bg-transparent border-0 p-0 max-w-[95vw] sm:max-w-[90vw] max-h-[90vh] overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-primary text-white flex items-center justify-center transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>

            {introImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newIndex = currentSlide === 0 ? introImages.length - 1 : currentSlide - 1;
                    setCurrentSlide(newIndex);
                    setSelectedImage(introImages[newIndex]?.originUrl || null);
                  }}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-primary text-white flex items-center justify-center transition-colors"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newIndex = currentSlide === introImages.length - 1 ? 0 : currentSlide + 1;
                    setCurrentSlide(newIndex);
                    setSelectedImage(introImages[newIndex]?.originUrl || null);
                  }}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-primary text-white flex items-center justify-center transition-colors"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </>
            )}

            {selectedImage && (
              <img
                src={selectedImage}
                alt={`fullscreen-${currentSlide}`}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
            )}

            <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 text-white text-sm">
              {currentSlide + 1} / {introImages.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}