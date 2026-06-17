import type { Metadata } from "next";

import { Navbar } from "@/components/layout/public/Navbar";
import { Footer } from "@/components/layout/public/Footer";
import { AboutCard } from "@/components/sections/landing/AboutCard";
import { FeatureCard } from "@/components/sections/landing/FeatureCard";
import { StepCard } from "@/components/sections/landing/StepCard";
import { HeroActions, LandingCta } from "@/components/sections/landing/LandingActions";
import { LandingFaq } from "@/components/sections/landing/LandingFaq";
import {
  aboutHighlights,
  heroBadges,
  landingFaqs,
  landingImages,
  learningSteps,
  topicHighlights,
} from "@/data/public/landing-content";
import { GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "EduBidan | Media Pembelajaran Kebidanan Digital",
  description:
    "EduBidan adalah platform pembelajaran digital untuk mahasiswa kebidanan dengan materi video, modul pembelajaran, dan kuis evaluasi.",
};

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
                  <GraduationCap size={16} />
                  Media Belajar Interaktif
                </div>

                <h1 className="text-4xl lg:text-5xl tracking-tight mb-6 font-extrabold leading-[1.15]">
                  Platform Digital
                  <br />
                  <span className="text-primary">Pembelajaran Kebidanan</span>
                  <br />
                  Interaktif
                </h1>

                <p className="text-muted-foreground text-lg mb-8 max-w-lg leading-relaxed">
                  EduBidan membantu mahasiswa kebidanan mengulas materi dasar
                  melalui modul pembelajaran, video penunjang, dan kuis evaluasi
                  yang dapat diakses secara mandiri.
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
              </div>
            </div>
          </div>
        </section>

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
                Materi EduBidan pada versi awal difokuskan pada tiga topik dasar
                kebidanan tanpa fitur kategori atau filter khusus di dalam sistem.
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
                Alur penggunaan EduBidan dibuat sederhana agar mahasiswa dapat
                langsung belajar, mengerjakan kuis, dan melihat hasil evaluasi.
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