import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBoxOpen } from "@fortawesome/free-solid-svg-icons";

export default function EventManagerPage() {
  return (
    <div className="space-y-6">

      {/* 1. HEADER BAR: Search + Tabs */}
      <div className="bg-card p-4 rounded-xl border border-border flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
        {/* LEFT: Search Group */}
        <div className="flex gap-2 items-center">
          <div className="relative flex-1 lg:w-96">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
                placeholder="Tìm kiếm sự kiện..."
                className="pl-10 bg-input border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
            />
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap">
            Tìm kiếm đi
          </Button>
        </div>

        {/* RIGHT: Filter Tabs */}
        <Tabs defaultValue="all" className="w-full lg:w-auto">
          <TabsList className="bg-background border border-border text-muted-foreground">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Tất cả</TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Sắp tới</TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Đã qua</TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Chờ duyệt</TabsTrigger>
            <TabsTrigger value="draft" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Nháp</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 2. TAB CONTENT */}
      <Tabs defaultValue="all" className="w-full">
        {/* Nội dung Tab: Tất cả */}
        <TabsContent value="all" className="mt-6">
            {/* TRẠNG THÁI TRỐNG (EMPTY STATE) - Giống ảnh mẫu */}
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-card rounded-xl border border-border border-dashed">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                    <FontAwesomeIcon icon={faBoxOpen} className="text-3xl text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground">Chưa có sự kiện nào</h3>
                <p className="text-sm mb-6">Hãy bắt đầu tạo sự kiện đầu tiên của bạn ngay hôm nay.</p>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Tạo sự kiện ngay
                </Button>
            </div>
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
            {/* TRẠNG THÁI TRỐNG (EMPTY STATE) - Giống ảnh mẫu */}
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-card rounded-xl border border-border border-dashed">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                    <FontAwesomeIcon icon={faBoxOpen} className="text-3xl text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground">Chưa có sự kiện nào</h3>
                <p className="text-sm mb-6">Hãy bắt đầu tạo sự kiện đầu tiên của bạn ngay hôm nay.</p>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Tạo sự kiện ngay
                </Button>
            </div>
        </TabsContent>

        <TabsContent value="past"><div className="text-foreground">Danh sách sự kiện đã qua...</div></TabsContent>
        <TabsContent value="pending"><div className="text-foreground">Danh sách chờ duyệt...</div></TabsContent>
        <TabsContent value="draft"><div className="text-foreground">Danh sách nháp...</div></TabsContent>
      </Tabs>
    </div>
  );
}
