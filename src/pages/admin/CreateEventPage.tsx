import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import ImageUploadBox from "@/features/admin/components/ImageUploadBox";
import { categoryService, type Category } from "@/features/concerts/services/categoryService";

interface CreateEventForm {
  title: string;
  venue: string;
  address: string;
  categoryId: string;
  description: string;
  youtubeUrl?: string;
}

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // State lưu file ảnh sau khi crop
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const { register, handleSubmit, control, formState: { errors } } = useForm<CreateEventForm>();

  // Load danh sách Category
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCats();
  }, []);

  const onSubmit = async (data: CreateEventForm) => {
    if (!thumbnailFile || !coverFile) {
        alert("Vui lòng tải lên đầy đủ ảnh đại diện và ảnh bìa!");
        return;
    }

    try {
        setLoading(true);

        // 1. Tạo FormData
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("venue", data.venue);
        formData.append("address", data.address);
        formData.append("description", data.description);
        formData.append("categoryId", data.categoryId);
        if (data.youtubeUrl) formData.append("YoutubeUrl", data.youtubeUrl);

        // 2. Append File (Lưu ý key là "files" cho cả 2 ảnh theo Postman)
        // Backend sẽ phân biệt dựa trên thứ tự hoặc xử lý nội bộ.
        // Thường thì ảnh đầu là thumbnail, ảnh sau là cover, hoặc backend tự resize.
        formData.append("files", thumbnailFile);
        formData.append("files", coverFile);

        // 3. Gọi API (Header Content-Type sẽ tự động được axios set là multipart/form-data)
        const response = await apiClient.post("/events", formData);

        console.log("Success:", response);
        alert("Tạo sự kiện thành công!");
        navigate("/admin/events");

    } catch (error: any) {
        console.error("Error creating event:", error);
        alert("Lỗi khi tạo sự kiện: " + (error.response?.data?.message || error.message));
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tạo sự kiện mới</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* KHỐI 1: HÌNH ẢNH */}
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-4 text-emerald-600 dark:text-emerald-400 border-b pb-2">1. Hình ảnh sự kiện</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Cột trái: Thumbnail (Dọc - Tỷ lệ 2:3 hoặc 3:4) */}
                <div className="md:col-span-1">
                    <ImageUploadBox
                        label="Ảnh dọc (Thumbnail)"
                        aspectRatio={3/4}
                        description="Kích thước gợi ý: 720x960"
                        onImageCropped={setThumbnailFile}
                    />
                </div>

                {/* Cột phải: Cover (Ngang - Tỷ lệ 16:9) */}
                <div className="md:col-span-2">
                    <ImageUploadBox
                        label="Ảnh ngang (Hero/Cover)"
                        aspectRatio={16/9}
                        description="Kích thước gợi ý: 1280x720"
                        onImageCropped={setCoverFile}
                    />

                    {/* Youtube URL Input */}
                    <div className="mt-4">
                        <Label>Link Video Youtube (Optional)</Label>
                        <Input
                            placeholder="https://www.youtube.com/watch?v=..."
                            {...register("youtubeUrl")}
                            className="mt-1 bg-gray-50 dark:bg-[#0f172a]"
                        />
                        <p className="text-xs text-gray-500 mt-1">Nếu có link Youtube, video sẽ được ưu tiên hiển thị trên banner.</p>
                    </div>
                </div>
            </div>
        </div>

        {/* KHỐI 2: THÔNG TIN CƠ BẢN */}
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-4 text-emerald-600 dark:text-emerald-400 border-b pb-2">2. Thông tin sự kiện</h3>

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Tên sự kiện <span className="text-red-500">*</span></Label>
                        <Input
                            placeholder="Nhập tên sự kiện..."
                            {...register("title", { required: true })}
                            className={errors.title ? "border-red-500" : ""}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Thể loại <span className="text-red-500">*</span></Label>
                        <Controller
                            control={control}
                            name="categoryId"
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn thể loại" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(c => (
                                            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Địa điểm tổ chức (Venue) <span className="text-red-500">*</span></Label>
                    <Input placeholder="VD: Sân vận động Mỹ Đình" {...register("venue", { required: true })} />
                </div>

                <div className="space-y-2">
                    <Label>Địa chỉ chi tiết <span className="text-red-500">*</span></Label>
                    <Input placeholder="VD: Số 1 Lê Đức Thọ, Mỹ Đình, Nam Từ Liêm, Hà Nội" {...register("address", { required: true })} />
                </div>
            </div>
        </div>

        {/* KHỐI 3: CHI TIẾT (Rich Editor) */}
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-4 text-emerald-600 dark:text-emerald-400 border-b pb-2">3. Giới thiệu chi tiết</h3>

            <div className="space-y-2">
                <Label>Nội dung bài viết</Label>
                <Controller
                    name="description"
                    control={control}
                    rules={{ required: "Vui lòng nhập mô tả" }}
                    render={({ field }) => (
                        <div className="bg-white text-black rounded-lg overflow-hidden">
                            <ReactQuill
                                theme="snow"
                                value={field.value}
                                onChange={field.onChange}
                                className="h-64 mb-12"
                            />
                        </div>
                    )}
                />
            </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/events")}>Hủy bỏ</Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[150px]" disabled={loading}>
                {loading ? "Đang xử lý..." : "Lưu & Tạo sự kiện"}
            </Button>
        </div>

      </form>
    </div>
  );
}
