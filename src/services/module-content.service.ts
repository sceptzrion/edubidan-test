import { prisma } from "@/lib/prisma";

export type ReorderModuleContentsResult =
  | {
      success: true;
      error: null;
    }
  | {
      success: false;
      error:
        | "MODULE_NOT_FOUND"
        | "CONTENT_IDS_REQUIRED"
        | "CONTENT_IDS_INVALID"
        | "CONTENT_NOT_FOUND";
    };

function normalizeOrderedContentIds(value: unknown) {
  if (!Array.isArray(value)) return null;

  const ids = value
    .map((item) => Number(item))
    .filter((item) => Number.isInteger(item) && item > 0);

  const uniqueIds = Array.from(new Set(ids));

  if (uniqueIds.length !== value.length) {
    return null;
  }

  return uniqueIds;
}

export async function reorderModuleContents(params: {
  moduleId: number;
  orderedContentIds: unknown;
}): Promise<ReorderModuleContentsResult> {
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
      error: "MODULE_NOT_FOUND",
    };
  }

  const orderedContentIds = normalizeOrderedContentIds(params.orderedContentIds);

  if (!orderedContentIds) {
    return {
      success: false,
      error: "CONTENT_IDS_INVALID",
    };
  }

  if (orderedContentIds.length === 0) {
    return {
      success: false,
      error: "CONTENT_IDS_REQUIRED",
    };
  }

  const matchingContents = await prisma.moduleContent.findMany({
    where: {
      moduleId: params.moduleId,
      id: {
        in: orderedContentIds,
      },
    },
    select: {
      id: true,
    },
  });

  if (matchingContents.length !== orderedContentIds.length) {
    return {
      success: false,
      error: "CONTENT_NOT_FOUND",
    };
  }

  await prisma.$transaction(
    orderedContentIds.map((contentId, index) =>
      prisma.moduleContent.update({
        where: {
          id: contentId,
        },
        data: {
          order: index + 1,
        },
      })
    )
  );

  return {
    success: true,
    error: null,
  };
}