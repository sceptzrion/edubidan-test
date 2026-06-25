import bcrypt from "bcryptjs";
import {
  ContentType,
  ModuleStatus,
  NotificationType,
  Role,
  VideoSource,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

type DemoRole = "MAHASISWA" | "DOSEN";

type DemoAccountResult = {
  email: string;
  password: string;
  role: DemoRole;
  expiresAt: Date;
};

const DEMO_IMAGES = {
  pregnancy:
    "https://images.unsplash.com/photo-1632053651899-3389100579fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
  newborn:
    "https://images.unsplash.com/photo-1701557774684-a5d563c46c1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
  breastfeeding:
    "https://images.unsplash.com/photo-1632053002434-b203dc8efb37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
};

const DEMO_VIDEO_URL = "https://www.youtube.com/embed/o_l3NiAtoKo";

const DEMO_VIDEOS = {
  ancIntro: DEMO_VIDEO_URL,
  ancSteps: DEMO_VIDEO_URL,
};

const DEFAULT_DEMO_DOMAIN = "edubidan.test";
const DEFAULT_EXPIRES_DAYS = 7;

function randomDigits(length: number) {
  let result = "";

  for (let index = 0; index < length; index += 1) {
    result += Math.floor(Math.random() * 10).toString();
  }

  return result;
}

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function getDemoExpiresAt() {
  const days = Number(
    process.env.DEMO_ACCOUNT_EXPIRES_DAYS ?? DEFAULT_EXPIRES_DAYS
  );

  return addDays(Number.isFinite(days) && days > 0 ? days : DEFAULT_EXPIRES_DAYS);
}

function getDemoEmail(role: DemoRole, digits: string) {
  const domain = process.env.DEMO_EMAIL_DOMAIN ?? DEFAULT_DEMO_DOMAIN;
  const prefix = role === "MAHASISWA" ? "mahasiswa" : "dosen";

  return `${prefix}.demo${digits}@${domain}`;
}

async function generateUniqueIdentity(role: DemoRole) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const digits = randomDigits(4);
    const email = getDemoEmail(role, digits);

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!existingUser) {
      const prefix = role === "MAHASISWA" ? "MHS" : "DSN";
      const demoCode = `${prefix}${digits}${Date.now().toString().slice(-6)}`;
      const password = `password${randomDigits(3)}`;

      return {
        digits,
        email,
        password,
        demoCode,
      };
    }
  }

  throw new Error("Gagal membuat identitas demo yang unik.");
}

async function createMateri(params: {
  moduleId: number;
  order: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  objectives: string[];
  tools: string[];
}) {
  const content = await prisma.moduleContent.create({
    data: {
      moduleId: params.moduleId,
      kind: ContentType.MATERI,
      order: params.order,
    },
  });

  return prisma.materi.create({
    data: {
      contentId: content.id,
      title: params.title,
      description: params.description,
      videoSource: VideoSource.EMBED,
      videoUrl: DEMO_VIDEOS.ancIntro,
      estimatedMinutes: params.estimatedMinutes,
      objectives: {
        create: params.objectives.map((text, index) => ({
          text,
          order: index + 1,
        })),
      },
      tools: {
        create: params.tools.map((name) => ({
          name,
        })),
      },
    },
  });
}

