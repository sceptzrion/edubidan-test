"use client";

import { useCallback, useMemo, useState } from "react";

import { ModuleFormModal } from "@/components/dashboard/lecturer/modules/ModuleFormModal";
import { LecturerModulesGrid } from "@/components/dashboard/lecturer/modules/list/LecturerModulesGrid";
import { LecturerModulesHeader } from "@/components/dashboard/lecturer/modules/list/LecturerModulesHeader";
import { AppToast, type AppToastState } from "@/components/ui/AppToast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  filterLecturerModules,
  type LecturerModule,
  type LecturerModuleFormValue,
  type LecturerModuleStatus,
} from "@/data/learning/lecturer/lecturer-modules";

type ModuleApiData = {
  id: number;
  title: string;
  bannerUrl: string | null;
  bannerPublicId: string | null;
  accessCode: string;
  status: "DRAFT" | "PUBLIK";
  updatedAt: string;
  stats?: {
    totalMateri?: number;
  };
  contents?: Array<{
    kind: "MATERI" | "KUIS";
  }>;
};

type ModuleApiResponse = {
  success: boolean;
  message: string;
  data: ModuleApiData | null;
};

interface LecturerModulesClientProps {
  initialModules: LecturerModule[];
}

function formatUpdatedAt(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Hari ini";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function mapApiStatus(status: ModuleApiData["status"]): LecturerModuleStatus {
  if (status === "PUBLIK") {
    return "Publik";
  }

  return "Draft";
}

function getMaterialCount(module: ModuleApiData) {
  if (typeof module.stats?.totalMateri === "number") {
    return module.stats.totalMateri;
  }

  if (Array.isArray(module.contents)) {
    return module.contents.filter((content) => content.kind === "MATERI")
      .length;
  }

  return 0;
}

function mapApiModuleToLecturerModule(module: ModuleApiData): LecturerModule {
  return {
    id: module.id,
    title: module.title,
    materialCount: getMaterialCount(module),
    status: mapApiStatus(module.status),
    updated: formatUpdatedAt(module.updatedAt),
    code: module.accessCode,
    image: module.bannerUrl ?? undefined,
    bannerPublicId: module.bannerPublicId,
  };
}

function getFriendlyModuleError(message: string) {
  if (message === "Title is required" || message === "Title cannot be empty") {
    return "Judul modul tidak boleh kosong.";
  }

  if (message === "Invalid module status") {
    return "Status modul tidak valid.";
  }

  if (message === "Authentication required") {
    return "Sesi login sudah berakhir. Silakan login kembali.";
  }

  if (message === "Only lecturers can manage modules") {
    return "Hanya akun dosen yang dapat mengelola modul.";
  }

  if (message === "Dosen profile not found") {
    return "Profil dosen tidak ditemukan.";
  }

  if (message === "Module not found or not owned by lecturer") {
    return "Modul tidak ditemukan atau bukan milik akun dosen ini.";
  }

  if (message === "Failed to generate unique access code") {
    return "Gagal membuat kode modul. Silakan coba lagi.";
  }

  return "Terjadi kesalahan. Silakan coba lagi.";
}

