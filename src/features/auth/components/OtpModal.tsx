import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
  email: string;
}

export default function OtpModal({ isOpen, onClose, onVerify, email }: OtpModalProps) {
  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    if (otp.length === 6) {
      onVerify(otp);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white p-8 rounded-3xl gap-6 shadow-2xl">
        <DialogHeader className="items-center text-center space-y-3">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            {/* Icon shield or lock */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 text-primary"
            >
              <path
                fillRule="evenodd"
                d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Verify Validation Code
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-base">
            We have sent a verification code to <br />
            <span className="font-semibold text-gray-900">{email}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center space-y-6">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup className="gap-2 sm:gap-3">
              {/* Create 6 input slots with custom focus styling */}
              {Array.from({ length: 6 }).map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="w-10 h-12 sm:w-12 sm:h-14 border border-gray-300 rounded-lg text-lg font-bold
                  focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all
                  data-[active=true]:border-primary data-[active=true]:ring-1 data-[active=true]:ring-primary"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          <Button
            onClick={handleVerify}
            className="w-full h-12 rounded-xl text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30"
            disabled={otp.length < 6}
          >
            Verify Code
          </Button>

          <div className="text-sm text-center text-gray-500">
            Didn't receive the code?{" "}
            <button className="text-primary font-semibold hover:underline">
              Resend Code
            </button>
            <span className="ml-2 text-gray-400">(00:59)</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}