"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useIsClient } from "@/hooks/useIsClient";
import { createPortal } from "react-dom";
import {
  Award,
  Building2,
  Calendar,
  Key,
  Lock,
  Mail,
  Phone,
  Shield,
  Trash2,
  X,
} from "lucide-react";

import type { AdminUser } from "@/data/learning/admin/admin-users";

type UserDetailTab = "profil" | "akun";

interface UserDetailModalProps {
  user: AdminUser;
  onClose: () => void;
}

function Info({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="p-4 rounded-2xl border border-border bg-muted/10 flex items-start gap-3">
      <div className="text-primary mt-0.5 shrink-0">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">
          {label}
        </p>

        <p className="text-sm font-extrabold text-foreground wrap-break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

function AccountActionRow({
  icon,
  title,
  description,
  action,
  tone,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action: string;
  tone: "primary" | "danger";
}) {
  const buttonClass =
    tone === "primary"
      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
      : "bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white border border-red-500/20";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-start gap-4 min-w-0">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
            tone === "danger"
              ? "bg-red-500/10 text-red-500"
              : "bg-primary/10 text-primary"
          }`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-base font-extrabold text-foreground mb-0.5">
            {title}
          </p>

          <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all active:scale-95 whitespace-nowrap ${buttonClass}`}
      >
        {action}
      </button>
    </div>
  );
}

export function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  const mounted = useIsClient();
  const [tab, setTab] = useState<UserDetailTab>("profil");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const identityLabel = user.role === "Dosen" ? "NIDN / NIP" : "NIM / NPM";
  const moduleLabel = user.role === "Dosen" ? "Modul Dikelola" : "Modul Diikuti";

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Tutup modal detail pengguna"
      />

      <div className="relative z-10 bg-card rounded-3xl border border-border w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between bg-card shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-foreground">
              Detail Pengguna
            </h2>

            <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-1">
              Informasi akun dan status akses pengguna.
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

        <div className="overflow-y-auto scrollbar-thin bg-muted/10">
          <div className="p-5 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-8 text-center sm:text-left">
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl text-white flex items-center justify-center text-3xl font-extrabold shadow-lg shrink-0 ${
                  user.role === "Dosen"
                    ? "bg-linear-to-br from-indigo-500 to-purple-500"
                    : "bg-linear-to-br from-primary to-teal-500"
                }`}
              >
                {user.name.charAt(0)}
              </div>

              <div className="flex-1 mt-2 sm:mt-0 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                  <h3 className="text-2xl font-extrabold text-foreground leading-tight">
                    {user.name}
                  </h3>

                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${
                        user.role === "Dosen"
                          ? "bg-indigo-500/10 text-indigo-600 border border-indigo-500/20"
                          : "bg-teal-500/10 text-teal-600 border border-teal-500/20"
                      }`}
                    >
                      {user.role}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${
                        user.status === "Aktif"
                          ? "bg-green-500/10 text-green-600 border border-green-500/20"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>
                </div>

                <p className="text-sm font-medium text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
                  <Building2 size={16} />
                  {user.institution}
                </p>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-6 border-b border-border mb-8 overflow-x-auto scrollbar-none">
              {(["profil", "akun"] as const).map((item) => {
                const isActive = tab === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTab(item)}
                    className={`px-2 py-3 text-xs sm:text-sm font-extrabold border-b-2 transition-all whitespace-nowrap ${
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                  >
                    {item === "profil" ? "Informasi Profil" : "Pengaturan Akun"}
                  </button>
                );
              })}
            </div>

            {tab === "profil" && (
              <div className="grid sm:grid-cols-2 gap-4 animate-in fade-in duration-300">
                <Info
                  icon={<Mail size={16} />}
                  label="Alamat Email"
                  value={user.email}
                />

                <Info
                  icon={<Phone size={16} />}
                  label="Nomor Telepon"
                  value={user.phone ?? "-"}
                />

                <Info
                  icon={<Shield size={16} />}
                  label={identityLabel}
                  value={user.identityNo}
                />

                <Info
                  icon={<Calendar size={16} />}
                  label="Tanggal Bergabung"
                  value={user.joined}
                />

                <Info
                  icon={<Award size={16} />}
                  label={moduleLabel}
                  value={`${user.modules} Modul`}
                />
              </div>
            )}

            {tab === "akun" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <AccountActionRow
                  icon={<Lock size={20} />}
                  title="Reset Kata Sandi"
                  description="Kirim tautan reset kata sandi ke email pengguna."
                  action="Kirim Link"
                  tone="primary"
                />

                <AccountActionRow
                  icon={<Key size={20} />}
                  title="Atur Ulang Akses"
                  description="Gunakan tindakan ini jika pengguna mengalami kendala akses akun."
                  action="Atur Akses"
                  tone="primary"
                />

                <AccountActionRow
                  icon={<Trash2 size={20} />}
                  title={
                    user.status === "Aktif"
                      ? "Nonaktifkan Akun"
                      : "Aktifkan Akun"
                  }
                  description={
                    user.status === "Aktif"
                      ? "Pengguna tidak akan bisa login ke dalam sistem EduBidan."
                      : "Pengguna akan kembali bisa mengakses sistem EduBidan."
                  }
                  action={
                    user.status === "Aktif"
                      ? "Nonaktifkan Akun"
                      : "Aktifkan Akun"
                  }
                  tone="danger"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}