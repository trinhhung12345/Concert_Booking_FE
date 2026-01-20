import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import type { SeatMapData, Section, Seat } from "../types/seatmap";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearchPlus, faSearchMinus, faRedo } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";

// CẤU HÌNH KÍCH THƯỚC
const SEAT_SIZE = 25;
const SEAT_GAP = 10;
const SEAT_RADIUS = 6;
// Tính bước nhảy (khoảng cách từ đầu ghế này sang đầu ghế kia)
const STEP = SEAT_SIZE + SEAT_GAP;

// HÀM TIỆN ÍCH: Đổi số thành chữ (1 -> A, 2 -> B, ..., 27 -> AA)
const getRowLabel = (n: number) => {
  const ordA = 'A'.charCodeAt(0);
  const ordZ = 'Z'.charCodeAt(0);
  const len = ordZ - ordA + 1;
  let s = "";
  while (n >= 0) {
    s = String.fromCharCode(n % len + ordA - 1) + s; // -1 vì n bắt đầu từ 1
    n = Math.floor(n / len) - 1;
  }
  return s;
};

interface SeatMapProps {
  data: SeatMapData;
  selectedSeats: Seat[];
  onSeatClick: (seat: Seat) => void;
}

export default function SeatMap({ data, selectedSeats, onSeatClick }: SeatMapProps) {

  const isSelected = (seatId: number) => selectedSeats.some((s) => s.id === seatId);

  // --- COMPONENT VẼ 1 GHẾ (Giữ nguyên) ---
  const RenderSeat = ({ seat }: { seat: Seat }) => {
    const x = (seat.colIndex - 1) * STEP;
    const y = (seat.rowIndex - 1) * STEP;
    const selected = isSelected(seat.id);
    const available = seat.status === "AVAILABLE";

    return (
      <g
        transform={`translate(${x}, ${y})`}
        onClick={(e) => {
           e.stopPropagation();
           if (available) onSeatClick(seat);
        }}
        className={cn(
            "cursor-pointer transition-all duration-200",
            available ? "hover:opacity-80" : "cursor-not-allowed opacity-50"
        )}
      >
        <rect
          width={SEAT_SIZE}
          height={SEAT_SIZE}
          rx={SEAT_RADIUS}
          fill={selected ? "#FF0082" : available ? "#E5E7EB" : "#374151"}
          stroke={selected ? "#FF0082" : "#D1D5DB"}
          strokeWidth="1"
        />
        <text
          x={SEAT_SIZE / 2}
          y={SEAT_SIZE / 2}
          dy=".35em"
          fontSize="10"
          textAnchor="middle"
          fill={selected ? "white" : "#111827"}
          className="select-none pointer-events-none font-medium"
        >
          {seat.colIndex}
        </text>
      </g>
    );
  };

  // Hàm kiểm tra hex color hợp lệ
  const isValidHexColor = (color: string) => {
    return /^#[0-9A-Fa-f]{6}$/.test(color) || /^#[0-9A-Fa-f]{3}$/.test(color);
  };

  // --- COMPONENT VẼ KHU VỰC (ĐÃ CẬP NHẬT LABEL) ---
  const RenderSection = ({ section }: { section: Section }) => {
    const attr = section.attribute || { x: 0, y: 0, scaleX: 1, scaleY: 1, rotate: 0, fill: "transparent" };

    // 1. Tìm danh sách các hàng và cột duy nhất có trong section này
    // Set giúp loại bỏ các giá trị trùng lặp
    const uniqueRows = [...new Set(section.seats.map(s => s.rowIndex))].sort((a, b) => a - b);
    const uniqueCols = [...new Set(section.seats.map(s => s.colIndex))].sort((a, b) => a - b);

    return (
      <g
        transform={`translate(${attr.x}, ${attr.y}) scale(${attr.scaleX || 1}, ${attr.scaleY || 1}) rotate(${attr.rotate || 0})`}
      >
        {/* Nền/Khung Section - Hỗ trợ nhiều loại element */}
        {section.elements.map((el) => {
            const fillColor = isValidHexColor(el.fill) ? el.fill : "#9CA3AF";
            
            // Render rect cho cả type "rect" và các type khác (như "string")
            // vì chúng đều có x, y, width, height
            if (el.width && el.height) {
                return (
                  <rect 
                    key={el.id} 
                    x={el.x} 
                    y={el.y} 
                    width={el.width} 
                    height={el.height} 
                    fill={fillColor} 
                    opacity="0.3" 
                    stroke="#e5e7eb" 
                    rx={4}
                  />
                );
            }
            return null;
        })}

        {/* --- VẼ CHỈ MỤC HÀNG (A, B, C...) --- */}
        {uniqueRows.map((rowIndex) => {
            // Vị trí Y: Dựa vào rowIndex
            const yPos = (rowIndex - 1) * STEP + (SEAT_SIZE / 2);
            // Vị trí X: Cách lề trái 25px
            const xPos = -25;

            return (
                <text
                    key={`row-${rowIndex}`}
                    x={xPos}
                    y={yPos}
                    dy=".35em" // Căn giữa theo chiều dọc
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="bold"
                    fill="#9CA3AF" // Màu xám nhạt
                    className="select-none"
                >
                    {getRowLabel(rowIndex)}
                </text>
            );
        })}

        {/* --- VẼ CHỈ MỤC CỘT (1, 2, 3...) --- */}
        {uniqueCols.map((colIndex) => {
             // Vị trí X: Dựa vào colIndex
             const xPos = (colIndex - 1) * STEP + (SEAT_SIZE / 2);
             // Vị trí Y: Cách lề trên 25px
             const yPos = -25;

             return (
                <text
                    key={`col-${colIndex}`}
                    x={xPos}
                    y={yPos}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="bold"
                    fill="#9CA3AF"
                    className="select-none"
                >
                    {colIndex}
                </text>
             );
        })}

        {/* Vẽ Ghế */}
        {section.seats.map((seat) => (
          <RenderSeat key={seat.id} seat={seat} />
        ))}

        {/* Tên khu vực - Vị trí dựa vào có ghế hay không */}
        {section.seats.length > 0 ? (
          // Nếu có ghế, hiển thị tên phía trên
          <text x={0} y={-45} fontSize="16" fontWeight="bold" fill="#374151">
            {section.name}
          </text>
        ) : (
          // Nếu không có ghế (khu đứng/standing), hiển thị tên ở giữa element
          section.elements[0] && (
            <text 
              x={(section.elements[0].x || 0) + (section.elements[0].width || 0) / 2} 
              y={(section.elements[0].y || 0) + (section.elements[0].height || 0) / 2} 
              fontSize="18" 
              fontWeight="bold" 
              fill="#374151"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {section.name}
              {section.message && (
                <tspan x={(section.elements[0].x || 0) + (section.elements[0].width || 0) / 2} dy="20" fontSize="12" fill="#6B7280">
                  {section.message}
                </tspan>
              )}
            </text>
          )
        )}
      </g>
    );
  };

  return (
    <div className="relative w-full h-[600px] bg-white border border-gray-200 rounded-xl overflow-hidden shadow-inner">
      <TransformWrapper
        initialScale={0.8} // Zoom nhỏ lại chút để nhìn bao quát hơn lúc đầu
        minScale={0.4}
        maxScale={3}
        centerOnInit
        limitToBounds={false} // Cho phép kéo ra ngoài vùng viewbox chút để xem rìa
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white p-2 rounded-lg shadow-md border border-gray-100">
              <Button size="icon" variant="ghost" onClick={() => zoomIn()} title="Phóng to">
                <FontAwesomeIcon icon={faSearchPlus} />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => zoomOut()} title="Thu nhỏ">
                <FontAwesomeIcon icon={faSearchMinus} />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => resetTransform()} title="Đặt lại">
                <FontAwesomeIcon icon={faRedo} />
              </Button>
            </div>

            <TransformComponent wrapperClass="w-full h-full" contentClass="w-full h-full">
              <svg
                viewBox={data.viewbox}
                className="w-full h-full"
                style={{ cursor: "grab" }}
              >
                {data.sections.map((section) => (
                  <RenderSection key={section.id} section={section} />
                ))}
              </svg>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      {/* Legend giữ nguyên */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-sm border border-gray-200 flex gap-4 text-xs font-medium">
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-[#E5E7EB] border border-gray-300"></div> Trống</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-[#FF0082]"></div> Đang chọn</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-[#374151]"></div> Đã bán</div>
      </div>
    </div>
  );
}