async function createKuis(params: {
  moduleId: number;
  order: number;
  title: string;
  description: string;
}) {
  const content = await prisma.moduleContent.create({
    data: {
      moduleId: params.moduleId,
      kind: ContentType.KUIS,
      order: params.order,
    },
  });

  return prisma.kuis.create({
    data: {
      contentId: content.id,
      title: params.title,
      description: params.description,
      hasTimeLimit: true,
      timeLimitMinutes: 10,
      soals: {
        create: [
          {
            questionText:
              "Apa tujuan utama pemeriksaan antenatal care pada ibu hamil?",
            order: 1,
            options: {
              create: [
                {
                  text: "Memantau kondisi ibu dan janin selama kehamilan.",
                  isCorrect: true,
                  order: 1,
                },
                {
                  text: "Menggantikan seluruh proses persalinan.",
                  isCorrect: false,
                  order: 2,
                },
                {
                  text: "Menentukan jenis kelamin bayi secara pasti.",
                  isCorrect: false,
                  order: 3,
                },
                {
                  text: "Menghindari seluruh pemeriksaan laboratorium.",
                  isCorrect: false,
                  order: 4,
                },
              ],
            },
          },
          {
            questionText:
              "Alat yang dapat digunakan untuk memantau denyut jantung janin adalah...",
            order: 2,
            options: {
              create: [
                {
                  text: "Doppler.",
                  isCorrect: true,
                  order: 1,
                },
                {
                  text: "Termometer ruangan.",
                  isCorrect: false,
                  order: 2,
                },
                {
                  text: "Timbangan bayi.",
                  isCorrect: false,
                  order: 3,
                },
                {
                  text: "Penggaris biasa.",
                  isCorrect: false,
                  order: 4,
                },
              ],
            },
          },
          {
            questionText:
              "Data identitas dan keluhan ibu hamil biasanya dikumpulkan pada tahap...",
            order: 3,
            options: {
              create: [
                {
                  text: "Anamnesis.",
                  isCorrect: true,
                  order: 1,
                },
                {
                  text: "Sterilisasi alat.",
                  isCorrect: false,
                  order: 2,
                },
                {
                  text: "Pencatatan nilai akhir.",
                  isCorrect: false,
                  order: 3,
                },
                {
                  text: "Evaluasi aplikasi.",
                  isCorrect: false,
                  order: 4,
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      soals: {
        include: {
          options: true,
        },
      },
    },
  });
}

async function createCompletedAttempt(params: {
  userId: number;
  kuisId: number;
  correctCount: number;
  durationSeconds: number;
}) {
  const questions = await prisma.soal.findMany({
    where: {
      kuisId: params.kuisId,
    },
    include: {
      options: true,
    },
    orderBy: {
      order: "asc",
    },
  });

  const totalQuestions = questions.length;
  const totalCorrect = Math.min(params.correctCount, totalQuestions);
  const score = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: params.userId,
      kuisId: params.kuisId,
      score,
      totalCorrect,
      totalQuestions,
      durationSeconds: params.durationSeconds,
      submittedAt: new Date(),
      isCompleted: true,
    },
  });

  for (const [index, question] of questions.entries()) {
    const correctOption = question.options.find((option) => option.isCorrect);
    const wrongOption = question.options.find((option) => !option.isCorrect);

    const selectedOption =
      index < totalCorrect
        ? correctOption ?? question.options[0]
        : wrongOption ?? question.options[0];

    await prisma.attemptAnswer.create({
      data: {
        attemptId: attempt.id,
        soalId: question.id,
        optionId: selectedOption?.id,
      },
    });
  }
}

async function createMahasiswaDemoAccount(): Promise<DemoAccountResult> {
  const identity = await generateUniqueIdentity("MAHASISWA");
  const passwordHash = await bcrypt.hash(identity.password, 10);
  const expiresAt = getDemoExpiresAt();

  const user = await prisma.user.create({
    data: {
      name: `Mahasiswa Demo ${identity.digits}`,
      email: identity.email,
      password: passwordHash,
      role: Role.MAHASISWA,
      phoneNumber: `08${randomDigits(10)}`,
      isActive: true,
      isDemo: true,
      demoCode: identity.demoCode,
      demoExpiresAt: expiresAt,
      mahasiswaProfile: {
        create: {
          npm: `99${identity.digits}${randomDigits(7)}`,
        },
      },
      notifPreference: {
        create: {
          moduleUpdate: true,
          newMaterial: true,
          newQuiz: true,
          quizResult: true,
          quizActivity: false,
          accountActivity: true,
          systemAlert: true,
        },
      },
    },
  });

  const modules = await prisma.module.findMany({
    where: {
      status: ModuleStatus.PUBLIK,
    },
    select: {
      id: true,
    },
    take: 3,
  });

  if (modules.length === 0) {
    throw new Error("Belum ada modul publik. Jalankan npm run db:seed terlebih dahulu.");
  }

  await prisma.enrollment.createMany({
    data: modules.map((module) => ({
      userId: user.id,
      moduleId: module.id,
    })),
    skipDuplicates: true,
  });

  await prisma.notification.create({
    data: {
      userId: user.id,
      type: NotificationType.GABUNG_MODUL,
      title: "Akun demo siap digunakan",
      body: "Akun demo Mahasiswa telah dibuat dan sudah tergabung ke modul pembelajaran.",
      href: "/dashboard/modules",
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: user.id,
      actionType: "GENERATE_DEMO_ACCOUNT",
      description: "Akun demo Mahasiswa berhasil dibuat untuk usability testing.",
    },
  });

  return {
    email: identity.email,
    password: identity.password,
    role: "MAHASISWA",
    expiresAt,
  };
}

async function createDosenDemoAccount(): Promise<DemoAccountResult> {
  const identity = await generateUniqueIdentity("DOSEN");
  const passwordHash = await bcrypt.hash(identity.password, 10);
  const expiresAt = getDemoExpiresAt();

  const dosenUser = await prisma.user.create({
    data: {
      name: `Dosen Demo ${identity.digits}`,
      email: identity.email,
      password: passwordHash,
      role: Role.DOSEN,
      phoneNumber: `08${randomDigits(10)}`,
      isActive: true,
      isDemo: true,
      demoCode: identity.demoCode,
      demoExpiresAt: expiresAt,
      dosenProfile: {
        create: {
          nidnNip: `88${identity.digits}${randomDigits(6)}`,
        },
      },
      notifPreference: {
        create: {
          moduleUpdate: true,
          newMaterial: true,
          newQuiz: true,
          quizResult: true,
          quizActivity: true,
          accountActivity: true,
          systemAlert: true,
        },
      },
    },
    include: {
      dosenProfile: true,
    },
  });

  if (!dosenUser.dosenProfile) {
    throw new Error("Profil dosen demo gagal dibuat.");
  }

  const demoModule = await prisma.module.create({
    data: {
      dosenProfileId: dosenUser.dosenProfile.id,
      title: `[DEMO ${identity.digits}] Pemeriksaan Kehamilan Dasar`,
      description:
        "Modul demo untuk pengujian fitur dosen, materi, kuis, peserta, analisis kuis, dan rekap nilai.",
      bannerUrl: DEMO_IMAGES.pregnancy,
      accessCode: `DM${identity.digits}${Date.now().toString().slice(-4)}`,
      status: ModuleStatus.PUBLIK,
      estimatedMinutes: 90,
      objectives: {
        create: [
          {
            text: "Memahami tujuan pemeriksaan antenatal care.",
            order: 1,
          },
          {
            text: "Mengidentifikasi alat pemeriksaan kehamilan dasar.",
            order: 2,
          },
          {
            text: "Menjelaskan tahapan pemeriksaan secara sistematis.",
            order: 3,
          },
        ],
      },
    },
  });

  const materiOne = await createMateri({
    moduleId: demoModule.id,
    order: 1,
    title: "Pengenalan Pemeriksaan Antenatal Care",
    description:
      "Materi demo yang menjelaskan pengertian, tujuan, alat, dan alur dasar pemeriksaan kehamilan.",
    estimatedMinutes: 25,
    objectives: [
      "Menjelaskan pengertian pemeriksaan antenatal care.",
      "Menyebutkan alat yang diperlukan dalam pemeriksaan.",
      "Mengurutkan tahapan pemeriksaan dasar.",
    ],
    tools: ["Tensimeter", "Stetoskop", "Pita ukur LILA", "Doppler"],
  });

  const materiTwo = await createMateri({
    moduleId: demoModule.id,
    order: 2,
    title: "Tahapan Pemeriksaan Ibu Hamil",
    description:
      "Materi demo yang membahas tahapan pemeriksaan ibu hamil dari anamnesis hingga pemeriksaan fisik dasar.",
    estimatedMinutes: 30,
    objectives: [
      "Menjelaskan tahapan anamnesis singkat.",
      "Mengidentifikasi pemeriksaan fisik dasar pada ibu hamil.",
    ],
    tools: ["Buku KIA", "Timbangan", "Tensimeter", "Doppler"],
  });

  const kuis = await createKuis({
    moduleId: demoModule.id,
    order: 3,
    title: "Kuis Demo Pemeriksaan Kehamilan Dasar",
    description:
      "Kuis demo untuk menguji tampilan soal, pilihan jawaban, hasil kuis, dan rekap nilai.",
  });

  for (let index = 1; index <= 3; index += 1) {
    const student = await prisma.user.create({
      data: {
        name: `Mahasiswa Dummy ${identity.digits}-${index}`,
        email: `mahasiswa.dummy${identity.digits}${index}@edubidan.test`,
        password: passwordHash,
        role: Role.MAHASISWA,
        isActive: true,
        isDemo: true,
        demoCode: `${identity.demoCode}S${index}`,
        demoExpiresAt: expiresAt,
        mahasiswaProfile: {
          create: {
            npm: `97${identity.digits}${index}${randomDigits(6)}`,
          },
        },
        notifPreference: {
          create: {},
        },
      },
    });

    await prisma.enrollment.create({
      data: {
        userId: student.id,
        moduleId: demoModule.id,
      },
    });

    await prisma.lessonProgress.createMany({
      data: [
        {
          userId: student.id,
          materiId: materiOne.id,
          isCompleted: true,
          completedAt: new Date(),
        },
        {
          userId: student.id,
          materiId: materiTwo.id,
          isCompleted: index !== 3,
          completedAt: index !== 3 ? new Date() : null,
        },
      ],
      skipDuplicates: true,
    });

    await createCompletedAttempt({
      userId: student.id,
      kuisId: kuis.id,
      correctCount: index,
      durationSeconds: 300 + index * 60,
    });
  }

  await prisma.notification.create({
    data: {
      userId: dosenUser.id,
      moduleId: demoModule.id,
      type: NotificationType.MAHASISWA_BERGABUNG,
      title: "Data demo dosen siap digunakan",
      body: "Modul, materi, kuis, peserta, progres, dan hasil kuis dummy telah dibuat.",
      href: `/dashboard/lecturer/modules/${demoModule.id}`,
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: dosenUser.id,
      actionType: "GENERATE_DEMO_ACCOUNT",
      description: "Akun demo Dosen berhasil dibuat untuk usability testing.",
    },
  });

  return {
    email: identity.email,
    password: identity.password,
    role: "DOSEN",
    expiresAt,
  };
}

export async function createDemoAccount(role: DemoRole) {
  if (process.env.DEMO_ACCOUNT_ENABLED !== "true") {
    throw new Error("Fitur akun demo sedang tidak aktif.");
  }

  if (role === "MAHASISWA") {
    return createMahasiswaDemoAccount();
  }

  if (role === "DOSEN") {
    return createDosenDemoAccount();
  }

  throw new Error("Role demo tidak valid.");
}