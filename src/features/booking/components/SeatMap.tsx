import { useEffect, useState } from 'react';
import type { SeatMapData, Section, Seat } from '../types/seatmap';

/* ================= UTILS ================= */

const isSeatDisabled = (seat: Seat) =>
  seat.status !== 'AVAILABLE' || seat.isSalable === false;

/* ================= SEAT ITEM ================= */

const SeatItem = ({
  seat,
  onSelect,
  selected,
}: {
  seat: Seat;
  onSelect: (seat: Seat) => void;
  selected: boolean;
}) => {
  const disabled = isSeatDisabled(seat);

  return (
    <button
      disabled={disabled}
      onClick={() => !disabled && onSelect(seat)}
      title={
        disabled
          ? seat.status !== 'AVAILABLE'
            ? 'Ghế đã bán / không khả dụng'
            : 'Ghế không được phép bán'
          : seat.code
      }
      className={`
        relative w-7 h-7 m-1 rounded-full text-[10px] font-semibold
        flex items-center justify-center border transition
        ${
          disabled
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : selected
            ? 'bg-green-500 text-black'
            : 'bg-white text-black hover:bg-blue-300'
        }
      `}
    >
      {seat.colIndex}

      {/* GẠCH CHÉO */}
      {disabled && (
        <>
          <span className="pointer-events-none absolute w-full h-[2px] bg-red-500 rotate-45" />
          <span className="pointer-events-none absolute w-full h-[2px] bg-red-500 -rotate-45" />
        </>
      )}
    </button>
  );
};

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
  const [viewMode, setViewMode] = useState<'MAP' | 'SEATS'>('MAP');

  /* ===== RESET KHI BỎ HẾT GHẾ ===== */
  useEffect(() => {
    if (selectedSeats.length === 0) {
      setActiveZoneId(null);
      setSelectedSection(null);
      setViewMode('MAP');
    }
  }, [selectedSeats]);

  /* ===== DATA ===== */

  const stageSection = data.sections.find((s) => s.isStage);
  const seatSections = data.sections.filter((s) => !s.isStage);

  const viewBox = data.viewbox
    ? data.viewbox.split(' ').map(Number)
    : [0, 0, 1000, 1000];

  const [, , vbW, vbH] = viewBox;

  const canvasW = 900;
  const canvasH = 600;
  const scale = Math.min(canvasW / vbW, canvasH / vbH);

  /* ================= RENDER ================= */

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col">
      {/* ===== HEADER ===== */}
      {viewMode === 'SEATS' && (
        <div className="flex items-center gap-3 px-4 py-3 bg-[#0a0312] border-b border-pink-500/20">
          <button
            onClick={() => setViewMode('MAP')}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm"
          >
            ← Quay lại sơ đồ
          </button>

          <div className="text-sm text-gray-300">
            Khu vực:{' '}
            <span className="text-green-400 font-semibold">
              {selectedSection?.name}
            </span>
          </div>
        </div>
      )}

      {/* ===== MAP VIEW ===== */}
      {viewMode === 'MAP' && (
        <div className="flex-1 flex items-center justify-center">
          <div
            className="relative"
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
                }}
              >
                STAGE
              </div>
            )}

            {/* ZONES */}
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
                      )
                        return;

                      setSelectedSection(section);
                      setViewMode('SEATS');
                    }}
                  >
                    <div className="font-bold">{section.name}</div>
                    <div className="text-xs opacity-80">
                      {section.seats.length ? 'Seating' : 'Standing'}
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      )}

      {/* ===== SEAT VIEW (FULL SCREEN) ===== */}
      {viewMode === 'SEATS' && selectedSection && (
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto bg-gray-900 rounded-2xl p-6">
            <div className="mb-4 text-center font-bold text-green-400">
              {selectedSection.name}
            </div>

            {Array.from(
              new Set(selectedSection.seats.map((s) => s.rowIndex))
            )
              .sort((a, b) => a - b)
              .map((row) => (
                <div key={row} className="flex justify-center mb-2">
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

            <div className="mt-6 text-sm text-center text-gray-300">
              Ghế đã chọn:{' '}
              <span className="text-green-400">
                {selectedSeats.map((s) => s.code).join(', ') || 'Chưa chọn'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
