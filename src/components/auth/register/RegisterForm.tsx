"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Hash, Loader2, Mail, User } from "lucide-react";

import { AuthShell } from "@/components/auth/shared/AuthShell";
import { PasswordInput } from "@/components/auth/shared/PasswordInput";
import { RegisterSuccess } from "@/components/auth/register/RegisterSuccess";
import { TermsModal } from "@/components/modals/TermsModal";

type RegisterApiResponse = {
  success: boolean;
  message: string;
  data: unknown;
  meta?: {
    email?: {
      sent: boolean;
      skipped: boolean;
      error: string | null;
    };
  };
};

function getFriendlyRegisterError(message: string) {
  const messages: Record<string, string> = {
    "Name is required": "Nama lengkap wajib diisi.",
    "NPM is required": "NPM wajib diisi.",
    "Email is required": "Email wajib diisi.",
    "Password is required": "Kata sandi wajib diisi.",
    "Password confirmation is required": "Konfirmasi kata sandi wajib diisi.",
    "Password must be at least 8 characters":
      "Kata sandi minimal harus 8 karakter.",
    "Password confirmation does not match":
      "Konfirmasi kata sandi belum sesuai.",
    "NPM must contain 10 to 20 digits": "NPM harus berisi 10 sampai 20 digit.",
    "Student email must use @student.unsika.ac.id domain":
      "Email mahasiswa harus menggunakan domain @student.unsika.ac.id.",
    "Student email must match the NPM format":
      "Email mahasiswa harus sesuai format NPM, contoh: npm@student.unsika.ac.id.",
    "Email is already registered": "Email sudah terdaftar.",
    "NPM is already registered": "NPM sudah terdaftar.",
  };

  return messages[message] ?? "Registrasi gagal. Silakan periksa kembali data Anda.";
}

function getInitialEmail(searchParams: URLSearchParams) {
  return searchParams.get("email") ?? "";
}

