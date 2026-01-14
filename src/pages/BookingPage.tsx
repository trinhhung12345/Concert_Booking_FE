import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import SeatMap from "../features/booking/components/SeatMap";
import type { SeatMapData, Seat } from "../features/booking/types/seatmap";
import { bookingService } from "../features/booking/services/bookingService";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faSpinner, faChevronLeft } from "@fortawesome/free-solid-svg-icons";

export default function BookingPage() {
  const navigate = useNavigate();
  const { eventId } = useParams();

  // 1. Lấy showingId từ URL (ví dụ: /booking/1?showingId=5)
  const [searchParams] = useSearchParams();
  const showingId = searchParams.get("showingId");

  const [mapData, setMapData] = useState<SeatMapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  // 2. GỌI API LẤY SƠ ĐỒ GHẾ DỰA TRÊN SHOWING ID
  useEffect(() => {
    console.log("🎭 BookingPage useEffect - showingId:", showingId, "eventId:", eventId);

    // Nếu không có showingId trên URL thì báo lỗi
    if (!showingId) {
        console.log("❌ Không có showingId trên URL");
        setError("Không tìm thấy thông tin suất diễn (Thiếu showingId).");
        setLoading(false);
        return;
    }

    const fetchSeatMap = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("📡 Gọi API: GET /seat-maps/" + showingId);
        // Gọi API: GET /seat-maps/{showingId}
        const data = await bookingService.getSeatMapById(showingId);
        console.log("✅ API response:", data);
        setMapData(data);

      } catch (err) {
        console.error("❌ Lỗi tải sơ đồ ghế:", err);
        setError("Không thể tải sơ đồ ghế hoặc suất diễn này chưa có sơ đồ.");
      } finally {
        setLoading(false);
      }
    };

    fetchSeatMap();
  }, [showingId]); // Chạy lại khi showingId thay đổi

  // 3. XỬ LÝ CHỌN GHẾ
  const handleSeatClick = (seat: Seat) => {
    const isSelected = selectedSeats.some((s) => s.id === seat.id);

    if (isSelected) {
      setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= 4) {
        alert("Bạn chỉ được chọn tối đa 4 vé");
        return;
      }
      // Lưu ý: JSON ghế trả về price đang là null,
      // nếu muốn hiện giá ở giỏ hàng, bạn có thể cần map giá từ API TicketType hoặc Backend phải trả về price trong seat.
      setSelectedSeats((prev) => [...prev, seat]);
    }
  };

  // --- RENDER ---

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center flex-col gap-4 bg-white">
        <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-primary" />
        <p className="text-gray-500 font-medium">Đang tải sơ đồ ghế...</p>
      </div>
    );
  }

  if (error || !mapData) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <div className="text-red-500 font-medium text-lg">{error || "Không tìm thấy dữ liệu"}</div>
        <Button variant="outline" onClick={() => navigate(-1)}>Quay lại</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header Booking */}
      <div className="h-16 border-b flex items-center px-4 md:px-6 justify-between bg-white sticky top-0 z-50 shadow-sm">
         <div className="flex flex-col">
             <h1 className="font-bold text-lg md:text-xl truncate max-w-[200px] md:max-w-md">
                {mapData.name}
             </h1>
             <p className="text-xs text-gray-500">
                Suất diễn ID: <span className="font-medium text-gray-900">{showingId}</span>
             </p>
         </div>

         <div className="text-sm text-gray-500 hidden sm:block bg-gray-100 px-3 py-1 rounded-full">
            Thời gian giữ vé: <span className="text-primary font-bold">10:00</span>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
         {/* LEFT: SEAT MAP */}
         <div className="flex-1 p-4 bg-gray-50/50 flex items-center justify-center relative overflow-hidden">
             <SeatMap
                data={mapData}
                selectedSeats={selectedSeats}
                onSeatClick={handleSeatClick}
             />
         </div>

         {/* RIGHT: CART / SUMMARY */}
         <div className="w-full md:w-96 bg-white border-l shadow-xl flex flex-col p-6 z-40 h-[40vh] md:h-auto">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faArrowRight} className="text-primary text-sm transform rotate-45" />
                Vé đang chọn
                <span className="ml-auto text-sm font-normal text-gray-500">
                    {selectedSeats.length}/4
                </span>
            </h2>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {selectedSeats.length === 0 ? (
                    <div className="text-center text-gray-400 mt-10 flex flex-col items-center opacity-60">
                         {/* Icon ghế trống */}
                         <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="M19 9h-3.93a2 2 0 0 0-1.66.9l-.82 1.2a2 2 0 0 1-1.66.9H7.87a2 2 0 0 1-1.66-.9L5.39 9.9A2 2 0 0 0 3.73 9H2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9Z"/><path d="M22 9V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4"/><path d="M4.44 9h15.12"/></svg>
                        <p>Vui lòng chọn ghế trên bản đồ</p>
                    </div>
                ) : (
                    selectedSeats.map((seat) => (
                        <div key={seat.id} className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-primary/50 transition-colors">
                            <div>
                                <div className="font-bold text-gray-800 text-lg">
                                    {seat.code}
                                </div>
                                <div className="text-xs text-gray-500 uppercase font-semibold">
                                    {/* Vì sectionId là số, nếu muốn hiện tên section (VIP/Thường)
                                        bạn cần tìm trong mapData.sections dựa vào sectionId */}
                                    {mapData.sections.find(s => s.id === seat.sectionId)?.name || "Ghế ngồi"}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-primary">
                                    {/* Giá vé đang null nên tạm để hiển thị fallback */}
                                    {seat.price ? seat.price.toLocaleString('vi-VN') : "---"} đ
                                </div>
                                <button
                                    onClick={() => handleSeatClick(seat)}
                                    className="text-xs text-red-500 hover:text-red-700 font-medium mt-1"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-auto border-t border-dashed border-gray-300 pt-4 space-y-4">
                <div className="flex justify-between text-lg font-bold">
                    <span>Tổng tạm tính</span>
                    <span className="text-primary">
                        {selectedSeats.reduce((acc, s) => acc + (s.price || 0), 0).toLocaleString('vi-VN')} đ
                    </span>
                </div>
                <Button
                    className="w-full h-12 text-lg bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 rounded-xl"
                    disabled={selectedSeats.length === 0}
                >
                    Tiếp tục thanh toán <FontAwesomeIcon icon={faArrowRight} className="ml-2"/>
                </Button>
            </div>
         </div>
      </div>
    </div>
  );
}
