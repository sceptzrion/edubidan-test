"use client";

import { FormEvent } from "react";
import { Loader2, Lock } from "lucide-react";

import { PasswordInput } from "@/components/auth/shared/PasswordInput";

interface ForgotPasswordResetStepProps {
  password: string;
  confirmPassword: string;
  isSubmitting: boolean;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (password: string) => void;
  onSubmit: () => void;
}

export function ForgotPasswordResetStep({
  password,
  confirmPassword,
  isSubmitting,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: ForgotPasswordResetStepProps) {
  const isPasswordMatch = password.length > 0 && password === confirmPassword;
  const isFormValid = password.length >= 8 && isPasswordMatch;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid || isSubmitting) return;

    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-in fade-in slide-in-from-right-4 duration-500"
    >
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
        <Lock size={32} className="text-primary" />
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-foreground">
        Kata Sandi Baru
      </h1>

      <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
        Buat kata sandi baru minimal 8 karakter. Gunakan kombinasi yang mudah
        diingat namun sulit ditebak.
      </p>

      <div className="space-y-5">
        <PasswordInput
          id="password"
          label="Kata Sandi Baru"
          value={password}
          onChange={onPasswordChange}
          placeholder="Min. 8 karakter"
          inputClassName="py-3.5 pl-11 pr-12"
          iconSize={18}
          iconClassName="left-4"
          buttonClassName="right-4"
          labelClassName="text-sm font-medium"
          disabled={isSubmitting}
        />

        <div>
          <PasswordInput
            id="confirmPassword"
            label="Konfirmasi Kata Sandi"
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
            placeholder="Ulangi kata sandi baru"
            inputClassName="py-3.5 pl-11 pr-12"
            iconSize={18}
            iconClassName="left-4"
            buttonClassName="right-4"
            labelClassName="text-sm font-medium"
            disabled={isSubmitting}
          />

          {confirmPassword.length > 0 && !isPasswordMatch && (
            <p className="text-[11px] font-medium text-red-500 mt-1.5">
              Konfirmasi kata sandi belum sesuai.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="w-full bg-primary text-primary-foreground py-3.5 mt-2 rounded-xl hover:opacity-90 transition-all font-bold text-base shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting && <Loader2 size={18} className="animate-spin" />}
          {isSubmitting ? "Menyimpan..." : "Simpan Kata Sandi"}
        </button>
      </div>
    </form>
  );
}