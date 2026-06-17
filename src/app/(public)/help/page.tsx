import type { Metadata } from "next";

import { Navbar } from "@/components/layout/public/Navbar";
import { Footer } from "@/components/layout/public/Footer";
import { HelpCenterClient } from "@/components/sections/help/HelpCenterClient";

export const metadata: Metadata = {
  title: "Pusat Bantuan | EduBidan",
  description:
    "Pusat bantuan EduBidan berisi panduan penggunaan akun, modul, materi, kuis, dan kendala teknis.",
};

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300 font-sans text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1">
        <HelpCenterClient />
      </main>

      <Footer />
    </div>
  );
}