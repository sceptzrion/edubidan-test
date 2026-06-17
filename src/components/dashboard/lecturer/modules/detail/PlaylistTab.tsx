"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Edit3,
  Eye,
  GripVertical,
  HelpCircle,
  Plus,
  Trash2,
  Video,
} from "lucide-react";

import { MateriModal } from "@/components/dashboard/lecturer/modules/detail/lesson/MateriModal";
import { KuisModal } from "@/components/dashboard/lecturer/modules/detail/quiz/KuisModal";
import { AppToast, type AppToastState } from "@/components/ui/AppToast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface PlaylistTabProps {
  moduleId: string;
  initialItems: LecturerPlaylistItem[];
}

export type LecturerMateriItem = {
  kind: "materi";
  id: number;
  contentId?: number;
  title: string;
  videoSource: "upload" | "embed";
  videoUrl?: string;
  duration: string;
  summary: string;
  objectives: string[];
  tools: string[];
};

export type LecturerQuizOption = {
  id: number;
  text: string;
};

export type LecturerQuizQuestion = {
  id: number;
  questionText: string;
  mediaUrl: string | null;
  mediaPublicId?: string | null;
  options: LecturerQuizOption[];
  correctOptionId: number;
};

export type LecturerKuisItem = {
  kind: "kuis";
  id: number;
  contentId?: number;
  title: string;
  description?: string;
  hasTimeLimit: boolean;
  timeLimitMinutes: number;
  questions: LecturerQuizQuestion[];
  questionCount?: number;
};

export type LecturerPlaylistItem = LecturerMateriItem | LecturerKuisItem;

type MaterialApiData = {
  id: number;
  title: string;
  description: string | null;
  videoSource: "UPLOAD" | "EMBED";
  videoUrl: string | null;
  estimatedMinutes: number | null;
  content: {
    id: number;
  };
  objectives: Array<{
    text: string;
  }>;
  tools: Array<{
    name: string;
  }>;
};

type QuizApiData = {
  id: number;
  title: string;
  description: string | null;
  hasTimeLimit: boolean;
  timeLimitMinutes: number | null;
  content: {
    id: number;
  };
  soals: Array<{
    id: number;
    questionText: string;
    mediaUrl: string | null;
    mediaPublicId: string | null;
    options: Array<{
      id: number;
      text: string;
      isCorrect: boolean;
    }>;
  }>;
};

type MaterialApiResponse = {
  success: boolean;
  message: string;
  data: MaterialApiData | null;
};

type QuizApiResponse = {
  success: boolean;
  message: string;
  data: QuizApiData | null;
};

type DeleteApiResponse = {
  success: boolean;
  message: string;
  data: {
    id: number;
    contentId: number;
  } | null;
};

type ReorderApiResponse = {
  success: boolean;
  message: string;
  data: {
    orderedContentIds: number[];
  } | null;
};

function formatDuration(minutes: number | null) {
  if (!minutes || minutes <= 0) {
    return "- menit";
  }

  return `${minutes} menit`;
}

function mapMaterialApiToItem(material: MaterialApiData): LecturerMateriItem {
  return {
    kind: "materi",
    id: material.id,
    contentId: material.content.id,
    title: material.title,
    videoSource: material.videoSource === "UPLOAD" ? "upload" : "embed",
    videoUrl: material.videoUrl ?? undefined,
    duration: formatDuration(material.estimatedMinutes),
    summary: material.description ?? "",
    objectives: material.objectives.map((objective) => objective.text),
    tools: material.tools.map((tool) => tool.name),
  };
}

function mapQuizApiToItem(quiz: QuizApiData): LecturerKuisItem {
  return {
    kind: "kuis",
    id: quiz.id,
    contentId: quiz.content.id,
    title: quiz.title,
    description: quiz.description ?? "",
    hasTimeLimit: quiz.hasTimeLimit,
    timeLimitMinutes: quiz.timeLimitMinutes ?? 0,
    questionCount: quiz.soals.length,
    questions: quiz.soals.map((soal) => {
      const correctOption = soal.options.find((option) => option.isCorrect);
      const fallbackOption = soal.options[0];

      return {
        id: soal.id,
        questionText: soal.questionText,
        mediaUrl: soal.mediaUrl,
        mediaPublicId: soal.mediaPublicId,
        options: soal.options.map((option) => ({
          id: option.id,
          text: option.text,
        })),
        correctOptionId: correctOption?.id ?? fallbackOption?.id ?? 0,
      };
    }),
  };
}

