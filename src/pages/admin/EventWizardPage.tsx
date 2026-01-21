import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import EventWizardHeader from "@/features/admin/components/event-wizard/EventWizardHeader";
import StepEventInfo, { type EventInfoFormValues } from "@/features/admin/components/event-wizard/StepEventInfo";
import StepTimeTickets from "@/features/admin/components/event-wizard/StepTimeTickets";
import StepSeatMap from "@/features/admin/components/event-wizard/StepSeatMap";
import { eventService } from "@/features/concerts/services/eventService";

export default function EventWizardPage() {
  const { id } = useParams(); // Nếu có ID -> Chế độ Edit

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // State lưu dữ liệu của Step 1
  const [eventData, setEventData] = useState<EventInfoFormValues | null>(null);

  // Ref để gọi hàm validate và getData từ con
  const step1Ref = useRef<{ validate: () => Promise<boolean>; getData: () => EventInfoFormValues } | null>(null);
  const step2Ref = useRef<{ validate: () => boolean; getData: () => any[] } | null>(null);

  // ID sự kiện sau khi tạo xong ở bước 1
  const [createdEventId, setCreatedEventId] = useState<number | null>(id ? Number(id) : null);

  // HÀM LƯU DỮ LIỆU (Tùy bước mà gọi API khác nhau)
  const handleSave = async (andNext: boolean = false) => {
    setLoading(true);
    try {
        if (currentStep === 1) {
            // Validate Step 1
            const isValid = await step1Ref.current?.validate();
            if (!isValid) {
                setLoading(false);
                return;
            }

            // Get data from step component
            const eventData = step1Ref.current?.getData();
            if (!eventData) return;

            // Prepare Form Data
            const formData = new FormData();
            formData.append("title", eventData.title);
            formData.append("venue", eventData.venue);
            formData.append("address", eventData.address);
            formData.append("description", eventData.description);
            formData.append("categoryId", eventData.categoryId);
            if (eventData.YoutubeUrl) formData.append("YoutubeUrl", eventData.YoutubeUrl);
            if (eventData.thumbnailFile) formData.append("files", eventData.thumbnailFile);
            if (eventData.coverFile) formData.append("files", eventData.coverFile);

            // API Call
            let res;
            if (createdEventId) {
                // TODO: Gọi API Update nếu đã có ID (nếu bạn làm tính năng edit)
                // res = await eventService.update(createdEventId, formData);
                console.log("Update logic here");
            } else {
                // Create New
                res = await eventService.create(formData);
                setCreatedEventId(res.id); // Lưu ID lại để dùng cho bước sau
            }

            console.log("Step 1 Saved:", res);
        } else if (currentStep === 2) {
            // Validate Step 2
            const isValid = step2Ref.current?.validate();
            if (!isValid) {
                setLoading(false);
                return;
            }

            // Get data from step component
            const showingsData = step2Ref.current?.getData();
            console.log("Step 2 Data:", showingsData);

            // TODO: Gọi API tạo Showing/TicketTypes dựa trên createdEventId
            // Ví dụ:
            /*
            for (const show of showingsData) {
                 const showRes = await eventService.createShowing(createdEventId, {
                     startTime: show.startTime,
                     endTime: show.endTime
                 });

                 // Sau khi có ID suất diễn, tạo vé
                 for (const ticket of show.tickets) {
                     await eventService.createTicket(showRes.id, ticket);
                 }
            }
            */

            // Tạm thời alert demo
            alert("Đã lưu suất diễn & vé thành công!");
        }

        // Chuyển bước nếu cần
        if (andNext) {
            setCurrentStep((prev) => prev + 1);
        } else {
            alert("Lưu thành công!");
        }

    } catch (error) {
        console.error(error);
        alert("Có lỗi xảy ra");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
        <EventWizardHeader
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            onSave={() => handleSave(false)}
            onNext={() => handleSave(true)}
            loading={loading}
        />

        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* RENDER STEP CONTENT */}
            {currentStep === 1 && (
                <StepEventInfo
                    ref={step1Ref}
                    initialData={undefined} // Nếu Edit thì truyền data fetch từ API vào đây
                />
            )}

            {currentStep === 2 && (
                <StepTimeTickets
                    ref={step2Ref}
                    eventId={createdEventId}
                />
            )}

            {currentStep === 3 && (
                <StepSeatMap />
            )}

            {currentStep === 4 && (
                <div className="text-center py-20 bg-card rounded-xl border border-border">
                    <h3 className="text-xl font-bold text-foreground">Thanh toán & Publish</h3>
                    <p className="text-muted-foreground mt-2">Tính năng đang phát triển...</p>
                </div>
            )}
        </div>
    </div>
  );
}
