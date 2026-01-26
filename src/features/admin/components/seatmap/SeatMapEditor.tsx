import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Transformer } from 'react-konva';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { FaSquare, FaMusic, FaPlus, FaTrash, FaSave, FaUndo, FaRedo } from 'react-icons/fa';
import Konva from 'konva';

interface Section {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  name: string;
  isStage: boolean;
  rows?: number;
  cols?: number;
}

interface SeatMapEditorProps {
  showingId?: number;
}

const SeatMapEditor: React.FC<SeatMapEditorProps> = ({ showingId }) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tool, setTool] = useState<'select' | 'section' | 'stage'>('select');
  const [seatMapName, setSeatMapName] = useState('');
  
  // Form inputs for new section
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionRows, setNewSectionRows] = useState(5);
  const [newSectionCols, setNewSectionCols] = useState(8);
  
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  const selectedSection = sections.find(s => s.id === selectedId);

  // Update transformer when selection changes
  useEffect(() => {
    if (selectedId && transformerRef.current && layerRef.current) {
      const selectedNode = layerRef.current.findOne(`#${selectedId}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
    }
  }, [selectedId]);

  const handleStageClick = (e: any) => {
    // Click on empty area - deselect
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
      return;
    }

    // If in select mode, select the clicked shape
    if (tool === 'select') {
      const clickedId = e.target.id();
      setSelectedId(clickedId);
    }
    
    // If in section/stage mode, add new section
    if (tool === 'section' || tool === 'stage') {
      const stage = e.target.getStage();
      const pointerPosition = stage.getPointerPosition();
      
      const newSection: Section = {
        id: `section-${Date.now()}`,
        x: pointerPosition.x - 100,
        y: pointerPosition.y - 50,
        width: 200,
        height: 100,
        fill: tool === 'stage' ? '#EF4444' : '#3B82F6',
        name: newSectionName || (tool === 'stage' ? 'Sân khấu' : `Khu ${sections.length + 1}`),
        isStage: tool === 'stage',
        rows: tool === 'section' ? newSectionRows : undefined,
        cols: tool === 'section' ? newSectionCols : undefined,
      };
      
      setSections([...sections, newSection]);
      setSelectedId(newSection.id);
      setTool('select');
      setNewSectionName('');
    }
  };

  const handleDragEnd = (id: string) => (e: any) => {
    setSections(sections.map(section =>
      section.id === id
        ? { ...section, x: e.target.x(), y: e.target.y() }
        : section
    ));
  };

  const handleTransformEnd = (id: string) => (e: any) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Reset scale
    node.scaleX(1);
    node.scaleY(1);

    setSections(sections.map(section =>
      section.id === id
        ? {
            ...section,
            x: node.x(),
            y: node.y(),
            width: Math.max(50, node.width() * scaleX),
            height: Math.max(30, node.height() * scaleY),
          }
        : section
    ));
  };

  const handleDeleteSection = () => {
    if (selectedId) {
      setSections(sections.filter(s => s.id !== selectedId));
      setSelectedId(null);
    }
  };

  const updateSelectedSection = (updates: Partial<Section>) => {
    if (selectedId) {
      setSections(sections.map(s =>
        s.id === selectedId ? { ...s, ...updates } : s
      ));
    }
  };

  const handleSave = async () => {
    console.log('Saving seat map:', {
      name: seatMapName,
      showingId,
      sections,
    });
    alert('Lưu sơ đồ ghế thành công! (Chức năng save API chưa hoàn thiện)');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-72 bg-card border-r border-border p-5 flex flex-col gap-4 shadow-xl overflow-y-auto">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-8 bg-primary rounded-full"></div>
          <h2 className="text-xl font-bold text-card-foreground">Thiết kế sơ đồ ghế</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="seatmap-name" className="text-foreground">Tên sơ đồ</Label>
            <Input
              id="seatmap-name"
              value={seatMapName}
              onChange={(e) => setSeatMapName(e.target.value)}
              placeholder="Nhập tên sơ đồ ghế"
              className="bg-background border-input text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <Separator className="bg-border" />

        <div>
          <h3 className="font-semibold mb-2 text-card-foreground">Công cụ</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={tool === 'select' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTool('select')}
            >
              Chọn
            </Button>
            <Button
              variant={tool === 'section' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTool('section')}
            >
              <FaSquare className="mr-1" /> Khu vực
            </Button>
            <Button
              variant={tool === 'stage' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTool('stage')}
              className="col-span-2"
            >
              <FaMusic className="mr-1" /> Sân khấu
            </Button>
          </div>
        </div>

        {tool !== 'select' && (
          <div className="space-y-3 bg-muted/50 p-4 rounded-lg border border-border">
            <h3 className="font-semibold text-foreground">Thông tin khu vực</h3>
            <div>
              <Label className="text-foreground">Tên khu vực</Label>
              <Input
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                placeholder={tool === 'stage' ? 'Tên sân khấu' : 'Tên khu vực'}
                className="bg-background border-input text-foreground placeholder:text-muted-foreground"
              />
            </div>
            
            {tool === 'section' && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-foreground text-xs">Số hàng</Label>
                    <Input
                      type="number"
                      value={newSectionRows}
                      onChange={(e) => setNewSectionRows(Number(e.target.value))}
                      className="bg-background border-input text-foreground"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground text-xs">Số cột</Label>
                    <Input
                      type="number"
                      value={newSectionCols}
                      onChange={(e) => setNewSectionCols(Number(e.target.value))}
                      className="bg-background border-input text-foreground"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tổng: {newSectionRows * newSectionCols} ghế
                </p>
              </>
            )}
            
            <p className="text-xs text-muted-foreground">
              Nhấp vào canvas để thêm {tool === 'stage' ? 'sân khấu' : 'khu vực'}
            </p>
          </div>
        )}

        {selectedSection && (
          <div className="mt-4 bg-muted/50 p-4 rounded-lg border border-border">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-foreground">Thuộc tính</h3>
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
                <Label className="text-foreground text-xs">Tên</Label>
                <Input
                  value={selectedSection.name}
                  onChange={(e) => updateSelectedSection({ name: e.target.value })}
                  className="bg-background border-input text-foreground text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-muted-foreground text-xs">Vị trí X</Label>
                  <Input
                    type="number"
                    value={Math.round(selectedSection.x)}
                    onChange={(e) => updateSelectedSection({ x: Number(e.target.value) })}
                    className="bg-background border-input text-foreground text-sm"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Vị trí Y</Label>
                  <Input
                    type="number"
                    value={Math.round(selectedSection.y)}
                    onChange={(e) => updateSelectedSection({ y: Number(e.target.value) })}
                    className="bg-background border-input text-foreground text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-muted-foreground text-xs">Chiều rộng</Label>
                  <Input
                    type="number"
                    value={Math.round(selectedSection.width)}
                    onChange={(e) => updateSelectedSection({ width: Number(e.target.value) })}
                    className="bg-background border-input text-foreground text-sm"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Chiều cao</Label>
                  <Input
                    type="number"
                    value={Math.round(selectedSection.height)}
                    onChange={(e) => updateSelectedSection({ height: Number(e.target.value) })}
                    className="bg-background border-input text-foreground text-sm"
                  />
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground text-xs">Màu sắc</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedSection.fill}
                    onChange={(e) => updateSelectedSection({ fill: e.target.value })}
                    className="w-10 h-10 border border-input rounded cursor-pointer bg-background"
                  />
                  <Input
                    value={selectedSection.fill}
                    onChange={(e) => updateSelectedSection({ fill: e.target.value })}
                    className="bg-background border-input text-foreground text-sm"
                  />
                </div>
              </div>

              {!selectedSection.isStage && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-foreground text-xs">Số hàng</Label>
                    <Input
                      type="number"
                      value={selectedSection.rows || 5}
                      onChange={(e) => updateSelectedSection({ rows: Number(e.target.value) })}
                      className="bg-background border-input text-foreground text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground text-xs">Số cột</Label>
                    <Input
                      type="number"
                      value={selectedSection.cols || 8}
                      onChange={(e) => updateSelectedSection({ cols: Number(e.target.value) })}
                      className="bg-background border-input text-foreground text-sm"
                    />
                  </div>
                </div>
              )}

              {!selectedSection.isStage && (
                <p className="text-xs text-muted-foreground">
                  Tổng: {(selectedSection.rows || 5) * (selectedSection.cols || 8)} ghế
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-auto space-y-2">
          <Button
            className="w-full"
            variant="default"
            onClick={handleSave}
          >
            <FaSave className="mr-2" /> Lưu sơ đồ
          </Button>
          <Button className="w-full" variant="outline">
            <FaUndo className="mr-2" /> Hoàn tác
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative bg-muted/30">
        <div className="w-full h-full flex items-center justify-center p-8">
          <div className="bg-card border border-border rounded-lg shadow-2xl overflow-hidden">
            <Stage
              ref={stageRef}
              width={1200}
              height={800}
              onClick={handleStageClick}
              onTap={handleStageClick}
            >
              <Layer ref={layerRef}>
                {/* Background */}
                <Rect
                  x={0}
                  y={0}
                  width={1200}
                  height={800}
                  fill="hsl(var(--muted))"
                />

                {/* Grid pattern */}
                {Array.from({ length: 30 }).map((_, i) => (
                  <React.Fragment key={`grid-${i}`}>
                    <Rect
                      x={i * 40}
                      y={0}
                      width={1}
                      height={800}
                      fill="hsl(var(--border))"
                      opacity={0.3}
                    />
                    <Rect
                      x={0}
                      y={i * 40}
                      width={1200}
                      height={1}
                      fill="hsl(var(--border))"
                      opacity={0.3}
                    />
                  </React.Fragment>
                ))}

                {/* Sections */}
                {sections.map((section) => (
                  <React.Fragment key={section.id}>
                    <Rect
                      id={section.id}
                      x={section.x}
                      y={section.y}
                      width={section.width}
                      height={section.height}
                      fill={section.fill}
                      opacity={0.8}
                      cornerRadius={8}
                      draggable={tool === 'select'}
                      onDragEnd={handleDragEnd(section.id)}
                      onTransformEnd={handleTransformEnd(section.id)}
                      onClick={() => {
                        if (tool === 'select') {
                          setSelectedId(section.id);
                        }
                      }}
                      onTap={() => {
                        if (tool === 'select') {
                          setSelectedId(section.id);
                        }
                      }}
                    />
                    <Text
                      x={section.x}
                      y={section.y + section.height / 2 - 10}
                      width={section.width}
                      text={section.name}
                      fontSize={16}
                      fontStyle="bold"
                      fill="white"
                      align="center"
                      listening={false}
                    />
                    {!section.isStage && (
                      <Text
                        x={section.x}
                        y={section.y + section.height / 2 + 10}
                        width={section.width}
                        text={`${section.rows || 5}x${section.cols || 8} = ${(section.rows || 5) * (section.cols || 8)} ghế`}
                        fontSize={12}
                        fill="white"
                        align="center"
                        listening={false}
                      />
                    )}
                  </React.Fragment>
                ))}

                {/* Transformer */}
                {tool === 'select' && (
                  <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox, newBox) => {
                      // Limit resize
                      if (newBox.width < 50 || newBox.height < 30) {
                        return oldBox;
                      }
                      return newBox;
                    }}
                  />
                )}
              </Layer>
            </Stage>
          </div>
        </div>

        {/* Instructions */}
        {sections.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-6 text-center max-w-md">
              <h3 className="text-lg font-bold text-foreground mb-2">Chào mừng đến với Trình chỉnh sửa sơ đồ ghế</h3>
              <p className="text-sm text-muted-foreground">
                Chọn một khu vực ghế ngồi. Hệ thống sẽ tự động tạo ghế dựa trên số hàng và cột bạn nhập.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatMapEditor;
