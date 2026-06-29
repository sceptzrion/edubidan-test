import { Suspense } from "react";
import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login/LoginForm";
import { redirectIfAuthenticated } from "@/lib/auth/guards";

export const metadata: Metadata = {
  title: "Masuk | EduBidan",
  description:
    "Masuk ke EduBidan untuk mengakses modul pembelajaran, materi video, kuis evaluasi, dan dashboard sesuai peran akun.",
};

function LoginFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-sm font-semibold text-muted-foreground">
        Memuat halaman masuk...
      </div>
    </div>
  );
}

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}