export function LecturerModulesClient({
  initialModules,
}: LecturerModulesClientProps) {
  const [modules, setModules] = useState<LecturerModule[]>(initialModules);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LecturerModule | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<LecturerModule | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<AppToastState>(null);

  const filteredModules = useMemo(() => {
    return filterLecturerModules(modules, search);
  }, [modules, search]);

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

  const handleOpenCreateModal = () => {
    setEditing(null);
    setOpen(true);
    closeToast();
  };

  const handleCloseModal = () => {
    if (isSaving) return;

    setOpen(false);
    setEditing(null);
  };

  const handleSave = async (form: LecturerModuleFormValue) => {
    if (isSaving) return;

    setIsSaving(true);
    closeToast();

    try {
      const response = await fetch(
        editing ? `/api/modules/${editing.id}` : "/api/modules",
        {
          method: editing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "same-origin",
          body: JSON.stringify({
            title: form.title,
            status: form.status,
            ...(form.bannerUrl !== undefined
              ? {
                  bannerUrl: form.bannerUrl,
                  bannerPublicId: form.bannerPublicId ?? null,
                }
              : {}),
          }),
        }
      );

      const result = (await response.json()) as ModuleApiResponse;

      if (!response.ok || !result.success || !result.data) {
        const message = getFriendlyModuleError(result.message);

        showToast({
          type: "error",
          title: editing ? "Gagal memperbarui modul" : "Gagal menambahkan modul",
          message,
        });

        throw new Error(message);
      }

      const savedModule = mapApiModuleToLecturerModule(result.data);

      if (editing) {
        setModules((currentModules) =>
          currentModules.map((module) =>
            module.id === editing.id ? savedModule : module
          )
        );

        showToast({
          type: "success",
          title: "Modul berhasil diperbarui",
          message: `Perubahan pada modul "${savedModule.title}" sudah tersimpan.`,
        });
      } else {
        setModules((currentModules) => [savedModule, ...currentModules]);

        showToast({
          type: "success",
          title: "Modul berhasil ditambahkan",
          message: `Kode modul: ${savedModule.code}`,
        });
      }

      setOpen(false);
      setEditing(null);
    } catch (error) {
      console.error("Save module error:", error);

      if (!(error instanceof Error)) {
        showToast({
          type: "error",
          title: editing ? "Gagal memperbarui modul" : "Gagal menambahkan modul",
          message: "Terjadi kesalahan koneksi. Silakan coba lagi.",
        });
      }

      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleAskRemove = (module: LecturerModule) => {
    setModuleToDelete(module);
    closeToast();
  };

  const handleCancelRemove = () => {
    if (isDeleting) return;

    setModuleToDelete(null);
  };

  const handleConfirmRemove = async () => {
    if (!moduleToDelete || isDeleting) return;

    setIsDeleting(true);
    closeToast();

    try {
      const response = await fetch(`/api/modules/${moduleToDelete.id}`, {
        method: "DELETE",
        credentials: "same-origin",
      });

      const result = (await response.json()) as {
        success: boolean;
        message: string;
        data: { id: number } | null;
      };

      if (!response.ok || !result.success) {
        showToast({
          type: "error",
          title: "Gagal menghapus modul",
          message: getFriendlyModuleError(result.message),
        });
        return;
      }

      setModules((currentModules) =>
        currentModules.filter((module) => module.id !== moduleToDelete.id)
      );

      showToast({
        type: "success",
        title: "Modul berhasil dihapus",
        message: `Modul "${moduleToDelete.title}" sudah dihapus dari daftar.`,
      });

      setModuleToDelete(null);
    } catch (error) {
      console.error("Delete module error:", error);

      showToast({
        type: "error",
        title: "Gagal menghapus modul",
        message: "Terjadi kesalahan koneksi. Silakan coba lagi.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 sm:pb-12">
      <AppToast toast={toast} onClose={closeToast} />

      <LecturerModulesHeader
        search={search}
        totalModules={modules.length}
        onSearchChange={(value) => {
          setSearch(value);
          closeToast();
        }}
        onAddClick={handleOpenCreateModal}
      />

      <LecturerModulesGrid
        modules={filteredModules}
        search={search}
        onEdit={(module) => {
          setEditing(module);
          setOpen(true);
          closeToast();
        }}
        onRemove={(id) => {
          const selectedModule = modules.find((module) => module.id === id);

          if (selectedModule) {
            handleAskRemove(selectedModule);
          }
        }}
      />

      {open && (
        <ModuleFormModal
          key={editing?.id ?? "create"}
          isOpen={open}
          editing={editing}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}

      <ConfirmDialog
        open={Boolean(moduleToDelete)}
        title="Hapus modul?"
        description={
          moduleToDelete
            ? `Modul "${moduleToDelete.title}" akan dihapus. Semua konten, peserta, dan progres yang terkait dengan modul ini juga dapat ikut terhapus.`
            : "Modul ini akan dihapus."
        }
        confirmLabel="Hapus Modul"
        cancelLabel="Batal"
        variant="danger"
        isLoading={isDeleting}
        onCancel={handleCancelRemove}
        onConfirm={handleConfirmRemove}
      />
    </div>
  );
}