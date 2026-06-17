import { ContentType, VideoSource } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { formatMinutes } from "@/lib/video/youtube";
import type {
  LecturerLessonPreviewData,
  LecturerLessonPreviewDetail,
  LecturerPreviewPlaylistItem,
} from "@/data/learning/lecturer/lecturer-content-preview";

const fallbackThumbnail =
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080";

function formatDuration(minutes: number | null) {
  return formatMinutes(minutes);
}

function mapVideoSource(source: VideoSource): LecturerLessonPreviewDetail["videoSource"] {
  if (source === VideoSource.UPLOAD) {
    return "upload";
  }

  return "embed";
}

export async function getLecturerLessonPreviewData(params: {
  moduleId: number;
  lessonId: number;
  dosenProfileId: number | null | undefined;
}): Promise<LecturerLessonPreviewData | null> {
  if (!params.dosenProfileId) return null;

  const moduleData = await prisma.module.findFirst({
    where: {
      id: params.moduleId,
      dosenProfileId: params.dosenProfileId,
    },
    select: {
      id: true,
      contents: {
        orderBy: {
          order: "asc",
        },
        select: {
          id: true,
          kind: true,
          materi: {
            select: {
              id: true,
              title: true,
              description: true,
              videoSource: true,
              videoUrl: true,
              estimatedMinutes: true,
              objectives: {
                orderBy: {
                  order: "asc",
                },
                select: {
                  text: true,
                },
              },
              tools: {
                select: {
                  name: true,
                },
              },
            },
          },
          kuis: {
            select: {
              id: true,
              title: true,
              timeLimitMinutes: true,
            },
          },
        },
      },
    },
  });

  if (!moduleData) return null;

  const materialContent = moduleData.contents.find(
    (content) =>
      content.kind === ContentType.MATERI && content.materi?.id === params.lessonId
  );

  if (!materialContent?.materi) return null;

  const playlist: LecturerPreviewPlaylistItem[] = moduleData.contents
    .map((content) => {
      if (content.kind === ContentType.MATERI && content.materi) {
        return {
          id: content.materi.id,
          kind: "materi" as const,
          title: content.materi.title,
          duration: formatDuration(content.materi.estimatedMinutes),
        };
      }

      if (content.kind === ContentType.KUIS && content.kuis) {
        return {
          id: content.kuis.id,
          kind: "kuis" as const,
          title: content.kuis.title,
          duration: content.kuis.timeLimitMinutes
            ? `${content.kuis.timeLimitMinutes} menit`
            : "Tanpa batas waktu",
        };
      }

      return null;
    })
    .filter((item): item is LecturerPreviewPlaylistItem => Boolean(item));

  return {
    lesson: {
      id: materialContent.materi.id,
      title: materialContent.materi.title,
      videoSource: mapVideoSource(materialContent.materi.videoSource),
      videoUrl: materialContent.materi.videoUrl ?? undefined,
      duration: formatDuration(materialContent.materi.estimatedMinutes),
      summary: materialContent.materi.description ?? "",
      objectives: materialContent.materi.objectives.map((objective) => objective.text),
      tools: materialContent.materi.tools.map((tool) => tool.name),
      thumbnailUrl: materialContent.materi.videoUrl ?? fallbackThumbnail,
    },
    playlist,
  };
}