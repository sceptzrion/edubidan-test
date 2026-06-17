"use client";

import { useMemo, useState } from "react";
import { Mail, Search } from "lucide-react";

import { CategoryCard } from "@/components/sections/help/CategoryCard";
import { HelpFaqItem } from "@/components/sections/help/HelpFaqItem";
import { helpCategories, helpFaqs } from "@/data/public/help-content";
import { siteConfig } from "@/config/site";

export function HelpCenterClient() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredFaqs = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return helpFaqs.filter((faq) => {
      const matchesCategory =
        activeCategory === "Semua" || faq.category === activeCategory;

      const matchesSearch =
        keyword.length === 0 ||
        faq.q.toLowerCase().includes(keyword) ||
        faq.a.toLowerCase().includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <>
      <section className="bg-linear-to-br from-primary to-teal-600 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-white tracking-tight">
            Pusat Bantuan
          </h1>

          <p className="text-white/90 text-lg mb-10 max-w-xl mx-auto">
            Temukan panduan penggunaan EduBidan seputar akun, modul, materi,
            kuis, dan kendala teknis.
          </p>

          <div className="relative max-w-2xl mx-auto shadow-2xl shadow-primary/20">
            <Search
              size={22}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setOpenFaq(null);
              }}
              placeholder="Cari pertanyaan atau kendala..."
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-card text-foreground outline-none text-base border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <h2 className="text-2xl font-bold mb-6 text-foreground">
          Kategori Bantuan
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-16">
          {helpCategories.map((category) => {
            const count =
              category.id === "Semua"
                ? helpFaqs.length
                : helpFaqs.filter((faq) => faq.category === category.id).length;

            return (
              <CategoryCard
                key={category.id}
                icon={category.icon}
                title={category.title}
                count={count}
                isActive={activeCategory === category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setOpenFaq(null);
                }}
              />
            );
          })}
        </div>

        <div className="mb-6 flex justify-between items-end gap-4">
          <h2 className="text-2xl font-bold text-foreground">
            {search.trim()
              ? "Hasil Pencarian"
              : activeCategory === "Semua"
                ? "Pertanyaan Umum"
                : `Topik: ${activeCategory}`}
          </h2>

          <span className="text-sm text-muted-foreground shrink-0">
            {filteredFaqs.length} ditemukan
          </span>
        </div>

        <div className="border border-border rounded-3xl p-4 md:p-6 bg-card/30 shadow-sm mb-2">
          <div className="space-y-4 max-h-105 overflow-y-auto pr-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <HelpFaqItem
                  key={`${faq.category}-${faq.q}`}
                  question={faq.q}
                  answer={faq.a}
                  isOpen={openFaq === index}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-3xl border border-dashed border-border">
                <p className="text-muted-foreground">
                  Tidak ada pertanyaan yang cocok dengan kata kunci &quot;{search}&quot;.
                </p>
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-4 text-primary font-medium hover:underline"
                >
                  Hapus Pencarian
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 bg-card rounded-3xl border border-border p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-5 text-left w-full">
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Mail size={28} />
            </div>

            <div>
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">
                Masih Butuh Bantuan?
              </h3>
              <p className="text-sm text-muted-foreground">
                Hubungi admin EduBidan melalui {siteConfig.contact.email} jika kendala belum
                terjawab.
              </p>
            </div>
          </div>

          <a
            href={siteConfig.links.email}
            className="w-full md:w-auto shrink-0 bg-primary text-primary-foreground px-6 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm text-sm"
          >
            <Mail size={18} />
            Email Admin
          </a>
        </div>
      </section>
    </>
  );
}