"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Mail } from "lucide-react";

import { AuthShell } from "@/components/auth/shared/AuthShell";
import { PasswordInput } from "@/components/auth/shared/PasswordInput";
import { setStoredUser, type StoredUser } from "@/lib/auth/client-auth";

type LoginApiResponse = {
  success: boolean;
  message: string;
  data: {
    user: StoredUser;
    redirectTo: string;
  } | null;
};

function getFriendlyLoginError(message: string) {
  if (message === "Email is required") {
    return "Email wajib diisi.";
  }

  if (message === "Password is required") {
    return "Kata sandi wajib diisi.";
  }

  if (message === "Invalid email or password") {
    return "Email atau kata sandi tidak sesuai.";
  }

  if (message === "User account is inactive") {
    return "Akun Anda sedang nonaktif. Silakan hubungi admin.";
  }

  return "Gagal masuk. Silakan coba lagi.";
}

function isSafeRedirectPath(path: string | null): path is string {
  return (
    typeof path === "string" &&
    path.startsWith("/") &&
    !path.startsWith("//")
  );
}

function getReasonMessage(reason: string | null) {
  if (reason === "auth-required") {
    return "Anda harus login terlebih dahulu.";
  }

  return "";
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextPath = searchParams.get("next");

  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [reasonMessage, setReasonMessage] = useState(() =>
    getReasonMessage(searchParams.get("reason"))
  );

  const isBusy = isSubmitting || isRedirecting;

  const isFormValid = useMemo(() => {
    return email.trim().length > 0 && password.trim().length > 0;
  }, [email, password]);

  const clearMessages = () => {
    setErrorMessage("");
    setReasonMessage("");
  };

  const handleForgotPassword = () => {
    const trimmedEmail = email.trim();
    const targetPath = trimmedEmail
      ? `/forgot-password?email=${encodeURIComponent(trimmedEmail)}`
      : "/forgot-password";

    router.push(targetPath);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid || isBusy) return;

    clearMessages();
    setIsSubmitting(true);
    setIsRedirecting(false);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = (await response.json()) as LoginApiResponse;

      if (!response.ok || !result.success || !result.data) {
        setErrorMessage(getFriendlyLoginError(result.message));
        setIsSubmitting(false);
        return;
      }

      setStoredUser(result.data.user, remember);

      setIsSubmitting(false);
      setIsRedirecting(true);

      router.push(
        isSafeRedirectPath(nextPath) ? nextPath : result.data.redirectTo
      );
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Terjadi kesalahan koneksi. Silakan coba lagi.");
      setIsSubmitting(false);
      setIsRedirecting(false);
    }
  };

  return (
    <AuthShell
      sideTitle="Selamat Datang Kembali"
      sideDescription="Masuk untuk melanjutkan pembelajaran, mengelola modul, atau memantau aktivitas EduBidan sesuai peran akun Anda."
      sideVariant="primary"
    >
      <form
        onSubmit={handleSubmit}
        className="animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-foreground">
          Masuk ke Akun
        </h1>

        <p className="text-muted-foreground mb-8 text-sm">
          Masukkan email dan kata sandi untuk melanjutkan.
        </p>

        {reasonMessage && (
          <div className="mb-6 rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
            {reasonMessage}
          </div>
        )}

        {isRedirecting && (
          <div className="mb-6 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary flex items-center gap-2">
            <Loader2 size={16} className="animate-spin shrink-0" />
            <span>Login berhasil. Menyiapkan dashboard Anda...</span>
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium mb-1.5 block text-foreground"
            >
              Email
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
                onChange={(event) => {
                  setEmail(event.target.value);
                  clearMessages();
                }}
                placeholder="Masukkan email"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-card border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isBusy}
              />
            </div>
          </div>

          <PasswordInput
            id="password"
            label="Kata Sandi"
            value={password}
            onChange={(value) => {
              setPassword(value);
              clearMessages();
            }}
            placeholder="Masukkan kata sandi"
            inputClassName="py-3.5 pl-11 pr-12"
            iconSize={18}
            iconClassName="left-4"
            buttonClassName="right-4"
            labelClassName="text-sm font-medium"
            disabled={isBusy}
          />

          {errorMessage && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
              {errorMessage}
            </div>
          )}

          <div className="flex items-center justify-between mt-2 gap-4">
            <button
              type="button"
              onClick={() => setRemember((current) => !current)}
              className="flex items-center gap-2.5 select-none group disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isBusy}
            >
              <span
                className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center transition-all ${
                  remember
                    ? "bg-primary border-primary"
                    : "border-muted-foreground/40 bg-transparent group-hover:border-primary/60"
                }`}
              >
                {remember && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2.5 6L5 8.5L9.5 3.5"
                      stroke="white"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>

              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                Ingat Saya
              </span>
            </button>

            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-primary font-semibold hover:underline whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isBusy}
            >
              Lupa kata sandi?
            </button>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isBusy}
            className="w-full bg-primary text-primary-foreground py-3.5 mt-4 rounded-xl hover:opacity-90 transition-all font-bold text-base shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isBusy && <Loader2 size={18} className="animate-spin" />}
            {isRedirecting
              ? "Menyiapkan dashboard..."
              : isSubmitting
                ? "Memproses login..."
                : "Masuk"}
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Belum punya akun?{" "}
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="text-primary font-bold hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isBusy}
          >
            Daftar Sekarang
          </button>
        </p>
      </form>
    </AuthShell>
  );
}