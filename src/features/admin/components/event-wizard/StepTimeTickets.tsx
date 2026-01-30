import { useState, useImperativeHandle, forwardRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faTicket,
  faChevronDown,
  faChevronUp,
  faPen,
  faCalendarAlt,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import TicketModal, { type TicketFormValues } from "./TicketModal";

// --- TYPES ---
export interface ShowingFormValues {
  id: number | string; // ID tạm (timestamp) hoặc ID thật
  startTime: string;
  endTime: string;
  tickets: TicketFormValues[];
  isOpen?: boolean; // Trạng thái đóng mở accordion UI
}

interface StepTimeTicketsProps {
  eventId: number | null;
  initialData?: any[] | null;
}

const StepTimeTickets = forwardRef(({ eventId, initialData }: StepTimeTicketsProps, ref) => {
  // State quản lý danh sách suất diễn
  const [showings, setShowings] = useState<ShowingFormValues[]>([
    { id: Date.now(), startTime: "", endTime: "", tickets: [], isOpen: true } // Mặc định có 1 cái đang mở
  ]);

  // State cho Modal vé
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<{ showingId: number | string, ticketIndex?: number, data?: TicketFormValues } | null>(null);

  // Populate showings from initialData when it changes
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      console.log("Populating StepTimeTickets with initialData:", initialData);
      // Close all showings by default when loading edit data
      setShowings(initialData.map(show => ({
        ...show,
        isOpen: show.isOpen || false // Keep existing isOpen state or default to false
      })));
    } else if (!initialData) {
      // Reset to default when no initialData (for new events)
      setShowings([{ id: Date.now(), startTime: "", endTime: "", tickets: [], isOpen: true }]);
    }
  }, [initialData]);

  // --- ACTIONS SHOWING ---
  const addShowing = () => {
    const newId = Date.now();
    // Đóng các cái cũ, mở cái mới
    const newShowings = showings.map(s => ({ ...s, isOpen: false }));
    setShowings([...newShowings, { id: newId, startTime: "", endTime: "", tickets: [], isOpen: true }]);
  };

  const removeShowing = (id: number | string) => {
    if (confirm("Bạn có chắc muốn xóa suất diễn này?")) {
        setShowings(showings.filter(s => s.id !== id));
    }
  };

  const toggleAccordion = (id: number | string) => {
    setShowings(showings.map(s => s.id === id ? { ...s, isOpen: !s.isOpen } : s));
  };

  const updateShowingTime = (id: number | string, field: 'startTime' | 'endTime', value: string) => {
    setShowings(showings.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  // --- ACTIONS TICKET ---
  const openAddTicketModal = (showingId: number | string) => {
    setEditingTicket({ showingId });
    setModalOpen(true);
  };

  const openEditTicketModal = (showingId: number | string, ticketIndex: number, ticket: TicketFormValues) => {
    setEditingTicket({ showingId, ticketIndex, data: ticket });
    setModalOpen(true);
  };

  const handleSaveTicket = (ticketData: TicketFormValues) => {
    if (!editingTicket) return;

    setShowings(prev => prev.map(show => {
      if (show.id === editingTicket.showingId) {
        const newTickets = [...show.tickets];
        if (editingTicket.ticketIndex !== undefined) {
          // Edit
          newTickets[editingTicket.ticketIndex] = ticketData;
        } else {
          // Add new
          newTickets.push({ ...ticketData, id: Date.now() });
        }
        return { ...show, tickets: newTickets };
      }
      return show;
    }));
  };

  const removeTicket = (showingId: number | string, ticketIndex: number) => {
    if (confirm("Xóa loại vé này?")) {
        setShowings(prev => prev.map(show => {
            if (show.id === showingId) {
                return { ...show, tickets: show.tickets.filter((_, i) => i !== ticketIndex) };
            }
            return show;
        }));
    }
  };

  // --- EXPOSE DATA CHO CHA (để lưu API) ---
  useImperativeHandle(ref, () => ({
    getData: () => showings,
    validate: () => {
        // Validate cơ bản: Cần ít nhất 1 suất diễn, mỗi suất cần có vé
        if (showings.length === 0) { alert("Cần ít nhất 1 suất diễn"); return false; }
        for (const show of showings) {
            if (!show.startTime || !show.endTime) { alert("Vui lòng nhập đầy đủ thời gian"); return false; }
            if (show.tickets.length === 0) { alert("Vui lòng tạo ít nhất 1 loại vé cho mỗi suất diễn"); return false; }
        }
        return true;
    }
  }));

  // --- HELPER FORMAT ---
  const formatHeaderTime = (start: string) => {
    if (!start) return "Chưa thiết lập thời gian";
    const d = new Date(start);
    return `${d.toLocaleDateString('vi-VN')} - ${d.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

        {/* LIST SHOWINGS */}
        {showings.map((show) => (
            <div
                key={show.id}
                className={cn(
                    "rounded-xl border transition-all overflow-hidden",
                    show.isOpen
                        ? "bg-card border-primary/50 shadow-lg shadow-primary/10"
                        : "bg-card border-border hover:border-primary/50 cursor-pointer"
                )}
            >
                {/* HEADER (Luôn hiển thị) */}
                <div
                    className={cn(
                        "p-4 flex items-center justify-between select-none",
                        show.isOpen ? "border-b border-border" : ""
                    )}
                    onClick={() => !show.isOpen && toggleAccordion(show.id)}
                >
                    <div className="flex items-center gap-4">
                        <div
                            onClick={(e) => { e.stopPropagation(); toggleAccordion(show.id); }}
                            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                        >
                            <FontAwesomeIcon icon={show.isOpen ? faChevronUp : faChevronDown} />
                        </div>

                        <div>
                            <div className="flex items-center gap-2 font-bold text-foreground text-lg">
                                {show.isOpen ? "Ngày sự kiện" : formatHeaderTime(show.startTime)}
                            </div>
                            {!show.isOpen && (
                                <div className="text-sm text-muted-foreground mt-1">
                                    {show.tickets.length} Loại vé
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Nút xóa suất diễn (Góc phải) */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => { e.stopPropagation(); removeShowing(show.id); }}
                    >
                        {show.isOpen ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faTrash} />}
                    </Button>
                </div>

                {/* BODY (Chỉ hiện khi Open) */}
                {show.isOpen && (
                    <div className="p-6 space-y-8">

                        {/* 1. THỜI GIAN */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-muted-foreground font-medium">Thời gian bắt đầu</Label>
                                <div className="relative">
                                    <Input
                                        type="datetime-local"
                                        value={show.startTime}
                                        onChange={(e) => updateShowingTime(show.id, 'startTime', e.target.value)}
                                        className="bg-input border-border text-foreground pl-10 h-11"
                                    />
                                    <FontAwesomeIcon icon={faCalendarAlt} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-muted-foreground font-medium">Thời gian kết thúc</Label>
                                <div className="relative">
                                    <Input
                                        type="datetime-local"
                                        value={show.endTime}
                                        onChange={(e) => updateShowingTime(show.id, 'endTime', e.target.value)}
                                        className="bg-input border-border text-foreground pl-10 h-11"
                                    />
                                    <FontAwesomeIcon icon={faCalendarAlt} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                </div>
                            </div>
                        </div>

                        {/* 2. DANH SÁCH VÉ */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Label className="text-primary font-bold text-base">* Loại vé</Label>
                            </div>

                            {/* Ticket Items */}
                            {show.tickets.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic py-2">Chưa có loại vé nào. Hãy tạo mới.</p>
                            ) : (
                                show.tickets.map((ticket, idx) => (
                                    <div key={idx} className="group flex items-center justify-between bg-muted p-3 rounded-lg border border-transparent hover:border-border transition-all">
                                        <div className="flex items-center gap-4">
                                            {/* Drag Handle Icon giả lập */}
                                            <div className="text-muted-foreground cursor-move px-2">
                                                <div className="space-y-1">
                                                    <div className="w-4 h-0.5 bg-current"></div>
                                                    <div className="w-4 h-0.5 bg-current"></div>
                                                </div>
                                            </div>

                                            {/* Icon Vé */}
                                            <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-muted-foreground">
                                                <FontAwesomeIcon icon={faTicket} />
                                            </div>

                                            {/* Tên Vé & Giá */}
                                            <div>
                                                <div className="font-medium text-foreground">{ticket.name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {ticket.quantity} vé • {new Intl.NumberFormat('vi-VN').format(ticket.price)} đ
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions: Edit / Delete */}
                                        <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            <Button
                                                size="sm" variant="ghost"
                                                className="h-8 w-8 p-0 bg-background text-foreground hover:text-primary hover:bg-background"
                                                onClick={() => openEditTicketModal(show.id, idx, ticket)}
                                            >
                                                <FontAwesomeIcon icon={faPen} size="xs" />
                                            </Button>
                                            <Button
                                                size="sm" variant="ghost"
                                                className="h-8 w-8 p-0 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                                onClick={() => removeTicket(show.id, idx)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} size="xs" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}

                            {/* Button Add Ticket (Centered) */}
                            <div className="flex justify-center mt-4 pt-2">
                                <Button
                                    variant="ghost"
                                    onClick={() => openAddTicketModal(show.id)}
                                    className="text-primary hover:text-primary/80 hover:bg-primary/10 gap-2"
                                >
                                    <div className="bg-primary rounded-full w-5 h-5 flex items-center justify-center text-primary-foreground text-xs">
                                        <FontAwesomeIcon icon={faPlus} />
                                    </div>
                                    Tạo loại vé mới
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        ))}

        {/* FOOTER: CREATE SHOWING */}
        <div className="flex justify-center py-6 border-t border-border mt-8">
            <Button
                variant="ghost"
                onClick={addShowing}
                className="text-primary hover:text-primary/80 text-lg gap-2"
            >
                <FontAwesomeIcon icon={faPlus} /> Tạo suất diễn
            </Button>
        </div>

        {/* MODAL (Render 1 cái dùng chung) */}
        <TicketModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            initialData={editingTicket?.data}
            onSave={handleSaveTicket}
        />
    </div>
  );
});

export default StepTimeTickets;
