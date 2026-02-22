import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { authService } from "../services/authService";
import { Loader2 } from "lucide-react";

// Schema validate email
const ForgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

interface ForgotPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordDialog({
  isOpen,
  onClose,
}: ForgotPasswordDialogProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError(null);
    setSuccessMessage(null);
    try {
      const res = await authService.forgotPassword(data.email);
       // Check status code if needed, axios usually throws on non-2xx but the service implies custom response structure
      if (res && (res as any).code === 200) {
          setSuccessMessage((res as any).message || "Mật khẩu mới đã được gửi đến email của bạn.");
           // Optional: close dialog after a delay
           // setTimeout(onClose, 3000);
      } else {
          setServerError((res as any).message || "Có lỗi xảy ra.");
      }
    } catch (error: any) {
      setServerError(
        error.response?.data?.message || "Gửi yêu cầu thất bại. Vui lòng thử lại."
      );
    }
  };

  const handleClose = () => {
      reset();
      setServerError(null);
      setSuccessMessage(null);
      onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quên mật khẩu</DialogTitle>
          <DialogDescription>
            Nhập địa chỉ email của bạn để nhận mật khẩu mới tạm thời.
          </DialogDescription>
        </DialogHeader>

        {successMessage ? (
             <div className="flex flex-col items-center justify-center space-y-4 py-4">
                <div className="text-green-600 font-medium text-center">
                    {successMessage}
                </div>
                 <Button onClick={handleClose} className="w-full">
                    Đóng
                </Button>
             </div>
        ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="forgot-email">Email</Label>
                <Input
                id="forgot-email"
                type="email"
                placeholder="example@gmail.com"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
            </div>

            {serverError && (
                <p className="text-sm text-red-500 text-center">{serverError}</p>
            )}

            <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" type="button" onClick={handleClose}>
                Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
                </Button>
            </div>
            </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
