"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertCircle,
  Clock,
  HelpCircle,
  ImageIcon,
  ListOrdered,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import { useIsClient } from "@/hooks/useIsClient";
import type {
  LecturerKuisItem,
  LecturerQuizQuestion,
} from "@/components/dashboard/lecturer/modules/detail/PlaylistTab";

interface KuisModalProps {
  initial: LecturerKuisItem | null;
  onSave: (value: LecturerKuisItem) => void | Promise<void>;
  onClose: () => void;
}

type QuestionImageDraft = {
  file: File;
  previewUrl: string;
};

type MediaUploadApiResponse = {
  success: boolean;
  message: string;
  data: {
    url: string;
    secureUrl: string;
    publicId: string;
  } | null;
};

function createDefaultQuestion(id = 1): LecturerQuizQuestion {
  return {
    id,
    questionText: "",
    mediaUrl: null,
    mediaPublicId: null,
    options: [
      { id: 1, text: "" },
      { id: 2, text: "" },
    ],
    correctOptionId: 1,
  };
}

function getInitialQuestions(
  initial: LecturerKuisItem | null
): LecturerQuizQuestion[] {
  if (initial?.questions && initial.questions.length > 0) {
    return initial.questions.map((question) => ({
      ...question,
      mediaPublicId: question.mediaPublicId ?? null,
    }));
  }

  return [createDefaultQuestion()];
}

function getFileError(file: File) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    return "Format gambar tidak didukung. Gunakan JPG, PNG, atau WEBP.";
  }

  if (file.size > 5 * 1024 * 1024) {
    return "Ukuran gambar terlalu besar. Maksimal 5MB.";
  }

  return null;
}

