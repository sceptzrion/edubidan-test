import { ContentType, ModuleStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type {
  LecturerModule,
  LecturerModuleStatus,
} from "@/data/learning/lecturer/lecturer-modules";

function formatUpdatedAt(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function mapModuleStatus(status: ModuleStatus): LecturerModuleStatus {
  if (status === ModuleStatus.PUBLIK) {
    return "Publik";
  }

  return "Draft";
}

export async function getLecturerModulesByDosenProfileId(
  dosenProfileId: number | null | undefined
): Promise<LecturerModule[]> {
  if (!dosenProfileId) return [];

  const modules = await prisma.module.findMany({
    where: {
      dosenProfileId,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      title: true,
      bannerUrl: true,
      accessCode: true,
      status: true,
      updatedAt: true,
      contents: {
        select: {
          id: true,
          kind: true,
        },
      },
    },
  });

  return modules.map((module) => {
    const materialCount = module.contents.filter(
      (content) => content.kind === ContentType.MATERI
    ).length;

    return {
      id: module.id,
      title: module.title,
      materialCount,
      status: mapModuleStatus(module.status),
      updated: formatUpdatedAt(module.updatedAt),
      code: module.accessCode,
      image: module.bannerUrl ?? undefined,
    };
  });
}