import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface EventWizardHeaderProps {
  currentStep: number;
  onSave: () => void;
  onNext: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const STEPS = [
  { id: 1, label: "Thông tin sự kiện" },
  { id: 2, label: "Thời gian & Loại vé" },
  { id: 3, label: "Sơ đồ ghế" },
];

export default function EventWizardHeader({
  currentStep,
  onSave,
  onNext,
  onCancel,
  loading
}: EventWizardHeaderProps) {
  return (
    <div className="bg-card border-b border-border sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* STEPPER */}
        <div className="flex items-center gap-1 md:gap-8 overflow-x-auto no-scrollbar">
          {STEPS.map((step) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            return (
              <div
                key={step.id}
             
                className={cn(
                  "flex items-center gap-2 cursor-pointer group transition-all duration-200 px-2 py-1 rounded-lg",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-300",
                  isActive ? "bg-primary border-primary text-primary-foreground" :
                  isCompleted ? "bg-primary/20 border-primary/50 text-primary" : "border-border bg-transparent text-muted-foreground"
                )}>
                  {isCompleted ? <FontAwesomeIcon icon={faCheck} /> : step.id}
                </div>
                <span className="whitespace-nowrap text-sm font-medium hidden md:inline-block">
                    {step.label}
                </span>

                {/* Line active indicator */}
                {isActive && (
                    <div className="absolute bottom-0 h-0.5 bg-primary w-full left-0 hidden md:block transition-all duration-300" />
                )}
              </div>
            );
          })}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={onCancel}
                disabled={loading}
            >
                Hủy
            </Button>
            <Button
                variant="outline"
                size="sm"
                className="border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={onSave}
                disabled={loading}
            >
                Lưu
            </Button>
            <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={onNext}
                disabled={loading}
            >
                {currentStep === 3 ? "Hoàn tất" : "Tiếp tục"}
            </Button>
        </div>
      </div>
    </div>
  );
}
