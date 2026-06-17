import type { Metadata } from "next";
import {
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  KeyRound,
  MousePointerClick,
  ShieldCheck,
  Sparkles,
  UserRoundPlus,
} from "lucide-react";

import { Navbar } from "@/components/layout/public/Navbar";
import { Footer } from "@/components/layout/public/Footer";
import { AboutCard } from "@/components/sections/landing/AboutCard";
import { FeatureCard } from "@/components/sections/landing/FeatureCard";
import { StepCard } from "@/components/sections/landing/StepCard";
import {
  HeroActions,
  LandingCta,
} from "@/components/sections/landing/LandingActions";
import { LandingFaq } from "@/components/sections/landing/LandingFaq";
import {
  aboutHighlights,
  heroBadges,
  landingFaqs,
  landingImages,
  learningSteps,
  topicHighlights,
} from "@/data/public/landing-content";

export const metadata: Metadata = {
  title: "EduBidan Demo | Usability Testing",
  description:
    "EduBidan Demo adalah versi uji coba platform pembelajaran digital kebidanan untuk pengujian fitur, alur, dan kemudahan penggunaan.",
};

const demoSteps = [
  {
    icon: MousePointerClick,
    title: "1. Buka Halaman Login",
    desc: "Masuk ke halaman login, lalu gunakan panel Mode Uji Coba untuk membuat akun demo.",
  },
  {
    icon: UserRoundPlus,
    title: "2. Pilih Role Demo",
    desc: "Pilih Mahasiswa untuk mencoba alur belajar atau Dosen untuk mencoba pengelolaan modul dan kuis.",
  },
  {
    icon: KeyRound,
    title: "3. Generate Akun",
    desc: "Sistem akan membuat email dan kata sandi demo secara otomatis dengan data dummy yang siap dicoba.",
  },
  {
    icon: ClipboardCheck,
    title: "4. Explore dan Isi Form",
    desc: "Coba fitur sesuai skenario, lalu isi kuesioner usability berdasarkan pengalaman penggunaan.",
  },
];

function DemoGuideCard() {
  return (
    <section
      id="panduan-uji-coba"
      className="py-20 bg-background border-y border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
          <div className="rounded-3xl border border-primary/20 bg-linear-to-br from-primary/10 via-card to-teal-500/10 p-8 shadow-sm">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary mb-5">
              <ShieldCheck size={16} />
              Panduan Responden
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-foreground mb-4">
              Ini adalah versi uji coba EduBidan
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-6">
              Versi ini disiapkan untuk kebutuhan pengujian. Responden dapat
              membuat akun demo, mencoba fitur sesuai role, dan mengeksplorasi
              aplikasi tanpa mengganggu data utama. Setiap akun demo memiliki
              email, kata sandi, dan data dummy masing-masing.
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-background/80 p-4">
                <CheckCircle2 className="mt-0.5 text-primary" size={18} />
                <span className="text-muted-foreground">
                  Gunakan role <b className="text-foreground">Mahasiswa</b>{" "}
                  untuk mencoba modul, materi, kuis evaluasi, hasil kuis, dan
                  pengaturan akun.
                </span>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-border bg-background/80 p-4">
                <CheckCircle2 className="mt-0.5 text-primary" size={18} />
                <span className="text-muted-foreground">
                  Gunakan role <b className="text-foreground">Dosen</b> untuk
                  mencoba kelola modul, materi, kuis, peserta, analisis kuis,
                  dan rekap nilai.
                </span>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-border bg-background/80 p-4">
                <CheckCircle2 className="mt-0.5 text-primary" size={18} />
                <span className="text-muted-foreground">
                  Role Admin hanya digunakan untuk pengujian terbatas oleh
                  peneliti atau pengelola sistem.
                </span>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {demoSteps.map((step) => (
              <div
                key={step.title}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <step.icon size={24} />
                </div>

                <h3 className="text-lg font-extrabold text-foreground mb-2">
                  {step.title}
                </h3>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans transition-colors duration-300 bg-background text-foreground">
      <Navbar />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-teal-500/5" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold px-4 py-1.5 rounded-full text-sm mb-6">
                  <Sparkles size={16} />
                  Versi Uji Coba EduBidan
                </div>

                <h1 className="text-4xl lg:text-5xl tracking-tight mb-6 font-extrabold leading-[1.15]">
                  Coba Platform
                  <br />
                  <span className="text-primary">Pembelajaran Kebidanan</span>
                  <br />
                  Secara Interaktif
                </h1>

                <p className="text-muted-foreground text-lg mb-8 max-w-lg leading-relaxed">
                  EduBidan Demo disiapkan untuk pengujian alur dan kemudahan
                  penggunaan. Buat akun demo sesuai role, masuk ke dashboard,
                  lalu coba modul, materi video, kuis evaluasi, progres belajar,
                  dan rekap nilai.
                </p>

                <HeroActions />

                <div className="flex flex-wrap items-center gap-6 mt-10 text-sm text-muted-foreground font-medium">
                  {heroBadges.map((badge) => (
                    <div key={badge.label} className="flex items-center gap-2">
                      <badge.icon size={16} className="text-primary" />
                      {badge.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-border">
                  <img
                    src={landingImages.hero}
                    alt="Mahasiswa kebidanan belajar melalui platform digital"
                    className="w-full h-80 lg:h-112.5 object-cover"
                  />
                </div>

                <div className="absolute -bottom-6 left-6 right-6 rounded-2xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <GraduationCap size={20} />
                    </div>

                    <div>
                      <p className="text-sm font-extrabold text-foreground">
                        Akses uji coba EduBidan
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        Gunakan perangkat yang paling nyaman untuk mencoba
                        alur fitur, membuat akun demo, dan mengisi kuesioner
                        berdasarkan pengalaman penggunaan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <DemoGuideCard />

        <section id="about" className="py-20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                Tentang <span className="text-primary">EduBidan</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                EduBidan dikembangkan sebagai platform pembelajaran digital
                pendamping untuk membantu mahasiswa kebidanan memahami materi
                dasar secara lebih fleksibel, terstruktur, dan interaktif.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {aboutHighlights.map((item) => (
                <AboutCard
                  key={item.title}
                  icon={<item.icon size={28} />}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-foreground">
                Fokus Materi Pembelajaran
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                Materi EduBidan pada versi awal difokuskan pada topik dasar
                kebidanan yang disajikan melalui modul, materi video, dan kuis
                evaluasi.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {topicHighlights.map((item) => (
                <FeatureCard
                  key={item.title}
                  img={item.img}
                  icon={<item.icon size={22} />}
                  title={item.title}
                  desc={item.desc}
                  lessons={item.lessons}
                  duration={item.duration}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="alur-belajar" className="py-20 bg-card border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-foreground">
                Alur Pembelajaran
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                Alur penggunaan EduBidan dibuat sederhana agar pengguna dapat
                langsung mencoba fitur utama sesuai role yang digunakan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {learningSteps.map((step, index) => (
                <StepCard
                  key={step.title}
                  icon={<step.icon size={28} />}
                  title={step.title}
                  desc={step.desc}
                  isLast={index === learningSteps.length - 1}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-foreground">
                Pertanyaan Umum
              </h2>
              <p className="text-muted-foreground text-lg">
                Jawaban singkat seputar ruang lingkup dan penggunaan EduBidan.
              </p>
            </div>

            <LandingFaq faqs={landingFaqs} />
          </div>
        </section>

        <LandingCta />
      </main>

      <Footer />
    </div>
  );
}