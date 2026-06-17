"use client";

import { useRouter } from "next/navigation";
import { Target } from "lucide-react";

import { UpcomingQuizCard } from "@/components/dashboard/student/UpcomingQuizCard";

interface PendingQuizItem {
  id: number;
  moduleId: number;
  title: string;
  status: string;
}

interface PendingQuizSectionProps {
  quizzes: PendingQuizItem[];
}

export function PendingQuizSection({ quizzes }: PendingQuizSectionProps) {
  const router = useRouter();

  return (
    <section className="bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-6 md:p-8 shadow-sm">
      <h2 className="text-lg sm:text-xl font-extrabold mb-5 sm:mb-6 flex items-center gap-2.5 text-foreground border-b border-border/50 pb-4">
        <Target size={20} className="text-primary" />
        Kuis Belum Dikerjakan
      </h2>

      {quizzes.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {quizzes.map((quiz) => (
            <UpcomingQuizCard
              key={`${quiz.moduleId}-${quiz.id}`}
              title={quiz.title}
              date={quiz.status}
              onClick={() =>
                router.push(`/dashboard/modules/${quiz.moduleId}/quiz/${quiz.id}`)
              }
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-5 text-center">
          <p className="text-sm font-bold text-foreground mb-1">
            Semua kuis sudah dikerjakan
          </p>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
            Lanjutkan materi berikutnya atau tinjau kembali hasil pembelajaran
            Anda.
          </p>
        </div>
      )}
    </section>
  );
}