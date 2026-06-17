import type { Metadata } from "next";
import { Suspense } from "react";

import { ForgotPasswordFlow } from "@/components/auth/forgot-password/ForgotPasswordFlow";

export const metadata: Metadata = {
  title: "Lupa Kata Sandi | EduBidan",
  description:
    "Atur ulang kata sandi akun EduBidan melalui email, kode verifikasi, dan kata sandi baru.",
};

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordFlow />
    </Suspense>
  );
}