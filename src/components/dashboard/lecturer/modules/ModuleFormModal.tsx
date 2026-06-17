"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Image as ImageIcon,
  Loader2,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { createPortal } from "react-dom";

import type {
  LecturerModule,
  LecturerModuleFormValue,
  LecturerModuleStatus,
} from "@/data/learning/lecturer/lecturer-modules";
import { useIsClient } from "@/hooks/useIsClient";

interface ModuleFormModalProps {
  isOpen: boolean;
  editing: LecturerModule | null;
  onClose: () => void;
  onSave: (form: LecturerModuleFormValue) => void | Promise<void>;
}

type MediaUploadApiResponse = {
  success: boolean;
  message: string;
  data: {
    url: string;
    secureUrl: string;
    publicId: string;
  } | null;
};

const statusOptions: LecturerModuleStatus[] = ["Draft", "Publik"];

function getInitialForm(editing: LecturerModule | null): LecturerModuleFormValue {
  if (editing) {
    return {
      title: editing.title,
      status: editing.status,
      bannerUrl: editing.image ?? null,
      bannerPublicId: editing.bannerPublicId ?? null,
    };
  }

  return {
    title: "",
    status: "Draft",
    bannerUrl: null,
    bannerPublicId: null,
  };
}

export function ModuleFormModal({
  isOpen,
  editing,
  onClose,
  onSave,
}: ModuleFormModalProps) {
  const mounted = useIsClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialForm = useMemo(() => getInitialForm(editing), [editing]);

  const [error, setError] = useState("");
  const [bannerError, setBannerError] = useState("");
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [form, setForm] = useState<LecturerModuleFormValue>(initialForm);
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(
    null
  );
  const [previewBannerUrl, setPreviewBannerUrl] = useState<string | null>(null);
  const [shouldRemoveBanner, setShouldRemoveBanner] = useState(false);

  const bannerPreview = shouldRemoveBanner
    ? null
    : previewBannerUrl ?? form.bannerUrl ?? null;

  const canRemoveBanner = Boolean(bannerPreview);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (previewBannerUrl) {
        URL.revokeObjectURL(previewBannerUrl);
      }
    };
  }, [previewBannerUrl]);

  const handleBannerClick = () => {
    fileInputRef.current?.click();
  };

  const handleBannerChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setBannerError("Format banner tidak didukung. Gunakan JPG, PNG, atau WEBP.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setBannerError("Ukuran banner terlalu besar. Maksimal 5MB.");
      event.target.value = "";
      return;
    }

    if (previewBannerUrl) {
      URL.revokeObjectURL(previewBannerUrl);
    }

    setSelectedBannerFile(file);
    setPreviewBannerUrl(URL.createObjectURL(file));
    setShouldRemoveBanner(false);
    setBannerError("");
    event.target.value = "";
  };

  const handleRemoveBanner = () => {
    if (previewBannerUrl) {
      URL.revokeObjectURL(previewBannerUrl);
    }

    setSelectedBannerFile(null);
    setPreviewBannerUrl(null);
    setShouldRemoveBanner(true);
    setBannerError("");
  };

  const uploadBannerIfNeeded = async () => {
    if (!selectedBannerFile) return undefined;

    const formData = new FormData();

    formData.append("purpose", "module-banner");
    formData.append("file", selectedBannerFile);

    const response = await fetch("/api/media/upload", {
      method: "POST",
      credentials: "same-origin",
      body: formData,
    });

    const result = (await response.json()) as MediaUploadApiResponse;

    if (!response.ok || !result.success || !result.data) {
      throw new Error(result.message || "Upload banner modul gagal.");
    }

    return {
      bannerUrl: result.data.secureUrl || result.data.url,
      bannerPublicId: result.data.publicId,
    };
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError("Judul modul tidak boleh kosong.");
      return;
    }

    setError("");
    setBannerError("");
    setIsUploadingBanner(true);

    try {
      const uploadedBanner = await uploadBannerIfNeeded();

      await onSave({
        ...form,
        title: form.title.trim(),
        ...(uploadedBanner
          ? {
              bannerUrl: uploadedBanner.bannerUrl,
              bannerPublicId: uploadedBanner.bannerPublicId,
            }
          : shouldRemoveBanner
            ? {
                bannerUrl: null,
                bannerPublicId: null,
                shouldRemoveBanner: true,
              }
            : {}),
      });
    } catch (error) {
      console.error("Save module banner error:", error);

      setBannerError(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan banner modul. Silakan coba lagi."
      );
    } finally {
      setIsUploadingBanner(false);
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        aria-label="Tutup modal"
      />

      <div className="bg-card rounded-2xl sm:rounded-3xl border border-border w-full max-w-lg relative z-10 animate-in zoom-in-95 duration-200 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border shrink-0 bg-card z-20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <BookOpen size={20} />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-extrabold text-foreground truncate">
                {editing ? "Edit Modul" : "Tambah Modul Baru"}
              </h2>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                Lengkapi informasi dasar modul pembelajaran.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl transition-colors"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto scrollbar-thin bg-muted/20">
          <div>
            <label className="text-xs sm:text-sm mb-2.5 block font-bold text-foreground">
              Banner Modul
            </label>

            <button
              type="button"
              onClick={handleBannerClick}
              className="group relative w-full h-40 overflow-hidden rounded-2xl border border-dashed border-border bg-card hover:bg-muted transition-colors"
            >
              {bannerPreview ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bannerPreview}
                    alt="Preview banner modul"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-extrabold">
                    Ganti Banner
                  </div>
                </>
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <ImageIcon size={26} />
                  <span className="text-xs font-extrabold">
                    Pilih Banner Modul
                  </span>
                  <span className="text-[10px] font-medium">
                    JPG, PNG, atau WEBP · Maks. 5MB
                  </span>
                </div>
              )}
            </button>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              ref={fileInputRef}
              className="hidden"
              onChange={handleBannerChange}
            />

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleBannerClick}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-extrabold hover:bg-primary/90 transition-colors"
              >
                <ImageIcon size={14} />
                {bannerPreview ? "Ganti Banner" : "Pilih Banner"}
              </button>

              {canRemoveBanner && (
                <button
                  type="button"
                  onClick={handleRemoveBanner}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-red-500 text-xs font-extrabold hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={14} />
                  Hapus Banner
                </button>
              )}
            </div>

            {bannerError && (
              <p className="text-[11px] sm:text-xs font-bold text-red-500 mt-2">
                {bannerError}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="moduleTitle"
              className="text-xs sm:text-sm mb-2.5 block font-bold text-foreground"
            >
              Judul Modul
            </label>

            <input
              id="moduleTitle"
              value={form.title}
              onChange={(event) => {
                setForm((current) => ({
                  ...current,
                  title: event.target.value,
                }));
                setError("");
              }}
              placeholder="Contoh: ANC Terpadu Trimester 1"
              className="w-full px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-card border border-border text-sm text-foreground font-bold outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
            />

            {error && (
              <p className="text-[11px] sm:text-xs font-bold text-red-500 mt-2">
                {error}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs sm:text-sm mb-2.5 block font-bold text-foreground">
              Status Akses
            </label>

            <div className="flex gap-3">
              {statusOptions.map((status) => {
                const isSelected = form.status === status;

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        status,
                      }))
                    }
                    className={`flex-1 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border-2 text-sm font-extrabold transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>

            <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 font-medium leading-relaxed">
              Draft hanya tersimpan untuk dosen. Publik dapat diakses mahasiswa
              yang terdaftar pada modul.
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-border flex gap-3 sm:gap-4 shrink-0 bg-card rounded-b-2xl sm:rounded-3xl z-20">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploadingBanner}
            className="flex-1 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border border-border text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition-colors disabled:cursor-not-allowed disabled:opacity-70"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isUploadingBanner}
            className="flex-1 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-primary text-primary-foreground text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {isUploadingBanner ? (
              <Loader2 size={18} className="animate-spin sm:w-5 sm:h-5" />
            ) : (
              <Save size={18} className="sm:w-5 sm:h-5" />
            )}
            {isUploadingBanner
              ? "Menyimpan..."
              : editing
                ? "Simpan Perubahan"
                : "Simpan Modul"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}