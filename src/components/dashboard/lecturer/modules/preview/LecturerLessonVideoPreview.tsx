import { ExternalLink, Play, Video } from "lucide-react";

import type { LecturerLessonPreviewDetail } from "@/data/learning/lecturer/lecturer-content-preview";
import { getYouTubeEmbedUrl } from "@/lib/video/youtube";

interface LecturerLessonVideoPreviewProps {
  lesson: LecturerLessonPreviewDetail;
}

export function LecturerLessonVideoPreview({
  lesson,
}: LecturerLessonVideoPreviewProps) {
  const embedUrl =
    lesson.videoSource === "embed" ? getYouTubeEmbedUrl(lesson.videoUrl) : null;

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-border/50 group shrink-0">
      {lesson.videoSource === "upload" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-slate-950 p-6 text-center">
          <Video size={48} className="mb-4 opacity-70" />
          <p className="text-sm sm:text-base font-extrabold">
            Video Upload Belum Tersedia
          </p>
          <p className="text-xs sm:text-sm text-white/70 font-medium mt-2 max-w-md leading-relaxed">
            Fitur upload video native masih masuk backlog media upload. Gunakan
            embed link untuk materi video pada tahap ini.
          </p>
        </div>
      ) : embedUrl ? (
        <iframe
          src={embedUrl}
          title={lesson.title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lesson.thumbnailUrl}
            alt={`Thumbnail ${lesson.title}`}
            className="w-full h-full object-cover opacity-70"
          />

          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/90 text-white rounded-full flex items-center justify-center shadow-xl backdrop-blur-sm">
              <Play size={32} className="ml-1.5 sm:ml-2" />
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-4 sm:p-6 text-white">
            <p className="text-xs sm:text-sm font-extrabold">
              Link video belum valid
            </p>
            <p className="text-[10px] sm:text-xs font-medium text-white/70 mt-1">
              Periksa kembali URL embed/link pada materi.
            </p>

            {lesson.videoUrl && (
              <a
                href={lesson.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-primary hover:underline mt-2"
              >
                Buka tautan asli
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}