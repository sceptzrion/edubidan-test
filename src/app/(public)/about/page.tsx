import type { Metadata } from "next";
import { GraduationCap, Heart, Shield, Star, Target } from "lucide-react";

import { Navbar } from "@/components/layout/public/Navbar";
import { Footer } from "@/components/layout/public/Footer";
import { PilarCard } from "@/components/sections/about/PilarCard";
import { VisiMisiCard } from "@/components/sections/about/VisiMisiCard";

export const metadata: Metadata = {
  title: "Tentang EduBidan | Platform Pembelajaran Kebidanan Digital",
  description:
    "EduBidan adalah platform pembelajaran digital pendamping untuk membantu mahasiswa kebidanan mempelajari materi dasar dan mengerjakan kuis evaluasi.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300 font-sans text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="relative py-20 lg:py-28 overflow-hidden bg-primary/5">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-teal-500/10 blur-3xl" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-foreground">
              Tentang <span className="text-primary">EduBidan</span>
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              EduBidan adalah platform pembelajaran digital pendamping untuk
              membantu mahasiswa kebidanan mengulas materi dasar, mempelajari
              video pembelajaran, dan mengerjakan kuis evaluasi secara mandiri.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <VisiMisiCard
                icon={Target}
                title="Visi Pengembangan"
                desc="Menyediakan ruang belajar digital yang praktis, terstruktur, dan mudah diakses untuk mendukung pembelajaran kebidanan dasar."
                colorClass="bg-primary/10"
                textClass="text-primary"
              />

              <VisiMisiCard
                icon={Heart}
                title="Misi Sistem"
                desc="Menghadirkan modul pembelajaran, materi video, progres belajar, dan kuis evaluasi dalam antarmuka yang ramah pengguna."
                colorClass="bg-teal-500/10"
                textClass="text-teal-600"
              />
            </div>
          </div>
        </section>

        <section className="py-20 bg-card border-y border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
              Fokus Pengembangan
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <PilarCard
                icon={Shield}
                title="Terstruktur"
                desc="Materi disusun dalam modul pembelajaran yang memiliki urutan materi dan kuis evaluasi."
              />

              <PilarCard
                icon={Star}
                title="Aksesibel"
                desc="Sistem dirancang agar mudah digunakan melalui perangkat yang terhubung ke internet."
              />

              <PilarCard
                icon={GraduationCap}
                title="Edukatif"
                desc="Fitur difokuskan pada proses belajar, pengukuran pemahaman, dan rekap hasil evaluasi."
              />
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-5 relative pl-4 pt-4 md:pl-0 md:pt-0">
                <div className="absolute top-0 left-0 md:-left-6 md:-top-6 w-10 h-10 md:w-12 md:h-12 border-t-4 border-l-4 border-primary rounded-tl-xl" />

                <h2 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                  Mendukung Pembelajaran Kebidanan Secara Digital
                </h2>
              </div>

              <div className="md:col-span-7 bg-card border border-border p-8 rounded-3xl shadow-sm">
                <p className="text-base text-muted-foreground leading-relaxed mb-6">
                  Pembelajaran kebidanan membutuhkan pemahaman teori yang kuat
                  sebelum mahasiswa masuk ke tahap praktik. EduBidan hadir
                  sebagai media pendamping yang membantu mahasiswa mengulas materi
                  secara mandiri.
                </p>

                <p className="text-base text-muted-foreground leading-relaxed">
                  Melalui modul, materi video, dan kuis evaluasi, mahasiswa dapat
                  memahami konsep dasar, memantau progres belajar, dan melihat
                  hasil evaluasi sebagai bahan refleksi pembelajaran.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}