function getFriendlyMaterialError(message: string) {
  if (message === "Title is required") {
    return "Judul materi tidak boleh kosong.";
  }

  if (message === "Video source is invalid") {
    return "Sumber video tidak valid.";
  }

  if (message === "Estimated minutes must be a positive integer") {
    return "Durasi materi harus berupa angka menit yang valid.";
  }

  if (message === "Authentication required") {
    return "Sesi login sudah berakhir. Silakan login kembali.";
  }

  if (message === "Only lecturers can manage materials") {
    return "Hanya akun dosen yang dapat mengelola materi.";
  }

  if (message === "Material not found or not owned by lecturer") {
    return "Materi tidak ditemukan atau bukan milik akun dosen ini.";
  }

  if (message === "Module not found or not owned by lecturer") {
    return "Modul tidak ditemukan atau bukan milik akun dosen ini.";
  }

  return "Terjadi kesalahan. Silakan coba lagi.";
}

function getFriendlyQuizError(message: string) {
  if (message === "Title is required") {
    return "Judul kuis tidak boleh kosong.";
  }

  if (message === "Time limit must be a positive integer") {
    return "Batas waktu kuis harus berupa angka menit yang valid.";
  }

  if (message === "Quiz questions are invalid") {
    return "Soal kuis belum valid. Minimal satu soal dengan dua opsi jawaban.";
  }

  if (message === "Authentication required") {
    return "Sesi login sudah berakhir. Silakan login kembali.";
  }

  if (message === "Only lecturers can manage quizzes") {
    return "Hanya akun dosen yang dapat mengelola kuis.";
  }

  if (message === "Quiz not found or not owned by lecturer") {
    return "Kuis tidak ditemukan atau bukan milik akun dosen ini.";
  }

  if (message === "Module not found or not owned by lecturer") {
    return "Modul tidak ditemukan atau bukan milik akun dosen ini.";
  }

  return "Terjadi kesalahan. Silakan coba lagi.";
}

function getFriendlyReorderError(message: string) {
  if (
    message === "Ordered content ids are required" ||
    message === "Ordered content ids are invalid"
  ) {
    return "Urutan konten tidak valid.";
  }

  if (message === "Some contents were not found in this module") {
    return "Sebagian konten tidak ditemukan pada modul ini.";
  }

  if (message === "Module not found or not owned by lecturer") {
    return "Modul tidak ditemukan atau bukan milik akun dosen ini.";
  }

  return "Gagal menyimpan urutan konten.";
}

function getContentId(item: LecturerPlaylistItem) {
  return item.contentId;
}

