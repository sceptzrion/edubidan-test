import type { Metadata } from "next";
import { Scale } from "lucide-react";

import { Navbar } from "@/components/layout/public/Navbar";
import { Footer } from "@/components/layout/public/Footer";
import { termsSections } from "@/data/public/legal-content";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan | EduBidan",
  description:
    "Syarat dan ketentuan penggunaan EduBidan sebagai purwarupa platform pembelajaran kebidanan digital.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300 font-sans text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="relative py-16 md:py-20 overflow-hidden bg-primary/5 border-b border-border">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
              <Scale size={28} />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight text-foreground">
              Syarat & Ketentuan
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
              Ketentuan ini mengatur penggunaan EduBidan sebagai platform
              pembelajaran digital untuk mendukung kegiatan belajar kebidanan.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm">
              <div className="space-y-10">
                {termsSections.map((section) => (
                  <section key={section.title}>
                    <h2 className="text-lg md:text-xl font-bold mb-4 text-foreground">
                      {section.title}
                    </h2>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}