"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Loader2, Mail } from "lucide-react";

interface ForgotPasswordEmailStepProps {
  email: string;
  isSubmitting: boolean;
  errorMessage: string;
  onEmailChange: (email: string) => void;
  onSubmit: () => void;
}

export function ForgotPasswordEmailStep({
  email,
  isSubmitting,
  errorMessage,
  onEmailChange,
  onSubmit,
}: ForgotPasswordEmailStepProps) {
  const router = useRouter();
  const isEmailFilled = email.trim().length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isEmailFilled || isSubmitting) return;

    onSubmit();
  };

  const handleRegisterClick = () => {
    const trimmedEmail = email.trim();
    const targetPath = trimmedEmail
      ? `/register?email=${encodeURIComponent(trimmedEmail)}`
      : "/register";

    router.push(targetPath);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
        <Mail size={32} className="text-primary" />
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-foreground">
        Lupa Kata Sandi?
      </h1>

      <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
        Masukkan email yang terdaftar. Jika email valid, sistem akan mengirimkan
        kode verifikasi untuk proses pemulihan akun.
      </p>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="text-sm font-medium mb-1.5 block text-foreground"
          >
            Email Terdaftar
          </label>

          <div className="relative group">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
            />

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="Masukkan email"
              disabled={isSubmitting}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-card border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />

            <div className="space-y-1">
              <p className="font-semibold">{errorMessage}</p>

              <p className="text-destructive/90">
                Belum punya akun?{" "}
                <button
                  type="button"
                  onClick={handleRegisterClick}
                  className="font-bold underline underline-offset-2 hover:opacity-80"
                  disabled={isSubmitting}
                >
                  Buat akun
                </button>
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!isEmailFilled || isSubmitting}
          className="w-full bg-primary text-primary-foreground py-3.5 mt-2 rounded-xl hover:opacity-90 transition-all font-bold text-base shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting && <Loader2 size={18} className="animate-spin" />}
          {isSubmitting ? "Mengirim..." : "Kirim Kode Verifikasi"}
          {!isSubmitting && <ArrowRight size={18} />}
        </button>
      </div>
    </form>
  );
}