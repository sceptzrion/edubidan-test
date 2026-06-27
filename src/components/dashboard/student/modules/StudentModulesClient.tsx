"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { JoinModuleModal } from "@/components/dashboard/student/modules/JoinModuleModal";
import { LeaveModuleConfirmModal } from "@/components/dashboard/student/modules/LeaveModuleConfirmModal";
import { StudentModulesHeader } from "@/components/dashboard/student/modules/list/StudentModulesHeader";
import { StudentModulesList } from "@/components/dashboard/student/modules/list/StudentModulesList";
import {
  StudentModulesToolbar,
  type StudentModulesLayout,
} from "@/components/dashboard/student/modules/list/StudentModulesToolbar";
import { AppToast, type AppToastState } from "@/components/ui/AppToast";
import type { StudentModuleCardItem } from "@/data/learning/student/student-learning.server";

interface StudentModulesClientProps {
  initialModules: StudentModuleCardItem[];
}

type LeaveModuleApiResponse = {
  success: boolean;
  message: string;
  data: unknown;
};

function getFriendlyLeaveModuleError(message: string) {
  if (message === "Authentication required") {
    return "Sesi login sudah berakhir. Silakan login kembali.";
  }

  if (message === "Forbidden" || message === "Only mahasiswa can leave modules") {
    return "Hanya akun mahasiswa yang dapat keluar dari modul.";
  }

  if (message === "Invalid module id") {
    return "Modul yang dipilih tidak valid.";
  }

  if (message === "Module not found") {
    return "Modul tidak ditemukan.";
  }

  if (message === "Enrollment not found") {
    return "Modul ini tidak terdaftar pada akun Anda.";
  }

  if (message === "Enrollment already inactive") {
    return "Anda sudah tidak tergabung pada modul ini.";
  }

  return "Terjadi kesalahan. Silakan coba lagi.";
}

export function StudentModulesClient({
  initialModules,
}: StudentModulesClientProps) {
  const router = useRouter();
  const [isRefreshing, startRefreshTransition] = useTransition();

  const [search, setSearch] = useState("");
  const [layout, setLayout] = useState<StudentModulesLayout>("grid");
  const [joinOpen, setJoinOpen] = useState(false);
  const [leaveTarget, setLeaveTarget] = useState<StudentModuleCardItem | null>(
    null
  );
  const [isLeaving, setIsLeaving] = useState(false);
  const [toast, setToast] = useState<AppToastState>(null);

  const filteredModules = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return initialModules;

    return initialModules.filter((module) => {
      return (
        module.title.toLowerCase().includes(keyword) ||
        module.desc.toLowerCase().includes(keyword) ||
        module.instructor.toLowerCase().includes(keyword)
      );
    });
  }, [initialModules, search]);

  const closeToast = () => {
    setToast(null);
  };

  const showToast = (nextToast: NonNullable<AppToastState>) => {
    setToast(nextToast);

    if (nextToast.durationMs === 0) return;

    window.setTimeout(() => {
      setToast(null);
    }, nextToast.durationMs ?? 3500);
  };

  const handleJoined = () => {
    setJoinOpen(false);

    startRefreshTransition(() => {
      router.refresh();
    });
  };

  const handleConfirmLeaveModule = async () => {
    if (!leaveTarget || isLeaving) return;

    setIsLeaving(true);
    closeToast();

    try {
      const response = await fetch(`/api/modules/${leaveTarget.id}/leave`, {
        method: "PATCH",
        credentials: "same-origin",
      });

      const result = (await response.json()) as LeaveModuleApiResponse;

      if (!response.ok || !result.success) {
        showToast({
          type: "error",
          title: "Gagal keluar dari modul",
          message: getFriendlyLeaveModuleError(result.message),
        });
        return;
      }

      const leftModuleTitle = leaveTarget.title;

      setLeaveTarget(null);

      showToast({
        type: "success",
        title: "Berhasil keluar dari modul",
        message: `Modul ${leftModuleTitle} sudah dihapus dari daftar Modul Saya.`,
      });

      startRefreshTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Leave module error:", error);

      showToast({
        type: "error",
        title: "Gagal keluar dari modul",
        message: "Terjadi kesalahan koneksi. Silakan coba lagi.",
      });
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 sm:pb-12">
      <AppToast toast={toast} onClose={closeToast} />

      {isRefreshing && (
        <div className="fixed inset-x-0 top-4 z-80 mx-auto flex w-fit items-center gap-2 rounded-full border border-border bg-card/95 px-4 py-2 text-xs font-extrabold text-primary shadow-lg shadow-black/5 backdrop-blur-md">
          <Loader2 size={14} className="animate-spin" />
          Memuat ulang modul...
        </div>
      )}

      <div
        className={`transition-opacity duration-200 ${
          isRefreshing ? "opacity-70" : "opacity-100"
        }`}
        aria-busy={isRefreshing}
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StudentModulesHeader totalModules={initialModules.length} />

          <StudentModulesToolbar
            search={search}
            layout={layout}
            onSearchChange={setSearch}
            onLayoutChange={setLayout}
            onJoinModule={() => {
              if (isRefreshing) return;
              setJoinOpen(true);
            }}
          />
        </div>

        <StudentModulesList
          modules={filteredModules}
          layout={layout}
          search={search}
          onLeaveModule={setLeaveTarget}
        />
      </div>

      <JoinModuleModal
        isOpen={joinOpen}
        onClose={() => {
          if (isRefreshing) return;
          setJoinOpen(false);
        }}
        onJoined={handleJoined}
      />

      {leaveTarget && (
        <LeaveModuleConfirmModal
          module={leaveTarget}
          isLeaving={isLeaving}
          onClose={() => {
            if (isLeaving) return;
            setLeaveTarget(null);
          }}
          onConfirm={handleConfirmLeaveModule}
        />
      )}
    </div>
  );
}