"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  BookOpen,
  FileVideo,
  Link as LinkIcon,
  Plus,
  Save,
  Target,
  Trash2,
  Upload,
  Wrench,
  X,
} from "lucide-react";

import { useIsClient } from "@/hooks/useIsClient";
import type { LecturerMateriItem } from "@/components/dashboard/lecturer/modules/detail/PlaylistTab";

interface MateriModalProps {
  initial: LecturerMateriItem | null;
  onSave: (value: LecturerMateriItem) => void;
  onClose: () => void;
}

function getInitialForm(initial: LecturerMateriItem | null): LecturerMateriItem {
  return {
    kind: "materi",
    id: initial?.id ?? 0,
    title: initial?.title ?? "",
    videoUrl: initial?.videoUrl ?? "",
    videoSource: initial?.videoSource ?? "embed",
    summary: initial?.summary ?? "",
    objectives: initial?.objectives ?? [""],
    tools: initial?.tools ?? [""],
    duration: initial?.duration ?? "- menit",
  };
}

export function MateriModal({ initial, onSave, onClose }: MateriModalProps) {
  const mounted = useIsClient();

  const [form, setForm] = useState<LecturerMateriItem>(() =>
    getInitialForm(initial)
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const updateList = (
    key: "objectives" | "tools",
    index: number,
    value: string
  ) => {
    setForm((current) => {
      const next = [...current[key]];
      next[index] = value;

      return {
        ...current,
        [key]: next,
      };
    });
  };

  const addItem = (key: "objectives" | "tools") => {
    setForm((current) => ({
      ...current,
      [key]: [...current[key], ""],
    }));
  };

  const removeItem = (key: "objectives" | "tools", index: number) => {
    setForm((current) => ({
      ...current,
      [key]: current[key].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSave = () => {
    onSave({
      ...form,
      title: form.title.trim(),
      duration: form.duration,
      summary: form.summary.trim(),
      objectives: form.objectives.map((item) => item.trim()).filter(Boolean),
      tools: form.tools.map((item) => item.trim()).filter(Boolean),
    });
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-label="Tutup modal materi"
      />

      <div className="bg-card rounded-2xl sm:rounded-3xl border border-border w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border shrink-0 bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FileVideo size={20} />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-foreground">
              {initial ? "Edit Materi Modul" : "Tambah Materi Baru"}
            </h2>
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

        <div className="p-5 sm:p-6 space-y-6 sm:space-y-8 overflow-y-auto scrollbar-thin bg-muted/10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs sm:text-sm mb-2.5 block font-bold text-foreground">
                Judul Materi
              </label>
              <input
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                placeholder="Contoh: Anamnesis Ibu Hamil"
                className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm font-bold text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all"
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm mb-2.5 block font-bold text-foreground">
                Durasi Video
              </label>
              <div className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border text-sm font-extrabold text-muted-foreground shadow-sm">
                {form.duration || "- menit"}
              </div>
              <p className="text-[10px] text-muted-foreground font-medium mt-2 leading-relaxed">
                Durasi otomatis dibaca dari link YouTube saat materi disimpan.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm">
            <label className="text-xs sm:text-sm mb-3 block font-bold text-foreground">
              Sumber Video
            </label>

            <div className="flex p-1 rounded-xl bg-muted/50 border border-border/50 mb-4">
              <button
                type="button"
                disabled
                title="Upload video native belum tersedia pada tahap ini"
                className={`flex-1 py-2.5 text-xs sm:text-sm font-extrabold rounded-lg flex items-center justify-center gap-2 transition-all cursor-not-allowed opacity-60 ${
                  form.videoSource === "upload"
                    ? "bg-card shadow-sm text-primary border border-border/50"
                    : "text-muted-foreground"
                }`}
              >
                <Upload size={16} /> Upload Video
              </button>

              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    videoSource: "embed",
                  }))
                }
                className={`flex-1 py-2.5 text-xs sm:text-sm font-extrabold rounded-lg flex items-center justify-center gap-2 transition-all ${
                  form.videoSource === "embed"
                    ? "bg-card shadow-sm text-primary border border-border/50"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LinkIcon size={16} /> Embed Link Tautan
              </button>
            </div>

            {form.videoSource === "upload" ? (
              <div className="border-2 border-dashed border-border bg-muted/20 rounded-xl p-8 text-center transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Upload size={24} className="text-primary" />
                </div>
                <p className="text-sm font-extrabold text-foreground mb-1">
                  Upload video belum tersedia
                </p>
                <p className="text-xs font-medium text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Untuk tahap ini, gunakan opsi Embed Link Tautan seperti
                  YouTube agar video dapat diputar di preview dosen dan halaman
                  mahasiswa.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      videoSource: "embed",
                    }))
                  }
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-extrabold hover:bg-primary/90 transition-colors"
                >
                  <LinkIcon size={14} />
                  Gunakan Embed Link
                </button>
              </div>
            ) : (
              <>
                <input
                  value={form.videoUrl ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      videoUrl: event.target.value,
                    }))
                  }
                  placeholder="Masukkan URL (Contoh: https://youtube.com/watch?v=...)"
                  className="w-full px-4 py-3.5 rounded-xl bg-muted/30 border border-border text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 font-medium leading-relaxed">
                  Mendukung link YouTube biasa, YouTube Shorts, youtu.be, dan
                  format embed. Durasi video akan dihitung otomatis setelah
                  materi disimpan.
                </p>
              </>
            )}
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
              <div>
                <label
                  htmlFor="materialSummary"
                  className="text-xs sm:text-sm flex items-center gap-2 font-bold text-foreground"
                >
                  <BookOpen size={16} className="text-primary" />
                  Ringkasan Materi
                </label>

                <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-1">
                  Tulis penjelasan yang akan dibaca mahasiswa sebelum atau
                  sesudah menonton video.
                </p>
              </div>

              <span className="text-[10px] sm:text-xs font-bold text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-lg shrink-0">
                {form.summary.trim().length} karakter
              </span>
            </div>

            <textarea
              id="materialSummary"
              rows={6}
              value={form.summary}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  summary: event.target.value,
                }))
              }
              placeholder="Contoh: Materi ini membahas langkah-langkah pemeriksaan dasar pada ibu hamil, mulai dari anamnesis, pemeriksaan tanda vital, hingga dokumentasi hasil pemeriksaan."
              className="w-full px-4 py-3.5 rounded-xl bg-muted/30 border border-border text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y min-h-36 leading-relaxed transition-all"
            />
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-3">
              <label className="text-xs sm:text-sm flex items-center gap-2 font-bold text-foreground">
                <Target size={16} className="text-primary" /> Tujuan
                Pembelajaran
              </label>
              <button
                type="button"
                onClick={() => addItem("objectives")}
                className="text-xs sm:text-sm text-primary flex items-center gap-1.5 hover:bg-primary/10 px-2 py-1 rounded-md font-extrabold transition-colors"
              >
                <Plus size={14} /> Tambah Tujuan
              </button>
            </div>

            <div className="space-y-3">
              {form.objectives.map((objective, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 font-extrabold">
                    {index + 1}
                  </span>
                  <input
                    value={objective}
                    onChange={(event) =>
                      updateList("objectives", index, event.target.value)
                    }
                    placeholder={`Tulis poin tujuan pembelajaran ${index + 1}`}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-muted/30 border border-border text-sm font-medium text-foreground outline-none focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem("objectives", index)}
                    className="p-2.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-xl transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-3">
              <label className="text-xs sm:text-sm flex items-center gap-2 font-bold text-foreground">
                <Wrench size={16} className="text-primary" /> Alat Pendukung /
                Praktikum
              </label>
              <button
                type="button"
                onClick={() => addItem("tools")}
                className="text-xs sm:text-sm text-primary flex items-center gap-1.5 hover:bg-primary/10 px-2 py-1 rounded-md font-extrabold transition-colors"
              >
                <Plus size={14} /> Tambah Alat
              </button>
            </div>

            <div className="space-y-3">
              {form.tools.map((tool, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 font-extrabold">
                    •
                  </span>
                  <input
                    value={tool}
                    onChange={(event) =>
                      updateList("tools", index, event.target.value)
                    }
                    placeholder="Cth: Buku KIA, Phantom Pelvis, dll."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-muted/30 border border-border text-sm font-medium text-foreground outline-none focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem("tools", index)}
                    className="p-2.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-xl transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-border flex gap-3 sm:gap-4 shrink-0 bg-card rounded-b-2xl sm:rounded-3xl z-20">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 sm:py-3.5 rounded-xl border border-border text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition-colors"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 sm:py-3.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
          >
            <Save size={18} /> Simpan Materi
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}