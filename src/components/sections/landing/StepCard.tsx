import React from "react";

interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  isLast: boolean; // Prop ini untuk mengecek apakah dia item terakhir (agar tidak ada garis putus-putus)
}

export function StepCard({ icon, title, desc, isLast }: StepCardProps) {
  return (
    <div className="relative text-center group">
      {/* Garis penghubung antar step (hanya muncul jika BUKAN item terakhir) */}
      {!isLast && (
        <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-border border-dashed border-2 z-0" />
      )}
      
      {/* Ikon Step */}
      <div className="relative z-10 w-20 h-20 mx-auto bg-background border-4 border-card rounded-full flex items-center justify-center text-primary shadow-lg shadow-primary/10 mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
        {icon}
      </div>
      
      {/* Teks Step */}
      <h3 className="text-lg font-bold mb-2 text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed px-2">
        {desc}
      </p>
    </div>
  );
}