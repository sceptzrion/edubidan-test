"use client";

import { ExternalLink, Play, Video } from "lucide-react";

import { getYouTubeEmbedUrl } from "@/lib/video/youtube";

interface LessonVideoPlayerProps {
  title: string;
  thumbnailUrl: string;
  duration: string;
  videoSource?: "upload" | "embed";
  videoUrl?: string;
}

export function LessonVideoPlayer({
  title,
  thumbnailUrl,
  duration,
  videoSource = "embed",
  videoUrl,
}: LessonVideoPlayerProps) {
  const embedUrl =
    videoSource === "embed" ? getYouTubeEmbedUrl(videoUrl) : null;

  return (
    <div className="relative bg-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden aspect-video shadow-lg border border-border/50 group shrink-0">
      {videoSource === "upload" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-white p-6 text-center">
          <Video size={42} className="mb-4 opacity-70" />
          <p className="text-sm sm:text-base font-extrabold">
            Video Upload Belum Tersedia
          </p>
          <p className="text-xs sm:text-sm text-white/70 font-medium mt-2 max-w-md leading-relaxed">
            Materi ini menggunakan sumber upload. Fitur upload video native
            masih masuk backlog media upload. Gunakan embed link terlebih dahulu.
          </p>
        </div>
      ) : embedUrl ? (
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover opacity-70"
          />

          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lg backdrop-blur-sm">
              <Play
                size={24}
                className="text-white ml-1 sm:ml-1.5 sm:w-8 sm:h-8"
              />
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-3 sm:p-6 z-10">
            <div className="flex flex-col gap-2 text-white">
              <p className="text-xs sm:text-sm font-extrabold">
                Link video belum valid
              </p>
              <p className="text-[10px] sm:text-xs font-medium text-white/70">
                Periksa kembali URL video materi. Durasi: {duration}
              </p>

              {videoUrl && (
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit items-center gap-1.5 text-[10px] sm:text-xs font-bold text-primary hover:underline"
                >
                  Buka tautan asli
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}