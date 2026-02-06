import { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Transformer, Group, Text } from "react-konva";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave, faTrash, faMousePointer, faRefresh, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Konva from "konva";
import { eventService } from "@/features/concerts/services/eventService";
import { seatMapService } from "@/features/admin/services/seatMapService";
import type { Section, SectionAttribute } from "@/features/admin/types/seatmap";

// --- TYPES ---
interface TicketType {
  id: number;
  name: string;
  description: string;
  color: string;
  isFree: boolean;
  price: number;
  originalPrice: number;
  maxQtyPerOrder: number;
  minQtyPerOrder: number;
  startTime: string;
  endTime: string;
  position: number;
  status: string;
  imageUrl: string;
  showingId: number | null;
}

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
  ticketTypeId: number | null;
  status?: number; // Thêm trường status để theo dõi trạng thái của section
  attributeId?: number | null; // ID của attribute để phân biệt PUT/POST khi lưu
}

// Interface mở rộng cho mục đích tạo section mới, bao gồm các thuộc tính bổ sung
interface ExtendedSection {
  _tempId?: string;
  id?: number;
  name: string;
  seatMapId: number;
  status: number;
  isStage: boolean;
  isSalable: boolean;
  isReservingSeat: boolean;
  message: string;
  ticketTypeId: number;
  elements?: any[];
  attribute?: any;
  seats?: any[];
  // Các thuộc tính bổ sung để sử dụng trong quá trình tạo section
  price?: number;
  rows?: number;
  cols?: number;
}

interface SeatMapEditorProps {
  showingId?: number;
  onSave?: (data: any) => void;
}

