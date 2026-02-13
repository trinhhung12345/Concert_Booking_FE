import { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import ImageUploadBox from "@/features/admin/components/ImageUploadBox";
import { categoryService, type Category } from "@/features/concerts/services/categoryService";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

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
  // Gallery images for event detail
  galleryFiles?: File[];
  existingGalleryUrls?: string[];
  // Track removed gallery URLs in edit mode
  removedGalleryUrls?: string[];
}

interface StepEventInfoProps {
  initialData?: Partial<EventInfoFormValues>; // Dữ liệu cũ nếu là Edit
}

const StepEventInfo = forwardRef(({ initialData }: StepEventInfoProps, ref) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [removedGalleryUrls, setRemovedGalleryUrls] = useState<string[]>([]);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const { register, control, trigger, getValues, reset } = useForm<EventInfoFormValues>({
    defaultValues: {
        title: "",
        venue: "",
        address: "",
        categoryId: "",
        description: "",
        YoutubeUrl: "",
    }
  });

  // Reset form and gallery state when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        venue: initialData.venue || "",
        address: initialData.address || "",
        categoryId: initialData.categoryId?.toString() || "",
        description: initialData.description || "",
        YoutubeUrl: initialData.YoutubeUrl || "",
      });
      // Reset gallery state when loading new initial data
      setRemovedGalleryUrls([]);
      setGalleryFiles([]);
    }
  }, [initialData, reset, setGalleryFiles, setRemovedGalleryUrls]);

  // Load Categories
  useEffect(() => {
    categoryService.getAllAdmin().then(data => setCategories(Array.isArray(data) ? data : []));
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

  // Handle gallery file upload
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setGalleryFiles(prev => [...prev, ...newFiles]);
      // Reset input to allow selecting same files again
      e.target.value = "";
    }
  };

  const removeGalleryFile = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Create preview URLs for gallery files
  const galleryPreviews = galleryFiles.map(file => URL.createObjectURL(file));

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      galleryPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [galleryPreviews]);

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
    getData: () => {
      // Calculate remaining existing gallery URLs (exclude removed ones)
      const remainingGalleryUrls = initialData?.existingGalleryUrls?.filter(
        url => !removedGalleryUrls.includes(url)
      ) || [];
      
      const data = {
        ...getValues(),
        thumbnailFile,
        coverFile,
        galleryFiles,
        existingGalleryUrls: remainingGalleryUrls,
        removedGalleryUrls
      };
      console.log("StepEventInfo - getData:", data);
      return data;
    }
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

        {/* SECTION 4: GALLERY IMAGES */}
        <div className="bg-card p-6 rounded-xl border border-border">
             <h3 className="text-lg font-bold mb-4 text-primary border-b border-border pb-2">
                Ảnh bổ sung cho chi tiết sự kiện
                <span className="text-xs text-muted-foreground font-normal ml-2">Sẽ hiển thị ở trang chi tiết sự kiện</span>
             </h3>
             
             {/* Upload Button */}
             <div className="mb-4">
                <input
                    type="file"
                    ref={galleryInputRef}
                    onChange={handleGalleryUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                />
                <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => galleryInputRef.current?.click()}
                    className="border-dashed border-2"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Thêm ảnh
                </Button>
             </div>

             {/* Gallery Preview Grid */}
             {(galleryFiles.length > 0 || (initialData?.existingGalleryUrls && initialData.existingGalleryUrls.length > 0)) && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {/* New Uploaded Files */}
                    {galleryFiles.map((_file, index) => (
                        <div key={`new-${index}`} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                            <img 
                                src={galleryPreviews[index]} 
                                alt={`Gallery ${index}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => removeGalleryFile(index)}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {/* Existing Images (Edit Mode) - Only show if not removed */}
                    {initialData?.existingGalleryUrls?.map((url, index) => (
                        !removedGalleryUrls.includes(url) ? (
                        <div key={`existing-${index}`} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                            <img 
                                src={url} 
                                alt={`Gallery existing ${index}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                        setRemovedGalleryUrls(prev => [...prev, url]);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>
                            </div>
                        </div>
                        ) : null
                    ))}
                </div>
             )}

             {/* Helper text */}
             <p className="text-sm text-muted-foreground mt-4">
                Có thể chọn nhiều ảnh cùng lúc. Ảnh sẽ được hiển thị trong phần giới thiệu sự kiện.
             </p>
        </div>
    </div>
  );
});

export default StepEventInfo;
