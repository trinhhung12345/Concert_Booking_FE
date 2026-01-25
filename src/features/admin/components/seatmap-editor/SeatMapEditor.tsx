import React, { useState, useRef } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  FaSquare,
  FaMusic,
  FaPlus,
  FaTrash,
  FaSave,
  FaUndo,
  FaRedo,
  FaSearchPlus,
  FaSearchMinus,
  FaHandPaper
} from 'react-icons/fa';
import type { SeatMap, SeatMapSection, SeatMapSectionAttribute } from '../../types/seatmap';
import { seatMapService } from '../../services/seatMapService';

// Default values
const DEFAULT_VIEWBOX = "0 0 1200 800";
const DEFAULT_SECTION_COLOR = "#3B82F6"; // blue-500
const DEFAULT_STAGE_COLOR = "#EF4444"; // red-500

const SeatMapEditor: React.FC<{ showingId?: number }> = ({ showingId }) => {
  // State for seatmap data
  const [seatMap, setSeatMap] = useState<SeatMap>({
    id: 0,
    name: '',
    status: 1,
    viewbox: DEFAULT_VIEWBOX,
    showingId: showingId || 0,
    sections: [],
    elements: []
  });

  // State for UI controls
  const [selectedTool, setSelectedTool] = useState<'select' | 'section' | 'stage' | 'element'>('select');
  const [selectedSection, setSelectedSection] = useState<SeatMapSection | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionMessage, setNewSectionMessage] = useState('');
  const [newSectionTicketType, setNewSectionTicketType] = useState('1');
  const [saving, setSaving] = useState(false);
  
  const svgRef = useRef<SVGSVGElement>(null);

  // Load existing seatmap if showingId is provided
  React.useEffect(() => {
    if (showingId) {
      const loadSeatMap = async () => {
        try {
          // For now, we'll initialize with the showingId
          // In a real implementation, you would fetch the existing seatmap
          setSeatMap(prev => ({
            ...prev,
            showingId: showingId
          }));
        } catch (error) {
          console.error('Error loading seatmap:', error);
        }
      };

      loadSeatMap();
    }
  }, [showingId]);

  // Handle SVG click to add sections
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (selectedTool !== 'section' && selectedTool !== 'stage') return;
    
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorpt = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    
    const newSection: SeatMapSection = {
      id: Date.now(),
      name: newSectionName || (selectedTool === 'stage' ? 'Sân khấu' : `Khu ${seatMap.sections.length + 1}`),
      seatMapId: seatMap.id,
      status: 1,
      isStage: selectedTool === 'stage',
      isSalable: selectedTool !== 'stage',
      isReservingSeat: false,
      message: newSectionMessage || (selectedTool === 'stage' ? 'Sân khấu' : ''),
      ticketTypeId: parseInt(newSectionTicketType) || null,
      attribute: {
        x: cursorpt.x - 100,
        y: cursorpt.y - 50,
        width: 200,
        height: 100,
        scaleX: 1,
        scaleY: 1,
        rotate: 0,
        fill: selectedTool === 'stage' ? DEFAULT_STAGE_COLOR : DEFAULT_SECTION_COLOR,
        sectionId: 0 // Will be updated after saving
      }
    };
    
    setSeatMap(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    
    setSelectedSection(newSection);
    setSelectedTool('select');
  };

  // Handle mouse down on a section for dragging
  const handleMouseDown = (e: React.MouseEvent, section: SeatMapSection) => {
    if (selectedTool !== 'select') return;
    
    e.stopPropagation();
    setSelectedSection(section);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Handle mouse move for dragging sections
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedSection) return;
    
    const svg = svgRef.current;
    if (!svg) return;
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    setSeatMap(prev => ({
      ...prev,
      sections: prev.sections.map(sec => 
        sec.id === selectedSection.id 
          ? { 
              ...sec, 
              attribute: { 
                ...sec.attribute, 
                x: sec.attribute.x + dx, 
                y: sec.attribute.y + dy 
              } 
            } 
          : sec
      )
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle section deletion
  const handleDeleteSection = () => {
    if (!selectedSection) return;
    
    setSeatMap(prev => ({
      ...prev,
      sections: prev.sections.filter(sec => sec.id !== selectedSection.id)
    }));
    
    setSelectedSection(null);
  };

  // Handle property changes
  const handlePropertyChange = (property: keyof SeatMapSectionAttribute, value: any) => {
    if (!selectedSection) return;

    setSeatMap(prev => ({
      ...prev,
      sections: prev.sections.map(sec =>
        sec.id === selectedSection.id
          ? {
              ...sec,
              attribute: {
                ...sec.attribute,
                [property]: value
              }
            }
          : sec
      )
    }));

    // Update selected section reference
    setSelectedSection(prev =>
      prev ? {
        ...prev,
        attribute: {
          ...prev.attribute,
          [property]: value
        }
      } : null
    );
  };

  // Handle color change
  const handleColorChange = (color: string) => {
    handlePropertyChange('fill', color);
  };

  // Reset form inputs
  const resetFormInputs = () => {
    setNewSectionName('');
    setNewSectionMessage('');
    setNewSectionTicketType('1');
  };

  // Save the seatmap to the server
  const handleSaveSeatMap = async () => {
    if (!seatMap.name.trim()) {
      alert('Vui lòng nhập tên sơ đồ ghế');
      return;
    }

    const actualShowingId = showingId || seatMap.showingId;
    if (!actualShowingId) {
      alert('Vui lòng chọn suất diễn để thiết lập sơ đồ ghế');
      return;
    }

    setSaving(true);

    try {
      // First, check if a seatmap already exists for this showing
      let savedSeatMap = seatMap;
      let seatMapExists = seatMap.id !== 0;

      // If no seatmap exists for this showing, create one
      if (!seatMapExists) {
        const response = await seatMapService.createSeatMap({
          name: seatMap.name || `Sơ đồ ghế cho suất #${actualShowingId}`,
          status: seatMap.status,
          viewbox: seatMap.viewbox,
          showingId: actualShowingId
        });
        savedSeatMap = response;
        setSeatMap(response);
      } else {
        // Update existing seatmap
        const response = await seatMapService.updateSeatMap(seatMap.id, {
          name: seatMap.name,
          status: seatMap.status,
          viewbox: seatMap.viewbox,
          showingId: actualShowingId
        });
        savedSeatMap = response;
      }

      // Process sections
      for (const section of savedSeatMap.sections) {
        // Create or update section
        let savedSection = section;
        // Check if this is a newly created section (using timestamp as ID)
        const isNewSection = section.id.toString().length > 12; // Date.now() generates 13-digit number

        if (isNewSection) {
          const response = await seatMapService.createSection({
            name: section.name,
            seatMapId: savedSeatMap.id,
            status: section.status,
            isStage: section.isStage,
            isSalable: section.isSalable,
            isReservingSeat: section.isReservingSeat,
            message: section.message,
            ticketTypeId: section.ticketTypeId
          });
          savedSection = response;
        } else {
          const response = await seatMapService.updateSection(section.id, {
            name: section.name,
            seatMapId: savedSeatMap.id,
            status: section.status,
            isStage: section.isStage,
            isSalable: section.isSalable,
            isReservingSeat: section.isReservingSeat,
            message: section.message,
            ticketTypeId: section.ticketTypeId
          });
          savedSection = response;
        }

        // Create/update section attribute
        if (savedSection.attribute) {
          await seatMapService.createSectionAttribute({
            x: savedSection.attribute.x,
            y: savedSection.attribute.y,
            width: savedSection.attribute.width,
            height: savedSection.attribute.height,
            scaleX: savedSection.attribute.scaleX,
            scaleY: savedSection.attribute.scaleY,
            rotate: savedSection.attribute.rotate,
            fill: savedSection.attribute.fill,
            sectionId: savedSection.id
          });
        }

        // If section has seats configuration, create them
        // For now, we'll create a default 5x5 grid of seats for demonstration
        if (section.isSalable && !section.isStage) {
          await seatMapService.createSeatsBatch({
            sectionId: savedSection.id,
            price: 500000, // Default price
            status: 'AVAILABLE',
            isSalable: true,
            rows: 5,
            cols: 5,
            startRow: 1,
            startCol: 1,
            codePrefix: section.name.charAt(0),
            overwrite: true
          });
        }
      }

      alert('Lưu sơ đồ ghế thành công!');
    } catch (error) {
      console.error('Error saving seatmap:', error);
      alert('Lỗi khi lưu sơ đồ ghế: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // Render the seatmap sections
  const renderSections = () => {
    return seatMap.sections.map((section) => (
      <g
        key={section.id}
        transform={`translate(${section.attribute.x}, ${section.attribute.y})`}
        onMouseDown={(e) => handleMouseDown(e, section)}
        className={`cursor-move ${selectedSection?.id === section.id ? 'outline outline-2 outline-blue-500' : ''}`}
      >
        <rect
          width={section.attribute.width}
          height={section.attribute.height}
          fill={section.attribute.fill}
          opacity={0.7}
          stroke={selectedSection?.id === section.id ? "#3B82F6" : "#9CA3AF"}
          strokeWidth={selectedSection?.id === section.id ? 2 : 1}
          rx={4}
        />
        <text
          x={section.attribute.width / 2}
          y={section.attribute.height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="14"
          fontWeight="bold"
        >
          {section.name}
        </text>
      </g>
    ));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Toolbar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-gray-800">Thiết kế sơ đồ ghế</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="seatmap-name">Tên sơ đồ</Label>
            <Input
              id="seatmap-name"
              value={seatMap.name}
              onChange={(e) => setSeatMap({...seatMap, name: e.target.value})}
              placeholder="Nhập tên sơ đồ ghế"
            />
          </div>
          
          <div>
            <Label htmlFor="showing-id">ID Buổi diễn</Label>
            <Input
              id="showing-id"
              type="number"
              value={seatMap.showingId}
              onChange={(e) => setSeatMap({...seatMap, showingId: parseInt(e.target.value) || 0})}
              placeholder="ID buổi diễn"
            />
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-semibold mb-2">Công cụ</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={selectedTool === 'select' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTool('select')}
            >
              <FaHandPaper className="mr-1" /> Chọn
            </Button>
            <Button
              variant={selectedTool === 'section' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setSelectedTool('section');
                resetFormInputs();
              }}
            >
              <FaSquare className="mr-1" /> Khu vực
            </Button>
            <Button
              variant={selectedTool === 'stage' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setSelectedTool('stage');
                resetFormInputs();
              }}
            >
              <FaMusic className="mr-1" /> Sân khấu
            </Button>
          </div>
        </div>
        
        {selectedTool === 'section' || selectedTool === 'stage' ? (
          <div className="space-y-3">
            <h3 className="font-semibold">Thông tin khu vực</h3>
            <div>
              <Label>Tên khu vực</Label>
              <Input
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                placeholder={selectedTool === 'stage' ? "Tên sân khấu" : "Tên khu vực"}
              />
            </div>
            
            <div>
              <Label>Mô tả</Label>
              <Input
                value={newSectionMessage}
                onChange={(e) => setNewSectionMessage(e.target.value)}
                placeholder="Mô tả khu vực"
              />
            </div>
            
            <div>
              <Label>Loại vé</Label>
              <Select value={newSectionTicketType} onValueChange={setNewSectionTicketType}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại vé" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">VIP</SelectItem>
                  <SelectItem value="2">Thường</SelectItem>
                  <SelectItem value="3">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              size="sm" 
              className="w-full"
              onClick={() => {
                setSelectedTool('select');
                resetFormInputs();
              }}
            >
              <FaPlus className="mr-1" /> Thêm khu vực
            </Button>
          </div>
        ) : null}
        
        {selectedSection && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Thuộc tính khu vực</h3>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDeleteSection}
                title="Xóa khu vực"
              >
                <FaTrash />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label>Vị trí X</Label>
                <Input
                  type="number"
                  value={selectedSection.attribute.x}
                  onChange={(e) => handlePropertyChange('x', parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <Label>Vị trí Y</Label>
                <Input
                  type="number"
                  value={selectedSection.attribute.y}
                  onChange={(e) => handlePropertyChange('y', parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <Label>Chiều rộng</Label>
                <Input
                  type="number"
                  value={selectedSection.attribute.width}
                  onChange={(e) => handlePropertyChange('width', parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <Label>Chiều cao</Label>
                <Input
                  type="number"
                  value={selectedSection.attribute.height}
                  onChange={(e) => handlePropertyChange('height', parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <Label>Màu sắc</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedSection.attribute.fill}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <Input
                    value={selectedSection.attribute.fill}
                    onChange={(e) => handleColorChange(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-auto space-y-2">
          <Button
            className="w-full"
            variant="default"
            onClick={handleSaveSeatMap}
            disabled={saving}
          >
            {saving ? 'Đang lưu...' : <><FaSave className="mr-2" /> Lưu sơ đồ</>}
          </Button>
          <Button className="w-full" variant="outline">
            <FaUndo className="mr-2" /> Hoàn tác
          </Button>
          <Button className="w-full" variant="outline">
            <FaRedo className="mr-2" /> Làm lại
          </Button>
        </div>
      </div>
      
      {/* Canvas Area */}
      <div className="flex-1 relative">
        <TransformWrapper
          initialScale={0.8}
          minScale={0.2}
          maxScale={3}
          limitToBounds={false}
          centerOnInit
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white p-2 rounded-lg shadow-md border border-gray-100">
                <Button size="icon" variant="ghost" onClick={() => zoomIn()} title="Phóng to">
                  <FaSearchPlus />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => zoomOut()} title="Thu nhỏ">
                  <FaSearchMinus />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => resetTransform()} title="Đặt lại">
                  <FaUndo />
                </Button>
              </div>
              
              <TransformComponent wrapperClass="w-full h-full" contentClass="w-full h-full">
                <svg
                  ref={svgRef}
                  viewBox={seatMap.viewbox}
                  className="w-full h-full bg-white border border-gray-200"
                  onClick={handleSvgClick}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  {/* Grid background */}
                  <defs>
                    <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                    </pattern>
                    <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                      <rect width="100" height="100" fill="url(#smallGrid)" />
                      <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#d1d5db" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Render sections */}
                  {renderSections()}
                </svg>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
    </div>
  );
};

export default SeatMapEditor;