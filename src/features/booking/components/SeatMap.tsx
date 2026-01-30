import React, { useState } from 'react';
import type { SeatMapData, Section, Seat } from '../types/seatmap';

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
    className={`w-7 h-7 m-1 rounded text-xs font-bold border
      ${
        seat.status === 'BOOKED' || seat.status === 'LOCKED'
          ? 'bg-gray-400 cursor-not-allowed'
          : selected
          ? 'bg-green-400'
          : 'bg-white hover:bg-blue-200'
      }`}
    disabled={seat.status === 'BOOKED' || seat.status === 'LOCKED'}
    onClick={() => onSelect(seat)}
    title={seat.code}
  >
    {seat.code}
  </button>
);

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
  const [expanded, setExpanded] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  /* ===== LOGIC ===== */

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

        {/* SECTIONS */}
        {seatSections.map(
          (section) =>
            section.attribute && (
              <div
                key={section.id}
                className={`absolute flex flex-col items-center justify-center border-2 rounded-lg cursor-pointer transition
                  ${
                    selectedSection?.id === section.id
                      ? 'ring-4 ring-green-400'
                      : ''
                  }`}
                style={{
                  left: section.attribute.x * scale,
                  top: section.attribute.y * scale,
                  width: section.attribute.width * scale,
                  height: section.attribute.height * scale,
                  background: section.attribute.fill || '#666',
                }}
                onClick={() => {
                  setSelectedSection(section);
                  setExpanded(false);
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
          <div className="absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-5 rounded-lg shadow-xl">
            <div className="mb-3 font-bold text-green-400">
              {selectedSection.name}
            </div>

            {!expanded ? (
              <div className="flex flex-col items-center">
                <button
                  className="mt-2 px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition"
                  onClick={() => setExpanded(true)}
                >
                  Phóng to để chọn ghế
                </button>
              </div>
            ) : (
              <>
                {Array.from(
                  new Set(selectedSection.seats.map((s) => s.rowIndex))
                )
                  .sort((a, b) => a - b)
                  .map((row) => (
                    <div key={row} className="flex items-center">
                      <span className="w-6 text-xs text-gray-300">
                        {row <= 26 ? String.fromCharCode(64 + row) : row}
                      </span>

                      {selectedSection.seats
                        .filter((s) => s.rowIndex === row)
                        .sort((a, b) => a.colIndex - b.colIndex)
                        .map((seat) => (
                          <SeatItem
                            key={seat.id}
                            seat={seat}
                            onSelect={onSeatClick}
                            selected={selectedSeats.some(
                              (s) => s.id === seat.id
                            )}
                          />
                        ))}
                    </div>
                  ))}

                <div className="mt-3 text-sm">
                  Selected:{' '}
                  {selectedSeats.map((s) => s.code).join(', ') || 'None'}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
