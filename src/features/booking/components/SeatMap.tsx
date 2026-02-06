import { useEffect, useState } from 'react';
import type { SeatMapData, Section, Seat } from '../types/seatmap';

/* ================= SEAT ITEM ================= */

const SeatItem = ({
  seat,
  onSelect,
  selected,
}: {
  seat: Seat;
  onSelect: (seat: Seat) => void;
  selected: boolean;
}) => (
  <button
    className={`
      w-7 h-7 m-1 rounded-full text-[10px] font-semibold
      flex items-center justify-center
      border
      ${
        seat.status === 'BOOKED' || seat.status === 'LOCKED'
          ? 'bg-gray-500 cursor-not-allowed text-gray-800'
          : selected
          ? 'bg-green-500 text-black'
          : 'bg-white text-black hover:bg-blue-300'
      }
    `}
    disabled={seat.status === 'BOOKED' || seat.status === 'LOCKED'}
    onClick={() => onSelect(seat)}
    title={seat.code}
  >
    {seat.colIndex}
  </button>
);

/* ================= MAIN ================= */

interface SeatMapProps {
  data: SeatMapData;
  selectedSeats: Seat[];
  onSeatClick: (seat: Seat) => void;
}

export default function SeatMap({
  data,
  selectedSeats,
  onSeatClick,
}: SeatMapProps) {
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [activeZoneId, setActiveZoneId] = useState<number | null>(null);

  /* ===== RESET ZONE KHI BỎ HẾT GHẾ ===== */
  useEffect(() => {
    if (selectedSeats.length === 0) {
      setActiveZoneId(null);
      setSelectedSection(null);
    }
  }, [selectedSeats]);

  /* ===== DATA ===== */

  const stageSection = data.sections.find((s: any) => s.isStage);
  const seatSections = data.sections.filter((s: any) => !s.isStage);

  const viewBox = data.viewbox
    ? data.viewbox.split(' ').map(Number)
    : [0, 0, 1000, 1000];

  const [, , vbW, vbH] = viewBox;

  const canvasW = 800;
  const canvasH = 600;
  const scale = Math.min(canvasW / vbW, canvasH / vbH);

  /* ===== RENDER ===== */

  return (
    <div className="flex w-full h-screen bg-black text-white">
      <div
        className="relative mx-auto my-auto"
        style={{ width: canvasW, height: canvasH }}
      >
        {/* STAGE */}
        {stageSection?.attribute && (
          <div
            className="absolute flex items-center justify-center font-bold text-2xl rounded-lg"
            style={{
              left: stageSection.attribute.x * scale,
              top: stageSection.attribute.y * scale,
              width: stageSection.attribute.width * scale,
              height: stageSection.attribute.height * scale,
              background: stageSection.attribute.fill || '#ccc',
              color: '#222',
              border: '2px solid #fff',
              zIndex: 10,
            }}
          >
            STAGE
          </div>
        )}

        {/* SECTIONS (ZONES) */}
        {seatSections.map(
          (section) =>
            section.attribute && (
              <div
                key={section.id}
                className={`
                  absolute flex flex-col items-center justify-center
                  border-2 rounded-lg cursor-pointer transition
                  ${
                    activeZoneId !== null &&
                    activeZoneId !== section.id
                      ? 'opacity-40 cursor-not-allowed'
                      : ''
                  }
                  ${
                    selectedSection?.id === section.id
                      ? 'ring-4 ring-green-400'
                      : ''
                  }
                `}
                style={{
                  left: section.attribute.x * scale,
                  top: section.attribute.y * scale,
                  width: section.attribute.width * scale,
                  height: section.attribute.height * scale,
                  background: section.attribute.fill || '#666',
                }}
                onClick={() => {
                  if (
                    activeZoneId !== null &&
                    activeZoneId !== section.id
                  ) {
                    return;
                  }
                  setSelectedSection(section);
                }}
              >
                <div className="font-bold">{section.name}</div>
                <div className="text-xs">
                  {section.seats.length ? 'Seating' : 'Standing'}
                </div>
              </div>
            )
        )}

        {/* SEATS POPUP */}
        {selectedSection && (
          <div className="absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-5 rounded-xl shadow-2xl max-h-[80vh] overflow-auto">
            <div className="mb-3 font-bold text-green-400 text-center">
              {selectedSection.name}
            </div>

            {/* SEAT GRID */}
            {Array.from(
              new Set(selectedSection.seats.map((s) => s.rowIndex))
            )
              .sort((a, b) => a - b)
              .map((row) => (
                <div
                  key={row}
                  className="flex items-center justify-center"
                >
                  <span className="w-6 text-xs text-gray-400 mr-2">
                    {row <= 26 ? String.fromCharCode(64 + row) : row}
                  </span>

                  <div className="flex flex-wrap justify-center">
                    {selectedSection.seats
                      .filter((s) => s.rowIndex === row)
                      .sort((a, b) => a.colIndex - b.colIndex)
                      .map((seat) => (
                        <SeatItem
                          key={seat.id}
                          seat={seat}
                          selected={selectedSeats.some(
                            (s) => s.id === seat.id
                          )}
                          onSelect={(seat) => {
                            // LẦN ĐẦU CHỌN GHẾ → KHÓA ZONE
                            if (activeZoneId === null) {
                              setActiveZoneId(selectedSection.id);
                            }
                            onSeatClick(seat);
                          }}
                        />
                      ))}
                  </div>
                </div>
              ))}

            <div className="mt-4 text-sm text-center text-gray-300">
              Ghế đã chọn:{' '}
              <span className="text-green-400">
                {selectedSeats.map((s) => s.code).join(', ') || 'Chưa chọn'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
