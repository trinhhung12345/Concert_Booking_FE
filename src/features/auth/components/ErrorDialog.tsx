import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, X } from "lucide-react";

interface ErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  code?: number;
}

export default function ErrorDialog({
  isOpen,
  onClose,
  title = "Lỗi",
  message,
  code
}: ErrorDialogProps) {
  const getErrorIcon = () => {
    if (code === 400) return "⚠️"; // Validation error
    if (code === 401) return "🔒"; // Auth error
    if (code === 500) return "🔧"; // Server error
    return "❌"; // Generic error
  };

  const getErrorTitle = () => {
    if (code === 400) return "Dữ liệu không hợp lệ";
    if (code === 401) return "Lỗi xác thực";
    if (code === 500) return "Lỗi máy chủ";
    return title;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white p-6 rounded-3xl gap-4 shadow-2xl">
        <DialogHeader className="items-center text-center space-y-3">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-2">
            <span className="text-2xl">{getErrorIcon()}</span>
          </div>

          <DialogTitle className="text-xl font-bold text-gray-900">
            {getErrorTitle()}
          </DialogTitle>

          <DialogDescription className="text-gray-600 text-base leading-relaxed">
            {message}
          </DialogDescription>

          {code && (
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block">
              Mã lỗi: {code}
            </div>
          )}
        </DialogHeader>

        <div className="flex justify-center">
          <Button
            onClick={onClose}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium"
          >
            Đã hiểu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}