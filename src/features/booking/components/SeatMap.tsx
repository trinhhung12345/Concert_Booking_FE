import type { PointerEventHandler, WheelEventHandler } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { SeatMapData, Section, Seat } from '../types/seatmap';

/* ================= UTILS ================= */

const isSeatDisabled = (seat: Seat) =>
  seat.status !== 'AVAILABLE' || seat.isSalable === false;

type ViewBox = [number, number, number, number];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const parseViewBox = (raw?: string | null): ViewBox | null => {
  if (!raw) return null;
  const nums = raw
    .trim()
    .split(/\s+/)
    .map((v) => Number(v))
    .filter((n) => Number.isFinite(n));
  if (nums.length !== 4) return null;
  const [x, y, w, h] = nums as ViewBox;
  if (w <= 0 || h <= 0) return null;
  return [x, y, w, h];
};

const computeSectionsBounds = (sections: Section[]) => {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const section of sections) {
    const attr = section.attribute;
    if (!attr) continue;

    const w = attr.width * (attr.scaleX || 1);
    const h = attr.height * (attr.scaleY || 1);

    minX = Math.min(minX, attr.x);
    minY = Math.min(minY, attr.y);
    maxX = Math.max(maxX, attr.x + w);
    maxY = Math.max(maxY, attr.y + h);
  }

  if (!Number.isFinite(minX) || !Number.isFinite(minY)) {
    return null;
  }

  return { minX, minY, maxX, maxY };
};

const getBestInitialViewBox = (data: SeatMapData): ViewBox => {
  const fromApi = parseViewBox(data.viewbox);
  const bounds = computeSectionsBounds(data.sections);

  let x = fromApi?.[0] ?? 0;
  let y = fromApi?.[1] ?? 0;
  let w = fromApi?.[2] ?? 1000;
  let h = fromApi?.[3] ?? 1000;

  if (bounds) {
    const apiRight = x + w;
    const apiBottom = y + h;
    const contentRight = bounds.maxX;
    const contentBottom = bounds.maxY;

    const minUnionX = Math.min(x, bounds.minX);
    const minUnionY = Math.min(y, bounds.minY);
    const maxUnionX = Math.max(apiRight, contentRight);
    const maxUnionY = Math.max(apiBottom, contentBottom);

    x = minUnionX;
    y = minUnionY;
    w = Math.max(1, maxUnionX - minUnionX);
    h = Math.max(1, maxUnionY - minUnionY);
  }

  const pad = Math.max(20, Math.max(w, h) * 0.03);
  return [x - pad, y - pad, w + pad * 2, h + pad * 2];
};

