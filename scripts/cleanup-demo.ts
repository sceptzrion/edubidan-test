import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaMariaDb(databaseUrl);

const prisma = new PrismaClient({
  adapter,
  log: ["error", "warn"],
});

async function main() {
  const now = new Date();

  const demoUsers = await prisma.user.findMany({
    where: {
      isDemo: true,
      OR: [
        {
          demoExpiresAt: {
            lt: now,
          },
        },
        {
          demoExpiresAt: null,
        },
      ],
    },
    select: {
      id: true,
      dosenProfile: {
        select: {
          id: true,
        },
      },
    },
  });

  const userIds = demoUsers.map((user) => user.id);
  const dosenProfileIds = demoUsers
    .map((user) => user.dosenProfile?.id)
    .filter((id): id is number => typeof id === "number");

  if (userIds.length === 0) {
    console.log("Tidak ada data demo yang perlu dibersihkan.");
    return;
  }

  const demoModules = await prisma.module.findMany({
    where: {
      dosenProfileId: {
        in: dosenProfileIds,
      },
    },
    select: {
      id: true,
      contents: {
        select: {
          id: true,
          materi: {
            select: {
              id: true,
            },
          },
          kuis: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  const moduleIds = demoModules.map((module) => module.id);

  const materiIds = demoModules.flatMap((module) =>
    module.contents
      .map((content) => content.materi?.id)
      .filter((id): id is number => typeof id === "number")
  );

  const kuisIds = demoModules.flatMap((module) =>
    module.contents
      .map((content) => content.kuis?.id)
      .filter((id): id is number => typeof id === "number")
  );

  const attempts = await prisma.quizAttempt.findMany({
    where: {
      OR: [
        {
          userId: {
            in: userIds,
          },
        },
        {
          kuisId: {
            in: kuisIds,
          },
        },
      ],
    },
    select: {
      id: true,
    },
  });

  const attemptIds = attempts.map((attempt) => attempt.id);

  await prisma.attemptAnswer.deleteMany({
    where: {
      attemptId: {
        in: attemptIds,
      },
    },
  });

  await prisma.quizAttempt.deleteMany({
    where: {
      id: {
        in: attemptIds,
      },
    },
  });

  await prisma.lessonProgress.deleteMany({
    where: {
      OR: [
        {
          userId: {
            in: userIds,
          },
        },
        {
          materiId: {
            in: materiIds,
          },
        },
      ],
    },
  });

  await prisma.enrollment.deleteMany({
    where: {
      OR: [
        {
          userId: {
            in: userIds,
          },
        },
        {
          moduleId: {
            in: moduleIds,
          },
        },
      ],
    },
  });

  await prisma.notification.deleteMany({
    where: {
      OR: [
        {
          userId: {
            in: userIds,
          },
        },
        {
          moduleId: {
            in: moduleIds,
          },
        },
      ],
    },
  });

  await prisma.activityLog.deleteMany({
    where: {
      userId: {
        in: userIds,
      },
    },
  });

  await prisma.notifPreference.deleteMany({
    where: {
      userId: {
        in: userIds,
      },
    },
  });

  await prisma.module.deleteMany({
    where: {
      id: {
        in: moduleIds,
      },
    },
  });

  await prisma.user.deleteMany({
    where: {
      id: {
        in: userIds,
      },
    },
  });

  console.log(`Berhasil membersihkan ${userIds.length} akun demo.`);
}

main()
  .catch((error) => {
    console.error("Cleanup demo failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });