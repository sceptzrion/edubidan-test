import { ContentType, Prisma, VideoSource } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getYouTubeVideoDurationMinutes } from "@/lib/video/youtube";

const moduleContentSelect = {
  id: true,
  moduleId: true,
  kind: true,
  order: true,
  materi: {
    select: {
      id: true,
      title: true,
      description: true,
      videoSource: true,
      videoUrl: true,
      estimatedMinutes: true,
      createdAt: true,
      updatedAt: true,
      objectives: {
        select: {
          id: true,
          text: true,
          order: true,
        },
        orderBy: {
          order: "asc",
        },
      },
      tools: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  kuis: {
    select: {
      id: true,
      title: true,
      description: true,
      hasTimeLimit: true,
      timeLimitMinutes: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          soals: true,
        },
      },
    },
  },
} satisfies Prisma.ModuleContentSelect;

const materialDetailSelect = {
  id: true,
  title: true,
  description: true,
  videoSource: true,
  videoUrl: true,
  estimatedMinutes: true,
  createdAt: true,
  updatedAt: true,
  content: {
    select: {
      id: true,
      moduleId: true,
      kind: true,
      order: true,
      module: {
        select: {
          id: true,
          title: true,
          accessCode: true,
          status: true,
          dosenProfileId: true,
        },
      },
    },
  },
  objectives: {
    select: {
      id: true,
      text: true,
      order: true,
    },
    orderBy: {
      order: "asc",
    },
  },
  tools: {
    select: {
      id: true,
      name: true,
    },
  },
  progress: {
    select: {
      id: true,
      userId: true,
      isCompleted: true,
      completedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  },
} satisfies Prisma.MateriSelect;

const materialProgressSelect = {
  id: true,
  userId: true,
  materiId: true,
  isCompleted: true,
  completedAt: true,
  createdAt: true,
  updatedAt: true,
  materi: {
    select: {
      id: true,
      title: true,
      content: {
        select: {
          moduleId: true,
        },
      },
    },
  },
} satisfies Prisma.LessonProgressSelect;

type ModuleContentItem = Prisma.ModuleContentGetPayload<{
  select: typeof moduleContentSelect;
}>;

function mapModuleContent(content: ModuleContentItem) {
  if (content.kind === ContentType.MATERI) {
    return {
      id: content.id,
      moduleId: content.moduleId,
      kind: content.kind,
      order: content.order,
      materi: content.materi,
      kuis: null,
      title: content.materi?.title ?? null,
      estimatedMinutes: content.materi?.estimatedMinutes ?? null,
    };
  }

  return {
    id: content.id,
    moduleId: content.moduleId,
    kind: content.kind,
    order: content.order,
    materi: null,
    kuis: content.kuis,
    title: content.kuis?.title ?? null,
    estimatedMinutes: content.kuis?.timeLimitMinutes ?? null,
  };
}

function normalizeRequiredString(value: unknown) {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function normalizeOptionalString(value: unknown) {
  if (value === null) return null;
  if (typeof value !== "string") return undefined;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function normalizeStringList(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeVideoSource(value: unknown) {
  if (value === "upload" || value === VideoSource.UPLOAD) {
    return VideoSource.UPLOAD;
  }

  if (value === "embed" || value === VideoSource.EMBED) {
    return VideoSource.EMBED;
  }

  return null;
}

async function resolveMaterialEstimatedMinutes(params: {
  videoSource: VideoSource | null;
  videoUrl: string | null | undefined;
}) {
  if (params.videoSource !== VideoSource.EMBED) {
    return null;
  }

  return getYouTubeVideoDurationMinutes(params.videoUrl);
}

async function getNextContentOrder(moduleId: number) {
  const aggregate = await prisma.moduleContent.aggregate({
    where: {
      moduleId,
    },
    _max: {
      order: true,
    },
  });

  return (aggregate._max.order ?? 0) + 1;
}

export async function getModuleContents(moduleId: number) {
  const moduleData = await prisma.module.findUnique({
    where: {
      id: moduleId,
    },
    select: {
      id: true,
      title: true,
    },
  });

  if (!moduleData) {
    return null;
  }

  const contents = await prisma.moduleContent.findMany({
    where: {
      moduleId,
    },
    select: moduleContentSelect,
    orderBy: {
      order: "asc",
    },
  });

  return {
    module: moduleData,
    contents: contents.map(mapModuleContent),
  };
}

export async function getMaterialById(id: number) {
  return prisma.materi.findUnique({
    where: {
      id,
    },
    select: materialDetailSelect,
  });
}

export type CreateMaterialResult =
  | {
      success: true;
      material: Awaited<ReturnType<typeof getMaterialById>>;
      error: null;
    }
  | {
      success: false;
      material: null;
      error:
        | "MODULE_NOT_FOUND"
        | "TITLE_REQUIRED"
        | "VIDEO_SOURCE_INVALID";
    };

export async function createMaterial(params: {
  moduleId: number;
  title: unknown;
  description?: unknown;
  videoSource: unknown;
  videoUrl?: unknown;
  estimatedMinutes?: unknown;
  objectives?: unknown;
  tools?: unknown;
}): Promise<CreateMaterialResult> {
  const moduleData = await prisma.module.findUnique({
    where: {
      id: params.moduleId,
    },
    select: {
      id: true,
    },
  });

  if (!moduleData) {
    return {
      success: false,
      material: null,
      error: "MODULE_NOT_FOUND",
    };
  }

  const title = normalizeRequiredString(params.title);
  const description = normalizeOptionalString(params.description);
  const videoSource = normalizeVideoSource(params.videoSource);
  const videoUrl = normalizeOptionalString(params.videoUrl);
  const objectives = normalizeStringList(params.objectives);
  const tools = normalizeStringList(params.tools);

  if (!title) {
    return {
      success: false,
      material: null,
      error: "TITLE_REQUIRED",
    };
  }

  if (!videoSource) {
    return {
      success: false,
      material: null,
      error: "VIDEO_SOURCE_INVALID",
    };
  }

  const estimatedMinutes = await resolveMaterialEstimatedMinutes({
    videoSource,
    videoUrl,
  });

  const order = await getNextContentOrder(params.moduleId);

  const createdContent = await prisma.moduleContent.create({
    data: {
      moduleId: params.moduleId,
      kind: ContentType.MATERI,
      order,
      materi: {
        create: {
          title,
          description,
          videoSource,
          videoUrl,
          estimatedMinutes,
          objectives: {
            create: objectives.map((text, index) => ({
              text,
              order: index + 1,
            })),
          },
          tools: {
            create: tools.map((name) => ({
              name,
            })),
          },
        },
      },
    },
    select: {
      materi: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!createdContent.materi) {
    return {
      success: false,
      material: null,
      error: "MODULE_NOT_FOUND",
    };
  }

  const material = await getMaterialById(createdContent.materi.id);

  return {
    success: true,
    material,
    error: null,
  };
}

export type UpdateMaterialResult =
  | {
      success: true;
      material: Awaited<ReturnType<typeof getMaterialById>>;
      error: null;
    }
  | {
      success: false;
      material: null;
      error:
        | "MATERIAL_NOT_FOUND"
        | "TITLE_REQUIRED"
        | "VIDEO_SOURCE_INVALID";
    };

export async function updateMaterial(params: {
  id: number;
  title?: unknown;
  description?: unknown;
  videoSource?: unknown;
  videoUrl?: unknown;
  estimatedMinutes?: unknown;
  objectives?: unknown;
  tools?: unknown;
}): Promise<UpdateMaterialResult> {
  const existingMaterial = await prisma.materi.findUnique({
    where: {
      id: params.id,
    },
    select: {
      id: true,
      videoSource: true,
      videoUrl: true,
    },
  });

  if (!existingMaterial) {
    return {
      success: false,
      material: null,
      error: "MATERIAL_NOT_FOUND",
    };
  }

  const data: Prisma.MateriUpdateInput = {};
  let nextVideoSource = existingMaterial.videoSource;
  let nextVideoUrl = existingMaterial.videoUrl;

  if (params.title !== undefined) {
    const title = normalizeRequiredString(params.title);

    if (!title) {
      return {
        success: false,
        material: null,
        error: "TITLE_REQUIRED",
      };
    }

    data.title = title;
  }

  if (params.description !== undefined) {
    data.description = normalizeOptionalString(params.description);
  }

  if (params.videoSource !== undefined) {
    const videoSource = normalizeVideoSource(params.videoSource);

    if (!videoSource) {
      return {
        success: false,
        material: null,
        error: "VIDEO_SOURCE_INVALID",
      };
    }

    nextVideoSource = videoSource;
    data.videoSource = videoSource;
  }

  if (params.videoUrl !== undefined) {
    const videoUrl = normalizeOptionalString(params.videoUrl) ?? null;

    nextVideoUrl = videoUrl;
    data.videoUrl = videoUrl;
  }

  if (params.videoSource !== undefined || params.videoUrl !== undefined) {
    data.estimatedMinutes = await resolveMaterialEstimatedMinutes({
      videoSource: nextVideoSource,
      videoUrl: nextVideoUrl,
    });
  }

  if (params.objectives !== undefined) {
    const objectives = normalizeStringList(params.objectives);

    data.objectives = {
      deleteMany: {},
      create: objectives.map((text, index) => ({
        text,
        order: index + 1,
      })),
    };
  }

  if (params.tools !== undefined) {
    const tools = normalizeStringList(params.tools);

    data.tools = {
      deleteMany: {},
      create: tools.map((name) => ({
        name,
      })),
    };
  }

  await prisma.materi.update({
    where: {
      id: params.id,
    },
    data,
  });

  const material = await getMaterialById(params.id);

  return {
    success: true,
    material,
    error: null,
  };
}

export type UpdateMaterialProgressResult =
  | {
      success: true;
      progress: Prisma.LessonProgressGetPayload<{
        select: typeof materialProgressSelect;
      }>;
      error: null;
    }
  | {
      success: false;
      progress: null;
      error:
        | "USER_ID_REQUIRED"
        | "MATERIAL_ID_REQUIRED"
        | "USER_NOT_FOUND"
        | "MATERIAL_NOT_FOUND"
        | "USER_NOT_ENROLLED"
        | "USER_KICKED"
        | "COMPLETION_STATUS_INVALID";
    };

export async function updateMaterialProgress(params: {
  userId: unknown;
  materialId: unknown;
  isCompleted: unknown;
}): Promise<UpdateMaterialProgressResult> {
  const userId = Number(params.userId);
  const materialId = Number(params.materialId);

  if (!Number.isInteger(userId) || userId <= 0) {
    return {
      success: false,
      progress: null,
      error: "USER_ID_REQUIRED",
    };
  }

  if (!Number.isInteger(materialId) || materialId <= 0) {
    return {
      success: false,
      progress: null,
      error: "MATERIAL_ID_REQUIRED",
    };
  }

  if (typeof params.isCompleted !== "boolean") {
    return {
      success: false,
      progress: null,
      error: "COMPLETION_STATUS_INVALID",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) {
    return {
      success: false,
      progress: null,
      error: "USER_NOT_FOUND",
    };
  }

  const material = await prisma.materi.findUnique({
    where: {
      id: materialId,
    },
    select: {
      id: true,
      content: {
        select: {
          moduleId: true,
        },
      },
    },
  });

  if (!material) {
    return {
      success: false,
      progress: null,
      error: "MATERIAL_NOT_FOUND",
    };
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_moduleId: {
        userId,
        moduleId: material.content.moduleId,
      },
    },
    select: {
      id: true,
      isKicked: true,
    },
  });

  if (!enrollment) {
    return {
      success: false,
      progress: null,
      error: "USER_NOT_ENROLLED",
    };
  }

  if (enrollment.isKicked) {
    return {
      success: false,
      progress: null,
      error: "USER_KICKED",
    };
  }

  const progress = await prisma.lessonProgress.upsert({
    where: {
      userId_materiId: {
        userId,
        materiId: materialId,
      },
    },
    create: {
      userId,
      materiId: materialId,
      isCompleted: params.isCompleted,
      completedAt: params.isCompleted ? new Date() : null,
    },
    update: {
      isCompleted: params.isCompleted,
      completedAt: params.isCompleted ? new Date() : null,
    },
    select: materialProgressSelect,
  });

  return {
    success: true,
    progress,
    error: null,
  };
}

export type DeleteMaterialResult =
  | {
      success: true;
      deletedMaterialId: number;
      deletedContentId: number;
      error: null;
    }
  | {
      success: false;
      deletedMaterialId: null;
      deletedContentId: null;
      error: "MATERIAL_NOT_FOUND";
    };

export async function deleteMaterial(id: number): Promise<DeleteMaterialResult> {
  const material = await prisma.materi.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      contentId: true,
    },
  });

  if (!material) {
    return {
      success: false,
      deletedMaterialId: null,
      deletedContentId: null,
      error: "MATERIAL_NOT_FOUND",
    };
  }

  await prisma.moduleContent.delete({
    where: {
      id: material.contentId,
    },
  });

  return {
    success: true,
    deletedMaterialId: material.id,
    deletedContentId: material.contentId,
    error: null,
  };
}