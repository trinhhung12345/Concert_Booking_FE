import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EventWizardHeader from "@/features/admin/components/event-wizard/EventWizardHeader";
import StepEventInfo, { type EventInfoFormValues } from "@/features/admin/components/event-wizard/StepEventInfo";
import StepTimeTickets from "@/features/admin/components/event-wizard/StepTimeTickets";
import StepSeatMap from "@/features/admin/components/event-wizard/StepSeatMap";
import { eventService, type Event, type Showing, type TicketType } from "@/features/concerts/services/eventService";

export default function EventWizardPage() {
  const { id } = useParams(); // Nếu có ID -> Chế độ Edit
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // State for cancel confirmation dialog
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // State lưu dữ liệu của từng step trong wizard session
  const [step1Data, setStep1Data] = useState<EventInfoFormValues | null>(null);
  const [step2Data, setStep2Data] = useState<any[] | null>(null);

  // Ref để gọi hàm validate và getData từ con
  const step1Ref = useRef<{ validate: () => Promise<boolean>; getData: () => EventInfoFormValues } | null>(null);
  const step2Ref = useRef<{ validate: () => boolean; getData: () => any[] } | null>(null);

  // ID sự kiện sau khi tạo xong ở bước 1
  const [createdEventId, setCreatedEventId] = useState<number | null>(id ? Number(id) : null);

  // State lưu dữ liệu đã load từ API (để populate form khi quay lại step)
  const [loadedEventData, setLoadedEventData] = useState<EventInfoFormValues | null>(null);
  const [loadedShowingsData, setLoadedShowingsData] = useState<any[] | null>(null);

  // --- DATA TRANSFORMATION FUNCTIONS ---
  const transformEventToFormValues = (event: Event): EventInfoFormValues => {
    console.log("Transforming event data:", event);

    // Extract image files (type 0) and YouTube (type 1)
    const imageFiles = event.files.filter(f => f.type === 0);
    const youtubeFile = event.files.find(f => f.type === 1);

    return {
      title: event.title,
      venue: event.venue,
      address: event.address,
      description: event.description,
      categoryId: event.categoryId.toString(),
      YoutubeUrl: youtubeFile?.originUrl || "",
      // Existing images for display in edit mode
      existingThumbnailUrl: imageFiles[0]?.thumbUrl || imageFiles[0]?.originUrl,
      existingCoverUrl: imageFiles[1]?.thumbUrl || imageFiles[1]?.originUrl,
      // Note: thumbnailFile and coverFile are for new uploads only
    };
  };

  const transformShowingsToFormValues = async (showings: Showing[], eventId: number): Promise<any[]> => {
    console.log("Transforming showings data:", showings);

    const result = await Promise.all(showings.map(async (showing) => {
      // Fetch ticket types for this showing
      console.log("Fetching ticket types for showing:", showing.id);
      const ticketTypes = await eventService.getTicketTypesByShowingId(showing.id);
      console.log("Ticket types for showing", showing.id, ":", ticketTypes);

      return {
        id: showing.id,
        startTime: showing.startTime.slice(0, 16), // Convert to datetime-local format (remove seconds)
        endTime: showing.endTime.slice(0, 16),
        tickets: ticketTypes.map(tt => ({
          id: tt.id,
          name: tt.name,
          price: tt.price,
          quantity: 100, // Default since API doesn't provide quantity
          description: tt.description,
          color: tt.color
        })),
        isOpen: false // Default closed
      };
    }));

    console.log("Transformed showings data:", result);
    return result;
  };

  // --- INITIAL DATA LOADING FOR EDIT MODE ---
  useEffect(() => {
    const loadEditData = async () => {
      if (!createdEventId) {
        console.log("No event ID - create mode, skipping edit data load");
        return;
      }

      console.log("Loading edit data for event ID:", createdEventId);
      setLoading(true);

      try {
        // Load all data simultaneously for edit mode
        console.log("Fetching event data...");
        const eventData = await eventService.getById(createdEventId);
        const transformedEventData = transformEventToFormValues(eventData);
        setLoadedEventData(transformedEventData);
        setStep1Data(transformedEventData); // Populate step data for edit mode
        console.log("Event data loaded and transformed:", transformedEventData);

        console.log("Fetching showings data...");
        const showings = await eventService.getShowingsByEventId(createdEventId);
        const transformedShowingsData = await transformShowingsToFormValues(showings, createdEventId);
        setLoadedShowingsData(transformedShowingsData);
        setStep2Data(transformedShowingsData); // Populate step data for edit mode
        console.log("Showings data loaded and transformed:", transformedShowingsData);

        console.log("✅ All edit data loaded successfully");
      } catch (error) {
        console.error("❌ Error loading edit data:", error);
        alert("Không thể tải dữ liệu sự kiện để chỉnh sửa");
      } finally {
        setLoading(false);
      }
    };

    loadEditData();
  }, []); // Run only once on mount

  // --- STEP NAVIGATION WITH DATA PERSISTENCE ---
  const handleStepChange = async (newStep: number) => {
    // Save current step data before changing
    if (currentStep === 1 && step1Ref.current) {
      const data = step1Ref.current.getData();
      setStep1Data(data);
      console.log("Saved step 1 data:", data);
    } else if (currentStep === 2 && step2Ref.current) {
      const data = step2Ref.current.getData();
      setStep2Data(data);
      console.log("Saved step 2 data:", data);
    }

    // Change step
    setCurrentStep(newStep);
  };

  // --- NAVIGATION DATA LOADING (fallback for create mode) ---
  useEffect(() => {
    const loadStepData = async () => {
      // Skip if we're in edit mode and data is already loaded
      if (createdEventId && (loadedEventData || loadedShowingsData)) {
        console.log("Edit mode data already loaded, skipping navigation load");
        return;
      }

      if (!createdEventId) {
        console.log("No event ID available, skipping navigation data load");
        return;
      }

      try {
        if (currentStep === 1 && !loadedEventData) {
          console.log("Loading event data for step 1 (navigation)...");
          const eventData = await eventService.getById(createdEventId);
          const transformedData = transformEventToFormValues(eventData);
          setLoadedEventData(transformedData);
          console.log("Event data loaded (navigation):", transformedData);
        } else if (currentStep === 2 && !loadedShowingsData) {
          console.log("Loading showings data for step 2 (navigation)...");
          const showings = await eventService.getShowingsByEventId(createdEventId);
          const transformedData = await transformShowingsToFormValues(showings, createdEventId);
          setLoadedShowingsData(transformedData);
          console.log("Showings data loaded (navigation):", transformedData);
        }
      } catch (error) {
        console.error("Error loading navigation step data:", error);
      }
    };

    loadStepData();
  }, [currentStep, createdEventId, loadedEventData, loadedShowingsData]);

  // --- CHECK FORM DIRTY ---
  const isFormDirty = () => {
    console.log("Checking form dirty...");

    // Check if any step has persisted data
    if (step1Data) {
      console.log("Step 1 has persisted data:", step1Data);
      return true;
    }
    if (step2Data) {
      console.log("Step 2 has persisted data:", step2Data);
      return true;
    }

    // Check if current step has unsaved changes
    try {
      if (currentStep === 1 && step1Ref.current) {
        const currentData = step1Ref.current.getData();
        console.log("Current step 1 data:", currentData);

        // Compare with initial data
        const initial = loadedEventData || null; // Use null instead of empty object to distinguish create vs edit mode
        console.log("Initial step 1 data:", initial);

        // If we're in create mode (no initial data loaded), check if any fields are filled
        if (!initial) {
          // We're in create mode, check if any field has been filled
          // Exclude default empty values like empty string descriptions
          const hasAnyData =
            currentData.title.trim() !== '' ||
            currentData.venue.trim() !== '' ||
            currentData.address.trim() !== '' ||
            currentData.categoryId !== '' ||
            (currentData.description && currentData.description.trim() !== '' && currentData.description !== '<p></p>') ||
            (currentData.YoutubeUrl && currentData.YoutubeUrl.trim() !== '') ||
            (currentData.thumbnailFile !== null && currentData.thumbnailFile !== undefined) || // If a thumbnail was selected
            (currentData.coverFile !== null && currentData.coverFile !== undefined) || // If a cover was selected
            currentData.existingThumbnailUrl !== undefined ||
            currentData.existingCoverUrl !== undefined;

          console.log("Create mode - has any data:", hasAnyData);
          return hasAnyData;
        }

        // We're in edit mode, compare with loaded data
        // Create a version of current data without files for comparison
        const currentDataWithoutFiles = {
          title: currentData.title || '',
          venue: currentData.venue || '',
          address: currentData.address || '',
          categoryId: currentData.categoryId || '',
          description: currentData.description || '',
          YoutubeUrl: currentData.YoutubeUrl || '',
          existingThumbnailUrl: currentData.existingThumbnailUrl,
          existingCoverUrl: currentData.existingCoverUrl,
          thumbnailFile: null,
          coverFile: null
        };

        const initialDataWithoutFiles = {
          title: initial.title || '',
          venue: initial.venue || '',
          address: initial.address || '',
          categoryId: initial.categoryId || '',
          description: initial.description || '',
          YoutubeUrl: initial.YoutubeUrl || '',
          existingThumbnailUrl: initial.existingThumbnailUrl || undefined,
          existingCoverUrl: initial.existingCoverUrl || undefined,
          thumbnailFile: null,
          coverFile: null
        };

        // Deep compare only the fields that matter
        const isDifferent =
          currentDataWithoutFiles.title !== initialDataWithoutFiles.title ||
          currentDataWithoutFiles.venue !== initialDataWithoutFiles.venue ||
          currentDataWithoutFiles.address !== initialDataWithoutFiles.address ||
          currentDataWithoutFiles.categoryId !== initialDataWithoutFiles.categoryId ||
          currentDataWithoutFiles.description !== initialDataWithoutFiles.description ||
          currentDataWithoutFiles.YoutubeUrl !== initialDataWithoutFiles.YoutubeUrl ||
          currentDataWithoutFiles.existingThumbnailUrl !== initialDataWithoutFiles.existingThumbnailUrl ||
          currentDataWithoutFiles.existingCoverUrl !== initialDataWithoutFiles.existingCoverUrl ||
          (currentData.thumbnailFile !== null && currentData.thumbnailFile !== undefined) ||  // If a new thumbnail was selected
          (currentData.coverFile !== null && currentData.coverFile !== undefined);        // If a new cover was selected

        console.log("Step 1 data compared - different:", isDifferent);
        console.log("Current without files:", currentDataWithoutFiles);
        console.log("Initial without files:", initialDataWithoutFiles);

        return isDifferent;
      } else if (currentStep === 2 && step2Ref.current) {
        const currentData = step2Ref.current.getData();
        const initial = loadedShowingsData || [];
        const isDifferent = JSON.stringify(currentData) !== JSON.stringify(initial);
        console.log("Step 2 data compared - different:", isDifferent);
        return isDifferent;
      }
    } catch (error) {
      console.error("Error checking form dirty:", error);
    }

    console.log("Form is not dirty");
    return false;
  };

  // Effect to handle browser back/close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isFormDirty()) {
        e.preventDefault();
        e.returnValue = "Bạn có thay đổi chưa lưu. Nếu rời khỏi trang, dữ liệu sẽ bị mất.";
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // --- CANCEL HANDLER ---
  const handleCancel = () => {
    if (isFormDirty()) {
      setShowCancelDialog(true);
    } else {
      // No unsaved changes, navigate back directly
      navigate(-1);
    }
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    navigate(-1);
  };

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
            if (!showingsData) {
                throw new Error("Không có dữ liệu suất diễn");
            }
            console.log("Step 2 Data:", showingsData);

            // 2. Duyệt qua từng suất diễn để lưu
            // Dùng for...of để chạy tuần tự (async/await hoạt động tốt hơn forEach)
            for (const show of showingsData) {

                // A. TẠO SHOWING
                const showingPayload = {
                    eventId: createdEventId, // ID sự kiện lấy từ bước 1
                    status: "ACTIVE",
                    isSalable: true,
                    // Thêm giây vào cuối cho đúng format Backend
                    startTime: show.startTime.length === 16 ? show.startTime + ":00" : show.startTime,
                    endTime: show.endTime.length === 16 ? show.endTime + ":00" : show.endTime,
                };

                console.log("Creating Showing...", showingPayload);
                const showingRes = await eventService.createShowing(showingPayload);

                // Backend trả về object có field `id`
                const newShowingId = showingRes.id;

                if (!newShowingId) {
                    throw new Error("Không lấy được ID của suất diễn vừa tạo");
                }
                console.log("Created Showing ID:", newShowingId);

                // B. TẠO CÁC LOẠI VÉ CHO SHOWING NÀY
                for (const ticket of show.tickets) {
                    const ticketPayload = {
                        showingId: newShowingId,
                        name: ticket.name,
                        description: ticket.description || ticket.name, // Fallback nếu rỗng
                        color: ticket.color || "#FF0082",
                        isFree: false,
                        price: Number(ticket.price),
                        originalPrice: Number(ticket.price), // Giả sử giá gốc bằng giá bán
                        maxQtyPerOrder: 4, // Mặc định
                        minQtyPerOrder: 1, // Mặc định
                        status: "ACTIVE",
                        position: 1,
                        imageUrl: "https://placehold.co/100x100?text=Ticket", // Placeholder vì chưa có upload ảnh vé

                        // Thời gian bán vé:
                        // Mặc định cho bán ngay bây giờ đến lúc hết sự kiện
                        startTime: new Date().toISOString().slice(0, 19),
                        endTime: show.endTime.length === 16 ? show.endTime + ":00" : show.endTime,
                    };

                    console.log("Creating Ticket...", ticketPayload);
                    await eventService.createTicketType(ticketPayload);
                }
            }

            alert("Đã lưu thành công tất cả Suất diễn & Vé!");
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
            onStepChange={handleStepChange}
            onSave={() => handleSave(false)}
            onNext={() => handleSave(true)}
            onCancel={handleCancel}
            loading={loading}
        />

        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* LOADING INDICATOR FOR EDIT MODE */}
            {loading && createdEventId && (
                <div className="text-center py-12">
                    <div className="inline-flex items-center gap-3 text-primary">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                        <span className="text-lg font-medium">Đang tải dữ liệu sự kiện...</span>
                    </div>
                    <p className="text-muted-foreground mt-2">Vui lòng đợi trong giây lát</p>
                </div>
            )}

            {/* RENDER STEP CONTENT */}
            {(!loading || !createdEventId) && (
                <>
                    {currentStep === 1 && (
                        <StepEventInfo
                            ref={step1Ref}
                            initialData={step1Data || loadedEventData || undefined}
                        />
                    )}

                    {currentStep === 2 && (
                        <StepTimeTickets
                            ref={step2Ref}
                            eventId={createdEventId}
                            initialData={step2Data || loadedShowingsData}
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
                </>
            )}
        </div>

        {/* CANCEL CONFIRMATION DIALOG */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Xác nhận hủy</DialogTitle>
                    <DialogDescription>
                        Bạn có thay đổi chưa lưu. Nếu hủy bây giờ, tất cả dữ liệu sẽ bị mất.
                        Bạn có chắc muốn hủy không?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                        Tiếp tục chỉnh sửa
                    </Button>
                    <Button variant="destructive" onClick={confirmCancel}>
                        Hủy và thoát
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}