export default function SeatMapEditor({ showingId, onSave }: SeatMapEditorProps) {
  const [shapes, setShapes] = useState<ShapeData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [loadingTicketTypes, setLoadingTicketTypes] = useState(false);
  const [loadingSeatMap, setLoadingSeatMap] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'delete' | 'soft-delete'>('delete');
  const [dialogAction, setDialogAction] = useState<(() => void) | null>(null);

  // Hàm xử lý xóa mềm section
  const softDeleteSection = async (sectionId: string) => {
    try {
      // Extract the numeric ID from the sectionId string (format: "section-{id}")
      const numericId = parseInt(sectionId.replace('section-', ''));
      if (isNaN(numericId)) {
        throw new Error("Invalid section ID format");
      }

      await seatMapService.softDeleteSection(numericId);
      // Remove the section from the UI after soft delete
      setShapes(shapes.filter(s => s.id !== sectionId));
      setSelectedId(null);
      alert("Xóa mềm khu vực thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa mềm khu vực:", error);
      alert("Lỗi khi xóa mềm khu vực: " + (error as Error).message);
    }
  };

  // Hàm xử lý xóa mềm seat
  const softDeleteSeat = async (seatId: number) => {
    try {
      await seatMapService.softDeleteSeat(seatId);
      alert("Xóa mềm ghế thành công!");
      // Refresh the seatmap after soft delete
      if (showingId) {
        refreshSeatMap();
      }
    } catch (error) {
      console.error("Lỗi khi xóa mềm ghế:", error);
      alert("Lỗi khi xóa mềm ghế: " + (error as Error).message);
    }
  };

  // Hàm xử lý xóa mềm element
  const softDeleteElement = async (elementId: number) => {
    try {
      await seatMapService.softDeleteSeatMapElement(elementId);
      alert("Ẩn phần tử thành công!");
      // Refresh the seatmap after soft delete
      if (showingId) {
        refreshSeatMap();
      }
    } catch (error) {
      console.error("Lỗi khi ẩn phần tử:", error);
      alert("Lỗi khi ẩn phần tử: " + (error as Error).message);
    }
  };

  // Hàm mở dialog xác nhận hành động
  const openDialog = (action: 'delete' | 'soft-delete', actionFn: () => void) => {
    setDialogType(action);
    setDialogAction(() => actionFn);
    setDialogOpen(true);
  };

  // Hàm đóng dialog và thực hiện hành động
  const handleDialogConfirm = () => {
    if (dialogAction) {
      dialogAction();
    }
    setDialogOpen(false);
  };

  // Load ticket types and seatmap when component mounts and has showingId
  useEffect(() => {
    if (showingId) {
      const loadData = async () => {
        setLoadingSeatMap(true);
        setError(null);
        
        try {
          // Fetch ticket types
          setLoadingTicketTypes(true);
          const types = await eventService.getTicketTypesByShowingId(showingId);
          setTicketTypes(types);
          setLoadingTicketTypes(false);
          
          // Fetch existing seatmap for the showing
          const seatMaps = await seatMapService.getSeatMapsByShowingId(showingId);
          if (seatMaps && seatMaps.length > 0) {
            // Convert seatmap data to ShapeData format
            const convertedShapes: ShapeData[] = (seatMaps[0].sections || [])
              .filter(section => section.status === 1) // Chỉ hiển thị các section có status = 1 (đang hoạt động)
              .map((section: any) => {
                // Find the first seat to determine rows and cols if possible
                let rows = 5, cols = 8; // default values
                
                if (section.seats && section.seats.length > 0) {
                  const maxRowIndex = Math.max(...section.seats.map((seat: any) => seat.rowIndex));
                  const maxColIndex = Math.max(...section.seats.map((seat: any) => seat.colIndex));
                  rows = maxRowIndex;
                  cols = maxColIndex;
                }
                
                // Get attribute values if available
                const attr = section.attribute || {};
                
                return {
                  id: `section-${section.id}`,
                  x: (attr && attr.x) || 50,
                  y: (attr && attr.y) || 50,
                  width: (attr && attr.width) || 200,
                  height: (attr && attr.height) || 150,
                  rotation: (attr && attr.rotate) || 0,
                  name: section.name || `Khu vực ${section.id}`,
                  rows: rows,
                  cols: cols,
                  price: section.price || 100000,
                  color: (attr && attr.fill) || "#FF0082",
                  ticketTypeId: section.ticketTypeId || null,
                  status: section.status, // Thêm status vào ShapeData để theo dõi trạng thái
                  attributeId: (attr && attr.id) || null // Lưu attribute ID để dùng khi cập nhật
                };
              });
            
            setShapes(convertedShapes);
          }
        } catch (err) {
          console.error('Error loading seat map data:', err);
          setError("Lỗi khi tải dữ liệu sơ đồ ghế: " + (err as Error).message);
        } finally {
          setLoadingSeatMap(false);
        }
      };

      loadData();
    } else {
      setTicketTypes([]);
      setShapes([]);
    }
  }, [showingId]);

  // Refresh seatmap data
  const refreshSeatMap = async () => {
    if (!showingId) return;
    
    setLoadingSeatMap(true);
    setError(null);
    
    try {
      const seatMaps = await seatMapService.getSeatMapsByShowingId(showingId);
      if (seatMaps && seatMaps.length > 0) {
        // Convert seatmap data to ShapeData format
        const convertedShapes: ShapeData[] = (seatMaps[0].sections || [])
          .filter(section => section.status === 1) // Chỉ hiển thị các section có status = 1 (đang hoạt động)
          .map((section: any) => {
            // Find the first seat to determine rows and cols if possible
            let rows = 5, cols = 8; // default values
            
            if (section.seats && section.seats.length > 0) {
              const maxRowIndex = Math.max(...section.seats.map((seat: any) => seat.rowIndex));
              const maxColIndex = Math.max(...section.seats.map((seat: any) => seat.colIndex));
              rows = maxRowIndex;
              cols = maxColIndex;
            }
            
            // Get attribute values if available
            const attr = section.attribute || {};
            
            return {
              id: `section-${section.id}`,
              x: (attr && attr.x) || 50,
              y: (attr && attr.y) || 50,
              width: (attr && attr.width) || 200,
              height: (attr && attr.height) || 150,
              rotation: (attr && attr.rotate) || 0,
              name: section.name || `Khu vực ${section.id}`,
              rows: rows,
              cols: cols,
              price: section.price || 100000,
              color: (attr && attr.fill) || "#FF0082",
              ticketTypeId: section.ticketTypeId || null,
              status: section.status, // Thêm status vào ShapeData để theo dõi trạng thái
              attributeId: (attr && attr.id) || null // Lưu attribute ID để dùng khi cập nhật
            };
          });
        
        setShapes(convertedShapes);
      }
    } catch (err) {
      console.error('Error refreshing seat map data:', err);
      setError("Lỗi khi làm mới dữ liệu sơ đồ ghế: " + (err as Error).message);
    } finally {
      setLoadingSeatMap(false);
    }
  };

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
      color: "#FF0082", // Màu hồng thương hiệu
      ticketTypeId: null
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
    // If updating ticketTypeId, check constraint
    /* if (field === 'ticketTypeId') {
      const ticketTypeId = value === 'none' ? null : Number(value);
      
      // Check if this ticket type is already used in another section
      // Chỉ kiểm tra ràng buộc nếu section hiện tại không phải là section mới (chưa có id thật)
      const currentShape = shapes.find(s => s.id === selectedId);
      if (ticketTypeId !== null && currentShape && shapes.some(s => s.id !== selectedId && s.ticketTypeId === ticketType)) {
        alert('Loại vé này đã được sử dụng cho khu vực khác. Mỗi loại vé chỉ được dùng cho một khu vực.');
        return;
      }
    } */
    
    setShapes(shapes.map(s => s.id === selectedId ? { ...s, [field]: value === 'none' ? null : value } : s));
  };

  // 5. HÀM LƯU SƠ ĐỒ GHẾ VỚI LOGIC CẬP NHẬT SECTION ĐÃ TỒN TẠI
  const handleSaveWithExistingCheck = async () => {
    if (!showingId) {
      alert("Không có showingId để lưu sơ đồ ghế!");
      return;
    }

    try {
      // GET lại seatmap hiện tại từ server để đảm bảo dữ liệu mới nhất
      const existingSeatMaps = await seatMapService.getSeatMapsByShowingId(showingId);
      const existingSeatMap = existingSeatMaps && existingSeatMaps.length > 0 ? existingSeatMaps[0] : null;

      // Với mỗi shape trong editor, kiểm tra xem đó là section đã tồn tại hay mới
      for (const shape of shapes) {
        // Trích xuất ID thật từ format "section-{id}" nếu có
        const realSectionId = shape.id.startsWith('section-') ? parseInt(shape.id.replace('section-', '')) : null;

        if (realSectionId) {
          // Đây là section đã tồn tại, cần cập nhật
          try {
            // GET chi tiết section từ server để so sánh
            const serverSection = await seatMapService.getSectionById(realSectionId);
            
            // So sánh và cập nhật section nếu có thay đổi
            const sectionUpdates: Partial<Section> = {};
            if (serverSection.name !== shape.name) sectionUpdates.name = shape.name;
            if (serverSection.ticketTypeId !== (shape.ticketTypeId || 0)) sectionUpdates.ticketTypeId = shape.ticketTypeId || 0;
            
            if (Object.keys(sectionUpdates).length > 0) {
              await seatMapService.updateSection(realSectionId, sectionUpdates);
              console.log(`Cập nhật section ${realSectionId} thành công`);
            }

            // Cập nhật section attribute
            // API dùng sectionId làm path param cho cả GET và PUT: /seat-map/section-attributes/{sectionId}
            // Nên ta kiểm tra attribute có tồn tại không, rồi dùng sectionId để PUT/POST
            let attributeExists = false;
            let currentAttribute: SectionAttribute | null = null;
            try {
              currentAttribute = await seatMapService.getSectionAttributeBySectionId(realSectionId);
              attributeExists = currentAttribute != null && typeof currentAttribute === 'object' && 'x' in currentAttribute;
            } catch {
              attributeExists = false;
            }

            if (attributeExists && currentAttribute) {
              // Attribute đã tồn tại, dùng PUT với sectionId để cập nhật
              const attrUpdates: Partial<SectionAttribute> = {
                sectionId: realSectionId
              };
              if (currentAttribute.x !== shape.x) attrUpdates.x = shape.x;
              if (currentAttribute.y !== shape.y) attrUpdates.y = shape.y;
              if (currentAttribute.width !== shape.width) attrUpdates.width = shape.width;
              if (currentAttribute.height !== shape.height) attrUpdates.height = shape.height;
              if (currentAttribute.rotate !== shape.rotation) attrUpdates.rotate = shape.rotation;
              if (currentAttribute.fill !== shape.color) attrUpdates.fill = shape.color;

              if (Object.keys(attrUpdates).length > 1) {
                await seatMapService.updateSectionAttribute(attrUpdates);
                console.log(`Cập nhật attribute cho section ${realSectionId} thành công (PUT /seat-map/section-attributes)`);
              } else {
                console.log(`Không có thay đổi nào cần cập nhật cho attribute của section ${realSectionId}`);
              }
            } else {
              // Attribute chưa tồn tại, tạo mới bằng POST
              const attributePayload: Omit<SectionAttribute, 'id'> = {
                x: shape.x,
                y: shape.y,
                width: shape.width,
                height: shape.height,
                scaleX: 1,
                scaleY: 1,
                rotate: shape.rotation,
                fill: shape.color,
                sectionId: realSectionId
              };

              const newAttribute = await seatMapService.createSectionAttribute(attributePayload);
              console.log(`Tạo mới attribute cho section ${realSectionId} thành công (POST)`, newAttribute);
            }

            // Nếu có thay đổi về rows/cols, có thể cập nhật lại seats
            if (serverSection.seats && (serverSection.seats.length !== shape.rows * shape.cols)) {
              // Xóa các seats hiện tại và tạo lại
              // (Ở đây có thể cần thêm logic để xử lý lại seats nếu cần)
            }
          } catch (error) {
            console.error(`Lỗi khi cập nhật section ${realSectionId}:`, error);
            alert(`Lỗi khi cập nhật section ${realSectionId}: ${(error as Error).message}`);
          }
        } else {
          // Đây là section mới (chưa có ID thật), tạo mới
          try {
            const isStage = shape.ticketTypeId === null;
            const newSectionData = {
              name: shape.name,
              seatMapId: existingSeatMap?.id || 0,
              status: 1,
              isStage: isStage,
              isSalable: !isStage,
              isReservingSeat: false,
              message: "",
              ticketTypeId: shape.ticketTypeId || 0,
              price: shape.price
            };

            const createdSection = await seatMapService.createSection(newSectionData);
            console.log(`Tạo mới section ${createdSection.id} thành công`);

            // Tạo section attribute cho section mới
            await seatMapService.createSectionAttribute({
              x: shape.x,
              y: shape.y,
              width: shape.width,
              height: shape.height,
              scaleX: 1,
              scaleY: 1,
              rotate: shape.rotation,
              fill: isStage ? "#808080" : shape.color, // Màu xám cho stage
              sectionId: createdSection.id
            });

            // Nếu không phải là stage, tạo seats
            if (!isStage) {
              await seatMapService.createSeatsBatch({
                sectionId: createdSection.id,
                price: shape.price,
                status: 'AVAILABLE',
                isSalable: true,
                rows: shape.rows,
                cols: shape.cols,
                startRow: 1,
                startCol: 1,
                codePrefix: shape.name.charAt(0),
                overwrite: true
              });
            }
          } catch (error) {
            console.error(`Lỗi khi tạo section mới:`, error);
            alert(`Lỗi khi tạo section mới: ${(error as Error).message}`);
          }
        }
      }

      alert("Cập nhật sơ đồ ghế thành công!");
      // Làm mới dữ liệu sau khi lưu
      refreshSeatMap();
    } catch (error) {
      console.error("Lỗi khi lưu sơ đồ ghế:", error);
      alert("Lỗi khi lưu sơ đồ ghế: " + (error as Error).message);
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

    // Xác định nếu đây là stage (khi không có ticketTypeId)
    const isStage = shape.ticketTypeId === null;
    const sectionColor = isStage ? "#808080" : shape.color; // Màu xám cho stage
    const opacity = isStage ? 0.5 : 0.3; // Độ trong suốt khác nhau cho stage

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
            fill={sectionColor}
            opacity={opacity}
            stroke={isSelected ? "#009688" : isStage ? "#666" : "black"} // Viền đậm hơn cho stage
            strokeWidth={isSelected ? 2 : 1}
            cornerRadius={4}
          />

          {/* 2. Label Tên Khu Vực */}
          <Text
            text={`${shape.name}\n(${shape.rows}x${shape.cols})${isStage ? '\n(STAGE)' : ''}`}
            width={shape.width}
            height={shape.height}
            align="center"
            verticalAlign="middle"
            fontSize={14}
            fontStyle={isStage ? "italic bold" : "bold"}
            fill={isStage ? "#ffffff" : "#00"}
          />

          {/* 3. Lưới Ghế (Visual giả lập để user dễ hình dung) - Không hiển thị nếu là stage */}
          {!isStage && Array.from({ length: shape.rows }).map((_, r) =>
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

  if (loadingSeatMap) {
    return (
      <div className="flex h-[600px] items-center justify-center bg-card border border-border rounded-xl">
        <div className="text-center">
          <FontAwesomeIcon icon={faRefresh} spin className="text-2xl text-primary mb-2" />
          <p className="text-muted-foreground">Đang tải sơ đồ ghế...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[600px] flex-col items-center justify-center bg-card border border-border rounded-xl p-4">
        <div className="text-red-500 text-center mb-4">
          <p className="font-medium">Lỗi: {error}</p>
        </div>
        <Button onClick={() => showingId && refreshSeatMap()}>
          <FontAwesomeIcon icon={faRefresh} className="mr-2" /> Thử lại
        </Button>
      </div>
    );
  }

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
        {showingId && (
          <Button
            size="icon"
            variant="outline"
            onClick={refreshSeatMap}
            title="Làm mới dữ liệu"
          >
            <FontAwesomeIcon icon={faRefresh} className="text-muted-foreground" />
          </Button>
        )}
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
                    s.id === shape.id ? { ...s, ...newAttrs } : s
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
          <Button size="sm" onClick={handleSaveWithExistingCheck} className="bg-primary hover:bg-primary/90">
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

            {/* Thêm phần chọn loại vé */}
            <div className="space-y-1">
              <Label>Loại vé</Label>
              {loadingTicketTypes ? (
                <div className="text-muted-foreground text-sm">Đang tải loại vé...</div>
              ) : ticketTypes.length > 0 ? (
                <Select
                  value={selectedShape.ticketTypeId?.toString() || 'none'}
                  onValueChange={(value) => updateSelectedShape("ticketTypeId", value)}
                >
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue placeholder="Chọn loại vé" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Không chọn</SelectItem>
                    {ticketTypes.map((ticketType) => {
                      // Kiểm tra xem loại vé này đã được sử dụng ở section khác chưa
                      // Bỏ qua kiểm tra nếu section hiện tại là section mới (chưa có id thật)
                      /* const currentShape = shapes.find(s => s.id === selectedId);
                      const isCurrentShapeNew = currentShape && currentShape.id.startsWith('section-'); // Section mới sẽ có id dạng 'section-timestamp'
                      const isDisabled = !isCurrentShapeNew && shapes.some(s => s.id !== selectedId && s.ticketTypeId === ticketType.id); */
                      
                      return (
                        <SelectItem 
                          key={ticketType.id} 
                          value={ticketType.id.toString()}
                          /* disabled={isDisabled} */
                        >
                          {ticketType.name} - {new Intl.NumberFormat('vi-VN').format(ticketType.price)}đ
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-muted-foreground text-sm">Chưa có loại vé nào</div>
              )}
            </div>

            <div className="flex flex-col gap-2 pt-4">
              {false && (
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => {
                  setShapes(shapes.filter(s => s.id !== selectedId));
                  setSelectedId(null);
                }}
              >
                <FontAwesomeIcon icon={faTrash} className="mr-2" /> Xóa khu vực
              </Button>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => openDialog('soft-delete', () => softDeleteSection(selectedId!))}
              >
                <FontAwesomeIcon icon={faEyeSlash} className="mr-2" /> Ẩn khu vực
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground text-sm text-center mt-10">
            Chọn một khu vực trên bản vẽ để chỉnh sửa hoặc nhấn dấu (+) để thêm mới.
            {showingId && shapes.length === 0 && (
              <p className="mt-2 text-xs">Chưa có khu vực nào được tạo cho suất diễn này.</p>
            )}
          </div>
        )}
      </div>

      {/* Dialog xác nhận xóa mềm */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogType === 'soft-delete' ? 'Xác nhận ẩn khu vực' : 'Xác nhận xóa khu vực'}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {dialogType === 'soft-delete' 
              ? 'Bạn có chắc chắn muốn ẩn khu vực này? Khu vực sẽ vẫn tồn tại trong hệ thống nhưng sẽ không hiển thị.'
              : 'Bạn có chắc chắn muốn xóa khu vực này? Hành động này không thể hoàn tác.'}
          </DialogDescription>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button variant="destructive" onClick={handleDialogConfirm}>
              {dialogType === 'soft-delete' ? 'Ẩn khu vực' : 'Xóa khu vực'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}