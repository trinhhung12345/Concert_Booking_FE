import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SeatMapEditor from '../seatmap-editor/SeatMapEditor';
import { eventService } from '@/features/concerts/services/eventService';

interface StepSeatMapProps {
  eventId?: number;
}

const StepSeatMap: React.FC<StepSeatMapProps> = ({ eventId }) => {
  const [showings, setShowings] = useState<Array<{id: number, startTime: string}>>([]);
  const [selectedShowingId, setSelectedShowingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load showings when eventId is available
  useEffect(() => {
    const loadShowings = async () => {
      if (!eventId) {
        setError("Vui lòng hoàn tất thông tin sự kiện trước khi cấu hình sơ đồ ghế.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const showingData = await eventService.getShowingsByEventId(eventId);
        const formattedShowings = showingData.map(showing => ({
          id: showing.id,
          startTime: showing.startTime
        }));
        setShowings(formattedShowings);

        // Auto-select first showing if available
        if (formattedShowings.length > 0) {
          setSelectedShowingId(formattedShowings[0].id);
        } else {
          setError("Chưa có suất diễn nào được tạo. Vui lòng quay lại bước 2 để tạo suất diễn.");
        }
      } catch (err) {
        console.error('Error loading showings:', err);
        setError("Không thể tải danh sách suất diễn. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    loadShowings();
  }, [eventId]);

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
            <div className="h-[60vh]">
              <SeatMapEditor showingId={selectedShowingId} />
            </div>
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
