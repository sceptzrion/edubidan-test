import type { Metadata } from "next";
import { Suspense } from "react";

import { RegisterForm } from "@/components/auth/register/RegisterForm";

export const metadata: Metadata = {
  title: "Daftar | EduBidan",
  description:
    "Buat akun mahasiswa EduBidan untuk mengakses modul pembelajaran kebidanan.",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}