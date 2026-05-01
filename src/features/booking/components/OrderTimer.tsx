import { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const ORDER_TIMEOUT_MS = 5 * 60 * 1000; // 5 phút

interface OrderTimerProps {
  createdAt: string;
  /** Callback khi hết thời gian */
  onExpired?: () => void;
  /** Kích thước hiển thị */
  size?: "sm" | "md" | "lg";
  /** Hiển thị dạng inline (cho danh sách) hay block (cho chi tiết) */
  variant?: "inline" | "block";
}

function parseServerDate(dateString: string): Date {
  // Server trả về format "2026-02-27 22:25:27" (không có timezone)
  // Coi như UTC hoặc server timezone
  const normalized = dateString.replace(" ", "T");
  return new Date(normalized);
}

function getRemainingMs(createdAt: string): number {
  const createdDate = parseServerDate(createdAt);
  const expiryTime = createdDate.getTime() + ORDER_TIMEOUT_MS;
  return Math.max(0, expiryTime - Date.now());
}

function formatTime(ms: number): string {
  if (ms <= 0) return "00:00";
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function OrderTimer({ 
  createdAt, 
  onExpired, 
  size = "md",
  variant = "inline" 
}: OrderTimerProps) {
  const [remainingMs, setRemainingMs] = useState(() => getRemainingMs(createdAt));
  const [expired, setExpired] = useState(() => getRemainingMs(createdAt) <= 0);

  const handleExpiry = useCallback(() => {
    setExpired(true);
    onExpired?.();
  }, [onExpired]);

  useEffect(() => {
    const remaining = getRemainingMs(createdAt);
    setRemainingMs(remaining);
    
    if (remaining <= 0) {
      handleExpiry();
      return;
    }

    setExpired(false);

    const interval = setInterval(() => {
      const newRemaining = getRemainingMs(createdAt);
      setRemainingMs(newRemaining);
      
      if (newRemaining <= 0) {
        clearInterval(interval);
        handleExpiry();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt, handleExpiry]);

  // Tính phần trăm thời gian còn lại cho progress bar
  const percentage = Math.min(100, (remainingMs / ORDER_TIMEOUT_MS) * 100);
  const isUrgent = remainingMs > 0 && remainingMs <= 15000; // Dưới 15 giây

  // Size classes
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const iconSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  if (variant === "inline") {
    if (expired) {
      return (
        <span className={`inline-flex items-center gap-1 ${sizeClasses[size]} text-red-400 font-medium`}>
          <FontAwesomeIcon icon={faExclamationTriangle} className={iconSizeClasses[size]} />
          Hết hạn thanh toán
        </span>
      );
    }

    return (
      <span 
        className={`inline-flex items-center gap-1.5 ${sizeClasses[size]} font-bold ${
          isUrgent ? "text-red-400 animate-pulse" : "text-orange-400"
        }`}
      >
        <FontAwesomeIcon icon={faClock} className={iconSizeClasses[size]} />
        {formatTime(remainingMs)}
      </span>
    );
  }

  // Block variant - hiển thị đầy đủ với progress bar
  if (expired) {
    return (
      <div className="bg-red-950/50 border border-red-700/60 rounded-xl p-4">
        <div className="flex items-center gap-2 text-red-400">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-lg" />
          <span className="font-bold">Đã hết thời gian thanh toán</span>
        </div>
        <p className="text-red-300/80 text-sm mt-1">
          Đơn hàng đã bị hủy do quá thời gian thanh toán. Vui lòng đặt lại vé.
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-4 border ${
      isUrgent 
        ? "bg-red-950/50 border-red-700/60" 
        : "bg-orange-950/40 border-orange-700/50"
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`flex items-center gap-2 font-bold ${
          isUrgent ? "text-red-400" : "text-orange-400"
        }`}>
          <FontAwesomeIcon icon={faClock} className={`text-lg ${isUrgent ? "animate-pulse" : ""}`} />
          <span>Thời gian còn lại</span>
        </div>
        <span className={`font-mono text-2xl font-bold ${
          isUrgent ? "text-red-400 animate-pulse" : "text-orange-400"
        }`}>
          {formatTime(remainingMs)}
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${
            isUrgent ? "bg-red-500" : "bg-orange-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <p className={`text-xs mt-2 ${isUrgent ? "text-red-300/70" : "text-orange-300/70"}`}>
        Vui lòng hoàn tất thanh toán trước khi hết thời gian
      </p>
    </div>
  );
}
