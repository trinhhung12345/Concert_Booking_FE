import { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Transformer, Group, Text } from "react-konva";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave, faTrash, faMousePointer } from "@fortawesome/free-solid-svg-icons";
import Konva from "konva";

// --- TYPES ---
interface ShapeData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  name: string;
  rows: number;
  cols: number;
  price: number;
  color: string;
}

interface SeatMapEditorProps {
  showingId?: number;
  onSave?: (data: any) => void;
}

export default function SeatMapEditor({ showingId, onSave }: SeatMapEditorProps) {
  const [shapes, setShapes] = useState<ShapeData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 1. HÀM THÊM KHU VỰC MỚI
  const addSection = () => {
    const newShape: ShapeData = {
      id: `section-${Date.now()}`,
      x: 50,
      y: 50,
      width: 200,
      height: 150,
      rotation: 0,
      name: `Khu vực ${shapes.length + 1}`,
      rows: 5,
      cols: 8,
      price: 100000,
      color: "#FF0082" // Màu hồng thương hiệu
    };
    setShapes([...shapes, newShape]);
    setSelectedId(newShape.id);
  };

  // 2. XỬ LÝ KHI CHỌN MỘT HÌNH
  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  // 3. CẬP NHẬT THUỘC TÍNH (Khi kéo thả xong)
  const handleTransformEnd = (e: any, id: string) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Reset scale về 1 và cập nhật width/height
    node.scaleX(1);
    node.scaleY(1);

    const newShapes = shapes.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          x: node.x(),
          y: node.y(),
          width: Math.max(50, s.width * scaleX),
          height: Math.max(50, s.height * scaleY),
          rotation: node.rotation(),
        };
      }
      return s;
    });
    setShapes(newShapes);
  };

  // 4. CẬP NHẬT DỮ LIỆU TỪ FORM (Sidebar phải)
  const updateSelectedShape = (field: keyof ShapeData, value: any) => {
    setShapes(shapes.map(s => s.id === selectedId ? { ...s, [field]: value } : s));
  };

  // 5. XUẤT JSON CHO BACKEND
  const handleExport = () => {
    const sections = shapes.map(shape => {
      const seats = [];
      
      for (let r = 1; r <= shape.rows; r++) {
        for (let c = 1; c <= shape.cols; c++) {
          seats.push({
            code: `${String.fromCharCode(64 + r)}${c}`,
            rowIndex: r,
            colIndex: c,
            status: "AVAILABLE",
          });
        }
      }

      return {
        id: Math.floor(Math.random() * 10000),
        name: shape.name,
        attribute: {
          x: shape.x,
          y: shape.y,
          width: shape.width,
          height: shape.height,
          rotation: shape.rotation,
          fill: shape.color
        },
        elements: [{ type: "rect", width: shape.width, height: shape.height, fill: shape.color }],
        seats: seats
      };
    });

    const finalData = {
      name: "Sơ đồ sự kiện mới",
      viewbox: "0 0 1200 800",
      showingId: showingId,
      sections: sections
    };

    console.log("JSON to Save:", finalData);
    if (onSave) {
      onSave(finalData);
    } else {
      alert("Đã xuất dữ liệu Map ra console!");
    }
  };

  // --- SUB-COMPONENT: VẼ MỘT SECTION ---
  const SectionShape = ({ shape, isSelected, onSelect, onChange }: any) => {
    const shapeRef = useRef<Konva.Group>(null);
    const trRef = useRef<Konva.Transformer>(null);

    useEffect(() => {
      if (isSelected && trRef.current && shapeRef.current) {
        trRef.current.nodes([shapeRef.current]);
        trRef.current.getLayer()?.batchDraw();
      }
    }, [isSelected]);

    return (
      <>
        <Group
          ref={shapeRef}
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          rotation={shape.rotation}
          draggable
          onClick={() => onSelect(shape.id)}
          onTap={() => onSelect(shape.id)}
          onDragEnd={(e) => {
            onChange({ ...shape, x: e.target.x(), y: e.target.y() });
          }}
          onTransformEnd={(e) => handleTransformEnd(e, shape.id)}
        >
          {/* 1. Nền Khu Vực */}
          <Rect
            width={shape.width}
            height={shape.height}
            fill={shape.color}
            opacity={0.3}
            stroke={isSelected ? "#009688" : "black"}
            strokeWidth={isSelected ? 2 : 1}
            cornerRadius={4}
          />

          {/* 2. Label Tên Khu Vực */}
          <Text
            text={`${shape.name}\n(${shape.rows}x${shape.cols})`}
            width={shape.width}
            height={shape.height}
            align="center"
            verticalAlign="middle"
            fontSize={14}
            fontStyle="bold"
            fill="#000"
          />

          {/* 3. Lưới Ghế (Visual giả lập để user dễ hình dung) */}
          {Array.from({ length: shape.rows }).map((_, r) =>
            Array.from({ length: shape.cols }).map((_, c) => {
              const w = shape.width / shape.cols;
              const h = shape.height / shape.rows;
              const pad = 2;
              return (
                <Rect
                  key={`${r}-${c}`}
                  x={c * w + pad}
                  y={r * h + pad}
                  width={w - pad * 2}
                  height={h - pad * 2}
                  fill={shape.color}
                  opacity={0.8}
                  cornerRadius={2}
                />
              );
            })
          )}
        </Group>

        {/* Công cụ Resize/Rotate hiện khi được chọn */}
        {isSelected && (
          <Transformer
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 30 || newBox.height < 30) return oldBox;
              return newBox;
            }}
          />
        )}
      </>
    );
  };

  // --- RENDER CHÍNH ---
  const selectedShape = shapes.find(s => s.id === selectedId);

  return (
    <div className="flex h-[600px] border border-border rounded-xl overflow-hidden bg-card">
      {/* 1. TOOLBAR TRÁI */}
      <div className="w-16 border-r border-border flex flex-col items-center py-4 gap-4 bg-card">
        <Button
          size="icon"
          onClick={addSection}
          title="Thêm khu vực"
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <FontAwesomeIcon icon={faPlus} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setSelectedId(null)}
          title="Bỏ chọn"
        >
          <FontAwesomeIcon icon={faMousePointer} className="text-muted-foreground" />
        </Button>
      </div>

      {/* 2. CANVAS CHÍNH */}
      <div className="flex-1 bg-muted/30 relative">
        <Stage
          width={800}
          height={600}
          onMouseDown={(e) => {
            if (e.target === e.target.getStage()) setSelectedId(null);
          }}
        >
          <Layer>
            {/* Background */}
            <Rect x={0} y={0} width={800} height={600} fill="#f8fafc" />
            
            {/* Grid pattern */}
            {Array.from({ length: 20 }).map((_, i) => (
              <Rect
                key={`vgrid-${i}`}
                x={i * 40}
                y={0}
                width={1}
                height={600}
                fill="#e2e8f0"
              />
            ))}
            {Array.from({ length: 15 }).map((_, i) => (
              <Rect
                key={`hgrid-${i}`}
                x={0}
                y={i * 40}
                width={800}
                height={1}
                fill="#e2e8f0"
              />
            ))}

            {shapes.map((shape) => (
              <SectionShape
                key={shape.id}
                shape={shape}
                isSelected={shape.id === selectedId}
                onSelect={handleSelect}
                onChange={(newAttrs: any) => {
                  const newShapes = shapes.map(s =>
                    s.id === shape.id ? newAttrs : s
                  );
                  setShapes(newShapes);
                }}
              />
            ))}
          </Layer>
        </Stage>
      </div>

      {/* 3. PROPERTIES PANEL (BÊN PHẢI) */}
      <div className="w-72 border-l border-border bg-card p-4 text-foreground overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold">Thuộc tính</h3>
          <Button size="sm" onClick={handleExport} className="bg-primary hover:bg-primary/90">
            <FontAwesomeIcon icon={faSave} className="mr-2" /> Lưu
          </Button>
        </div>

        {selectedShape ? (
          <div className="space-y-4 animate-in slide-in-from-right-2">
            <div className="space-y-1">
              <Label>Tên khu vực</Label>
              <Input
                value={selectedShape.name}
                onChange={(e) => updateSelectedShape("name", e.target.value)}
                className="bg-background border-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label>Số hàng</Label>
                <Input
                  type="number"
                  min={1}
                  value={selectedShape.rows}
                  onChange={(e) => updateSelectedShape("rows", parseInt(e.target.value) || 1)}
                  className="bg-background border-input"
                />
              </div>
              <div className="space-y-1">
                <Label>Số cột</Label>
                <Input
                  type="number"
                  min={1}
                  value={selectedShape.cols}
                  onChange={(e) => updateSelectedShape("cols", parseInt(e.target.value) || 1)}
                  className="bg-background border-input"
                />
              </div>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              Tổng: {selectedShape.rows * selectedShape.cols} ghế
            </div>

            <div className="space-y-1">
              <Label>Màu sắc</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={selectedShape.color}
                  onChange={(e) => updateSelectedShape("color", e.target.value)}
                  className="w-12 h-10 p-1 bg-background border-input cursor-pointer"
                />
                <Input
                  value={selectedShape.color}
                  onChange={(e) => updateSelectedShape("color", e.target.value)}
                  className="bg-background border-input flex-1"
                />
              </div>
            </div>

            <Button
              variant="destructive"
              className="w-full mt-4"
              onClick={() => {
                setShapes(shapes.filter(s => s.id !== selectedId));
                setSelectedId(null);
              }}
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2" /> Xóa khu vực
            </Button>
          </div>
        ) : (
          <div className="text-muted-foreground text-sm text-center mt-10">
            Chọn một khu vực trên bản vẽ để chỉnh sửa hoặc nhấn dấu (+) để thêm mới.
          </div>
        )}
      </div>
    </div>
  );
}