export function PlaylistTab({ moduleId, initialItems }: PlaylistTabProps) {
  const router = useRouter();

  const [items, setItems] = useState<LecturerPlaylistItem[]>(initialItems);
  const [addOpen, setAddOpen] = useState(false);
  const [materiOpen, setMateriOpen] = useState(false);
  const [kuisOpen, setKuisOpen] = useState(false);

  const [editingMateri, setEditingMateri] =
    useState<LecturerMateriItem | null>(null);
  const [editingKuis, setEditingKuis] = useState<LecturerKuisItem | null>(null);

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [toast, setToast] = useState<AppToastState>(null);
  const [contentToDelete, setContentToDelete] =
    useState<LecturerPlaylistItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingMateri, setIsSavingMateri] = useState(false);
  const [isSavingKuis, setIsSavingKuis] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  const sortedItems = useMemo(() => items, [items]);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  const showToast = useCallback((nextToast: NonNullable<AppToastState>) => {
    setToast(nextToast);

    if (nextToast.durationMs === 0) return;

    window.setTimeout(() => {
      setToast(null);
    }, nextToast.durationMs ?? 3500);
  }, []);

  const persistOrder = async (nextItems: LecturerPlaylistItem[]) => {
    const orderedContentIds = nextItems
      .map(getContentId)
      .filter((contentId): contentId is number => typeof contentId === "number");

    if (orderedContentIds.length !== nextItems.length) {
      showToast({
        type: "warning",
        title: "Urutan belum bisa disimpan",
        message:
          "Ada konten sementara yang belum tersimpan permanen. Simpan konten terlebih dahulu.",
      });
      return;
    }

    setIsReordering(true);
    closeToast();

    try {
      const response = await fetch(`/api/modules/${moduleId}/contents`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          orderedContentIds,
        }),
      });

      const result = (await response.json()) as ReorderApiResponse;

      if (!response.ok || !result.success) {
        showToast({
          type: "error",
          title: "Gagal menyimpan urutan",
          message: getFriendlyReorderError(result.message),
        });
        return;
      }

      showToast({
        type: "success",
        title: "Urutan konten tersimpan",
        message: "Susunan pembelajaran sudah diperbarui.",
      });
    } catch (error) {
      console.error("Reorder contents error:", error);

      showToast({
        type: "error",
        title: "Gagal menyimpan urutan",
        message: "Terjadi kesalahan koneksi. Silakan coba lagi.",
      });
    } finally {
      setIsReordering(false);
    }
  };

  const move = async (from: number, to: number) => {
    if (from === to || to < 0 || to >= items.length || isReordering) return;

    const next = [...items];
    const [movedItem] = next.splice(from, 1);

    if (!movedItem) return;

    next.splice(to, 0, movedItem);
    setItems(next);

    await persistOrder(next);
  };

  const handleSaveMateri = async (materi: LecturerMateriItem) => {
    if (isSavingMateri) return;

    setIsSavingMateri(true);
    closeToast();

    try {
      const response = await fetch(
        editingMateri
          ? `/api/materials/${editingMateri.id}`
          : `/api/modules/${moduleId}/contents`,
        {
          method: editingMateri ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "same-origin",
          body: JSON.stringify({
            kind: "materi",
            title: materi.title,
            description: materi.summary,
            videoSource: materi.videoSource,
            videoUrl: materi.videoUrl,
            objectives: materi.objectives,
            tools: materi.tools,
          }),
        }
      );

      const result = (await response.json()) as MaterialApiResponse;

      if (!response.ok || !result.success || !result.data) {
        showToast({
          type: "error",
          title: editingMateri ? "Gagal memperbarui materi" : "Gagal menambah materi",
          message: getFriendlyMaterialError(result.message),
        });
        return;
      }

      const savedMateri = mapMaterialApiToItem(result.data);

      setItems((currentItems) => {
        if (editingMateri) {
          return currentItems.map((item) =>
            item.kind === "materi" && item.id === editingMateri.id
              ? savedMateri
              : item
          );
        }

        return [savedMateri, ...currentItems];
      });

      setMateriOpen(false);
      setEditingMateri(null);

      showToast({
        type: "success",
        title: editingMateri ? "Materi berhasil diperbarui" : "Materi berhasil ditambahkan",
        message: `Materi "${savedMateri.title}" sudah tersimpan.`,
      });
    } catch (error) {
      console.error("Save material error:", error);

      showToast({
        type: "error",
        title: editingMateri ? "Gagal memperbarui materi" : "Gagal menambah materi",
        message: "Terjadi kesalahan koneksi. Silakan coba lagi.",
      });
    } finally {
      setIsSavingMateri(false);
    }
  };

  const handleSaveKuis = async (kuis: LecturerKuisItem) => {
    if (isSavingKuis) return;

    setIsSavingKuis(true);
    closeToast();

    try {
      const response = await fetch(
        editingKuis
          ? `/api/quizzes/${editingKuis.id}`
          : `/api/modules/${moduleId}/contents`,
        {
          method: editingKuis ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "same-origin",
          body: JSON.stringify({
            kind: "kuis",
            title: kuis.title,
            description: kuis.description,
            hasTimeLimit: kuis.hasTimeLimit,
            timeLimitMinutes: kuis.hasTimeLimit ? kuis.timeLimitMinutes : null,
            questions: kuis.questions,
          }),
        }
      );

      const result = (await response.json()) as QuizApiResponse;

      if (!response.ok || !result.success || !result.data) {
        showToast({
          type: "error",
          title: editingKuis ? "Gagal memperbarui kuis" : "Gagal menambah kuis",
          message: getFriendlyQuizError(result.message),
        });
        return;
      }

      const savedKuis = mapQuizApiToItem(result.data);

      setItems((currentItems) => {
        if (editingKuis) {
          return currentItems.map((item) =>
            item.kind === "kuis" && item.id === editingKuis.id
              ? savedKuis
              : item
          );
        }

        return [savedKuis, ...currentItems];
      });

      setKuisOpen(false);
      setEditingKuis(null);

      showToast({
        type: "success",
        title: editingKuis ? "Kuis berhasil diperbarui" : "Kuis berhasil ditambahkan",
        message: `Kuis "${savedKuis.title}" sudah tersimpan.`,
      });
    } catch (error) {
      console.error("Save quiz error:", error);

      showToast({
        type: "error",
        title: editingKuis ? "Gagal memperbarui kuis" : "Gagal menambah kuis",
        message: "Terjadi kesalahan koneksi. Silakan coba lagi.",
      });
    } finally {
      setIsSavingKuis(false);
    }
  };

  const closeMateriModal = () => {
    if (isSavingMateri) return;

    setMateriOpen(false);
    setEditingMateri(null);
  };

  const closeKuisModal = () => {
    if (isSavingKuis) return;

    setKuisOpen(false);
    setEditingKuis(null);
  };

  const handleAskDelete = (item: LecturerPlaylistItem) => {
    setContentToDelete(item);
    closeToast();
  };

  const handleCancelDelete = () => {
    if (isDeleting) return;

    setContentToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!contentToDelete || isDeleting) return;

    setIsDeleting(true);
    closeToast();

    try {
      const endpoint =
        contentToDelete.kind === "materi"
          ? `/api/materials/${contentToDelete.id}`
          : `/api/quizzes/${contentToDelete.id}`;

      const response = await fetch(endpoint, {
        method: "DELETE",
        credentials: "same-origin",
      });

      const result = (await response.json()) as DeleteApiResponse;

      if (!response.ok || !result.success) {
        showToast({
          type: "error",
          title:
            contentToDelete.kind === "materi"
              ? "Gagal menghapus materi"
              : "Gagal menghapus kuis",
          message:
            contentToDelete.kind === "materi"
              ? getFriendlyMaterialError(result.message)
              : getFriendlyQuizError(result.message),
        });
        return;
      }

      setItems((currentItems) =>
        currentItems.filter(
          (item) =>
            !(item.kind === contentToDelete.kind && item.id === contentToDelete.id)
        )
      );

      showToast({
        type: "success",
        title:
          contentToDelete.kind === "materi"
            ? "Materi berhasil dihapus"
            : "Kuis berhasil dihapus",
        message: `Konten "${contentToDelete.title}" sudah dihapus.`,
      });

      setContentToDelete(null);
    } catch (error) {
      console.error("Delete content error:", error);

      showToast({
        type: "error",
        title: "Gagal menghapus konten",
        message: "Terjadi kesalahan koneksi. Silakan coba lagi.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <AppToast toast={toast} onClose={closeToast} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-foreground">
            Susunan Pembelajaran
          </h2>
          <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-1">
            {items.length} item • Tahan dan geser (drag) ikon titik untuk
            mengubah urutan.
          </p>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setAddOpen((current) => !current)}
            className="w-full sm:w-auto bg-primary text-primary-foreground px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 hover:bg-primary/90 shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5"
          >
            <Plus size={16} /> Tambah Konten{" "}
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${
                addOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {addOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setAddOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-2xl shadow-xl py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                <button
                  type="button"
                  onClick={() => {
                    setEditingMateri(null);
                    setAddOpen(false);
                    setMateriOpen(true);
                    closeToast();
                  }}
                  className="w-full flex items-start gap-3 px-4 py-3 hover:bg-muted text-left transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Video size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-foreground">
                      Materi Baru
                    </p>
                    <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mt-0.5">
                      Video & ringkasan
                    </p>
                  </div>
                </button>

                <div className="border-t border-border/50 my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setEditingKuis(null);
                    setAddOpen(false);
                    setKuisOpen(true);
                    closeToast();
                  }}
                  className="w-full flex items-start gap-3 px-4 py-3 hover:bg-muted text-left transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                    <HelpCircle size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-foreground">
                      Kuis Evaluasi
                    </p>
                    <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mt-0.5">
                      Soal pilihan ganda
                    </p>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {sortedItems.map((item, index) => {
          const isMateri = item.kind === "materi";
          const questionCount =
            item.kind === "kuis"
              ? item.questionCount ?? item.questions.length
              : 0;

          return (
            <div
              key={`${item.kind}-${item.id}`}
              draggable={!isReordering}
              onDragStart={() => setDragIndex(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (dragIndex !== null) void move(dragIndex, index);
                setDragIndex(null);
              }}
              className={`bg-card rounded-xl sm:rounded-2xl border p-4 sm:p-5 flex items-center gap-3 sm:gap-4 transition-all hover:shadow-md hover:border-primary/30 ${
                dragIndex === index
                  ? "opacity-50 border-primary border-dashed"
                  : "border-border shadow-sm"
              }`}
            >
              <GripVertical
                size={20}
                className="text-muted-foreground cursor-grab active:cursor-grabbing shrink-0 hover:text-primary transition-colors"
              />

              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
                  isMateri
                    ? "bg-primary/10 text-primary"
                    : "bg-amber-500/10 text-amber-500"
                }`}
              >
                {isMateri ? (
                  <Video size={20} className="sm:w-6 sm:h-6" />
                ) : (
                  <HelpCircle size={20} className="sm:w-6 sm:h-6" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-md uppercase tracking-wider font-extrabold shadow-sm ${
                      isMateri ? "bg-primary text-white" : "bg-amber-500 text-white"
                    }`}
                  >
                    {isMateri ? "Materi" : "Kuis"}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">
                    Urutan #{index + 1}
                  </span>
                  {isReordering && (
                    <span className="text-[10px] font-bold text-primary">
                      Menyimpan urutan...
                    </span>
                  )}
                </div>

                <p className="text-sm sm:text-base font-extrabold text-foreground truncate leading-snug">
                  {item.title}
                </p>

                <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mt-1">
                  {isMateri
                    ? `${
                        item.videoSource === "upload"
                          ? "Upload Video"
                          : "Embed YouTube"
                      } • Durasi: ${item.duration || "--:--"}`
                    : `${questionCount} soal ${
                        item.hasTimeLimit
                          ? `• Waktu: ${item.timeLimitMinutes} menit`
                          : "• Tanpa batas waktu"
                      }`}
                </p>
              </div>

              <div className="flex gap-1.5 sm:gap-2 shrink-0 border-l border-border/50 pl-3 sm:pl-4 ml-2 sm:ml-4">
                <button
                  type="button"
                  onClick={() => {
                    if (isMateri) {
                      router.push(
                        `/dashboard/lecturer/modules/${moduleId}/lesson/${item.id}`
                      );
                    } else {
                      router.push(
                        `/dashboard/lecturer/modules/${moduleId}/quiz/${item.id}`
                      );
                    }
                  }}
                  className={`p-2 sm:p-2.5 rounded-xl transition-colors ${
                    isMateri
                      ? "hover:bg-primary/10 text-primary"
                      : "hover:bg-amber-500/10 text-amber-600"
                  }`}
                  title={
                    isMateri
                      ? "Lihat Pratinjau Materi"
                      : "Lihat Analisis & Pratinjau Kuis"
                  }
                >
                  <Eye size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (isMateri) {
                      setEditingMateri(item);
                      setMateriOpen(true);
                    } else {
                      setEditingKuis(item);
                      setKuisOpen(true);
                    }
                    closeToast();
                  }}
                  className="p-2 sm:p-2.5 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors"
                  title="Edit Konten"
                >
                  <Edit3 size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => handleAskDelete(item)}
                  className="p-2 sm:p-2.5 hover:bg-red-500/10 rounded-xl text-red-500 transition-colors"
                  title="Hapus Konten"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="py-12 text-center border-2 border-dashed border-border rounded-3xl bg-muted/20">
            <p className="text-muted-foreground font-bold">
              Belum ada materi atau kuis.
            </p>
          </div>
        )}
      </div>

      {materiOpen && (
        <MateriModal
          initial={editingMateri}
          onSave={handleSaveMateri}
          onClose={closeMateriModal}
        />
      )}

      {kuisOpen && (
        <KuisModal
          initial={editingKuis}
          onSave={handleSaveKuis}
          onClose={closeKuisModal}
        />
      )}

      <ConfirmDialog
        open={Boolean(contentToDelete)}
        title="Hapus konten?"
        description={
          contentToDelete
            ? `Konten "${contentToDelete.title}" akan dihapus dari susunan pembelajaran.`
            : "Konten ini akan dihapus."
        }
        confirmLabel="Hapus Konten"
        cancelLabel="Batal"
        variant="danger"
        isLoading={isDeleting}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}