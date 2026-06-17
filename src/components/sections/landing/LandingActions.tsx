"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Rocket } from "lucide-react";

export function HeroActions() {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-4">
      <button
        type="button"
        onClick={() => router.push("/register")}
        className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 text-base shadow-lg shadow-primary/25 font-semibold"
      >
        Mulai Belajar
        <ArrowRight size={18} />
      </button>

      <button
        type="button"
        onClick={() =>
          document
            .getElementById("alur-belajar")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        className="border border-border bg-card px-8 py-3.5 rounded-xl hover:bg-muted transition-all text-base font-semibold"
      >
        Pelajari Lebih Lanjut
      </button>
    </div>
  );
}

export function LandingCta() {
  const router = useRouter();

  return (
    <section className="py-20 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-linear-to-br from-primary to-teal-600 rounded-3xl p-10 md:p-14 shadow-2xl shadow-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 text-white shadow-inner">
              <Rocket size={32} />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Siap Mengulas Materi Kebidanan?
            </h2>

            <p className="text-white/80 text-sm md:text-base mb-10 max-w-xl mx-auto leading-relaxed">
              Buat akun mahasiswa untuk mengakses modul pembelajaran, mempelajari
              materi video, dan mengukur pemahaman melalui kuis evaluasi.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="bg-white text-primary px-8 py-3.5 rounded-xl hover:bg-slate-50 transition-all font-bold shadow-lg text-sm"
              >
                Buat Akun
              </button>

              <button
                type="button"
                onClick={() => router.push("/about")}
                className="bg-white/10 text-white border border-white/20 px-8 py-3.5 rounded-xl hover:bg-white/20 transition-all font-bold backdrop-blur-sm text-sm"
              >
                Kenali EduBidan
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}