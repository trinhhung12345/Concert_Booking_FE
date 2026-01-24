import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface TicketFormValues {
  id?: string | number; // ID tạm hoặc thật
  name: string;
  price: number;
  quantity: number;
  description: string;
  color: string;
}

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ticket: TicketFormValues) => void;
  initialData?: TicketFormValues | null;
}

export default function TicketModal({ isOpen, onClose, onSave, initialData }: TicketModalProps) {
  const [formData, setFormData] = useState<TicketFormValues>({
    name: "", price: 0, quantity: 100, description: "", color: "#FF0082"
  });

  useEffect(() => {
    if (isOpen) {
        if (initialData) {
            setFormData(initialData);
        } else {
            // Reset form khi tạo mới
            setFormData({ name: "", price: 0, quantity: 100, description: "", color: "#FF0082" });
        }
    }
  }, [isOpen, initialData]);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên vé");
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border text-foreground sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">{initialData ? "Chỉnh sửa loại vé" : "Tạo loại vé mới"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
            <div>
                <Label className="text-muted-foreground">Tên loại vé <span className="text-destructive">*</span></Label>
                <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-input border-border text-foreground mt-1 focus-visible:ring-primary"
                    placeholder="VD: Vé VIP, Vé Early Bird..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label className="text-muted-foreground">Giá vé (VNĐ)</Label>
                    <Input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                        className="bg-input border-border text-foreground mt-1"
                    />
                </div>
                <div>
                    <Label className="text-muted-foreground">Số lượng bán</Label>
                    <Input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
                        className="bg-input border-border text-foreground mt-1"
                    />
                </div>
            </div>

            <div>
                <Label className="text-muted-foreground">Mô tả ngắn</Label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="bg-input border border-border text-foreground mt-1 w-full rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                    placeholder="Mô tả về loại vé này..."
                />
            </div>

            <div>
                <Label className="text-muted-foreground">Màu hiển thị</Label>
                <div className="flex items-center gap-3 mt-1">
                    <Input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({...formData, color: e.target.value})}
                        className="w-12 h-10 p-1 bg-input border-border cursor-pointer"
                    />
                    <span className="text-sm text-muted-foreground">{formData.color}</span>
                </div>
            </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-foreground hover:bg-muted">Hủy</Button>
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90 text-primary-foreground">Lưu loại vé</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
