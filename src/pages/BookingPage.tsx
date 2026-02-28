import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import SeatMap from "../features/booking/components/SeatMap";
import type { SeatMapData, Seat } from "../features/booking/types/seatmap";
import { bookingService } from "../features/booking/services/bookingService";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { eventService, type TicketType } from "@/features/concerts/services/eventService";


  export default function BookingPage() {
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

    // Fetch seat map + ticket types
    useEffect(() => {
      if (!showingId) {
        setError("Không tìm thấy thông tin suất diễn (Thiếu showingId).");
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
          setError("Không thể tải dữ liệu suất diễn.");
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
        alert("Bạn chỉ được chọn tối đa 4 vé");
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

    if (loading) {
      return (
        <div className="h-screen flex flex-col items-center justify-center gap-4 bg-background text-foreground">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-primary" />
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="h-screen flex flex-col items-center justify-center gap-4 bg-background">
          <p className="text-red-400 font-medium">{error}</p>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Quay lại
          </Button>
        </div>
      );
    }

    // No seat map: choose ticket types
    if (noSeatMap || !mapData) {
      return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <header className="h-16 flex items-center justify-between px-6 border-b border-border">
            <h1 className="font-bold text-lg">Chọn loại vé</h1>
            <span className="text-sm text-primary font-bold">10:00</span>
          </header>

          <main className="flex-1 max-w-3xl mx-auto w-full p-6 space-y-6">
            {ticketTypes.map((ticket) => {
              const qty = ticketQuantities[ticket.id] || 0;
              return (
                <div key={ticket.id} className="border-b border-border pb-4">
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="text-primary font-semibold uppercase text-xs">
                        {ticket.name}
                      </p>
                      <p className="text-muted-foreground text-xs mt-1">{ticket.description}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-primary font-bold">
                        {ticket.price.toLocaleString("vi-VN")} đ
                      </p>
                      <div className="flex items-center mt-2 bg-muted rounded">
                        <button
                          className="w-8 h-8"
                          onClick={() => handleTicketQtyChange(ticket.id, -1)}
                        >
                          -
                        </button>
                        <span className="w-10 text-center">{qty}</span>
                        <button
                          className="w-8 h-8 text-primary"
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
              <div className="text-center text-muted-foreground mt-10">
                Không tìm thấy loại vé cho suất diễn này.
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-dashed border-border">
              <div>
                <p className="text-sm">
                  Tổng vé: <b>{totalTicketQuantity}</b>
                </p>
                <p className="font-bold text-primary">
                  {totalTicketAmount.toLocaleString("vi-VN")} đ
                </p>
              </div>

              <Button
                className="bg-primary hover:bg-primary/90"
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
                      eventName: eventName || "Đặt vé",
                      showingId: showingId || "",
                      ticketSelections: selections,
                    },
                  });
                }}
              >
                Tiếp tục thanh toán
              </Button>
            </div>
          </main>
        </div>
      );
    }

    // Has seat map
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <header className="h-16 flex items-center justify-between px-6 border-b border-border">
          <div>
            <h1 className="font-bold">{mapData.name}</h1>
            <p className="text-xs text-muted-foreground">Suất diễn: {showingId}</p>
          </div>
          <span className="text-primary font-bold">10:00</span>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 bg-card flex items-center justify-center">
            <SeatMap data={mapData} selectedSeats={selectedSeats} onSeatClick={handleSeatClick} />
          </div>

          <aside className="w-96 bg-background border-l border-border p-6 flex flex-col">
            <h2 className="text-lg font-bold mb-4">
              Vé đang chọn <span className="text-muted-foreground">({selectedSeats.length}/4)</span>
            </h2>

            <div className="flex-1 space-y-3 overflow-y-auto">
              {selectedSeats.map((seat) => (
                <div key={seat.id} className="bg-card p-3 rounded-xl flex justify-between">
                  <div>
                    <p className="font-bold">{seat.code}</p>
                    <p className="text-xs text-muted-foreground">
                      {mapData.sections.find((s) => s.id === seat.sectionId)?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      {seat.price?.toLocaleString("vi-VN")} đ
                    </p>
                    <button
                      className="text-xs text-red-400 hover:text-red-500"
                      onClick={() => handleSeatClick(seat)}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-dashed border-border">
              <div className="flex justify-between font-bold text-lg mb-4">
                <span>Tổng</span>
                <span className="text-primary">
                  {selectedSeats
                    .reduce((s, v) => s + (v.price || 0), 0)
                    .toLocaleString("vi-VN")} đ
                </span>
              </div>

              <Button
                className="w-full bg-primary hover:bg-primary/90"
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
        </div>
      </div>
    );
  }
