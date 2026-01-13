import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import type { SeatMapData, Section, Seat } from "../types/seatmap";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearchPlus, faSearchMinus, faRedo } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";

// CẤU HÌNH KÍCH THƯỚC GHẾ (Tự quy ước)
const SEAT_SIZE = 25;
const SEAT_GAP = 10;
const SEAT_RADIUS = 6;

interface SeatMapProps {
  data: SeatMapData;
  selectedSeats: Seat[];
  onSeatClick: (seat: Seat) => void;
}

export default function SeatMap({ data, selectedSeats, onSeatClick }: SeatMapProps) {

  // Kiểm tra ghế có đang được chọn không
  const isSelected = (seatId: number) => selectedSeats.some((s) => s.id === seatId);

  // Component vẽ 1 ghế đơn lẻ
  const RenderSeat = ({ seat }: { seat: Seat }) => {
    // Tính toạ độ ghế dựa trên hàng/cột
    // Lưu ý: colIndex, rowIndex bắt đầu từ 1
    const x = (seat.colIndex - 1) * (SEAT_SIZE + SEAT_GAP);
    const y = (seat.rowIndex - 1) * (SEAT_SIZE + SEAT_GAP);

    const selected = isSelected(seat.id);
    const available = seat.status === "AVAILABLE";

    return (
      <g
        transform={`translate(${x}, ${y})`}
        onClick={(e) => {
           e.stopPropagation(); // Chặn sự kiện click xuyên qua section
           if (available) onSeatClick(seat);
        }}
        className={cn(
            "cursor-pointer transition-all duration-200",
            available ? "hover:opacity-80" : "cursor-not-allowed opacity-50"
        )}
      >
        {/* Hình dáng ghế */}
        <rect
          width={SEAT_SIZE}
          height={SEAT_SIZE}
          rx={SEAT_RADIUS}
          fill={selected ? "#FF0082" : available ? "#E5E7EB" : "#374151"} // Hồng: Chọn, Xám nhạt: Trống, Xám đậm: Đã bán
          stroke={selected ? "#FF0082" : "#D1D5DB"}
          strokeWidth="1"
        />
        {/* Số ghế (VD: 1, 2, 3...) */}
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

  // Component vẽ 1 Khu vực (Section)
  const RenderSection = ({ section }: { section: Section }) => {
    const attr = section.attribute || { x: 0, y: 0, scaleX: 1, scaleY: 1, rotate: 0, fill: "transparent" };

    return (
      <g
        // Áp dụng biến đổi toạ độ từ attribute (QUAN TRỌNG)
        transform={`translate(${attr.x}, ${attr.y}) scale(${attr.scaleX}, ${attr.scaleY}) rotate(${attr.rotate})`}
      >
        {/* 1. Vẽ nền/khung của Section (Elements) */}
        {section.elements.map((el) => {
            if (el.type === 'rect') {
                return (
                    <rect
                        key={el.id}
                        x={el.x} y={el.y}
                        width={el.width} height={el.height}
                        fill={el.fill || "#f3f4f6"}
                        opacity="0.3" // Làm mờ nền để ghế nổi bật
                        stroke="#e5e7eb"
                    />
                )
            }
            return null;
        })}

        {/* 2. Vẽ danh sách ghế */}
        {section.seats.map((seat) => (
          <RenderSeat key={seat.id} seat={seat} />
        ))}

        {/* Tên khu vực (Label) */}
        <text
            x={0} y={-10}
            fontSize="16"
            fontWeight="bold"
            fill="#374151"
        >
            {section.name}
        </text>
      </g>
    );
  };

  return (
    <div className="relative w-full h-[600px] bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={3}
        centerOnInit
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Toolbar điều khiển Zoom */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white p-2 rounded-lg shadow-md">
              <Button size="icon" variant="ghost" onClick={() => zoomIn()}>
                <FontAwesomeIcon icon={faSearchPlus} />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => zoomOut()}>
                <FontAwesomeIcon icon={faSearchMinus} />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => resetTransform()}>
                <FontAwesomeIcon icon={faRedo} />
              </Button>
            </div>

            {/* Vùng vẽ SVG */}
            <TransformComponent wrapperClass="w-full h-full" contentClass="w-full h-full">
              <svg
                viewBox={data.viewbox} // "0 0 1200 800"
                className="w-full h-full"
                style={{ cursor: "grab" }}
              >
                {/* Vẽ từng section */}
                {data.sections.map((section) => (
                  <RenderSection key={section.id} section={section} />
                ))}
              </svg>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      {/* Legend (Chú thích) */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-sm border border-gray-200 flex gap-4 text-xs font-medium">
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-[#E5E7EB] border border-gray-300"></div> Trống</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-[#FF0082]"></div> Đang chọn</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-[#374151]"></div> Đã bán</div>
      </div>
    </div>
  );
}
