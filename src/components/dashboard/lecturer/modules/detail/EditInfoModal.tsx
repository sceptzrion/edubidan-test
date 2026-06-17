"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2, Save, X } from "lucide-react";

import { useIsClient } from "@/hooks/useIsClient";
import type { LecturerModuleDetailInfo } from "@/data/learning/lecturer/lecturer-module-detail";

interface EditInfoModalProps {
  info: LecturerModuleDetailInfo;
  isSaving?: boolean;
  onSave: (value: LecturerModuleDetailInfo) => void;
  onClose: () => void;
}

export function EditInfoModal({
  info,
  isSaving = false,
  onSave,
  onClose,
}: EditInfoModalProps) {
  const mounted = useIsClient();
  const [form, setForm] = useState<LecturerModuleDetailInfo>(info);
  const [objectiveText, setObjectiveText] = useState(info.objectives.join("\n"));

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleSave = () => {
    if (isSaving) return;

    const objectives = objectiveText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    onSave({
      ...form,
      estimatedTime: info.estimatedTime,
      objectives,
    });
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        onClick={isSaving ? undefined : onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        aria-label="Tutup modal edit informasi modul"
      />

      <div className="relative z-10 w-full max-w-2xl bg-card border border-border rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-foreground">
              Edit Informasi Modul
            </h2>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              Perbarui judul, deskripsi, tujuan, dan status akses modul.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto bg-muted/20 scrollbar-thin">
          <div>
            <label
              htmlFor="moduleTitle"
              className="text-xs sm:text-sm mb-2 block font-bold text-foreground"
            >
              Judul Modul
            </label>
            <input
              id="moduleTitle"
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              disabled={isSaving}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-bold text-foreground disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="moduleDescription"
              className="text-xs sm:text-sm mb-2 block font-bold text-foreground"
            >
              Deskripsi Modul
            </label>
            <textarea
              id="moduleDescription"
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
              rows={4}
              disabled={isSaving}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-medium text-foreground resize-none leading-relaxed disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <p className="text-xs sm:text-sm mb-2 block font-bold text-foreground">
              Estimasi Durasi
            </p>

            <div className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border text-sm font-extrabold text-muted-foreground">
              {form.estimatedTime || "- menit"}
            </div>

            <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 font-medium leading-relaxed">
              Durasi modul dihitung otomatis dari total durasi materi dan kuis, lalu
              dibulatkan ke atas ke kelipatan 5 menit.
            </p>
          </div>

          <div>
            <label
              htmlFor="moduleObjectives"
              className="text-xs sm:text-sm mb-2 block font-bold text-foreground"
            >
              Tujuan Pembelajaran
            </label>
            <textarea
              id="moduleObjectives"
              value={objectiveText}
              onChange={(event) => setObjectiveText(event.target.value)}
              rows={5}
              disabled={isSaving}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-medium text-foreground resize-none leading-relaxed disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="Tulis satu tujuan pembelajaran per baris"
            />
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 font-medium">
              Tulis satu tujuan pembelajaran per baris.
            </p>
          </div>

          <div>
            <label className="text-xs sm:text-sm mb-2 block font-bold text-foreground">
              Status Akses
            </label>

            <div className="flex gap-3">
              {(["Draft", "Publik"] as const).map((status) => {
                const isActive = form.status === status;

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setForm({ ...form, status })}
                    disabled={isSaving}
                    className={`flex-1 py-3 rounded-xl border-2 text-sm font-extrabold transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                      isActive
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-border flex gap-3 bg-card">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 py-3 rounded-xl border border-border text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-extrabold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Save size={17} />
            )}
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}