"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { AuthSidePanel } from "@/components/auth/shared/AuthSidePanel";
import { EduBidanLogo } from "@/components/ui/EduBidanLogo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface AuthShellProps {
  sideTitle: string;
  sideDescription: string;
  sideVariant?: "primary" | "teal";
  hideBackButton?: boolean;
  backLabel?: string;
  onBackClick?: () => void;
  children: ReactNode;
}

export function AuthShell({
  sideTitle,
  sideDescription,
  sideVariant = "primary",
  hideBackButton = false,
  backLabel = "Kembali",
  onBackClick,
  children,
}: AuthShellProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
      return;
    }

    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background flex font-sans text-foreground transition-colors duration-300">
      <AuthSidePanel
        title={sideTitle}
        description={sideDescription}
        variant={sideVariant}
      />

      <div className="flex-1 flex flex-col justify-center p-6 sm:p-10 md:px-16 lg:px-20 relative">
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
          {!hideBackButton && (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium p-2 rounded-lg hover:bg-muted"
            >
              <ArrowLeft size={18} />
              {backLabel}
            </button>
          )}

          <div className={hideBackButton ? "ml-auto" : ""}>
            <ThemeToggle />
          </div>
        </div>

        <div className="w-full max-w-115 mx-auto mt-16 lg:mt-0 pb-8">
          <div className="lg:hidden mb-8 flex justify-center">
            <EduBidanLogo size="md" />
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}