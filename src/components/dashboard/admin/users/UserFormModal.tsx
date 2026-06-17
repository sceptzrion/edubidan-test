"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useIsClient } from "@/hooks/useIsClient";
import { createPortal } from "react-dom";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  Send,
  Shield,
  Sparkles,
  X,
} from "lucide-react";

import type { AdminUser } from "@/data/learning/admin/admin-users";
import type { AdminUserFormData } from "@/lib/admin/users-admin-adapter";

interface UserFormModalProps {
  mode: "add" | "edit";
  user?: AdminUser;
  isResettingPassword?: boolean;
  onClose: () => void;
  onSave: (data: AdminUserFormData) => void;
  onResetPassword?: (user: AdminUser) => void;
}

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="text-xs sm:text-sm mb-2 block font-bold text-muted-foreground">
        {label} {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {children}

      {hint && (
        <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}

function getInitialForm(user?: AdminUser): AdminUserFormData {
  return (
    user ?? {
      name: "",
      email: "",
      phone: "",
      status: "Aktif",
      modules: 0,
      avgScore: 0,
      role: "Mahasiswa",
      identityNo: "",
      joined: new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      useAutoPassword: true,
      password: "",
      confirmPassword: "",
    }
  );
}

const inputClassName =
  "w-full px-4 py-3 rounded-xl bg-card border border-border outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-medium text-foreground placeholder:text-muted-foreground transition-all disabled:opacity-60 disabled:cursor-not-allowed";

const selectClassName =
  "w-full px-4 py-3 rounded-xl bg-card border border-border outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-bold text-foreground cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed";

export function UserFormModal({
  mode,
  user,
  isResettingPassword = false,
  onClose,
  onSave,
  onResetPassword,
}: UserFormModalProps) {
  const mounted = useIsClient();
  const [form, setForm] = useState<AdminUserFormData>(() =>
    getInitialForm(user)
  );
  const [showPassword, setShowPassword] = useState(false);
  const [resetStatus, setResetStatus] = useState<"idle" | "ready">("idle");

  const isAddMode = mode === "add";
  const useAutoPassword = form.useAutoPassword ?? true;
  const password = form.password ?? "";
  const confirmPassword = form.confirmPassword ?? "";

  const emailPlaceholder =
    form.role === "Dosen"
      ? "nama@staff.unsika.ac.id"
      : "npm@student.unsika.ac.id";

  const identityLabel =
    form.role === "Dosen" ? "NIDN / NIP" : "NPM Mahasiswa";

  const identityHint =
    form.role === "Dosen"
      ? "Gunakan NIDN/NIP dosen. Email dosen wajib memakai domain @staff.unsika.ac.id."
      : "Gunakan NPM mahasiswa. Email mahasiswa harus sesuai format npm@student.unsika.ac.id.";

  const manualPasswordInvalid =
    isAddMode &&
    !useAutoPassword &&
    (password.length < 8 || password !== confirmPassword);

  const canSubmit = useMemo(() => {
    if (!form.name?.trim()) return false;
    if (!form.email?.trim()) return false;
    if (!form.identityNo?.trim()) return false;

    if (isAddMode && !useAutoPassword) {
      return password.length >= 8 && password === confirmPassword;
    }

    return true;
  }, [
    form.name,
    form.email,
    form.identityNo,
    isAddMode,
    useAutoPassword,
    password,
    confirmPassword,
  ]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const updateForm = (patch: Partial<AdminUserFormData>) => {
    setForm((current) => ({
      ...current,
      ...patch,
    }));
  };

  const handleSendResetLink = () => {
    if (!user || isResettingPassword) return;

    setResetStatus("ready");
    onResetPassword?.(user);

    window.setTimeout(() => {
      setResetStatus("idle");
    }, 3000);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    onSave({
      ...form,
      useAutoPassword,
      password: useAutoPassword ? undefined : password,
      confirmPassword: useAutoPassword ? undefined : confirmPassword,
    });
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Tutup modal pengguna"
      />

      <div className="relative z-10 bg-card rounded-3xl border border-border w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
        <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between bg-card shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-foreground">
              {isAddMode ? "Tambah Pengguna Baru" : "Edit Data Pengguna"}
            </h2>

            <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-1 leading-relaxed">
              {isAddMode
                ? "Daftarkan akun dosen atau mahasiswa ke sistem EduBidan."
                : "Perbarui informasi identitas dan status akses pengguna."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Tutup modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto scrollbar-thin bg-muted/10">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Nama Lengkap" required>
              <input
                value={form.name ?? ""}
                onChange={(event) => updateForm({ name: event.target.value })}
                placeholder="Contoh: Sari Dewi"
                className={inputClassName}
              />
            </Field>

            <Field label="Peran Akun" required>
              <div className="relative">
                <select
                  value={form.role ?? "Mahasiswa"}
                  onChange={(event) =>
                    updateForm({
                      role: event.target.value as AdminUser["role"],
                      email: "",
                      identityNo: "",
                    })
                  }
                  className={`${selectClassName} appearance-none pr-10`}
                  disabled={!isAddMode}
                >
                  <option value="Mahasiswa">Mahasiswa</option>
                  <option value="Dosen">Dosen</option>
                </select>

                <Shield
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
              </div>
            </Field>

            <Field
              label="Email"
              required
              hint={
                form.role === "Mahasiswa"
                  ? "Contoh: 2310631170001@student.unsika.ac.id"
                  : "Contoh: dosen.kebidanan@staff.unsika.ac.id"
              }
            >
              <input
                type="email"
                value={form.email ?? ""}
                onChange={(event) => updateForm({ email: event.target.value })}
                placeholder={emailPlaceholder}
                className={inputClassName}
              />
            </Field>

            <Field label={identityLabel} required hint={identityHint}>
              <input
                value={form.identityNo ?? ""}
                onChange={(event) =>
                  updateForm({ identityNo: event.target.value })
                }
                placeholder={
                  form.role === "Dosen"
                    ? "Contoh: 0312087701"
                    : "Contoh: 2310631170001"
                }
                className={`${inputClassName} font-mono`}
              />
            </Field>

            <Field label="Nomor Telepon">
              <input
                value={form.phone ?? ""}
                onChange={(event) => updateForm({ phone: event.target.value })}
                placeholder="Contoh: 081234567890"
                className={inputClassName}
              />
            </Field>

            <Field label="Status Akun">
              <select
                value={form.status ?? "Aktif"}
                onChange={(event) =>
                  updateForm({
                    status: event.target.value as AdminUser["status"],
                  })
                }
                className={selectClassName}
              >
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </Field>
          </div>

          {isAddMode && (
            <div className="rounded-2xl border border-border p-5 bg-card shadow-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />

              <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <KeyRound size={18} />
                </div>

                <div>
                  <p className="text-sm font-extrabold text-foreground">
                    Kredensial Login
                  </p>

                  <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed mt-1">
                    Atur password awal untuk akun baru. Jika email service
                    aktif, informasi akun akan dikirim melalui email.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  updateForm({
                    useAutoPassword: !useAutoPassword,
                    password: "",
                    confirmPassword: "",
                  })
                }
                className="w-full flex items-start gap-3 rounded-2xl border border-border bg-muted/20 p-4 text-left hover:bg-muted/40 transition-colors"
              >
                <span
                  className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    useAutoPassword
                      ? "bg-primary border-primary"
                      : "border-muted-foreground/40 bg-transparent"
                  }`}
                >
                  {useAutoPassword && (
                    <CheckCircle2
                      size={14}
                      className="text-primary-foreground"
                    />
                  )}
                </span>

                <span>
                  <span className="block text-sm font-extrabold text-foreground">
                    Buat password otomatis
                  </span>

                  <span className="block text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed mt-1">
                    Sistem memakai password awal{" "}
                    <span className="font-mono font-extrabold text-foreground">
                      password123
                    </span>
                    . Informasi akun akan dikirim melalui email jika email
                    service sudah dikonfigurasi.
                  </span>
                </span>
              </button>

              {!useAutoPassword && (
                <div className="mt-5 grid sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Field label="Password Manual" required>
                    <div className="relative">
                      <LockKeyhole
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                      />

                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) =>
                          updateForm({ password: event.target.value })
                        }
                        placeholder="Minimal 8 karakter"
                        className={`${inputClassName} pl-11 pr-11`}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={
                          showPassword
                            ? "Sembunyikan password"
                            : "Tampilkan password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>
                  </Field>

                  <Field label="Konfirmasi Password" required>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) =>
                        updateForm({ confirmPassword: event.target.value })
                      }
                      placeholder="Ulangi password"
                      className={inputClassName}
                    />

                    {manualPasswordInvalid && (
                      <p className="mt-1.5 text-[11px] font-bold text-red-500">
                        Password minimal 8 karakter dan konfirmasi harus sama.
                      </p>
                    )}
                  </Field>
                </div>
              )}
            </div>
          )}

          {!isAddMode && (
            <div className="rounded-2xl border border-border p-5 bg-card shadow-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                    <Send size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-extrabold text-foreground">
                      Reset Password via Email
                    </p>

                    <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed mt-1">
                      Sistem akan membuat password sementara baru, menyimpannya
                      ke akun pengguna, lalu mengirim informasi reset ke email
                      pengguna jika email service sudah aktif.
                    </p>

                    {resetStatus === "ready" && (
                      <div className="mt-3 flex items-center gap-2 text-xs font-bold text-amber-600">
                        <Sparkles size={15} />
                        Permintaan reset password sedang diproses.
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSendResetLink}
                  disabled={isResettingPassword || !user}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 text-xs sm:text-sm font-extrabold hover:bg-amber-500 hover:text-white transition-colors whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-amber-500/10 disabled:hover:text-amber-600"
                >
                  {isResettingPassword ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Mail size={16} />
                  )}
                  {isResettingPassword ? "Memproses..." : "Reset Password"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6 border-t border-border flex gap-3 sm:gap-4 bg-card shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 rounded-xl border border-border text-sm font-bold text-foreground hover:bg-muted transition-colors"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex-1 py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-extrabold hover:bg-primary/90 transition-all hover:-translate-y-0.5 shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isAddMode ? "Daftarkan Pengguna" : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}