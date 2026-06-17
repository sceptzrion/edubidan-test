"use client";

import { BookOpen, ClipboardList, GraduationCap, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { ActionWidget } from "@/components/dashboard/lecturer/ActionWidget";
import type {
  LecturerActionBgIconKey,
  LecturerActionIconKey,
  LecturerQuickAction,
} from "@/data/learning/lecturer/lecturer-dashboard";

interface LecturerQuickActionsProps {
  actions: LecturerQuickAction[];
}

const actionIcons: Record<LecturerActionIconKey, typeof Plus> = {
  add: Plus,
  gradebook: ClipboardList,
};

const actionBgIcons: Record<LecturerActionBgIconKey, typeof BookOpen> = {
  module: BookOpen,
  graduation: GraduationCap,
};

export function LecturerQuickActions({ actions }: LecturerQuickActionsProps) {
  const router = useRouter();

  return (
    <section className="bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-6 md:p-8 shadow-sm">
      <h2 className="text-lg sm:text-xl font-extrabold mb-5 sm:mb-6 text-foreground border-b border-border/50 pb-4">
        Aksi Cepat
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => (
          <ActionWidget
            key={action.title}
            icon={actionIcons[action.iconKey]}
            bgIcon={actionBgIcons[action.bgIconKey]}
            title={action.title}
            description={action.description}
            colorTheme={action.colorTheme}
            onClick={() => router.push(action.href)}
          />
        ))}
      </div>
    </section>
  );
}