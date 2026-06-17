import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  FileQuestion,
  HelpCircle,
  TrendingDown,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";

import type { LecturerQuizAnalysisData } from "@/data/learning/lecturer/lecturer-quiz-analysis.server";

interface LecturerQuizAnalysisPageContentProps {
  data: LecturerQuizAnalysisData;
}

function formatScore(value: number | null) {
  if (typeof value !== "number") {
    return "-";
  }

  return value.toFixed(1);
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

export function LecturerQuizAnalysisPageContent({
  data,
}: LecturerQuizAnalysisPageContentProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 sm:pb-12">
      <div className="mb-6">
        <Link
          href={`/dashboard/lecturer/gradebook/${data.module.id}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft size={18} />
          Kembali ke Buku Nilai
        </Link>
      </div>

      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
            Analisis Kuis
          </h1>
          <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-2">
            Modul:{" "}
            <span className="font-extrabold text-foreground">
              {data.module.title}
            </span>{" "}
            • Kode {data.module.accessCode}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6 sm:mb-8">
        <SummaryCard
          icon={<FileQuestion size={18} />}
          label="Total Kuis"
          value={data.summary.totalQuizzes}
        />
        <SummaryCard
          icon={<Users size={18} />}
          label="Attempt Selesai"
          value={data.summary.totalAttempts}
        />
        <SummaryCard
          icon={<BarChart3 size={18} />}
          label="Rata-rata"
          value={formatScore(data.summary.averageScore)}
        />
        <SummaryCard
          icon={<TrendingUp size={18} />}
          label="Skor Tertinggi"
          value={formatScore(data.summary.highestScore)}
        />
        <SummaryCard
          icon={<TrendingDown size={18} />}
          label="Skor Terendah"
          value={formatScore(data.summary.lowestScore)}
        />
      </div>

      {data.quizzes.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border bg-muted/20 p-10 text-center">
          <HelpCircle
            size={42}
            className="mx-auto text-muted-foreground/40 mb-3"
          />
          <p className="font-extrabold text-foreground">Belum ada kuis</p>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            Analisis akan tersedia setelah dosen menambahkan kuis pada modul ini.
          </p>
        </div>
      )}

      <div className="space-y-5 sm:space-y-6">
        {data.quizzes.map((quiz, quizIndex) => (
          <section
            key={quiz.id}
            className="rounded-2xl sm:rounded-3xl border border-border bg-card shadow-sm overflow-hidden"
          >
            <div className="p-5 sm:p-6 border-b border-border bg-muted/20">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-primary mb-1">
                    Kuis {quizIndex + 1}
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-foreground">
                    {quiz.title}
                  </h2>
                  {quiz.description && (
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-1 max-w-3xl">
                      {quiz.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <MiniMetric label="Soal" value={quiz.totalQuestions} />
                  <MiniMetric label="Attempt" value={quiz.totalAttempts} />
                  <MiniMetric
                    label="Rata-rata"
                    value={formatScore(quiz.averageScore)}
                  />
                  <MiniMetric
                    label="Tertinggi"
                    value={formatScore(quiz.highestScore)}
                  />
                </div>
              </div>
            </div>

            <div className="divide-y divide-border">
              {quiz.questions.map((question, questionIndex) => (
                <div key={question.id} className="p-5 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-1">
                        Soal {questionIndex + 1}
                      </div>
                      <p className="text-sm sm:text-base font-extrabold text-foreground leading-relaxed">
                        {question.questionText}
                      </p>

                      {question.mediaUrl && (
                        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-muted/20">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={question.mediaUrl}
                            alt={`Gambar pendukung soal ${questionIndex + 1}`}
                            className="w-full max-h-72 object-contain bg-muted/10"
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center min-w-full lg:min-w-80">
                      <MiniMetric
                        label="Jawaban"
                        value={question.totalAnswers}
                      />
                      <MiniMetric
                        label="Benar"
                        value={question.correctCount}
                        tone="success"
                      />
                      <MiniMetric
                        label="Akurasi"
                        value={formatPercent(question.correctRate)}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {question.options.map((option) => (
                      <div
                        key={option.id}
                        className="rounded-xl border border-border bg-muted/10 p-3 sm:p-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <div
                              className={`mt-0.5 h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                                option.isCorrect
                                  ? "bg-green-500/10 text-green-500"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {option.isCorrect ? (
                                <CheckCircle2 size={16} />
                              ) : (
                                <XCircle size={16} />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm font-bold text-foreground leading-relaxed">
                                {option.text}
                              </p>
                              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mt-0.5">
                                {option.isCorrect
                                  ? "Opsi benar"
                                  : "Opsi pengecoh"}
                              </p>
                            </div>
                          </div>

                          <div className="sm:w-52">
                            <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold text-muted-foreground mb-1">
                              <span>{option.selectedCount} dipilih</span>
                              <span>{formatPercent(option.selectedRate)}</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  option.isCorrect
                                    ? "bg-green-500"
                                    : "bg-primary"
                                }`}
                                style={{ width: `${option.selectedRate}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {quiz.questions.length === 0 && (
                <div className="p-8 text-center text-sm font-medium text-muted-foreground">
                  Kuis ini belum memiliki soal.
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <p className="text-2xl font-extrabold text-foreground mt-1">{value}</p>
    </div>
  );
}

function MiniMetric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string | number;
  tone?: "default" | "success";
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <p
        className={`text-sm sm:text-base font-extrabold mt-0.5 ${
          tone === "success" ? "text-green-500" : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}