import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SeatMapEditor from '../seatmap/SeatMapEditor';
import { eventService } from '@/features/concerts/services/eventService';
import { seatMapService } from '@/features/admin/services/seatMapService';

interface StepSeatMapProps {
  eventId?: number;
  showingsData?: Array<{id: number, startTime: string}> | null;
}

const StepSeatMap: React.FC<StepSeatMapProps> = ({ eventId, showingsData }) => {
  const [showings, setShowings] = useState<Array<{id: number, startTime: string}>>([]);
  const [selectedShowingId, setSelectedShowingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sử dụng showingsData từ parent thay vì tự load
  useEffect(() => {
    if (showingsData && showingsData.length > 0) {
      setShowings(showingsData);
      // Auto-select first showing if available
      if (!selectedShowingId) {
        setSelectedShowingId(showingsData[0].id);
      }
      setError(null);
    } else if (!eventId) {
      setError("Vui lòng hoàn tất thông tin sự kiện và tạo suất diễn trước.");
    } else if (showingsData && showingsData.length === 0) {
      setError("Chưa có suất diễn nào. Vui lòng quay lại bước 2 để tầo suất diễn.");
    }
  }, [showingsData, eventId, selectedShowingId]);

  // Handle saving the seat map
  const handleSaveSeatMap = async (data: any) => {
    if (!selectedShowingId) {
      setError("Vui lòng chọn suất diễn trước khi lưu sơ đồ ghế.");
      return;
    }

    try {
      // Create or update seat map
      const seatMapPayload = {
        name: data.name || `Sơ đồ ghế cho suất #${selectedShowingId}`,
        status: 1,
        viewbox: data.viewbox || "0 0 1200 800",
        showingId: selectedShowingId
      };

      // If you have an existing seat map ID, update it; otherwise create new
      // For now, we'll create a new one
      const createdSeatMap = await seatMapService.createSeatMap(seatMapPayload);

      // Process sections
      for (const section of data.sections) {
        const sectionPayload = {
          name: section.name,
          seatMapId: createdSeatMap.id,
          status: 1,
          isStage: false, // Assuming these are not stage areas
          isSalable: true, // Assuming these are sellable areas
          isReservingSeat: false,
          message: "",
          ticketTypeId: null
        };

        const createdSection = await seatMapService.createSection(sectionPayload);

        // Create section attributes
        const attributePayload = {
          x: section.attribute.x,
          y: section.attribute.y,
          width: section.attribute.width,
          height: section.attribute.height,
          scaleX: 1,
          scaleY: 1,
          rotate: section.attribute.rotation || 0,
          fill: section.attribute.fill,
          sectionId: createdSection.id
        };

        await seatMapService.createSectionAttribute(attributePayload);

        // Create seats based on rows and columns
        if (section.seats && section.seats.length > 0) {
          // Create seats in batches
          await seatMapService.createSeatsBatch({
            sectionId: createdSection.id,
            price: 500000, // Default price
            status: 'AVAILABLE',
            isSalable: true,
            rows: section.seats.length > 0 ? Math.max(...section.seats.map((s: any) => s.rowIndex)) : 5,
            cols: section.seats.length > 0 ? Math.max(...section.seats.map((s: any) => s.colIndex)) : 8,
            startRow: 1,
            startCol: 1,
            codePrefix: section.name.charAt(0),
            overwrite: true
          });
        }
      }

      alert("Lưu sơ đồ ghế thành công!");
    } catch (err) {
      console.error('Error saving seat map:', err);
      setError("Lỗi khi lưu sơ đồ ghế: " + (err as Error).message);
    }
  };

  return (
    <div className="py-6">
      <Card>
        <CardHeader>
          <CardTitle>Cấu hình Sơ đồ ghế</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Chọn suất diễn</label>
            {loading ? (
              <div className="text-muted-foreground">Đang tải suất diễn...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : showings.length > 0 ? (
              <Select
                value={selectedShowingId?.toString()}
                onValueChange={(value) => setSelectedShowingId(Number(value))}
              >
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Chọn suất diễn để thiết lập sơ đồ ghế" />
                </SelectTrigger>
                <SelectContent>
                  {showings.map((showing) => (
                    <SelectItem key={showing.id} value={showing.id.toString()}>
                      {new Date(showing.startTime).toLocaleString('vi-VN')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-muted-foreground">Chưa có suất diễn nào được tạo</div>
            )}
          </div>

          {selectedShowingId ? (
            <SeatMapEditor showingId={selectedShowingId} />
          ) : error ? (
            <div className="h-[60vh] flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg bg-gray-50">
              <div className="text-center text-muted-foreground p-6">
                <p className="mb-2">{error}</p>
                {eventId && (
                  <p className="text-sm mt-4">
                    Nhấp vào "Lưu & Tiếp tục" ở bước trước để tạo suất diễn trước khi cấu hình sơ đồ ghế.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="h-[60vh] flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
              <div className="text-center text-muted-foreground">
                <p>Vui lòng chọn suất diễn để thiết lập sơ đồ ghế</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StepSeatMap;
