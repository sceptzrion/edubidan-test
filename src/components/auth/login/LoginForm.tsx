"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  Copy,
  GraduationCap,
  Loader2,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";

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

type DemoRole = "MAHASISWA" | "DOSEN";

type DemoAccount = {
  email: string;
  password: string;
  role: DemoRole;
  expiresAt?: string;
};

type DemoAccountApiResponse = {
  success: boolean;
  message: string;
  data: DemoAccount | null;
};

const DEMO_COOLDOWN_SECONDS = 20;

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

function getRoleLabel(role: DemoRole) {
  return role === "MAHASISWA" ? "Mahasiswa" : "Dosen";
}

function getRoleDescription(role: DemoRole) {
  if (role === "MAHASISWA") {
    return "Cocok untuk mencoba dashboard, modul, materi, kuis evaluasi, hasil kuis, dan pengaturan akun.";
  }

  return "Cocok untuk mencoba dashboard dosen, kelola modul, materi, kuis, peserta, analisis kuis, dan rekap nilai.";
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextPath = searchParams.get("next");

  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [demoRole, setDemoRole] = useState<DemoRole>("MAHASISWA");
  const [demoAccount, setDemoAccount] = useState<DemoAccount | null>(null);
  const [demoErrorMessage, setDemoErrorMessage] = useState("");
  const [demoSuccessMessage, setDemoSuccessMessage] = useState("");
  const [isGeneratingDemo, setIsGeneratingDemo] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [hasCopiedDemoAccount, setHasCopiedDemoAccount] = useState(false);

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

  useEffect(() => {
    if (cooldownSeconds <= 0) return;

    const timer = window.setTimeout(() => {
      setCooldownSeconds((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [cooldownSeconds]);

  useEffect(() => {
    if (!hasCopiedDemoAccount) return;

    const timer = window.setTimeout(() => {
      setHasCopiedDemoAccount(false);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [hasCopiedDemoAccount]);

  const clearMessages = () => {
    setErrorMessage("");
    setReasonMessage("");
  };

  const clearDemoMessages = () => {
    setDemoErrorMessage("");
    setDemoSuccessMessage("");
  };

  const handleForgotPassword = () => {
    const trimmedEmail = email.trim();
    const targetPath = trimmedEmail
      ? `/forgot-password?email=${encodeURIComponent(trimmedEmail)}`
      : "/forgot-password";

    router.push(targetPath);
  };

  const handleGenerateDemoAccount = async () => {
    if (isGeneratingDemo || isBusy || cooldownSeconds > 0) return;

    clearMessages();
    clearDemoMessages();
    setDemoAccount(null);
    setHasCopiedDemoAccount(false);
    setIsGeneratingDemo(true);

    try {
      const response = await fetch("/api/demo-accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: demoRole,
        }),
      });

      const result = (await response.json()) as DemoAccountApiResponse;

      if (!response.ok || !result.success || !result.data) {
        setDemoErrorMessage(
          result.message || "Gagal membuat akun demo. Silakan coba lagi."
        );
        return;
      }

      setDemoAccount(result.data);
      setEmail(result.data.email);
      setPassword(result.data.password);
      setRemember(false);
      setCooldownSeconds(DEMO_COOLDOWN_SECONDS);
      setDemoSuccessMessage(
        `Akun demo ${getRoleLabel(result.data.role)} berhasil dibuat. Email dan kata sandi sudah otomatis diisi pada form login.`
      );
    } catch (error) {
      console.error("Generate demo account error:", error);
      setDemoErrorMessage("Terjadi kesalahan koneksi saat membuat akun demo.");
    } finally {
      setIsGeneratingDemo(false);
    }
  };

  const handleCopyDemoAccount = async () => {
    if (!demoAccount) return;

    const text = `Email: ${demoAccount.email}\nPassword: ${demoAccount.password}`;

    try {
      await navigator.clipboard.writeText(text);
      setHasCopiedDemoAccount(true);
    } catch {
      setDemoErrorMessage(
        "Browser tidak mengizinkan salin otomatis. Silakan salin email dan kata sandi secara manual."
      );
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid || isBusy) return;

    clearMessages();
    clearDemoMessages();
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

  const isGenerateDisabled =
    isGeneratingDemo || isBusy || cooldownSeconds > 0;

  return (
    <AuthShell
      sideTitle="Akses Uji Coba EduBidan"
      sideDescription="Gunakan akun demo untuk mencoba alur pembelajaran, pengelolaan modul, kuis evaluasi, dan dashboard sesuai role tanpa mengganggu data utama."
      sideVariant="primary"
    >
      <form
        onSubmit={handleSubmit}
        className="animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        <div className="mb-7 rounded-3xl border border-primary/20 bg-linear-to-br from-primary/10 via-card to-teal-500/10 p-4 sm:p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Sparkles size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-extrabold text-foreground">
                  Mode Uji Coba
                </h2>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-extrabold text-primary">
                  Usability Testing
                </span>
              </div>

              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                Pilih role, buat akun demo otomatis, lalu masuk untuk mencoba
                fitur EduBidan. Setiap akun demo memiliki data dummy sendiri.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {(["MAHASISWA", "DOSEN"] as DemoRole[]).map((role) => {
                  const isSelected = demoRole === role;

                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        setDemoRole(role);
                        clearDemoMessages();
                      }}
                      disabled={isGeneratingDemo || isBusy}
                      className={`rounded-2xl border px-3 py-3 text-left transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "border-border bg-background hover:border-primary/50 hover:bg-primary/5"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {role === "MAHASISWA" ? (
                          <GraduationCap size={17} />
                        ) : (
                          <UsersRound size={17} />
                        )}
                        <span className="text-sm font-extrabold">
                          {getRoleLabel(role)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <p className="mt-3 text-[11px] sm:text-xs leading-relaxed text-muted-foreground">
                {getRoleDescription(demoRole)}
              </p>

              <button
                type="button"
                onClick={handleGenerateDemoAccount}
                disabled={isGenerateDisabled}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-sm font-extrabold text-background transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isGeneratingDemo ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : cooldownSeconds > 0 ? (
                  <RefreshCw size={17} />
                ) : (
                  <UserRoundCheck size={17} />
                )}

                {isGeneratingDemo
                  ? "Membuat akun demo..."
                  : cooldownSeconds > 0
                    ? `Tunggu ${cooldownSeconds} detik`
                    : `Generate Akun Demo ${getRoleLabel(demoRole)}`}
              </button>

              {demoSuccessMessage && (
                <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs font-semibold leading-relaxed text-emerald-700 dark:text-emerald-300">
                  {demoSuccessMessage}
                </div>
              )}

              {demoErrorMessage && (
                <div className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-xs font-semibold leading-relaxed text-destructive">
                  {demoErrorMessage}
                </div>
              )}

              {demoAccount && (
                <div className="mt-4 rounded-2xl border border-border bg-background/80 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                        Akun demo aktif
                      </p>
                      <p className="mt-1 truncate text-xs font-extrabold text-foreground">
                        {demoAccount.email}
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
                        Password: {demoAccount.password}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyDemoAccount}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                      aria-label="Salin akun demo"
                    >
                      {hasCopiedDemoAccount ? (
                        <Check size={17} />
                      ) : (
                        <Copy size={17} />
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-start gap-2 rounded-2xl bg-background/70 px-3 py-3 text-[11px] leading-relaxed text-muted-foreground">
                <ShieldCheck size={15} className="mt-0.5 shrink-0 text-primary" />
                <span>
                  Admin tidak dibuat otomatis dari halaman ini. Role Admin
                  hanya digunakan untuk pengujian terbatas oleh peneliti.
                </span>
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-foreground">
          Masuk ke Akun
        </h1>

        <p className="text-muted-foreground mb-8 text-sm">
          Gunakan akun terdaftar atau akun demo yang sudah dibuat.
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
                  clearDemoMessages();
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
              clearDemoMessages();
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
          Ingin mendaftar sebagai mahasiswa asli?{" "}
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