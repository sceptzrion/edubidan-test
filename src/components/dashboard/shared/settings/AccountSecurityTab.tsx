"use client";

import { FormEvent, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

type SecurityStatus = "idle" | "loading" | "success" | "error";

type PasswordApiResponse = {
  success: boolean;
  message: string;
  data: null;
};

interface AccountSecurityTabProps {
  description: string;
  currentPasswordId: string;
  newPasswordId: string;
  confirmPasswordId: string;
  successMessage: string;
}

function getFriendlyPasswordError(message: string) {
  if (message === "All password fields are required") {
    return "Harap isi semua kolom kata sandi.";
  }

  if (message === "New password must be at least 8 characters") {
    return "Kata sandi baru minimal harus 8 karakter.";
  }

  if (message === "Password confirmation does not match") {
    return "Konfirmasi kata sandi tidak cocok.";
  }

  if (message === "New password must be different") {
    return "Kata sandi baru tidak boleh sama dengan kata sandi saat ini.";
  }

  if (message === "Current password is incorrect") {
    return "Kata sandi saat ini salah.";
  }

  if (message === "Authentication required") {
    return "Sesi login sudah berakhir. Silakan login kembali.";
  }

  return "Gagal memperbarui kata sandi. Silakan coba lagi.";
}

export function AccountSecurityTab({
  description,
  currentPasswordId,
  newPasswordId,
  confirmPasswordId,
  successMessage,
}: AccountSecurityTabProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<SecurityStatus>("idle");
  const [message, setMessage] = useState("");

  const resetSuccessLater = () => {
    window.setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 3000);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      setStatus("error");
      setMessage("Harap isi semua kolom kata sandi.");
      return;
    }

    if (newPassword.length < 8) {
      setStatus("error");
      setMessage("Kata sandi baru minimal harus 8 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus("error");
      setMessage("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/account/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          currentPassword: oldPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const result = (await response.json()) as PasswordApiResponse;

      if (!response.ok || !result.success) {
        setStatus("error");
        setMessage(getFriendlyPasswordError(result.message));
        return;
      }

      setStatus("success");
      setMessage(successMessage);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      resetSuccessLater();
    } catch (error) {
      console.error("Update password error:", error);
      setStatus("error");
      setMessage("Terjadi kesalahan koneksi. Silakan coba lagi.");
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-base sm:text-lg font-extrabold text-foreground mb-1.5">
          Keamanan Akun
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
          {description}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 max-w-lg">
        {status === "error" && (
          <div className="flex items-center gap-2.5 p-3 sm:p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs sm:text-sm font-bold animate-in slide-in-from-top-2">
            <AlertCircle size={18} className="shrink-0" />
            {message}
          </div>
        )}

        {status === "success" && (
          <div className="flex items-center gap-2.5 p-3 sm:p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs sm:text-sm font-bold animate-in slide-in-from-top-2">
            <CheckCircle2 size={18} className="shrink-0" />
            {message}
          </div>
        )}

        <div>
          <label
            htmlFor={currentPasswordId}
            className="text-xs sm:text-sm mb-2 block font-bold text-muted-foreground"
          >
            Kata Sandi Saat Ini
          </label>

          <input
            id={currentPasswordId}
            type="password"
            value={oldPassword}
            onChange={(event) => setOldPassword(event.target.value)}
            placeholder="Masukkan kata sandi saat ini"
            autoComplete="current-password"
            className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-card border border-border outline-none focus:border-primary focus:ring-1 focus:ring-primary text-xs sm:text-sm font-medium text-foreground transition-all"
          />
        </div>

        <div>
          <label
            htmlFor={newPasswordId}
            className="text-xs sm:text-sm mb-2 block font-bold text-muted-foreground"
          >
            Kata Sandi Baru
          </label>

          <input
            id={newPasswordId}
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="Minimal 8 karakter"
            autoComplete="new-password"
            className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-card border border-border outline-none focus:border-primary focus:ring-1 focus:ring-primary text-xs sm:text-sm font-medium text-foreground transition-all"
          />
        </div>

        <div>
          <label
            htmlFor={confirmPasswordId}
            className="text-xs sm:text-sm mb-2 block font-bold text-muted-foreground"
          >
            Konfirmasi Kata Sandi Baru
          </label>

          <input
            id={confirmPasswordId}
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Ulangi kata sandi baru"
            autoComplete="new-password"
            className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-card border border-border outline-none focus:border-primary focus:ring-1 focus:ring-primary text-xs sm:text-sm font-medium text-foreground transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className={`flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all w-full sm:w-auto shadow-lg hover:-translate-y-0.5 ${
            status === "loading"
              ? "bg-primary/70 text-white cursor-not-allowed shadow-none hover:translate-y-0"
              : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
          }`}
        >
          {status === "loading" ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Memproses...
            </>
          ) : (
            "Perbarui Kata Sandi"
          )}
        </button>
      </form>
    </div>
  );
}