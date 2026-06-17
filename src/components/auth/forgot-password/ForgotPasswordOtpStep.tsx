"use client";

import { useRef } from "react";
import { KeyRound, Loader2, RotateCcw } from "lucide-react";

interface ForgotPasswordOtpStepProps {
  email: string;
  otp: string[];
  isSubmitting: boolean;
  resendCooldown: number;
  onOtpChange: (otp: string[]) => void;
  onSubmit: () => void;
  onResend: () => void;
}

export function ForgotPasswordOtpStep({
  email,
  otp,
  isSubmitting,
  resendCooldown,
  onOtpChange,
  onSubmit,
  onResend,
}: ForgotPasswordOtpStepProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const isOtpComplete = otp.every((digit) => digit.trim().length === 1);
  const canResend = resendCooldown <= 0 && !isSubmitting;

  const handleChange = (index: number, value: string) => {
    if (isSubmitting) return;
    if (value.length > 1 || !/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    onOtpChange(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    if (isSubmitting) return;

    const pasted = event.clipboardData.getData("text").replace(/\D/g, "");

    if (pasted.length !== 4) return;

    event.preventDefault();
    onOtpChange(pasted.split(""));
    inputRefs.current[3]?.focus();
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
        <KeyRound size={32} className="text-primary" />
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-foreground">
        Masukkan Kode
      </h1>

      <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
        Kode 4 digit telah dikirim ke{" "}
        <span className="font-semibold text-foreground">
          {email || "email terdaftar"}
        </span>
        .
      </p>

      <div
        className="flex justify-between w-full mb-8 gap-3"
        onPaste={handlePaste}
      >
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={isSubmitting}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            className="w-16 h-16 sm:w-20 sm:h-20 text-center text-2xl sm:text-3xl font-bold rounded-xl bg-card border-2 border-border focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!isOtpComplete || isSubmitting}
        className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl hover:opacity-90 transition-all font-bold text-base shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting && <Loader2 size={18} className="animate-spin" />}
        {isSubmitting ? "Memverifikasi..." : "Verifikasi Kode"}
      </button>

      <div className="mt-6 rounded-2xl p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Tidak menerima kode?
        </p>

        <button
          type="button"
          onClick={onResend}
          disabled={!canResend}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-extrabold text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:bg-transparent"
        >
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <RotateCcw size={16} />
          )}

          {resendCooldown > 0
            ? `Kirim ulang dalam ${resendCooldown} detik`
            : "Kirim ulang kode"}
        </button>
      </div>
    </div>
  );
}