"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AuthShell } from "@/components/auth/shared/AuthShell";
import { ForgotPasswordEmailStep } from "@/components/auth/forgot-password/ForgotPasswordEmailStep";
import { ForgotPasswordOtpStep } from "@/components/auth/forgot-password/ForgotPasswordOtpStep";
import { ForgotPasswordProgress } from "@/components/auth/forgot-password/ForgotPasswordProgress";
import { ForgotPasswordResetStep } from "@/components/auth/forgot-password/ForgotPasswordResetStep";
import { ForgotPasswordSuccess } from "@/components/auth/forgot-password/ForgotPasswordSuccess";
import { AppToast, type AppToastState } from "@/components/ui/AppToast";

export type ForgotPasswordStep = "email" | "otp" | "reset" | "success";

type EmailDeliveryMeta = {
  sent: boolean;
  skipped: boolean;
  error: string | null;
};

type ForgotPasswordApiResponse = {
  success: boolean;
  message: string;
  data: unknown;
  meta?: {
    email?: EmailDeliveryMeta;
  };
};

const RESEND_COOLDOWN_SECONDS = 60;

function getFriendlyForgotPasswordError(message: string) {
  const messages: Record<string, string> = {
    "Email is required": "Email wajib diisi.",
    "User not found": "Email tidak ditemukan.",
    "User is inactive": "Akun sedang nonaktif. Silakan hubungi admin.",
    "OTP is required": "Kode OTP wajib diisi.",
    "OTP is invalid": "Kode OTP tidak valid.",
    "OTP is expired": "Kode OTP sudah kedaluwarsa. Silakan kirim ulang kode.",
    "Password is required": "Kata sandi wajib diisi.",
    "Password confirmation is required": "Konfirmasi kata sandi wajib diisi.",
    "Password must be at least 8 characters":
      "Kata sandi minimal harus 8 karakter.",
    "Password confirmation does not match":
      "Konfirmasi kata sandi belum sesuai.",
    "Failed to request OTP":
      "Gagal meminta kode verifikasi. Silakan coba lagi.",
    "Failed to verify OTP":
      "Gagal memverifikasi kode OTP. Silakan coba lagi.",
    "Failed to reset password": "Gagal mengatur ulang kata sandi.",
  };

  return messages[message] ?? "Terjadi kesalahan. Silakan coba lagi.";
}

function getRequestOtpToast(
  emailMeta?: EmailDeliveryMeta
): NonNullable<AppToastState> {
  const hasDeliveryProblem =
    Boolean(emailMeta) && (!emailMeta?.sent || emailMeta.error !== null);

  if (hasDeliveryProblem) {
    return {
      type: "warning",
      title: "Kode belum terkirim",
      message:
        "Kode verifikasi belum dapat dikirim ke email Anda. Silakan coba lagi beberapa saat.",
    };
  }

  return {
    type: "success",
    title: "Kode verifikasi dikirim",
    message:
      "Kami telah mengirimkan kode verifikasi ke email Anda. Silakan cek kotak masuk atau folder spam.",
  };
}

