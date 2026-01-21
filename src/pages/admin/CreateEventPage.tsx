import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import ImageUploadBox from "@/features/admin/components/ImageUploadBox";
import { categoryService, type Category } from "@/features/concerts/services/categoryService";
import { eventService } from "@/features/concerts/services/eventService"; // Import service vừa sửa
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface CreateEventForm {
  title: string;
  venue: string;
  address: string;
  categoryId: string;
  description: string;
  YoutubeUrl?: string; // Viết hoa chữ Y cho giống Postman key
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
    // Validate ảnh thủ công
    if (!thumbnailFile) {
        alert("Vui lòng tải lên ảnh Thumbnail (Dọc)");
        return;
    }
    // Ảnh Cover là optional tùy bạn, nhưng nên bắt buộc cho đẹp
    if (!coverFile) {
        alert("Vui lòng tải lên ảnh Bìa/Hero (Ngang)");
        return;
    }

    try {
        setLoading(true);

        // --- TẠO FORM DATA CHUẨN POSTMAN ---
        const formData = new FormData();

        // Các trường Text
        formData.append("title", data.title);
        formData.append("venue", data.venue);
        formData.append("address", data.address);
        formData.append("description", data.description);
        formData.append("categoryId", data.categoryId); // API nhận text "2"

        // Trường YoutubeUrl (Optional)
        if (data.YoutubeUrl && data.YoutubeUrl.trim() !== "") {
            formData.append("YoutubeUrl", data.YoutubeUrl);
        }

        // Trường Files (Multiple)
        // Append lần lượt từng file vào cùng 1 key là "files"
        formData.append("files", thumbnailFile);
        formData.append("files", coverFile);

        // Nếu muốn hỗ trợ file thứ 3, bạn thêm ImageUploadBox thứ 3 và append tiếp vào đây.
        // formData.append("files", fileThu3);

        // --- GỌI API ---
        const res = await eventService.create(formData);

        console.log("Created Event:", res);

        // Thành công -> Chuyển hướng
        // Có thể redirect về trang list hoặc trang edit của event vừa tạo
        alert(`Tạo sự kiện "${res.title}" thành công!`);
        navigate("/admin/events");

    } catch (error: any) {
        console.error("Lỗi tạo sự kiện:", error);
        const serverMessage = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.";
        alert(`Thất bại: ${serverMessage}`);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4">
      <div className="flex items-center gap-4 mb-6 pt-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/events")}>
            <FontAwesomeIcon icon={faArrowLeft} />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tạo sự kiện mới</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* KHỐI 1: HÌNH ẢNH */}
        <div className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border">
            <h3 className="text-lg font-bold mb-4 text-primary border-b border-border pb-2">1. Hình ảnh sự kiện</h3>
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

                    {/* YoutubeUrl */}
                    <div className="mt-4">
                        <Label>Youtube URL (Trailer/Intro)</Label>
                        <Input
                            placeholder="https://www.youtube.com/watch?v=..."
                            {...register("YoutubeUrl")}
                            className="mt-1 bg-input text-foreground"
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* KHỐI 2: THÔNG TIN CƠ BẢN */}
        <div className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border">
            <h3 className="text-lg font-bold mb-4 text-primary border-b border-border pb-2">2. Thông tin sự kiện</h3>

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-foreground">Tên sự kiện <span className="text-destructive">*</span></Label>
                        <Input
                            placeholder="Nhập tên sự kiện..."
                            {...register("title", { required: true })}
                            className={`bg-input text-foreground ${errors.title ? "border-destructive" : ""}`}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-foreground">Thể loại <span className="text-destructive">*</span></Label>
                        <Controller
                            control={control}
                            name="categoryId"
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="bg-input text-foreground">
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
                    <Label className="text-foreground">Địa điểm tổ chức (Venue) <span className="text-destructive">*</span></Label>
                    <Input placeholder="VD: Sân vận động Mỹ Đình" {...register("venue", { required: true })} className="bg-input text-foreground" />
                </div>

                <div className="space-y-2">
                    <Label className="text-foreground">Địa chỉ chi tiết <span className="text-destructive">*</span></Label>
                    <Input placeholder="VD: Số 1 Lê Đức Thọ, Mỹ Đình, Nam Từ Liêm, Hà Nội" {...register("address", { required: true })} className="bg-input text-foreground" />
                </div>
            </div>
        </div>

        {/* KHỐI 3: CHI TIẾT (Rich Editor) */}
        <div className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border">
            <h3 className="text-lg font-bold mb-4 text-primary border-b border-border pb-2">3. Giới thiệu chi tiết</h3>

            <div className="space-y-2">
                <Label className="text-foreground">Nội dung bài viết</Label>
                <Controller
                    name="description"
                    control={control}
                    rules={{ required: "Vui lòng nhập mô tả" }}
                    render={({ field }) => (
                        <div className="rounded-lg overflow-hidden border border-border [&_.ql-toolbar]:bg-muted [&_.ql-toolbar]:border-border [&_.ql-container]:bg-input [&_.ql-container]:border-border [&_.ql-editor]:text-foreground [&_.ql-editor]:min-h-[200px] [&_.ql-picker-label]:text-foreground [&_.ql-stroke]:stroke-foreground [&_.ql-fill]:fill-foreground [&_.ql-picker-options]:bg-popover [&_.ql-picker-options]:text-popover-foreground">
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
        <div className="flex items-center justify-end gap-4 pt-4 border-t sticky bottom-0 bg-background p-4 z-10">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/events")}>
                Hủy bỏ
            </Button>
            <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[180px] text-lg font-semibold shadow-lg"
                disabled={loading}
            >
                {loading ? <><FontAwesomeIcon icon={faSpinner} spin className="mr-2"/> Đang xử lý...</> : "Lưu sự kiện"}
            </Button>
        </div>

      </form>
    </div>
  );
}
