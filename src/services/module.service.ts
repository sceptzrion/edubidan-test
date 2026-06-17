import { ContentType, ModuleStatus, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { deleteCloudinaryAsset } from "@/services/media/cloudinary.service";

const moduleListSelect = {
  id: true,
  title: true,
  description: true,
  bannerUrl: true,
  bannerPublicId: true,
  accessCode: true,
  status: true,
  estimatedMinutes: true,
  createdAt: true,
  updatedAt: true,
  dosenProfile: {
    select: {
      id: true,
      nidnNip: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          phoneNumber: true,
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
  contents: {
    select: {
      id: true,
      kind: true,
      order: true,
    },
    orderBy: {
      order: "asc",
    },
  },
  _count: {
    select: {
      contents: true,
      enrollments: true,
    },
  },
} satisfies Prisma.ModuleSelect;

const moduleDetailSelect = {
  id: true,
  title: true,
  description: true,
  bannerUrl: true,
  bannerPublicId: true,
  accessCode: true,
  status: true,
  estimatedMinutes: true,
  createdAt: true,
  updatedAt: true,
  dosenProfile: {
    select: {
      id: true,
      nidnNip: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          phoneNumber: true,
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
  contents: {
    select: {
      id: true,
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
          soals: {
            select: {
              id: true,
              questionText: true,
              mediaUrl: true,
              mediaPublicId: true,
              order: true,
              options: {
                select: {
                  id: true,
                  text: true,
                  isCorrect: true,
                  order: true,
                },
                orderBy: {
                  order: "asc",
                },
              },
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  },
  enrollments: {
    select: {
      id: true,
      joinedAt: true,
      isKicked: true,
      kickReason: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          mahasiswaProfile: {
            select: {
              npm: true,
            },
          },
        },
      },
    },
    orderBy: {
      joinedAt: "desc",
    },
  },
  _count: {
    select: {
      contents: true,
      enrollments: true,
    },
  },
} satisfies Prisma.ModuleSelect;

type ModuleListItem = Prisma.ModuleGetPayload<{
  select: typeof moduleListSelect;
}>;

type ModuleDetail = Prisma.ModuleGetPayload<{
  select: typeof moduleDetailSelect;
}>;

function normalizeSearch(value: string | null) {
  const search = value?.trim();

  return search && search.length > 0 ? search : null;
}

function normalizeStatus(value: string | null) {
  if (value === ModuleStatus.PUBLIK) {
    return ModuleStatus.PUBLIK;
  }

  if (value === ModuleStatus.DRAFT) {
    return ModuleStatus.DRAFT;
  }

  return null;
}

function buildModuleStats(contents: Array<{ kind: ContentType }>) {
  const totalMateri = contents.filter(
    (content) => content.kind === ContentType.MATERI
  ).length;

  const totalKuis = contents.filter(
    (content) => content.kind === ContentType.KUIS
  ).length;

  return {
    totalMateri,
    totalKuis,
    totalContents: contents.length,
  };
}

function mapModuleListItem(module: ModuleListItem) {
  const stats = buildModuleStats(module.contents);

  return {
    ...module,
    stats: {
      ...stats,
      totalParticipants: module._count.enrollments,
    },
  };
}

function mapModuleDetail(module: ModuleDetail) {
  const stats = buildModuleStats(module.contents);

  return {
    ...module,
    stats: {
      ...stats,
      totalParticipants: module._count.enrollments,
    },
  };
}

export async function getModules(params?: {
  search?: string | null;
  status?: string | null;
}) {
  const search = normalizeSearch(params?.search ?? null);
  const status = normalizeStatus(params?.status ?? null);

  const where: Prisma.ModuleWhereInput = {
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            {
              title: {
                contains: search,
              },
            },
            {
              description: {
                contains: search,
              },
            },
            {
              accessCode: {
                contains: search,
              },
            },
          ],
        }
      : {}),
  };

  const modules = await prisma.module.findMany({
    where,
    select: moduleListSelect,
    orderBy: {
      updatedAt: "desc",
    },
  });

  return modules.map(mapModuleListItem);
}

export async function getModuleById(id: number) {
  const moduleData = await prisma.module.findUnique({
    where: {
      id,
    },
    select: moduleDetailSelect,
  });

  if (!moduleData) {
    return null;
  }

  return mapModuleDetail(moduleData);
}

function normalizeOptionalString(value: unknown) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== "string") return undefined;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

async function deleteOldBannerIfNeeded(params: {
  oldPublicId: string | null;
  newPublicId?: string | null;
  shouldUpdateBanner: boolean;
}) {
  const { oldPublicId, newPublicId, shouldUpdateBanner } = params;

  if (!shouldUpdateBanner) return;
  if (!oldPublicId) return;
  if (oldPublicId === newPublicId) return;

  try {
    await deleteCloudinaryAsset(oldPublicId, "image");
  } catch (error) {
    console.error("Failed to delete old module banner from Cloudinary:", error);
  }
}

function normalizeRequiredString(value: unknown) {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function normalizeEstimatedMinutes(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const estimatedMinutes = Number(value);

  if (!Number.isInteger(estimatedMinutes) || estimatedMinutes <= 0) {
    return null;
  }

  return estimatedMinutes;
}

function normalizeObjectives(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function normalizeModuleStatus(value: unknown) {
  if (value === ModuleStatus.PUBLIK) return ModuleStatus.PUBLIK;
  if (value === ModuleStatus.DRAFT) return ModuleStatus.DRAFT;

  return null;
}

export type CreateModuleResult =
  | {
      success: true;
      module: Awaited<ReturnType<typeof getModuleById>>;
      error: null;
    }
  | {
      success: false;
      module: null;
      error:
        | "DOSEN_PROFILE_ID_REQUIRED"
        | "DOSEN_PROFILE_NOT_FOUND"
        | "TITLE_REQUIRED"
        | "ACCESS_CODE_REQUIRED"
        | "ACCESS_CODE_ALREADY_USED"
        | "ESTIMATED_MINUTES_INVALID";
    };

export async function createModule(params: {
  dosenProfileId: unknown;
  title: unknown;
  description?: unknown;
  bannerUrl?: unknown;
  bannerPublicId?: unknown;
  accessCode: unknown;
  estimatedMinutes?: unknown;
  objectives?: unknown;
}): Promise<CreateModuleResult> {
  const dosenProfileId = Number(params.dosenProfileId);
  const title = normalizeRequiredString(params.title);
  const description = normalizeOptionalString(params.description);
  const bannerUrl = normalizeOptionalString(params.bannerUrl);
  const bannerPublicId = normalizeOptionalString(params.bannerPublicId);
  const accessCode = normalizeRequiredString(params.accessCode)?.toUpperCase();
  const estimatedMinutes =
    params.estimatedMinutes === undefined
      ? null
      : normalizeEstimatedMinutes(params.estimatedMinutes);
  const objectives = normalizeObjectives(params.objectives);

  if (!Number.isInteger(dosenProfileId) || dosenProfileId <= 0) {
    return {
      success: false,
      module: null,
      error: "DOSEN_PROFILE_ID_REQUIRED",
    };
  }

  const dosenProfile = await prisma.dosenProfile.findUnique({
    where: {
      id: dosenProfileId,
    },
    select: {
      id: true,
    },
  });

  if (!dosenProfile) {
    return {
      success: false,
      module: null,
      error: "DOSEN_PROFILE_NOT_FOUND",
    };
  }

  if (!title) {
    return {
      success: false,
      module: null,
      error: "TITLE_REQUIRED",
    };
  }

  if (!accessCode) {
    return {
      success: false,
      module: null,
      error: "ACCESS_CODE_REQUIRED",
    };
  }

  if (params.estimatedMinutes !== undefined && estimatedMinutes === null) {
    return {
      success: false,
      module: null,
      error: "ESTIMATED_MINUTES_INVALID",
    };
  }

  const existingAccessCode = await prisma.module.findUnique({
    where: {
      accessCode,
    },
    select: {
      id: true,
    },
  });

  if (existingAccessCode) {
    return {
      success: false,
      module: null,
      error: "ACCESS_CODE_ALREADY_USED",
    };
  }

  const createdModule = await prisma.module.create({
    data: {
      dosenProfileId,
      title,
      description,
      bannerUrl,
      bannerPublicId,
      accessCode,
      status: ModuleStatus.DRAFT,
      estimatedMinutes,
      objectives: {
        create: objectives.map((text, index) => ({
          text,
          order: index + 1,
        })),
      },
    },
    select: {
      id: true,
    },
  });

  const moduleData = await getModuleById(createdModule.id);

  return {
    success: true,
    module: moduleData,
    error: null,
  };
}

export type UpdateModuleResult =
  | {
      success: true;
      module: Awaited<ReturnType<typeof getModuleById>>;
      error: null;
    }
  | {
      success: false;
      module: null;
      error:
        | "MODULE_NOT_FOUND"
        | "TITLE_EMPTY"
        | "ACCESS_CODE_EMPTY"
        | "ACCESS_CODE_ALREADY_USED"
        | "ESTIMATED_MINUTES_INVALID";
    };

export async function updateModule(params: {
  id: number;
  title?: unknown;
  description?: unknown;
  bannerUrl?: unknown;
  bannerPublicId?: unknown;
  accessCode?: unknown;
  estimatedMinutes?: unknown;
  objectives?: unknown;
}): Promise<UpdateModuleResult> {
  const existingModule = await prisma.module.findUnique({
    where: {
      id: params.id,
    },
    select: {
      id: true,
      bannerPublicId: true,
    },
  });

  if (!existingModule) {
    return {
      success: false,
      module: null,
      error: "MODULE_NOT_FOUND",
    };
  }

  const data: Prisma.ModuleUpdateInput = {};

  if (params.title !== undefined) {
    const title = normalizeRequiredString(params.title);

    if (!title) {
      return {
        success: false,
        module: null,
        error: "TITLE_EMPTY",
      };
    }

    data.title = title;
  }

  if (params.description !== undefined) {
    data.description = normalizeOptionalString(params.description);
  }

  if (params.bannerUrl !== undefined) {
    data.bannerUrl = normalizeOptionalString(params.bannerUrl);

    if (params.bannerPublicId === undefined) {
      data.bannerPublicId = null;
    }
  }

  if (params.bannerPublicId !== undefined) {
    data.bannerPublicId = normalizeOptionalString(params.bannerPublicId);
  }

  if (params.accessCode !== undefined) {
    const accessCode = normalizeRequiredString(params.accessCode)?.toUpperCase();

    if (!accessCode) {
      return {
        success: false,
        module: null,
        error: "ACCESS_CODE_EMPTY",
      };
    }

    const duplicateAccessCode = await prisma.module.findUnique({
      where: {
        accessCode,
      },
      select: {
        id: true,
      },
    });

    if (duplicateAccessCode && duplicateAccessCode.id !== params.id) {
      return {
        success: false,
        module: null,
        error: "ACCESS_CODE_ALREADY_USED",
      };
    }

    data.accessCode = accessCode;
  }

  if (params.estimatedMinutes !== undefined) {
    const estimatedMinutes = normalizeEstimatedMinutes(params.estimatedMinutes);

    if (estimatedMinutes === null) {
      return {
        success: false,
        module: null,
        error: "ESTIMATED_MINUTES_INVALID",
      };
    }

    data.estimatedMinutes = estimatedMinutes;
  }

  if (params.objectives !== undefined) {
    const objectives = normalizeObjectives(params.objectives);

    data.objectives = {
      deleteMany: {},
      create: objectives.map((text, index) => ({
        text,
        order: index + 1,
      })),
    };
  }

  await prisma.module.update({
    where: {
      id: params.id,
    },
    data,
  });

  const newPublicId =
    params.bannerPublicId !== undefined
      ? normalizeOptionalString(params.bannerPublicId)
      : params.bannerUrl !== undefined
        ? null
        : undefined;

  await deleteOldBannerIfNeeded({
    oldPublicId: existingModule.bannerPublicId,
    newPublicId,
    shouldUpdateBanner: params.bannerUrl !== undefined,
  });

  const moduleData = await getModuleById(params.id);

  return {
    success: true,
    module: moduleData,
    error: null,
  };
}

export type UpdateModulePublishStatusResult =
  | {
      success: true;
      module: Awaited<ReturnType<typeof getModuleById>>;
      error: null;
    }
  | {
      success: false;
      module: null;
      error: "MODULE_NOT_FOUND" | "STATUS_INVALID";
    };

export async function updateModulePublishStatus(params: {
  id: number;
  status: unknown;
}): Promise<UpdateModulePublishStatusResult> {
  const status = normalizeModuleStatus(params.status);

  if (!status) {
    return {
      success: false,
      module: null,
      error: "STATUS_INVALID",
    };
  }

  const existingModule = await prisma.module.findUnique({
    where: {
      id: params.id,
    },
    select: {
      id: true,
    },
  });

  if (!existingModule) {
    return {
      success: false,
      module: null,
      error: "MODULE_NOT_FOUND",
    };
  }

  await prisma.module.update({
    where: {
      id: params.id,
    },
    data: {
      status,
    },
  });

  const moduleData = await getModuleById(params.id);

  return {
    success: true,
    module: moduleData,
    error: null,
  };
}