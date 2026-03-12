import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import SeatMap from "../features/booking/components/SeatMap";
import type { SeatMapData, Seat } from "../features/booking/types/seatmap";
import { bookingService } from "../features/booking/services/bookingService";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowLeft,
  faSpinner,
  faTicketAlt,
  faChevronUp,
  faChevronDown,
  faTimes,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { eventService, type TicketType } from "@/features/concerts/services/eventService";
import { useLanguageStore } from "@/store/useLanguageStore";
import { getLocale } from "@/lib/i18n";

export default function BookingPage() {
  const { language } = useLanguageStore();
  const isVi = language === "vi";
  const locale = getLocale(language);
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [searchParams] = useSearchParams();
  const showingId = searchParams.get("showingId");

  const [mapData, setMapData] = useState<SeatMapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventName, setEventName] = useState<string>("");

  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [noSeatMap, setNoSeatMap] = useState(false);
  const [ticketQuantities, setTicketQuantities] = useState<Record<number, number>>({});
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  // Fetch seat map + ticket types
  useEffect(() => {
    if (!showingId) {
      setError(
        isVi
          ? "Không tìm thấy thông tin suất diễn (Thiếu showingId)."
          : "Cannot find showing information (missing showingId)."
      );
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [seatMaps, types] = await Promise.all([
          bookingService.getSeatMapByShowingIdV1(showingId),
          eventService.getTicketTypesByShowingId(showingId),
        ]);

        if (seatMaps && seatMaps.length > 0) {
          setMapData(seatMaps[0]);
          setNoSeatMap(false);
        } else {
          setMapData(null);
          setNoSeatMap(true);
        }

        setTicketTypes(types || []);
        setTicketQuantities({});
      } catch {
        setError(
          isVi
            ? "Không thể tải dữ liệu suất diễn."
            : "Failed to load showing data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showingId]);

  // Fetch event title
  useEffect(() => {
    if (!eventId) return;

    eventService
      .getById(eventId)
      .then((ev) => setEventName(ev.title))
      .catch(() => {});
  }, [eventId]);

  const getSeatPrice = (seat: Seat): number => {
    if (!mapData || ticketTypes.length === 0) return seat.price || 0;

    const section = mapData.sections.find((s) => s.id === seat.sectionId);
    const ticketTypeId = seat.ticketTypeId ?? section?.ticketTypeId ?? null;
    if (!ticketTypeId) return seat.price || 0;

    const ticket = ticketTypes.find((t) => t.id === ticketTypeId);
    return ticket?.price ?? seat.price ?? 0;
  };

  const handleSeatClick = (seat: Seat) => {
    const exists = selectedSeats.some((s) => s.id === seat.id);

    if (exists) {
      setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
      return;
    }

    if (selectedSeats.length >= 4) {
      alert(isVi ? "Bạn chỉ được chọn tối đa 4 vé" : "You can select up to 4 tickets only");
      return;
    }

    const price = getSeatPrice(seat);
    setSelectedSeats((prev) => [...prev, { ...seat, price }]);
  };

  const handleTicketQtyChange = (ticketTypeId: number, delta: 1 | -1) => {
    setTicketQuantities((prev) => {
      const current = prev[ticketTypeId] || 0;
      const ticket = ticketTypes.find((t) => t.id === ticketTypeId);

      const max = ticket?.maxQtyPerOrder ?? 10;
      const min = ticket?.minQtyPerOrder ?? 0;

      let next = current + delta;
      if (next < 0) next = 0;
      if (next > max) next = max;
      if (next < min && next !== 0) next = min;

      return { ...prev, [ticketTypeId]: next };
    });
  };

  const totalTicketQuantity = ticketTypes.reduce(
    (sum, t) => sum + (ticketQuantities[t.id] || 0),
    0
  );

  const totalTicketAmount = ticketTypes.reduce(
    (sum, t) => sum + (ticketQuantities[t.id] || 0) * (t.price || 0),
    0
  );

  const totalSeatAmount = selectedSeats.reduce((s, v) => s + (v.price || 0), 0);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-background text-foreground">
        <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-primary" />
        <p className="text-muted-foreground">
          {isVi ? "Đang tải..." : "Loading..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <p className="text-red-400 font-medium">{error}</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          {isVi ? "Quay lại" : "Go back"}
        </Button>
      </div>
    );
  }

  // No seat map: choose ticket types
  if (noSeatMap || !mapData) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="sticky top-0 z-50 h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
            <div>
              <h1 className="font-bold text-base sm:text-lg line-clamp-1">
                {eventName || (isVi ? "Chọn loại vé" : "Choose ticket type")}
              </h1>
              <p className="text-xs text-muted-foreground">
                {isVi ? "Suất diễn" : "Showing"} #{showingId}
              </p>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto w-full p-4 sm:p-6 space-y-4 pb-32">
          {ticketTypes.map((ticket) => {
            const qty = ticketQuantities[ticket.id] || 0;
            return (
              <div key={ticket.id} className="bg-card rounded-xl border border-border p-4 sm:p-5">
                <div className="flex justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-primary font-semibold uppercase text-xs tracking-wider">
                      {ticket.name}
                    </p>
                    <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{ticket.description}</p>
                    <p className="text-primary font-bold text-lg mt-2">
                      {ticket.price.toLocaleString(locale)} đ
                    </p>
                  </div>

                  <div className="flex items-center">
                    <div className="flex items-center bg-muted rounded-lg overflow-hidden">
                      <button
                        className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-accent transition-colors"
                        onClick={() => handleTicketQtyChange(ticket.id, -1)}
                      >
                        −
                      </button>
                      <span className="w-10 text-center font-semibold">{qty}</span>
                      <button
                        className="w-10 h-10 flex items-center justify-center text-primary font-semibold hover:bg-accent transition-colors"
                        onClick={() => handleTicketQtyChange(ticket.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {ticketTypes.length === 0 && (
            <div className="text-center text-muted-foreground py-16">
              <FontAwesomeIcon icon={faTicketAlt} className="text-5xl mb-4 opacity-30" />
              <p>
                {isVi
                  ? "Không tìm thấy loại vé cho suất diễn này."
                  : "No ticket types found for this showing."}
              </p>
            </div>
          )}
        </main>

        {/* Bottom fixed bar */}
        {ticketTypes.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 sm:p-5 z-50">
            <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {totalTicketQuantity} {isVi ? "vé" : "tickets"}
                </p>
                <p className="font-bold text-lg text-primary">
                  {totalTicketAmount.toLocaleString(locale)} đ
                </p>
              </div>

              <Button
                className="h-12 px-8 rounded-xl font-semibold"
                disabled={totalTicketQuantity === 0}
                onClick={() => {
                  const selections = ticketTypes
                    .map((t) => ({
                      ticketTypeId: t.id,
                      name: t.name,
                      price: t.price,
                      quantity: ticketQuantities[t.id] || 0,
                    }))
                    .filter((item) => item.quantity > 0);

                  if (selections.length === 0) return;

                  navigate("/checkout", {
                    state: {
                      eventName: eventName || (isVi ? "Đặt vé" : "Book tickets"),
                      showingId: showingId || "",
                      ticketSelections: selections,
                    },
                  });
                }}
              >
                Tiếp tục
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Has seat map
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 h-14 sm:h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </Button>
          <div className="min-w-0">
            <h1 className="font-bold text-sm sm:text-base line-clamp-1">{eventName || mapData.name}</h1>
            <p className="text-xs text-muted-foreground">Chọn ghế ngồi</p>
          </div>
        </div>
        
        {/* Mobile cart button */}
        <div className="lg:hidden">
          <Button
            variant={selectedSeats.length > 0 ? "default" : "outline"}
            size="sm"
            className="relative"
            onClick={() => setMobileCartOpen(!mobileCartOpen)}
          >
            <FontAwesomeIcon icon={faShoppingCart} />
            {selectedSeats.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                {selectedSeats.length}
              </span>
            )}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Seat Map Area */}
        <div className="flex-1 bg-card flex items-center justify-center p-2 sm:p-4">
          <SeatMap data={mapData} selectedSeats={selectedSeats} onSeatClick={handleSeatClick} />
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-80 xl:w-96 bg-background border-l border-border p-5 flex-col">
          <h2 className="text-lg font-bold mb-4">
            Vé đang chọn <span className="text-muted-foreground">({selectedSeats.length}/4)</span>
          </h2>

          <div className="flex-1 space-y-3 overflow-y-auto">
            {selectedSeats.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FontAwesomeIcon icon={faTicketAlt} className="text-3xl mb-3 opacity-30" />
                <p className="text-sm">Chọn ghế trên sơ đồ để đặt vé</p>
              </div>
            )}
            {selectedSeats.map((seat) => (
              <div key={seat.id} className="bg-card p-3 rounded-xl border border-border flex justify-between items-center">
                <div>
                  <p className="font-bold">{seat.code}</p>
                  <p className="text-xs text-muted-foreground">
                    {mapData.sections.find((s) => s.id === seat.sectionId)?.name}
                  </p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <p className="font-bold text-primary">
                    {seat.price?.toLocaleString("vi-VN")} đ
                  </p>
                  <button
                    className="w-7 h-7 rounded-full bg-muted hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors"
                    onClick={() => handleSeatClick(seat)}
                  >
                    <FontAwesomeIcon icon={faTimes} className="text-xs" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-dashed border-border mt-4">
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Tổng</span>
              <span className="text-primary">
                {totalSeatAmount.toLocaleString("vi-VN")} đ
              </span>
            </div>

            <Button
              className="w-full h-12 rounded-xl font-semibold"
              disabled={selectedSeats.length === 0}
              onClick={() =>
                navigate("/checkout", {
                  state: {
                    selectedSeats,
                    eventName: eventName || mapData.name,
                    showingId,
                  },
                })
              }
            >
              Tiếp tục <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Button>
          </div>
        </aside>

        {/* Mobile Bottom Sheet */}
        <div className="lg:hidden">
          {/* Overlay */}
          {mobileCartOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileCartOpen(false)}
            />
          )}

          {/* Sheet */}
          <div
            className={`fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border rounded-t-2xl transition-transform duration-300 ease-in-out ${
              mobileCartOpen ? "translate-y-0" : "translate-y-[calc(100%-4.5rem)]"
            }`}
            style={{ maxHeight: "70vh" }}
          >
            {/* Handle bar + summary */}
            <div
              className="p-4 flex items-center justify-between cursor-pointer"
              onClick={() => setMobileCartOpen(!mobileCartOpen)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faTicketAlt} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {selectedSeats.length > 0
                      ? `${selectedSeats.length} vé đã chọn`
                      : "Chưa chọn vé"}
                  </p>
                  <p className="text-primary font-bold">
                    {totalSeatAmount.toLocaleString("vi-VN")} đ
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {selectedSeats.length > 0 && !mobileCartOpen && (
                  <Button
                    size="sm"
                    className="rounded-full font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/checkout", {
                        state: {
                          selectedSeats,
                          eventName: eventName || mapData.name,
                          showingId,
                        },
                      });
                    }}
                  >
                    Tiếp tục
                  </Button>
                )}
                <FontAwesomeIcon
                  icon={mobileCartOpen ? faChevronDown : faChevronUp}
                  className="text-muted-foreground"
                />
              </div>
            </div>

            {/* Cart content */}
            {mobileCartOpen && (
              <div className="px-4 pb-4 overflow-y-auto" style={{ maxHeight: "calc(70vh - 5rem)" }}>
                <div className="space-y-2 mb-4">
                  {selectedSeats.length === 0 && (
                    <p className="text-center text-muted-foreground py-4 text-sm">
                      Chọn ghế trên sơ đồ để đặt vé
                    </p>
                  )}
                  {selectedSeats.map((seat) => (
                    <div key={seat.id} className="bg-card p-3 rounded-lg border border-border flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-sm">{seat.code}</p>
                        <p className="text-xs text-muted-foreground">
                          {mapData.sections.find((s) => s.id === seat.sectionId)?.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-primary text-sm">
                          {seat.price?.toLocaleString("vi-VN")} đ
                        </p>
                        <button
                          className="w-6 h-6 rounded-full bg-muted hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors"
                          onClick={() => handleSeatClick(seat)}
                        >
                          <FontAwesomeIcon icon={faTimes} className="text-[10px]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedSeats.length > 0 && (
                  <Button
                    className="w-full h-12 rounded-xl font-semibold"
                    onClick={() =>
                      navigate("/checkout", {
                        state: {
                          selectedSeats,
                          eventName: eventName || mapData.name,
                          showingId,
                        },
                      })
                    }
                  >
                    Tiếp tục thanh toán
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}