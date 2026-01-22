import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import ImageUploadBox from "@/features/admin/components/ImageUploadBox";
import { categoryService, type Category } from "@/features/concerts/services/categoryService";

// Type cho data form
export interface EventInfoFormValues {
  title: string;
  venue: string;
  address: string;
  categoryId: string;
  description: string;
  YoutubeUrl?: string;
  thumbnailFile?: File | null;
  coverFile?: File | null;
  // Existing images for edit mode (URLs)
  existingThumbnailUrl?: string;
  existingCoverUrl?: string;
}

interface StepEventInfoProps {
  initialData?: Partial<EventInfoFormValues>; // Dữ liệu cũ nếu là Edit
}

const StepEventInfo = forwardRef(({ initialData }: StepEventInfoProps, ref) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const { register, control, trigger, getValues } = useForm<EventInfoFormValues>({
    defaultValues: {
        title: initialData?.title || "",
        venue: initialData?.venue || "",
        address: initialData?.address || "",
        categoryId: initialData?.categoryId?.toString() || "",
        description: initialData?.description || "",
        YoutubeUrl: initialData?.YoutubeUrl || "",
    }
  });

  // Load Categories
  useEffect(() => {
    categoryService.getAll().then(data => setCategories(Array.isArray(data) ? data : []));
  }, []);

  // Populate files from initialData when it changes
  useEffect(() => {
    if (initialData?.thumbnailFile) {
      setThumbnailFile(initialData.thumbnailFile);
    }
    if (initialData?.coverFile) {
      setCoverFile(initialData.coverFile);
    }
  }, [initialData]);

  // Create preview URLs for files to display in ImageUploadBox
  const thumbnailPreviewUrl = thumbnailFile ? URL.createObjectURL(thumbnailFile) : undefined;
  const coverPreviewUrl = coverFile ? URL.createObjectURL(coverFile) : undefined;

  // Set cropped images for preview when files are loaded
  useEffect(() => {
    if (thumbnailPreviewUrl) {
      // For ImageUploadBox, we need to set it as if it's cropped
      // This is a workaround since ImageUploadBox expects croppedImage state
    }
  }, [thumbnailPreviewUrl]);

  useEffect(() => {
    if (coverPreviewUrl) {
      // Same for cover
    }
  }, [coverPreviewUrl]);

  // Expose hàm validate và getData cho cha dùng
  useImperativeHandle(ref, () => ({
    validate: async () => {
      const isValid = await trigger();
      // Create mode: require new images
      if (!thumbnailFile && !initialData?.existingThumbnailUrl) {
          alert("Thiếu ảnh Thumbnail");
          return false;
      }
      if (!coverFile && !initialData?.existingCoverUrl) {
          alert("Thiếu ảnh Cover");
          return false;
      }
      return isValid;
    },
    getData: () => ({
      ...getValues(),
      thumbnailFile,
      coverFile
    })
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

        {/* SECTION 1: MEDIA */}
        <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-lg font-bold mb-4 text-primary border-b border-border pb-2">
                * Upload hình ảnh <span className="text-xs text-muted-foreground font-normal ml-2">Xem vị trí hiển thị</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <ImageUploadBox
                        label="Thumbnail (Dọc)" aspectRatio={3/4} onImageCropped={setThumbnailFile}
                        existingImageUrl={initialData?.existingThumbnailUrl}
                        filePreviewUrl={thumbnailPreviewUrl}
                    />
                </div>
                <div className="md:col-span-2">
                    <ImageUploadBox
                        label="Hero Cover (Ngang)" aspectRatio={16/9} onImageCropped={setCoverFile}
                        existingImageUrl={initialData?.existingCoverUrl}
                        filePreviewUrl={coverPreviewUrl}
                    />
                     <div className="mt-4">
                        <Label className="text-muted-foreground">Youtube URL</Label>
                        <Input {...register("YoutubeUrl")} className="mt-1 bg-input border-border text-foreground" placeholder="https://..." />
                    </div>
                </div>
            </div>
        </div>

        {/* SECTION 2: INFO */}
        <div className="bg-card p-6 rounded-xl border border-border">
             <h3 className="text-lg font-bold mb-4 text-primary border-b border-border pb-2">* Tên sự kiện</h3>
             <Input
                {...register("title", { required: true })}
                className="bg-background text-foreground text-lg font-semibold"
                placeholder="Nhập tên sự kiện..."
             />

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                 <div className="space-y-2">
                    <Label className="text-muted-foreground">Thể loại</Label>
                    <Controller
                        control={control} name="categoryId" rules={{ required: true }}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="bg-input border-border text-foreground">
                                    <SelectValue placeholder="Chọn thể loại" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )}
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-muted-foreground">Địa điểm (Venue)</Label>
                    <Input {...register("venue", { required: true })} className="bg-input border-border text-foreground" />
                 </div>
             </div>

             <div className="mt-4 space-y-2">
                <Label className="text-muted-foreground">Địa chỉ chi tiết</Label>
                <Input {...register("address", { required: true })} className="bg-input border-border text-foreground" />
             </div>
        </div>

        {/* SECTION 3: DESCRIPTION */}
        <div className="bg-card p-6 rounded-xl border border-border">
             <h3 className="text-lg font-bold mb-4 text-primary border-b border-border pb-2">Chi tiết sự kiện</h3>
             <Controller
                name="description" control={control} rules={{ required: true }}
                render={({ field }) => (
                    <div className="bg-background text-foreground rounded-lg overflow-hidden">
                         <ReactQuill theme="snow" value={field.value} onChange={field.onChange} className="h-64 mb-12" />
                    </div>
                )}
             />
        </div>
    </div>
  );
});

export default StepEventInfo;
