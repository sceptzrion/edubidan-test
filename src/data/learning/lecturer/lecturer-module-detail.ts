import { ContentType, ModuleStatus, VideoSource } from "@prisma/client";

import type {
  LecturerKuisItem,
  LecturerMateriItem,
  LecturerPlaylistItem,
  LecturerQuizQuestion,
} from "@/components/dashboard/lecturer/modules/detail/PlaylistTab";
import { formatMinutes, formatRoundedModuleMinutes } from "@/lib/video/youtube";
import { getModuleById } from "@/services/module.service";

export type LecturerModuleDetailStatus = "Publik" | "Draft";

export interface LecturerModuleDetailInfo {
  banner: string;
  title: string;
  description: string;
  objectives: string[];
  estimatedTime: string;
  instructor: string;
  status: LecturerModuleDetailStatus;
  code: string;
}

export interface LecturerModuleDetailData {
  info: LecturerModuleDetailInfo;
  playlistItems: LecturerPlaylistItem[];
}

type ModuleDetailData = NonNullable<Awaited<ReturnType<typeof getModuleById>>>;
type ModuleDetailContent = ModuleDetailData["contents"][number];
type ModuleDetailMateri = ModuleDetailContent["materi"];
type ModuleDetailKuis = ModuleDetailContent["kuis"];
type ModuleDetailSoal = NonNullable<ModuleDetailKuis>["soals"][number];

const fallbackBanner =
  "https://images.unsplash.com/photo-1559757175-5700dde675bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080";

function mapModuleStatus(status: ModuleStatus): LecturerModuleDetailStatus {
  if (status === ModuleStatus.PUBLIK) {
    return "Publik";
  }

  return "Draft";
}

function formatEstimatedTime(minutes: number | null) {
  return formatMinutes(minutes);
}

function mapVideoSource(source: VideoSource): LecturerMateriItem["videoSource"] {
  if (source === VideoSource.UPLOAD) {
    return "upload";
  }

  return "embed";
}

function mapMateriItem(
  contentId: number,
  materi: ModuleDetailMateri
): LecturerMateriItem | null {
  if (!materi) return null;

  return {
    kind: "materi",
    id: materi.id,
    contentId,
    title: materi.title,
    videoSource: mapVideoSource(materi.videoSource),
    videoUrl: materi.videoUrl ?? undefined,
    duration: formatEstimatedTime(materi.estimatedMinutes),
    summary: materi.description ?? "",
    objectives: materi.objectives.map((objective) => objective.text),
    tools: materi.tools.map((tool) => tool.name),
  };
}

function mapQuizQuestion(soal: ModuleDetailSoal): LecturerQuizQuestion {
  const correctOption = soal.options.find((option) => option.isCorrect);
  const fallbackOption = soal.options[0];

  return {
    id: soal.id,
    questionText: soal.questionText,
    mediaUrl: soal.mediaUrl,
    mediaPublicId: soal.mediaPublicId,
    options: soal.options.map((option) => ({
      id: option.id,
      text: option.text,
    })),
    correctOptionId: correctOption?.id ?? fallbackOption?.id ?? 0,
  };
}

function mapKuisItem(
  contentId: number,
  kuis: ModuleDetailKuis
): LecturerKuisItem | null {
  if (!kuis) return null;

  const questions = kuis.soals.map(mapQuizQuestion);

  return {
    kind: "kuis",
    id: kuis.id,
    contentId,
    title: kuis.title,
    description: kuis.description ?? "",
    hasTimeLimit: kuis.hasTimeLimit,
    timeLimitMinutes: kuis.timeLimitMinutes ?? 0,
    questions,
    questionCount: questions.length,
  };
}

function getContentEstimatedMinutes(content: ModuleDetailContent) {
  if (content.kind === ContentType.MATERI) {
    return content.materi?.estimatedMinutes ?? 0;
  }

  if (content.kind === ContentType.KUIS) {
    return content.kuis?.timeLimitMinutes ?? 0;
  }

  return 0;
}

function calculateModuleEstimatedTime(moduleData: ModuleDetailData) {
  const totalMinutes = moduleData.contents.reduce((total, content) => {
    return total + getContentEstimatedMinutes(content);
  }, 0);

  return formatRoundedModuleMinutes(totalMinutes);
}

function mapPlaylistItems(moduleData: ModuleDetailData): LecturerPlaylistItem[] {
  return moduleData.contents
    .map((content) => {
      if (content.kind === ContentType.MATERI) {
        return mapMateriItem(content.id, content.materi);
      }

      return mapKuisItem(content.id, content.kuis);
    })
    .filter((item): item is LecturerPlaylistItem => Boolean(item));
}

export async function getLecturerModuleDetailData(
  moduleId: number,
  dosenProfileId: number
): Promise<LecturerModuleDetailData | null> {
  const moduleData = await getModuleById(moduleId);

  if (!moduleData || moduleData.dosenProfile.id !== dosenProfileId) {
    return null;
  }

  return {
    info: {
      banner: moduleData.bannerUrl ?? fallbackBanner,
      title: moduleData.title,
      description: moduleData.description ?? "",
      objectives: moduleData.objectives.map((objective) => objective.text),
      estimatedTime: calculateModuleEstimatedTime(moduleData),
      instructor: moduleData.dosenProfile.user.name,
      status: mapModuleStatus(moduleData.status),
      code: moduleData.accessCode,
    },
    playlistItems: mapPlaylistItems(moduleData),
  };
}