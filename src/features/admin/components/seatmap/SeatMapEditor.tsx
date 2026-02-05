import { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Transformer, Group, Text } from "react-konva";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave, faTrash, faMousePointer, faRefresh } from "@fortawesome/free-solid-svg-icons";
import Konva from "konva";
import { eventService } from "@/features/concerts/services/eventService";
import { seatMapService } from "@/features/admin/services/seatMapService";

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
        const convertedShapes: ShapeData[] = (seatMaps[0].sections || [])?.map((section: any) => {
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
                ticketTypeId: section.ticketTypeId || null
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
        const convertedShapes: ShapeData[] = (seatMaps[0].sections || [])?.map((section: any) => {
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
            ticketTypeId: section.ticketTypeId || null
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

  // 5. HÀM LƯU SƠ ĐỒ GHẾ VỚI LOGIC KIỂM TRA SECTION ĐÃ TỒN TẠI
  const handleSaveWithExistingCheck = async () => {
    if (!showingId) {
      alert("Không có showingId để lưu sơ đồ ghế!");
      return;
    }

    try {
      // Trước tiên, lấy danh sách seatmap hiện tại để kiểm tra section đã tồn tại
      const existingSeatMaps = await seatMapService.getSeatMapsByShowingId(showingId);
      const existingSections = existingSeatMaps && existingSeatMaps.length > 0 
        ? existingSeatMaps[0].sections || []
        : [];

      // Tạo danh sách các section từ editor
      const editorSections = shapes.map(shape => {
        // Lấy ID của section đã tồn tại nếu có (so sánh theo tên)
        const existingSection = existingSections.find((section: any) => section.name === shape.name);
        
        // Xác định nếu đây là stage (khi không có ticketTypeId)
        const isStage = shape.ticketTypeId === null;
        const seats = [];
        
        // Chỉ tạo ghế nếu không phải là stage
        if (!isStage) {
          for (let r = 1; r <= shape.rows; r++) {
            for (let c = 1; c <= shape.cols; c++) {
              seats.push({
                id: Math.floor(Math.random() * 1000000), // ID duy nhất cho mỗi ghế
                code: `${String.fromCharCode(64 + r)}${c}`,
                rowIndex: r,
                colIndex: c,
                status: "AVAILABLE" as const, // Giá trị cụ thể trong union type
                isSalable: true, // Ghế có thể bán
                price: shape.price, // Giá từ shape
                sectionId: existingSection?.id || Math.floor(Math.random() * 10000) // ID section, sẽ được cập nhật sau
              });
            }
          }
        }

        // Tạo các elements mặc định cho trạng thái ghế
        const elements = [
          {
            id: Math.floor(Math.random() * 1000000), // ID duy nhất cho mỗi element
            type: "rect",
            x: shape.x,
            y: shape.y,
            width: shape.width,
            height: shape.height,
            fill: isStage ? "#808080" : shape.color, // Màu xám cho stage
            data: isStage ? "stage-area-element" : "default-section-element",
            display: 1,
            sectionId: Math.floor(Math.random() * 10000) // Temporary ID, sẽ được thay thế khi lưu
          },
          // Element cho ghế trống (chỉ thêm nếu không phải là stage)
          ...(!isStage ? [{
            id: Math.floor(Math.random() * 1000000), // ID duy nhất cho mỗi element
            type: "rect",
            x: shape.x,
            y: shape.y,
            width: 20,
            height: 20,
            fill: "#8080", // màu xám cho ghế trống
            data: "available-seat-element",
            display: 1,
            sectionId: Math.floor(Math.random() * 10000)
          }] : []),
          // Element cho ghế đang chọn (chỉ thêm nếu không phải là stage)
          ...(!isStage ? [{
            id: Math.floor(Math.random() * 1000000), // ID duy nhất cho mỗi element
            type: "rect",
            x: shape.x,
            y: shape.y,
            width: 20,
            height: 20,
            fill: "#FF69B4", // màu hồng cho ghế đang chọn
            data: "selected-seat-element",
            display: 1,
            sectionId: Math.floor(Math.random() * 10000)
          }] : []),
          // Element cho ghế đã bán (chỉ thêm nếu không phải là stage)
          ...(!isStage ? [{
            id: Math.floor(Math.random() * 1000000), // ID duy nhất cho mỗi element
            type: "rect",
            x: shape.x,
            y: shape.y,
            width: 20,
            height: 20,
            fill: "#000000", // màu đen cho ghế đã bán
            data: "booked-seat-element",
            display: 1,
            sectionId: Math.floor(Math.random() * 10000)
          }] : [])
        ];

        // Trả về section object với đầy đủ các trường theo interface Section
        const sectionAttribute = {
          x: shape.x,
          y: shape.y,
          width: shape.width,
          height: shape.height,
          scaleX: 1,
          scaleY: 1,
          rotate: shape.rotation, // Theo interface SectionAttribute
          fill: isStage ? "#808080" : shape.color,
        };

        if (existingSection && existingSection.id) {
          // Section đã tồn tại, giữ nguyên ID
          return {
            id: existingSection.id,
            name: shape.name,
            seatMapId: existingSeatMaps && existingSeatMaps.length > 0 ? existingSeatMaps[0].id : 0,
            status: existingSection.status || 1,
            isStage: isStage,
            isSalable: !isStage,
            isReservingSeat: existingSection.isReservingSeat || false,
            message: existingSection.message || "",
            ticketTypeId: shape.ticketTypeId || 0, // Sử dụng 0 thay cho null để phù hợp với interface
            elements: elements,
            attribute: sectionAttribute,
            seats: seats
          };
        } else {
          // Section mới, không có ID
          // Trả về một đối tượng không có trường id để phân biệt với section đã tồn tại
          return {
            _tempId: `new_${Date.now()}_${Math.random()}`, // ID tạm thời để theo dõi
            name: shape.name,
            seatMapId: existingSeatMaps && existingSeatMaps.length > 0 ? existingSeatMaps[0].id : 0,
            status: 1,
            isStage: isStage,
            isSalable: !isStage,
            isReservingSeat: false,
            message: "",
            ticketTypeId: shape.ticketTypeId || 0, // Sử dụng 0 thay cho null để phù hợp với interface
            elements: elements,
            attribute: sectionAttribute,
            seats: seats
          };
        }
      });

      // Tạo mảng các section mới chỉ chứa các section đã tồn tại (có id)
      const existingSectionsForUpdate = editorSections.filter(section => 'id' in section && section.id !== undefined);
      // Tạo mảng các section mới (không có id)
      const newSectionsForCreate = editorSections.filter(section => !('id' in section) || section.id === undefined);

      // Kiểm tra xem có seatmap hiện tại không
      if (existingSeatMaps && existingSeatMaps.length > 0) {
        // Cập nhật seatmap hiện tại
        const seatMapToUpdate = existingSeatMaps[0];
        // Tạo một seatmap mới với các section đã được lọc
        const updatedSeatMap = {
          ...seatMapToUpdate,
          // Cập nhật các trường có thể thay đổi
          name: seatMapToUpdate.name || "Sơ đồ sự kiện",
          viewbox: seatMapToUpdate.viewbox || "0 0 1200 800",
          showingId: showingId,
          sections: existingSectionsForUpdate // Chỉ gửi các section đã tồn tại để cập nhật
        };
        
        const result = await seatMapService.updateSeatMap(seatMapToUpdate.id, updatedSeatMap);
        console.log("Cập nhật seatmap thành công:", result);
        alert("Cập nhật sơ đồ ghế thành công!");
      } else {
        // Tạo mới seatmap
        // Không gửi các section mới ở đây vì chúng chưa có id, nên chỉ gửi các section có id
        const newSeatMap = {
          name: "Sơ đồ sự kiện mới",
          status: 1, // Active
          viewbox: "0 0 1200 800",
          showingId: showingId,
          sections: [] // Ban đầu không có section nào vì tất cả đều là mới
        };

        const result = await seatMapService.createSeatMap(newSeatMap);
        console.log("Tạo mới seatmap thành công:", result);
        alert("Tạo mới sơ đồ ghế thành công!");
      }

      // Sau khi tạo hoặc cập nhật seatmap, thực hiện tạo các section mới nếu có
      if (newSectionsForCreate.length > 0) {
        // Gọi API để tạo các section mới
        for (const newSection of newSectionsForCreate) {
          // Trích xuất các thuộc tính để sử dụng riêng, giữ lại các thuộc tính khác trong sectionToSend
          const { _tempId, elements, attribute, seats, price, rows, cols, name, ...sectionToSend } = newSection;
          
          // Đảm bảo sectionToSend có đầy đủ các trường cần thiết cho việc tạo section
          // Trong trường hợp các trường bị loại bỏ do destructuring, chúng ta cần bổ sung lại
          const sectionToCreate = {
            ...sectionToSend,
            name: name // Đảm bảo trường name được giữ lại trong section để gửi tới API
          };

          try {
            const createdSection = await seatMapService.createSection(sectionToCreate);
            
            // Kiểm tra nếu section được tạo thành công
            if (createdSection && createdSection.id) {
              // Tạo section attribute nếu có
              if (attribute) {
                const attributePayload = {
                  ...attribute,
                  sectionId: createdSection.id
                };
                await seatMapService.createSectionAttribute(attributePayload);
              }

              // Tạo các seat map elements nếu có
              if (elements && elements.length > 0) {
                for (const element of elements) {
                  const elementPayload = {
                    ...element,
                    sectionId: createdSection.id
                  };
                  await seatMapService.createSeatMapElement(elementPayload);
                }
              }

              // Tạo các seats nếu có
              if (seats && seats.length > 0) {
                // Sử dụng batch API để tạo nhiều seats cùng lúc
                await seatMapService.createSeatsBatch({
                  sectionId: createdSection.id,
                  price: price,
                  status: 'AVAILABLE',
                  isSalable: true,
                  rows: rows,
                  cols: cols,
                  startRow: 1,
                  startCol: 1,
                  codePrefix: name.charAt(0),
                  overwrite: true
                });
              }
            }
          } catch (error) {
            console.error("Lỗi khi tạo section mới:", error);
          }
        }
      }

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
            {showingId && shapes.length === 0 && (
              <p className="mt-2 text-xs">Chưa có khu vực nào được tạo cho suất diễn này.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
