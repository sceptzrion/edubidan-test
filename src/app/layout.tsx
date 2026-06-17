import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// 1. Inisialisasi font Plus Jakarta Sans
const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta", // Disiapkan jika ingin di-mapping di Tailwind
  display: "swap", // Best practice agar teks tidak hilang saat font loading
});

// 2. Ubah Metadata web untuk tab browser dan SEO
export const metadata: Metadata = {
  title: "EduBidan | Platform Edukasi Kebidanan Digital",
  description: "Platform e-learning asuhan kebidanan terpadu dan interaktif via video dan kuis untuk mahasiswa dan bidan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 3. Ubah bahasa ke "id" dan terapkan font baru
    <html
      lang="id"
      className={`${jakartaSans.variable} ${jakartaSans.className} h-full scroll-smooth antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}