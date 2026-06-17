import React from "react";
import { BookOpen, Clock } from "lucide-react";

interface FeatureCardProps {
  img: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  lessons: string;
  duration: string;
}

export function FeatureCard({ img, icon, title, desc, lessons, duration }: FeatureCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all group">
      {/* Bagian Gambar */}
      <div className="relative overflow-hidden">
        {/* Menggunakan tag img standar seperti di Hero */}
        <img 
          src={img} 
          alt={title} 
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        {/* Ikon melayang di atas gambar */}
        <div className="absolute top-3 left-3 bg-background/90 backdrop-blur rounded-lg p-2 text-primary shadow-sm">
          {icon}
        </div>
      </div>
      
      {/* Bagian Teks & Info */}
      <div className="p-6">
        <h3 className="text-lg font-bold mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{desc}</p>
        
        {/* Garis pemisah tipis dan info durasi */}
        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground pt-4 border-t border-border/50">
          <span className="flex items-center gap-1.5"><BookOpen size={14} className="text-primary"/> {lessons}</span>
          <span className="flex items-center gap-1.5"><Clock size={14} className="text-primary"/> {duration}</span>
        </div>
      </div>
    </div>
  );
}