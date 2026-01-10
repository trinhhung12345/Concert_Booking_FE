import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faSignInAlt } from "@fortawesome/free-solid-svg-icons";

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginPromptModal({ isOpen, onClose }: LoginPromptModalProps) {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white p-6 rounded-3xl gap-4 shadow-2xl border-0">
        <DialogHeader className="items-center text-center space-y-3">
          {/* Lock Icon */}
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <FontAwesomeIcon icon={faLock} className="text-2xl text-primary" />
          </div>

          <DialogTitle className="text-xl font-bold text-gray-900">
            Yêu cầu đăng nhập
          </DialogTitle>

          <DialogDescription className="text-gray-600 text-base leading-relaxed">
            Bạn cần đăng nhập để truy cập tính năng này. Vui lòng đăng nhập để tiếp tục.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium"
          >
            Để sau
          </Button>
          <Button
            onClick={handleLogin}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faSignInAlt} />
            Đăng nhập
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}