const clampViewBoxToBase = (vb: ViewBox, base: ViewBox): ViewBox => {
  const [bx, by, bw, bh] = base;
  let [x, y, w, h] = vb;

  const minW = bw / 8;
  const minH = bh / 8;
  const maxW = bw * 2;
  const maxH = bh * 2;

  w = clamp(w, minW, maxW);
  h = clamp(h, minH, maxH);

  // Keep inside base bounds when possible.
  if (w <= bw) {
    x = clamp(x, bx, bx + bw - w);
  } else {
    x = bx + (bw - w) / 2;
  }

  if (h <= bh) {
    y = clamp(y, by, by + bh - h);
  } else {
    y = by + (bh - h) / 2;
  }

  return [x, y, w, h];
};

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
            ? 'bg-pink-500 text-black'
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

  const svgRef = useRef<SVGSVGElement | null>(null);
  const panRef = useRef<{
    pointerId: number | null;
    startClientX: number;
    startClientY: number;
    startViewBox: ViewBox;
    didPan: boolean;
  }>({
    pointerId: null,
    startClientX: 0,
    startClientY: 0,
    startViewBox: [0, 0, 1000, 1000],
    didPan: false,
  });

  /* ===== RESET KHI BỎ HẾT GHẾ ===== */
  useEffect(() => {
    if (selectedSeats.length === 0) {
      setActiveZoneId(null);
      setSelectedSection(null);
      setViewMode('MAP');
    }
  }, [selectedSeats]);

  /* ===== DATA ===== */

  const stageSections = useMemo(
    () => data.sections.filter((s) => s.isStage && s.status === 1),
    [data.sections]
  );
  const seatSections = useMemo(
    () => data.sections.filter((s) => !s.isStage && s.status === 1),
    [data.sections]
  );

  const baseViewBox = useMemo(() => getBestInitialViewBox(data), [data]);
  const baseViewBoxRef = useRef<ViewBox>(baseViewBox);
  const [mapViewBox, setMapViewBox] = useState<ViewBox>(() => baseViewBox);

  useEffect(() => {
    setMapViewBox(baseViewBox);
  }, [baseViewBox]);

  useEffect(() => {
    baseViewBoxRef.current = baseViewBox;
  }, [baseViewBox]);

  const canvasW = 900;
  const canvasH = 600;

  // Important: prevent page scroll while zooming.
  // React's onWheel may be passive depending on setup, so we attach a native listener.
  useEffect(() => {
    if (viewMode !== 'MAP') return;
    const svg = svgRef.current;
    if (!svg) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = svg.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const zoomFactor = e.deltaY < 0 ? 1 / 1.12 : 1.12;
      const px = clamp((e.clientX - rect.left) / rect.width, 0, 1);
      const py = clamp((e.clientY - rect.top) / rect.height, 0, 1);

      setMapViewBox((prev) => {
        const [pvx, pvy, pvw, pvh] = prev;
        const pw = pvw * zoomFactor;
        const ph = pvh * zoomFactor;
        const cx = pvx + px * pvw;
        const cy = pvy + py * pvh;
        const nx = cx - px * pw;
        const ny = cy - py * ph;
        return clampViewBoxToBase(
          [nx, ny, pw, ph],
          baseViewBoxRef.current
        );
      });
    };

    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      svg.removeEventListener('wheel', onWheel);
    };
  }, [viewMode]);

  const handlePointerDown: PointerEventHandler<SVGSVGElement> = (e) => {
    if (e.button !== 0) return;
    const svg = svgRef.current;
    if (!svg) return;
    panRef.current.pointerId = e.pointerId;
    panRef.current.startClientX = e.clientX;
    panRef.current.startClientY = e.clientY;
    panRef.current.startViewBox = mapViewBox;
    panRef.current.didPan = false;
    svg.setPointerCapture(e.pointerId);
  };

  const handlePointerMove: PointerEventHandler<SVGSVGElement> = (e) => {
    if (panRef.current.pointerId !== e.pointerId) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const dxPx = e.clientX - panRef.current.startClientX;
    const dyPx = e.clientY - panRef.current.startClientY;
    if (Math.abs(dxPx) + Math.abs(dyPx) > 3) panRef.current.didPan = true;

    const [sx, sy, sw, sh] = panRef.current.startViewBox;
    const dx = (dxPx / rect.width) * sw;
    const dy = (dyPx / rect.height) * sh;

    setMapViewBox(clampViewBoxToBase([sx - dx, sy - dy, sw, sh], baseViewBox));
  };

  const handlePointerUp: PointerEventHandler<SVGSVGElement> = (e) => {
    if (panRef.current.pointerId !== e.pointerId) return;
    const svg = svgRef.current;
    if (svg) {
      try {
        svg.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
    panRef.current.pointerId = null;
  };

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
            <span className="text-pink-400 font-semibold">
              {selectedSection?.name}
            </span>
          </div>
        </div>
      )}

      {/* ===== MAP VIEW ===== */}
      {viewMode === 'MAP' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="relative" style={{ width: canvasW, height: canvasH }}>
            <svg
              ref={svgRef}
              width={canvasW}
              height={canvasH}
              viewBox={`${mapViewBox[0]} ${mapViewBox[1]} ${mapViewBox[2]} ${mapViewBox[3]}`}
              className="block rounded-lg border border-white/10"
              style={{ touchAction: 'none' }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onPointerLeave={handlePointerUp}
              role="img"
              aria-label="Seat map"
            >
              {/* Background */}
              <rect
                x={mapViewBox[0]}
                y={mapViewBox[1]}
                width={mapViewBox[2]}
                height={mapViewBox[3]}
                fill="#000"
              />

              {/* STAGE + NON-SALABLE AREAS */}
              {stageSections
                .filter((s) => s.attribute)
                .map((section) => {
                  const attr = section.attribute!;
                  const label = section.name?.trim() || 'STAGE';
                  return (
                    <g key={section.id} style={{ pointerEvents: 'none' }}>
                      <rect
                        x={attr.x}
                        y={attr.y}
                        width={attr.width}
                        height={attr.height}
                        fill={attr.fill || '#808080'}
                        stroke="#fff"
                        strokeWidth={2}
                        rx={12}
                        ry={12}
                      />
                      <text
                        x={attr.x + attr.width / 2}
                        y={attr.y + attr.height / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#222"
                        fontWeight={700}
                        fontSize={32}
                      >
                        {label.toUpperCase()}
                      </text>
                    </g>
                  );
                })}

              {/* ZONES */}
              {seatSections
                .filter((s) => s.attribute)
                .map((section) => {
                  const attr = section.attribute!;
                  const isSectionLocked = section.isSalable === false;
                  const isBlockedByActiveZone =
                    activeZoneId !== null && activeZoneId !== section.id;
                  const isSectionDisabled = isSectionLocked || isBlockedByActiveZone;

                  const handleClick = () => {
                    if (panRef.current.didPan) {
                      panRef.current.didPan = false;
                      return;
                    }
                    if (isSectionDisabled) return;
                    setSelectedSection(section);
                    setViewMode('SEATS');
                  };

                  return (
                    <g
                      key={section.id}
                      onClick={handleClick}
                      style={{
                        cursor: isSectionDisabled ? 'not-allowed' : 'pointer',
                        opacity: isSectionDisabled ? 0.55 : 1,
                      }}
                    >
                      <title>
                        {isSectionLocked
                          ? `Khu vực đã hết vé${section.message ? `: ${section.message}` : ''}`
                          : section.name}
                      </title>
                      <rect
                        x={attr.x}
                        y={attr.y}
                        width={attr.width}
                        height={attr.height}
                        fill={attr.fill || '#666'}
                        rx={12}
                        ry={12}
                      />
                      <text
                        x={attr.x + attr.width / 2}
                        y={attr.y + attr.height / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#fff"
                        fontWeight={700}
                        fontSize={28}
                      >
                        {section.name}
                        <tspan
                          x={attr.x + attr.width / 2}
                          dy={32}
                          fontSize={16}
                          fontWeight={500}
                          opacity={0.9}
                        >
                          {section.seats.length ? 'Seating' : 'Standing'}
                        </tspan>
                        {isSectionLocked && (
                          <tspan
                            x={attr.x + attr.width / 2}
                            dy={24}
                            fontSize={14}
                            fontWeight={700}
                            fill="#ffb3c8"
                          >
                            ĐÃ HẾT VÉ
                          </tspan>
                        )}
                      </text>
                    </g>
                  );
                })}
            </svg>
          </div>
        </div>
      )}

      {/* ===== SEAT VIEW (FULL SCREEN) ===== */}
      {viewMode === 'SEATS' && selectedSection && (
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto bg-gray-900 rounded-2xl p-6">
            <div className="mb-4 text-center font-bold text-pink-400">
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
              <span className="text-pink-400">
                {selectedSeats.map((s) => s.code).join(', ') || 'Chưa chọn'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
