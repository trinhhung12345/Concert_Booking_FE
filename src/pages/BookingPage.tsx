import { useState } from "react";
import SeatMap from "../features/booking/components/SeatMap";
import type { SeatMapData, Seat } from "../features/booking/types/seatmap";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

// DỮ LIỆU MẪU TỪ JSON BẠN CUNG CẤP
const MOCK_MAP_DATA: SeatMapData = {
  id: 1,
  name: "Seat Map Cho Su Kien Gi Do",
  viewbox: "0 0 1200 800",
  sections: [
    {
      id: 1,
      name: "VIP",
      seats: [
        { id: 1, code: "A1-1", rowIndex: 1, colIndex: 1, status: "AVAILABLE" },
        { id: 2, code: "A1-2", rowIndex: 1, colIndex: 2, status: "AVAILABLE" },
        { id: 3, code: "A1-3", rowIndex: 1, colIndex: 3, status: "BOOKED" }, // Giả sử đã bán
        { id: 4, code: "A1-4", rowIndex: 1, colIndex: 4, status: "AVAILABLE" },
        { id: 5, code: "A2-1", rowIndex: 2, colIndex: 1, status: "AVAILABLE" },
        { id: 6, code: "A2-2", rowIndex: 2, colIndex: 2, status: "AVAILABLE" },
        { id: 7, code: "A2-3", rowIndex: 2, colIndex: 3, status: "AVAILABLE" },
        { id: 8, code: "A2-4", rowIndex: 2, colIndex: 4, status: "AVAILABLE" },
        // ... thêm nhiều ghế hơn để test
      ],
      elements: [
        { id: 2, type: "rect", x: -10, y: -10, width: 200, height: 150, fill: "#FCE7F3" } // Background hồng nhạt cho VIP
      ],
      attribute: { x: 100, y: 80, width: 600, height: 400, scaleX: 1.2, scaleY: 1.2, rotate: 0, fill: "" }
    },
    {
      id: 2,
      name: "Thuong",
      seats: [], // Khu này không có ghế (Standing)
      elements: [
        { id: 1, type: "rect", x: 0, y: 0, width: 300, height: 200, fill: "#E5E7EB" }
      ],
      attribute: { x: 600, y: 80, width: 300, height: 200, scaleX: 1, scaleY: 1, rotate: 0, fill: "" }
    }
  ]
};

export default function BookingPage() {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const handleSeatClick = (seat: Seat) => {
    // Check xem đã chọn chưa
    const isSelected = selectedSeats.some((s) => s.id === seat.id);

    if (isSelected) {
      // Bỏ chọn
      setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
    } else {
      // Chọn mới (Limit 4 vé)
      if (selectedSeats.length >= 4) {
        alert("Bạn chỉ được chọn tối đa 4 vé");
        return;
      }
      setSelectedSeats(prev => [...prev, seat]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header Booking */}
      <div className="h-16 border-b flex items-center px-6 justify-between bg-white sticky top-0 z-50">
         <h1 className="font-bold text-xl">Chọn ghế: Sự kiện Demo</h1>
         <div className="text-sm text-gray-500">Thời gian giữ vé: <span className="text-primary font-bold">10:00</span></div>
      </div>

      <div className="flex flex-1 overflow-hidden">
         {/* LEFT: SEAT MAP */}
         <div className="flex-1 p-4 bg-gray-100 flex items-center justify-center">
             <SeatMap
                data={MOCK_MAP_DATA}
                selectedSeats={selectedSeats}
                onSeatClick={handleSeatClick}
             />
         </div>

         {/* RIGHT: CART / SUMMARY */}
         <div className="w-96 bg-white border-l shadow-xl flex flex-col p-6 z-40">
            <h2 className="text-xl font-bold mb-4">Vé của bạn</h2>

            <div className="flex-1 overflow-y-auto space-y-3">
                {selectedSeats.length === 0 ? (
                    <div className="text-center text-gray-400 mt-10">
                        Chưa có ghế nào được chọn
                    </div>
                ) : (
                    selectedSeats.map((seat) => (
                        <div key={seat.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                            <div>
                                <div className="font-bold text-gray-800">Ghế {seat.code}</div>
                                <div className="text-xs text-gray-500">VIP Zone</div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-primary">200.000 đ</div>
                                <button
                                    onClick={() => handleSeatClick(seat)}
                                    className="text-xs text-red-500 hover:underline"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-auto border-t pt-4 space-y-4">
                <div className="flex justify-between text-lg font-bold">
                    <span>Tổng tiền</span>
                    <span className="text-primary">
                        {(selectedSeats.length * 200000).toLocaleString('vi-VN')} đ
                    </span>
                </div>
                <Button className="w-full h-12 text-lg bg-primary hover:bg-primary/90" disabled={selectedSeats.length === 0}>
                    Tiếp tục <FontAwesomeIcon icon={faArrowRight} className="ml-2"/>
                </Button>
            </div>
         </div>
      </div>
    </div>
  );
}
