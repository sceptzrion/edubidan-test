"use client";

import { useState } from "react";
import { Bell, Shield, User, type LucideIcon } from "lucide-react";

import { NotificationTab } from "@/components/dashboard/student/settings/NotificationTab";
import { ProfileTab } from "@/components/dashboard/student/settings/ProfileTab";
import { SecurityTab } from "@/components/dashboard/student/settings/SecurityTab";

type SettingsTab = "profil" | "keamanan" | "notifikasi";

interface SettingsTabItem {
  id: SettingsTab;
  label: string;
  icon: LucideIcon;
}

const tabs: SettingsTabItem[] = [
  { id: "profil", label: "Profil", icon: User },
  { id: "keamanan", label: "Keamanan", icon: Shield },
  { id: "notifikasi", label: "Notifikasi", icon: Bell },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profil");

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-1.5 sm:mb-2">
          Pengaturan
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Kelola informasi profil, keamanan akun, dan preferensi notifikasi
          pembelajaran Anda.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <aside className="lg:w-64 shrink-0">
          <div className="bg-card rounded-2xl border border-border p-1.5 sm:p-2 flex flex-row lg:flex-col gap-1 sm:gap-1.5 shadow-sm scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 lg:w-full flex items-center justify-center lg:justify-start gap-1.5 sm:gap-3 px-2 sm:px-4 py-2.5 sm:py-3 rounded-[10px] sm:rounded-xl text-[11px] sm:text-sm font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon
                    size={16}
                    className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0"
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="flex-1 bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-8 shadow-sm min-w-0">
          {activeTab === "profil" && <ProfileTab />}
          {activeTab === "keamanan" && <SecurityTab />}
          {activeTab === "notifikasi" && <NotificationTab />}
        </section>
      </div>
    </div>
  );
}