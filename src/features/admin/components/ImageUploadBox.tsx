import { useState, useRef } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/canvasUtils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt, faTrash, faCropSimple } from "@fortawesome/free-solid-svg-icons";

interface ImageUploadBoxProps {
  label: string;
  aspectRatio: number; // Tỷ lệ khung hình (VD: 16/9 hoặc 2/3)
  onImageCropped: (file: File) => void;
  description?: string;
}

export default function ImageUploadBox({ label, aspectRatio, onImageCropped, description }: ImageUploadBoxProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Crop state
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl as string);
      setIsDialogOpen(true);
      // Reset input để chọn lại cùng file vẫn kích hoạt onChange
      e.target.value = "";
    }
  };

  const readFile = (file: File) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  };

  const handleSaveCrop = async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
        if (croppedBlob) {
          // Tạo URL để preview
          const previewUrl = URL.createObjectURL(croppedBlob);
          setCroppedImage(previewUrl);

          // Convert Blob sang File để gửi lên server
          const file = new File([croppedBlob], "cropped_image.jpg", { type: "image/jpeg" });
          onImageCropped(file);

          setIsDialogOpen(false);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="font-semibold text-sm text-gray-700 dark:text-gray-300">{label}</div>

      {/* KHUNG UPLOAD / PREVIEW */}
      <div
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-[#1e293b] flex flex-col items-center justify-center relative overflow-hidden transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        style={{ aspectRatio: aspectRatio }} // Tự động chỉnh chiều cao theo tỷ lệ
      >
        {croppedImage ? (
          // TRẠNG THÁI ĐÃ CÓ ẢNH
          <div className="relative w-full h-full group">
            <img src={croppedImage} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                   <FontAwesomeIcon icon={faCropSimple} /> Đổi ảnh
                </Button>
                <Button size="sm" variant="destructive" onClick={() => setCroppedImage(null)}>
                   <FontAwesomeIcon icon={faTrash} />
                </Button>
            </div>
          </div>
        ) : (
          // TRẠNG THÁI CHƯA CÓ ẢNH
          <div
            className="flex flex-col items-center justify-center cursor-pointer p-6 text-center"
            onClick={() => fileInputRef.current?.click()}
          >
            <FontAwesomeIcon icon={faCloudUploadAlt} className="text-4xl text-emerald-500 mb-3" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Thêm ảnh sự kiện</p>
            {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
          </div>
        )}

        <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            accept="image/*"
            className="hidden"
        />
      </div>

      {/* MODAL CROP ẢNH */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Cắt ảnh & Chỉnh sửa</DialogTitle>
          </DialogHeader>

          <div className="relative w-full h-[400px] bg-black rounded-md overflow-hidden">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio} // Tỷ lệ quan trọng
                onCropChange={setCrop}
                onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
                onZoomChange={setZoom}
              />
            )}
          </div>

          <div className="py-2 flex items-center gap-4">
             <span className="text-sm min-w-[50px]">Zoom:</span>
             <Slider
                defaultValue={[1]}
                min={1} max={3} step={0.1}
                value={[zoom]}
                onValueChange={(val) => setZoom(val[0])}
             />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSaveCrop} className="bg-emerald-600 hover:bg-emerald-700">Cắt & Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
