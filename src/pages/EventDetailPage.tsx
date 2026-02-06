import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { eventService, type Event, type EventFile } from "@/features/concerts/services/eventService";
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

  useEffect(() => {
    (async () => {
      if (!id) return;
      const data = await eventService.getById(id);
      setEvent(data);

      const videoFile = data.files?.find(
        (f) => f.type === 1 || (f.originUrl && getYouTubeId(f.originUrl))
      );
      const ytId = getYouTubeId(videoFile?.originUrl);
      setVideoId(ytId);

      const imageFile = data.files?.find((f) => f.type === 0 && !isVideo(f));
      if (imageFile?.originUrl) setHeroImage(imageFile.originUrl);
      else if (ytId) setHeroImage(getYouTubeThumbnail(ytId));

      setLoading(false);
    })();
  }, [id]);

  if (loading)
    return (
      <div className="container py-10">
        <Skeleton className="h-[420px] w-full rounded-3xl" />
      </div>
    );

  if (!event)
    return <div className="py-20 text-center text-white">Không tìm thấy sự kiện</div>;

  const firstShowing = event.showings?.[0];
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
    <div className="min-h-screen bg-[#05010a] text-slate-100">
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

              {/* IMAGE GALLERY */}
              {introImages.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {introImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.originUrl}
                      alt={`intro-${idx}`}
                      className="w-full h-[220px] object-cover rounded-xl border border-pink-500/20"
                    />
                  ))}
                </div>
              )}

              {/* DESCRIPTION */}
              <div
                className="
                  text-slate-300 leading-relaxed text-[15px]
                  [&_img]:rounded-xl
                  [&_img]:my-4
                  [&_img]:border
                  [&_img]:border-pink-500/20
                  [&_img]:max-w-full
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
                onClick={() => {
                  if (event.showings?.length === 1)
                    navigate(`/booking/${event.id}?showingId=${event.showings[0].id}`);
                  else setShowingModalOpen(true);
                }}
              >
                Đặt vé ngay
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
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
              return (
                <div
                  key={s.id}
                  onClick={() => {
                    setShowingModalOpen(false);
                    navigate(`/booking/${event.id}?showingId=${s.id}`);
                  }}
                  className="cursor-pointer rounded-xl border border-pink-500/20 hover:border-pink-400 bg-[#12061f] px-4 py-3"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white">{time}</p>
                      <p className="text-sm text-slate-400">{date}</p>
                    </div>
                    <FontAwesomeIcon icon={faTicketAlt} className="text-pink-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
