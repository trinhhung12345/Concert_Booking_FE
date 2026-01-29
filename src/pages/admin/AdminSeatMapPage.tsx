import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { seatMapService } from '@/features/admin/services/seatMapService';
import type { SeatMap } from '@/features/admin/types/seatmap';
import SeatMapEditor from '@/features/admin/components/seatmap/SeatMapEditor';

const AdminSeatMapPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const showingId = parseInt(id || '0');
  const [seatMaps, setSeatMaps] = useState<SeatMap[]>([]);
  const [activeTab, setActiveTab] = useState<string>('editor');
  
  // Load seatmaps for the event
  useEffect(() => {
    const loadSeatMaps = async () => {
      try {
        // Sử dụng API mới để lấy seatmaps theo showingId
        const response = await seatMapService.getSeatMapsByShowingId(showingId);
        setSeatMaps(response);
        if (response.length > 0) {
          setActiveTab(`view-${response[0].id}`);
        }
      } catch (error) {
        console.error('Error loading seatmaps:', error);
      }
    };

    if (showingId) {
      loadSeatMaps();
    }
  }, [showingId]);

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý sơ đồ ghế</h1>
        <p className="text-gray-600 mt-2">Quản lý sơ đồ ghế cho buổi biểu diễn #{showingId}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-fit lg:grid-cols-3">
          <TabsTrigger value="editor">Thiết kế sơ đồ</TabsTrigger>
          {seatMaps.map((seatMap) => (
            <TabsTrigger key={seatMap.id} value={`view-${seatMap.id}`}>
              {seatMap.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="editor" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Thiết kế sơ đồ ghế mới</CardTitle>
            </CardHeader>
            <CardContent>
              <SeatMapEditor showingId={showingId} />
            </CardContent>
          </Card>
        </TabsContent>

        {seatMaps.map((seatMap) => (
          <TabsContent key={seatMap.id} value={`view-${seatMap.id}`} className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Sơ đồ: {seatMap.name}</CardTitle>
                  <Badge variant={seatMap.status === 1 ? 'default' : 'secondary'}>
                    {seatMap.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-[600px] flex items-center justify-center">
                  <p className="text-gray-500">Hiển thị sơ đồ ghế: {seatMap.name}</p>
                  {/* Placeholder for seatmap viewer */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AdminSeatMapPage;
