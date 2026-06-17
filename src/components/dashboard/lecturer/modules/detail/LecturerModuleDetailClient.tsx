"use client";

import { useCallback, useState } from "react";

import { EditInfoModal } from "@/components/dashboard/lecturer/modules/detail/EditInfoModal";
import { LecturerModuleDetailHeader } from "@/components/dashboard/lecturer/modules/detail/LecturerModuleDetailHeader";
import { ParticipantsTab } from "@/components/dashboard/lecturer/modules/detail/ParticipantsTab";
import {
  PlaylistTab,
  type LecturerPlaylistItem,
} from "@/components/dashboard/lecturer/modules/detail/PlaylistTab";
import { LecturerModuleBackButton } from "@/components/dashboard/lecturer/modules/detail/layout/LecturerModuleBackButton";
import {
  LecturerModuleDetailTabs,
  type LecturerModuleDetailTab,
} from "@/components/dashboard/lecturer/modules/detail/layout/LecturerModuleDetailTabs";
import { AppToast, type AppToastState } from "@/components/ui/AppToast";
import type {
  LecturerModuleDetailInfo,
  LecturerModuleDetailStatus,
} from "@/data/learning/lecturer/lecturer-module-detail";

type ModuleApiData = {
  id: number;
  title: string;
  description: string | null;
  bannerUrl: string | null;
  accessCode: string;
  status: "DRAFT" | "PUBLIK";
  estimatedMinutes: number | null;
  dosenProfile: {
    user: {
      name: string;
    };
  };
  objectives: Array<{
    text: string;
  }>;
};

type ModuleApiResponse = {
  success: boolean;
  message: string;
  data: ModuleApiData | null;
};

interface LecturerModuleDetailClientProps {
  moduleId: string;
  initialInfo: LecturerModuleDetailInfo;
  initialPlaylistItems: LecturerPlaylistItem[];
}

const fallbackBanner =
  "https://images.unsplash.com/photo-1559757175-5700dde675bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080";

function parseEstimatedTimeToMinutes(value: string) {
  const normalized = value.trim().toLowerCase();

  if (!normalized || normalized === "-") {
    return undefined;
  }

  const hourMatch = normalized.match(/(\d+)\s*(jam|j)/);
  const minuteMatch = normalized.match(/(\d+)\s*(menit|min|m)/);

  const hours = hourMatch ? Number(hourMatch[1]) : 0;
  const minutes = minuteMatch ? Number(minuteMatch[1]) : 0;

  if (hours > 0 || minutes > 0) {
    return hours * 60 + minutes;
  }

  const plainNumber = Number(normalized.replace(/[^\d]/g, ""));

  if (Number.isInteger(plainNumber) && plainNumber > 0) {
    return plainNumber;
  }

  return undefined;
}

function formatEstimatedTime(minutes: number | null) {
  if (!minutes || minutes <= 0) {
    return "-";
  }

  if (minutes < 60) {
    return `${minutes} Menit`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} Jam`;
  }

  return `${hours} Jam ${remainingMinutes} Menit`;
}

function mapApiStatus(
  status: ModuleApiData["status"]
): LecturerModuleDetailStatus {
  if (status === "PUBLIK") {
    return "Publik";
  }

  return "Draft";
}

function mapDetailApiToInfo(moduleData: ModuleApiData): LecturerModuleDetailInfo {
  return {
    banner: moduleData.bannerUrl ?? fallbackBanner,
    title: moduleData.title,
    description: moduleData.description ?? "",
    objectives: moduleData.objectives.map((objective) => objective.text),
    estimatedTime: formatEstimatedTime(moduleData.estimatedMinutes),
    instructor: moduleData.dosenProfile.user.name,
    status: mapApiStatus(moduleData.status),
    code: moduleData.accessCode,
  };
}

function getFriendlyEditInfoError(message: string) {
  if (message === "Title cannot be empty") {
    return "Judul modul tidak boleh kosong.";
  }

  if (message === "Estimated minutes must be a positive integer") {
    return "Estimasi durasi harus berupa angka menit yang valid.";
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

  if (message === "Module not found or not owned by lecturer") {
    return "Modul tidak ditemukan atau bukan milik akun dosen ini.";
  }

  return "Terjadi kesalahan. Silakan coba lagi.";
}

export function LecturerModuleDetailClient({
  moduleId,
  initialInfo,
  initialPlaylistItems,
}: LecturerModuleDetailClientProps) {
  const [tab, setTab] = useState<LecturerModuleDetailTab>("materi");
  const [info, setInfo] = useState(initialInfo);
  const [editInfoOpen, setEditInfoOpen] = useState(false);
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const [toast, setToast] = useState<AppToastState>(null);

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

  const handleSaveInfo = async (value: LecturerModuleDetailInfo) => {
    if (isSavingInfo) return;

    setIsSavingInfo(true);
    closeToast();

    try {
      const response = await fetch(`/api/modules/${moduleId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          title: value.title,
          description: value.description,
          estimatedMinutes: parseEstimatedTimeToMinutes(value.estimatedTime),
          objectives: value.objectives,
          status: value.status,
        }),
      });

      const result = (await response.json()) as ModuleApiResponse;

      if (!response.ok || !result.success || !result.data) {
        showToast({
          type: "error",
          title: "Gagal memperbarui info modul",
          message: getFriendlyEditInfoError(result.message),
        });
        return;
      }

      const updatedInfo = mapDetailApiToInfo(result.data);

      setInfo(updatedInfo);
      setEditInfoOpen(false);

      showToast({
        type: "success",
        title: "Info modul berhasil diperbarui",
        message: `Perubahan pada modul "${updatedInfo.title}" sudah tersimpan.`,
      });
    } catch (error) {
      console.error("Save module info error:", error);

      showToast({
        type: "error",
        title: "Gagal memperbarui info modul",
        message: "Terjadi kesalahan koneksi. Silakan coba lagi.",
      });
    } finally {
      setIsSavingInfo(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 sm:pb-12">
      <AppToast toast={toast} onClose={closeToast} />

      <LecturerModuleBackButton />

      <LecturerModuleDetailHeader
        info={info}
        onEditClick={() => {
          setEditInfoOpen(true);
          closeToast();
        }}
      />

      <LecturerModuleDetailTabs activeTab={tab} onTabChange={setTab} />

      {tab === "materi" && (
        <PlaylistTab moduleId={moduleId} initialItems={initialPlaylistItems} />
      )}

      {tab === "peserta" && <ParticipantsTab moduleId={moduleId} />}

      {editInfoOpen && (
        <EditInfoModal
          info={info}
          isSaving={isSavingInfo}
          onSave={handleSaveInfo}
          onClose={() => {
            if (isSavingInfo) return;
            setEditInfoOpen(false);
          }}
        />
      )}
    </div>
  );
}