export function KuisModal({ initial, onSave, onClose }: KuisModalProps) {
  const mounted = useIsClient();
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const [form, setForm] = useState<LecturerKuisItem>({
    kind: "kuis",
    id: initial?.id ?? 0,
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    hasTimeLimit: initial?.hasTimeLimit ?? false,
    timeLimitMinutes: initial?.timeLimitMinutes ?? 15,
    questions: getInitialQuestions(initial),
  });
  const [questionImageDrafts, setQuestionImageDrafts] = useState<
    Record<number, QuestionImageDraft>
  >({});
  const [imageErrors, setImageErrors] = useState<Record<number, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    return () => {
      Object.values(questionImageDrafts).forEach((draft) => {
        URL.revokeObjectURL(draft.previewUrl);
      });
    };
  }, [questionImageDrafts]);

  const handleToggleTime = () => {
    setForm((current) => ({
      ...current,
      hasTimeLimit: !current.hasTimeLimit,
    }));
  };

  const addQuestion = () => {
    setForm((current) => ({
      ...current,
      questions: [...current.questions, createDefaultQuestion(Date.now())],
    }));
  };

  const removeQuestion = (questionId: number) => {
    setQuestionImageDrafts((current) => {
      const existingDraft = current[questionId];

      if (existingDraft) {
        URL.revokeObjectURL(existingDraft.previewUrl);
      }

      const next = { ...current };
      delete next[questionId];

      return next;
    });

    setImageErrors((current) => {
      const next = { ...current };
      delete next[questionId];

      return next;
    });

    setForm((current) => ({
      ...current,
      questions: current.questions.filter(
        (question) => question.id !== questionId
      ),
    }));
  };

  const updateQuestionText = (questionId: number, text: string) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              questionText: text,
            }
          : question
      ),
    }));
  };

  const addOption = (questionId: number) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question) => {
        if (question.id !== questionId) return question;

        return {
          ...question,
          options: [...question.options, { id: Date.now(), text: "" }],
        };
      }),
    }));
  };

  const removeOption = (questionId: number, optionId: number) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question) => {
        if (question.id !== questionId) return question;

        const nextOptions = question.options.filter(
          (option) => option.id !== optionId
        );

        return {
          ...question,
          options: nextOptions,
          correctOptionId:
            question.correctOptionId === optionId
              ? nextOptions[0]?.id ?? 1
              : question.correctOptionId,
        };
      }),
    }));
  };

  const updateOptionText = (
    questionId: number,
    optionId: number,
    text: string
  ) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question) => {
        if (question.id !== questionId) return question;

        return {
          ...question,
          options: question.options.map((option) =>
            option.id === optionId
              ? {
                  ...option,
                  text,
                }
              : option
          ),
        };
      }),
    }));
  };

  const setCorrectOption = (questionId: number, optionId: number) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              correctOptionId: optionId,
            }
          : question
      ),
    }));
  };

  const openQuestionImagePicker = (questionId: number) => {
    fileInputRefs.current[questionId]?.click();
  };

  const handleQuestionImageChange = (
    questionId: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const fileError = getFileError(file);

    if (fileError) {
      setImageErrors((current) => ({
        ...current,
        [questionId]: fileError,
      }));

      event.target.value = "";
      return;
    }

    setQuestionImageDrafts((current) => {
      const existingDraft = current[questionId];

      if (existingDraft) {
        URL.revokeObjectURL(existingDraft.previewUrl);
      }

      return {
        ...current,
        [questionId]: {
          file,
          previewUrl: URL.createObjectURL(file),
        },
      };
    });

    setImageErrors((current) => {
      const next = { ...current };
      delete next[questionId];

      return next;
    });

    event.target.value = "";
  };

  const removeQuestionImage = (questionId: number) => {
    setQuestionImageDrafts((current) => {
      const existingDraft = current[questionId];

      if (existingDraft) {
        URL.revokeObjectURL(existingDraft.previewUrl);
      }

      const next = { ...current };
      delete next[questionId];

      return next;
    });

    setImageErrors((current) => {
      const next = { ...current };
      delete next[questionId];

      return next;
    });

    setForm((current) => ({
      ...current,
      questions: current.questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              mediaUrl: null,
              mediaPublicId: null,
            }
          : question
      ),
    }));
  };

  const uploadQuestionImage = async (file: File) => {
    const formData = new FormData();

    formData.append("purpose", "question-image");
    formData.append("file", file);

    const response = await fetch("/api/media/upload", {
      method: "POST",
      credentials: "same-origin",
      body: formData,
    });

    const result = (await response.json()) as MediaUploadApiResponse;

    if (!response.ok || !result.success || !result.data) {
      throw new Error(result.message || "Upload gambar soal gagal.");
    }

    return {
      mediaUrl: result.data.secureUrl || result.data.url,
      mediaPublicId: result.data.publicId,
    };
  };

  const uploadQuestionImagesIfNeeded = async () => {
    const entries = Object.entries(questionImageDrafts);

    if (entries.length === 0) {
      return form.questions;
    }

    const uploadedEntries = await Promise.all(
      entries.map(async ([questionId, draft]) => {
        const uploaded = await uploadQuestionImage(draft.file);

        return {
          questionId: Number(questionId),
          ...uploaded,
        };
      })
    );

    return form.questions.map((question) => {
      const uploaded = uploadedEntries.find(
        (entry) => entry.questionId === question.id
      );

      if (!uploaded) return question;

      return {
        ...question,
        mediaUrl: uploaded.mediaUrl,
        mediaPublicId: uploaded.mediaPublicId,
      };
    });
  };

  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);

    try {
      const questionsWithUploadedImages = await uploadQuestionImagesIfNeeded();

      await onSave({
        ...form,
        title: form.title.trim(),
        description: form.description?.trim() ?? "",
        questions: questionsWithUploadedImages.map((question) => ({
          ...question,
          questionText: question.questionText.trim(),
          options: question.options.map((option) => ({
            ...option,
            text: option.text.trim(),
          })),
        })),
      });
    } catch (error) {
      console.error("Save quiz error:", error);

      setImageErrors((current) => ({
        ...current,
        [-1]:
          error instanceof Error
            ? error.message
            : "Gagal menyimpan kuis. Silakan coba lagi.",
      }));
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-label="Tutup modal kuis"
      />

      <div className="bg-card rounded-2xl sm:rounded-3xl border border-border w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border shrink-0 bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <HelpCircle size={20} />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-foreground">
              {initial ? "Edit Kuis Evaluasi" : "Buat Kuis Baru"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl transition-colors disabled:cursor-not-allowed disabled:opacity-70"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-8 overflow-y-auto scrollbar-thin bg-muted/10">
          {imageErrors[-1] && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs font-bold text-red-500">
              {imageErrors[-1]}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs sm:text-sm mb-2 block font-bold text-foreground">
                Judul Kuis
              </label>
              <input
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                placeholder="Contoh: Kuis Akhir Modul ANC Terpadu"
                className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm font-bold text-foreground outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-sm transition-all"
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm mb-2 block font-bold text-foreground">
                Deskripsi Kuis
              </label>
              <textarea
                rows={2}
                value={form.description ?? ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Tulis instruksi pengerjaan kuis di sini..."
                className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm font-medium text-foreground outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-sm resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-border bg-card shadow-sm gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    form.hasTimeLimit
                      ? "bg-amber-500/10 text-amber-600"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Clock size={20} />
                </div>

                <div>
                  <p className="text-sm font-extrabold text-foreground">
                    Beri Batas Waktu
                  </p>
                  <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                    Batasi durasi mahasiswa mengerjakan kuis ini.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {form.hasTimeLimit && (
                  <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg border border-border animate-in slide-in-from-right-2">
                    <input
                      type="number"
                      min={1}
                      value={form.timeLimitMinutes}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          timeLimitMinutes: Number(event.target.value || "1"),
                        }))
                      }
                      className="w-12 bg-transparent text-sm font-extrabold text-center text-foreground outline-none"
                    />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Menit
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleToggleTime}
                  disabled={isSaving}
                  className={`relative w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-all duration-300 border-2 disabled:cursor-not-allowed disabled:opacity-70 ${
                    form.hasTimeLimit
                      ? "bg-amber-500 border-amber-500"
                      : "bg-muted border-border"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white transition-all shadow-sm ${
                      form.hasTimeLimit
                        ? "left-6 sm:left-7.5"
                        : "left-0.5 sm:left-0.75"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <ListOrdered size={18} className="text-amber-600" />
              <h3 className="text-sm sm:text-base font-extrabold text-foreground">
                Daftar Pertanyaan
              </h3>
              <span className="ml-auto text-[10px] font-bold bg-muted px-2 py-1 rounded-md text-muted-foreground uppercase tracking-widest">
                {form.questions.length} Soal
              </span>
            </div>

            {form.questions.map((question, index) => {
              const draftImage = questionImageDrafts[question.id];
              const questionImageUrl =
                draftImage?.previewUrl ?? question.mediaUrl ?? null;
              const questionImageError = imageErrors[question.id];

              return (
                <div
                  key={question.id}
                  className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
                        {index + 1}
                      </div>
                      <span className="text-xs font-extrabold text-foreground tracking-tight">
                        PERTANYAAN #{index + 1}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      disabled={isSaving}
                      className="p-1.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="p-4 sm:p-5 space-y-5">
                    <div>
                      <label className="text-[10px] uppercase font-extrabold text-muted-foreground mb-1.5 block tracking-widest">
                        Teks Pertanyaan
                      </label>
                      <textarea
                        value={question.questionText}
                        onChange={(event) =>
                          updateQuestionText(question.id, event.target.value)
                        }
                        placeholder="Tuliskan butir soal di sini..."
                        className="w-full px-4 py-3 rounded-xl bg-muted/20 border border-border text-sm font-medium text-foreground outline-none focus:border-amber-500 transition-all resize-none leading-relaxed"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-3">
                      {questionImageUrl && (
                        <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/20">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={questionImageUrl}
                            alt={`Gambar pendukung pertanyaan ${index + 1}`}
                            className="h-44 w-full object-cover"
                          />
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        ref={(element) => {
                          fileInputRefs.current[question.id] = element;
                        }}
                        className="hidden"
                        onChange={(event) =>
                          handleQuestionImageChange(question.id, event)
                        }
                      />

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openQuestionImagePicker(question.id)}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          <ImageIcon size={16} />
                          {questionImageUrl
                            ? "Ganti Gambar Pendukung"
                            : "Unggah Gambar Pendukung (Opsional)"}
                        </button>

                        {questionImageUrl && (
                          <button
                            type="button"
                            onClick={() => removeQuestionImage(question.id)}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-red-500 hover:bg-red-500/10 transition-all disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            <Trash2 size={16} />
                            Hapus Gambar
                          </button>
                        )}
                      </div>

                      {questionImageError && (
                        <p className="text-[11px] sm:text-xs font-bold text-red-500">
                          {questionImageError}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] uppercase font-extrabold text-muted-foreground tracking-widest">
                          Pilihan Jawaban
                        </label>
                        <button
                          type="button"
                          onClick={() => addOption(question.id)}
                          disabled={isSaving}
                          className="text-[10px] font-extrabold text-amber-600 hover:underline flex items-center gap-1 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          <Plus size={12} /> Tambah Opsi
                        </button>
                      </div>

                      <div className="grid gap-2.5">
                        {question.options.map((option, optionIndex) => {
                          const letter = String.fromCharCode(65 + optionIndex);
                          const isCorrect =
                            question.correctOptionId === option.id;

                          return (
                            <div
                              key={option.id}
                              className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                                isCorrect
                                  ? "bg-emerald-500/5 border-emerald-500/50"
                                  : "bg-muted/30 border-border"
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  setCorrectOption(question.id, option.id)
                                }
                                disabled={isSaving}
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all disabled:cursor-not-allowed disabled:opacity-70 ${
                                  isCorrect
                                    ? "bg-emerald-500 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                                    : "bg-card border-muted-foreground/30 hover:border-amber-500"
                                }`}
                              >
                                {isCorrect && (
                                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                )}
                              </button>

                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ${
                                  isCorrect
                                    ? "bg-emerald-500 text-white"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {letter}
                              </div>

                              <input
                                value={option.text}
                                onChange={(event) =>
                                  updateOptionText(
                                    question.id,
                                    option.id,
                                    event.target.value
                                  )
                                }
                                placeholder={`Opsi ${letter}...`}
                                disabled={isSaving}
                                className="flex-1 bg-transparent text-sm font-medium text-foreground outline-none disabled:cursor-not-allowed"
                              />

                              {question.options.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeOption(question.id, option.id)
                                  }
                                  disabled={isSaving}
                                  className="p-1.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-start gap-2 rounded-xl bg-emerald-500/5 border border-emerald-500/20 px-3 py-2 text-[10px] sm:text-xs text-emerald-600 font-bold">
                        <AlertCircle size={14} className="mt-0.5 shrink-0" />
                        Pilih satu opsi sebagai kunci jawaban benar.
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={addQuestion}
              disabled={isSaving}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-border text-xs sm:text-sm font-extrabold text-muted-foreground hover:text-amber-600 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Plus size={16} /> Tambah Pertanyaan
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-border flex gap-3 sm:gap-4 shrink-0 bg-card rounded-b-2xl sm:rounded-3xl z-20">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 py-3 sm:py-3.5 rounded-xl border border-border text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition-colors disabled:cursor-not-allowed disabled:opacity-70"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-3 sm:py-3.5 rounded-xl bg-amber-500 text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 hover:bg-amber-600 shadow-lg shadow-amber-500/20 transition-all disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {isSaving ? "Menyimpan..." : "Simpan Kuis"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}