export function ForgotPasswordFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [email, setEmail] = useState(() => searchParams.get("email") ?? "");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [toast, setToast] = useState<AppToastState>(null);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  const toastTimeoutRef = useRef<number | null>(null);
  const otpCode = otp.join("");

  const showToast = useCallback((nextToast: NonNullable<AppToastState>) => {
    if (toastTimeoutRef.current !== null) {
      window.clearTimeout(toastTimeoutRef.current);
    }

    setToast(nextToast);

    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimeoutRef.current = null;
    }, nextToast.durationMs ?? 3500);
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return undefined;

    const interval = window.setInterval(() => {
      setResendCooldown((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [resendCooldown]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current !== null) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const handleEmailChange = (nextEmail: string) => {
    setEmail(nextEmail);
    setEmailErrorMessage("");
  };

  const handleBack = () => {
    if (isSubmitting) return;

    if (step === "email") {
      router.push("/login");
      return;
    }

    if (step === "otp") {
      setStep("email");
      return;
    }

    if (step === "reset") {
      setStep("otp");
    }
  };

  const requestOtp = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setEmailErrorMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password/request-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const result = (await response.json()) as ForgotPasswordApiResponse;

      if (!response.ok || !result.success) {
        if (result.message === "User not found") {
          setEmailErrorMessage("Email belum terdaftar di sistem.");
          return;
        }

        showToast({
          type: "error",
          title: "Kode verifikasi gagal dikirim",
          message: getFriendlyForgotPasswordError(result.message),
        });
        return;
      }

      showToast(getRequestOtpToast(result.meta?.email));

      setOtp(["", "", "", ""]);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setStep("otp");
    } catch (error) {
      console.error("Request OTP error:", error);

      showToast({
        type: "error",
        title: "Koneksi bermasalah",
        message: "Terjadi kesalahan koneksi saat meminta kode verifikasi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/forgot-password/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otpCode,
        }),
      });

      const result = (await response.json()) as ForgotPasswordApiResponse;

      if (!response.ok || !result.success) {
        showToast({
          type: "error",
          title: "Verifikasi OTP gagal",
          message: getFriendlyForgotPasswordError(result.message),
        });
        return;
      }

      showToast({
        type: "success",
        title: "Kode OTP valid",
        message: "Silakan buat kata sandi baru untuk akun Anda.",
      });

      setStep("reset");
    } catch (error) {
      console.error("Verify OTP error:", error);

      showToast({
        type: "error",
        title: "Koneksi bermasalah",
        message: "Terjadi kesalahan koneksi saat memverifikasi kode OTP.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPassword = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/forgot-password/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otpCode,
          password,
          confirmPassword,
        }),
      });

      const result = (await response.json()) as ForgotPasswordApiResponse;

      if (!response.ok || !result.success) {
        showToast({
          type: "error",
          title: "Reset kata sandi gagal",
          message: getFriendlyForgotPasswordError(result.message),
        });
        return;
      }

      showToast({
        type: "success",
        title: "Kata sandi berhasil diubah",
        message: "Silakan masuk kembali menggunakan kata sandi baru.",
      });

      setStep("success");
    } catch (error) {
      console.error("Reset password error:", error);

      showToast({
        type: "error",
        title: "Koneksi bermasalah",
        message: "Terjadi kesalahan koneksi saat mengatur ulang kata sandi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOtp = async () => {
    if (resendCooldown > 0 || isSubmitting) return;

    await requestOtp();
  };

  return (
    <AuthShell
      sideTitle="Atur Ulang Kata Sandi"
      sideDescription="Jangan khawatir, kami akan membantu Anda memulihkan akses ke akun EduBidan dengan mudah dan aman."
      sideVariant="primary"
      hideBackButton={step === "success"}
      onBackClick={handleBack}
    >
      {step !== "success" && <ForgotPasswordProgress activeStep={step} />}

      {step === "email" && (
        <ForgotPasswordEmailStep
          email={email}
          isSubmitting={isSubmitting}
          errorMessage={emailErrorMessage}
          onEmailChange={handleEmailChange}
          onSubmit={requestOtp}
        />
      )}

      {step === "otp" && (
        <ForgotPasswordOtpStep
          email={email}
          otp={otp}
          isSubmitting={isSubmitting}
          resendCooldown={resendCooldown}
          onOtpChange={setOtp}
          onSubmit={verifyOtp}
          onResend={resendOtp}
        />
      )}

      {step === "reset" && (
        <ForgotPasswordResetStep
          password={password}
          confirmPassword={confirmPassword}
          isSubmitting={isSubmitting}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onSubmit={resetPassword}
        />
      )}

      {step === "success" && <ForgotPasswordSuccess />}

      <AppToast toast={toast} onClose={() => setToast(null)} />
    </AuthShell>
  );
}