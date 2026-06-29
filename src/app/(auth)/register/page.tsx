import type { Metadata } from "next";
import { Suspense } from "react";

import { RegisterForm } from "@/components/auth/register/RegisterForm";
import { redirectIfAuthenticated } from "@/lib/auth/guards";

export const metadata: Metadata = {
  title: "Daftar | EduBidan",
  description:
    "Buat akun mahasiswa EduBidan untuk mengakses modul pembelajaran kebidanan.",
};

export default async function RegisterPage() {
  await redirectIfAuthenticated();

  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}