function getInitialNpm(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail.endsWith("@student.unsika.ac.id")) {
    return "";
  }

  return normalizedEmail.split("@")[0] ?? "";
}

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialEmail = getInitialEmail(searchParams);

  const [fullName, setFullName] = useState("");
  const [npm, setNpm] = useState(() => getInitialNpm(initialEmail));
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [agree, setAgree] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const normalizedNpm = npm.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const expectedStudentEmail = normalizedNpm
    ? `${normalizedNpm}@student.unsika.ac.id`
    : "";

  const isNpmValid = /^\d{10,20}$/.test(normalizedNpm);
  const isEmailDomainValid = normalizedEmail.endsWith(
    "@student.unsika.ac.id"
  );
  const isEmailNpmMatch =
    normalizedNpm.length > 0 && normalizedEmail === expectedStudentEmail;
  const isEmailValid = isEmailDomainValid && isEmailNpmMatch;
  const isPasswordMatch = password.length > 0 && password === confirmPassword;

  const isFormValid = useMemo(() => {
    return (
      fullName.trim().length >= 3 &&
      isNpmValid &&
      isEmailValid &&
      password.length >= 8 &&
      isPasswordMatch &&
      agree
    );
  }, [agree, fullName, isNpmValid, isEmailValid, password, isPasswordMatch]);

  const clearError = () => {
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleEmailChange = (nextEmail: string) => {
    setEmail(nextEmail);

    const nextNpm = getInitialNpm(nextEmail);

    if (nextNpm) {
      setNpm(nextNpm);
    }

    clearError();
  };

  const handleLoginClick = () => {
    const trimmedEmail = email.trim();
    const targetPath = trimmedEmail
      ? `/login?email=${encodeURIComponent(trimmedEmail)}`
      : "/login";

    router.push(targetPath);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid || isSubmitting) return;

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          npm,
          email,
          password,
          confirmPassword,
        }),
      });

      const result = (await response.json()) as RegisterApiResponse;

      if (!response.ok || !result.success) {
        setErrorMessage(getFriendlyRegisterError(result.message));
        return;
      }

      setIsSuccess(true);
    } catch (error) {
      console.error("Register error:", error);
      setErrorMessage("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      sideTitle="Mulai Belajar di EduBidan"
      sideDescription="Buat akun mahasiswa untuk mengakses modul video pembelajaran dan kuis evaluasi kebidanan."
      sideVariant="teal"
      hideBackButton={isSuccess}
    >
      {isSuccess ? (
        <RegisterSuccess />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-foreground">
            Buat Akun Mahasiswa
          </h1>

          <p className="text-muted-foreground mb-8 text-sm">
            Pendaftaran mandiri hanya tersedia untuk mahasiswa kebidanan.
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="text-xs font-semibold mb-1.5 block text-foreground"
                >
                  Nama Lengkap
                </label>

                <div className="relative group">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                  />
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(event) => {
                      setFullName(event.target.value);
                      clearError();
                    }}
                    placeholder="Nama lengkap"
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-card border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="npm"
                  className="text-xs font-semibold mb-1.5 block text-foreground"
                >
                  NPM
                </label>

                <div className="relative group">
                  <Hash
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                  />
                  <input
                    id="npm"
                    type="text"
                    value={npm}
                    onChange={(event) => {
                      setNpm(event.target.value);
                      clearError();
                    }}
                    placeholder="2310631179999"
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-card border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>

                {npm.length > 0 && !isNpmValid && (
                  <p className="text-[11px] font-medium text-red-500 mt-1.5">
                    NPM harus berisi 10 sampai 20 digit.
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-xs font-semibold mb-1.5 block text-foreground"
              >
                Email Mahasiswa
              </label>

              <div className="relative group">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => handleEmailChange(event.target.value)}
                  placeholder="npm@student.unsika.ac.id"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-card border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              {email.length > 0 && !isEmailDomainValid && (
                <p className="text-[11px] font-medium text-red-500 mt-1.5">
                  Email mahasiswa harus menggunakan domain @student.unsika.ac.id.
                </p>
              )}

              {email.length > 0 && isEmailDomainValid && !isEmailNpmMatch && (
                <p className="text-[11px] font-medium text-red-500 mt-1.5">
                  Email harus sesuai NPM, contoh: {expectedStudentEmail}.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PasswordInput
                id="password"
                label="Kata Sandi"
                value={password}
                onChange={(value) => {
                  setPassword(value);
                  clearError();
                }}
                placeholder="Min. 8 karakter"
                inputClassName="py-3 pl-10 pr-10"
                iconSize={16}
                iconClassName="left-3.5"
                buttonClassName="right-3.5"
                labelClassName="text-xs font-semibold"
                disabled={isSubmitting}
              />

              <div>
                <PasswordInput
                  id="confirmPassword"
                  label="Konfirmasi Sandi"
                  value={confirmPassword}
                  onChange={(value) => {
                    setConfirmPassword(value);
                    clearError();
                  }}
                  placeholder="Ulangi sandi"
                  inputClassName="py-3 pl-10 pr-10"
                  iconSize={16}
                  iconClassName="left-3.5"
                  buttonClassName="right-3.5"
                  labelClassName="text-xs font-semibold"
                  disabled={isSubmitting}
                />

                {confirmPassword.length > 0 && !isPasswordMatch && (
                  <p className="text-[11px] font-medium text-red-500 mt-1.5">
                    Konfirmasi kata sandi belum sesuai.
                  </p>
                )}
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                {errorMessage}
              </div>
            )}

            <div className="pt-2">
              <div className="flex items-center gap-3 select-none group w-fit">
                <button
                  type="button"
                  onClick={() =>
                    agree ? setAgree(false) : setShowTerms(true)
                  }
                  className={`cursor-pointer w-5 h-5 shrink-0 rounded-sm border-2 flex items-center justify-center transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                    agree
                      ? "bg-primary border-primary"
                      : "border-muted-foreground/40 bg-transparent group-hover:border-primary/60"
                  }`}
                  aria-label="Setujui syarat dan ketentuan"
                  disabled={isSubmitting}
                >
                  {agree && (
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
                </button>

                <div className="text-sm text-muted-foreground">
                  <span>Saya menyetujui </span>
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-primary font-semibold hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    Syarat & Ketentuan
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="w-full bg-primary text-primary-foreground py-3.5 mt-4 rounded-xl hover:opacity-90 transition-all font-bold text-base shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 size={18} className="animate-spin" />}
              {isSubmitting ? "Memproses..." : "Daftar Sekarang"}
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Sudah punya akun?{" "}
            <button
              type="button"
              onClick={handleLoginClick}
              className="text-primary font-bold hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              Masuk
            </button>
          </p>
        </form>
      )}

      <TermsModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onAgree={() => {
          setAgree(true);
          setShowTerms(false);
          clearError();
        }}
      />
    </AuthShell>
  );
}