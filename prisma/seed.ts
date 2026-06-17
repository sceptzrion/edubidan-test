import "dotenv/config";

import {
  ContentType,
  ModuleStatus,
  NotificationType,
  PrismaClient,
  Role,
  VideoSource,
} from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaMariaDb(databaseUrl);

const prisma = new PrismaClient({
  adapter,
  log: ["error", "warn"],
});

const DEFAULT_PASSWORD = "password123";

async function clearDatabase() {
  console.log("Cleaning old local seed data...");

  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.notifPreference.deleteMany();

  await prisma.attemptAnswer.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.soalOption.deleteMany();
  await prisma.soal.deleteMany();
  await prisma.kuis.deleteMany();

  await prisma.lessonProgress.deleteMany();
  await prisma.materiTool.deleteMany();
  await prisma.materiObjective.deleteMany();
  await prisma.materi.deleteMany();

  await prisma.moduleContent.deleteMany();
  await prisma.moduleObjective.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.module.deleteMany();

  await prisma.otpCode.deleteMany();
  await prisma.mahasiswaProfile.deleteMany();
  await prisma.dosenProfile.deleteMany();
  await prisma.user.deleteMany();
}

async function createMateri(params: {
  moduleId: number;
  order: number;
  title: string;
  description: string;
  videoUrl: string;
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
      videoUrl: params.videoUrl,
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
  timeLimitMinutes: number;
  questions: Array<{
    questionText: string;
    options: Array<{
      text: string;
      isCorrect: boolean;
    }>;
  }>;
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
      timeLimitMinutes: params.timeLimitMinutes,
      soals: {
        create: params.questions.map((question, questionIndex) => ({
          questionText: question.questionText,
          order: questionIndex + 1,
          options: {
            create: question.options.map((option, optionIndex) => ({
              text: option.text,
              isCorrect: option.isCorrect,
              order: optionIndex + 1,
            })),
          },
        })),
      },
    },
    include: {
      soals: {
        include: {
          options: {
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
      options: {
        orderBy: {
          order: "asc",
        },
      },
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

  return attempt;
}

async function main() {
  console.log("Start seeding EduBidan database...");

  await clearDatabase();

  const password = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin EduBidan",
      email: "admin@edubidan.id",
      password,
      role: Role.ADMIN,
      phoneNumber: "081200000001",
      isActive: true,
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
  });

  const dosenUser = await prisma.user.create({
    data: {
      name: "Dosen Kebidanan",
      email: "dosen.kebidanan@staff.unsika.ac.id",
      password,
      role: Role.DOSEN,
      phoneNumber: "081200000002",
      isActive: true,
      dosenProfile: {
        create: {
          nidnNip: "1987654321",
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
    throw new Error("Dosen profile gagal dibuat.");
  }

  const mahasiswaAisyah = await prisma.user.create({
    data: {
      name: "Siti Aisyah",
      email: "2310631170001@student.unsika.ac.id",
      password,
      role: Role.MAHASISWA,
      phoneNumber: "081200000003",
      isActive: true,
      mahasiswaProfile: {
        create: {
          npm: "2310631170001",
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

  const mahasiswaNadia = await prisma.user.create({
    data: {
      name: "Nadia Putri",
      email: "2310631170002@student.unsika.ac.id",
      password,
      role: Role.MAHASISWA,
      phoneNumber: "081200000004",
      isActive: true,
      mahasiswaProfile: {
        create: {
          npm: "2310631170002",
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

  const mahasiswaRina = await prisma.user.create({
    data: {
      name: "Rina Lestari",
      email: "2310631170003@student.unsika.ac.id",
      password,
      role: Role.MAHASISWA,
      phoneNumber: "081200000005",
      isActive: false,
      mahasiswaProfile: {
        create: {
          npm: "2310631170003",
        },
      },
      notifPreference: {
        create: {},
      },
    },
  });

  const moduleKehamilan = await prisma.module.create({
    data: {
      dosenProfileId: dosenUser.dosenProfile.id,
      title: "Pemeriksaan Kehamilan Dasar",
      description:
        "Modul video dan evaluasi dasar untuk memahami alur pemeriksaan antenatal care.",
      bannerUrl: "/images/modules/pemeriksaan-kehamilan.jpg",
      accessCode: "ANC001",
      status: ModuleStatus.PUBLIK,
      estimatedMinutes: 90,
      objectives: {
        create: [
          {
            text: "Mahasiswa memahami tujuan pemeriksaan antenatal care.",
            order: 1,
          },
          {
            text: "Mahasiswa mampu mengidentifikasi alat pemeriksaan kehamilan dasar.",
            order: 2,
          },
          {
            text: "Mahasiswa mampu menjelaskan tahapan pemeriksaan secara sistematis.",
            order: 3,
          },
        ],
      },
    },
  });

  const moduleBayi = await prisma.module.create({
    data: {
      dosenProfileId: dosenUser.dosenProfile.id,
      title: "Perawatan Bayi Baru Lahir",
      description:
        "Modul pembelajaran mengenai perawatan awal bayi baru lahir secara aman dan terstruktur.",
      bannerUrl: "/images/modules/perawatan-bayi-baru-lahir.jpg",
      accessCode: "BBL001",
      status: ModuleStatus.PUBLIK,
      estimatedMinutes: 75,
      objectives: {
        create: [
          {
            text: "Mahasiswa memahami prinsip dasar perawatan bayi baru lahir.",
            order: 1,
          },
          {
            text: "Mahasiswa mampu mengenali tahapan perawatan awal bayi baru lahir.",
            order: 2,
          },
        ],
      },
    },
  });

  const moduleMenyusui = await prisma.module.create({
    data: {
      dosenProfileId: dosenUser.dosenProfile.id,
      title: "Teknik Menyusui",
      description:
        "Modul pembelajaran mengenai teknik menyusui, posisi ibu dan bayi, serta pelekatan yang tepat.",
      bannerUrl: "/images/modules/teknik-menyusui.jpg",
      accessCode: "ASI001",
      status: ModuleStatus.PUBLIK,
      estimatedMinutes: 60,
      objectives: {
        create: [
          {
            text: "Mahasiswa memahami prinsip dasar teknik menyusui yang benar.",
            order: 1,
          },
          {
            text: "Mahasiswa mampu menjelaskan posisi dan pelekatan bayi saat menyusui.",
            order: 2,
          },
        ],
      },
    },
  });

  const moduleDraft = await prisma.module.create({
    data: {
      dosenProfileId: dosenUser.dosenProfile.id,
      title: "Modul Draft Simulasi",
      description:
        "Modul draft untuk menguji status publikasi pada dashboard dosen dan admin.",
      accessCode: "DRAFT001",
      status: ModuleStatus.DRAFT,
      estimatedMinutes: 30,
    },
  });

  const materiKehamilanOne = await createMateri({
    moduleId: moduleKehamilan.id,
    order: 1,
    title: "Pengenalan Pemeriksaan Antenatal Care",
    description:
      "Materi ini menjelaskan pengertian, tujuan, alat, dan alur dasar pemeriksaan kehamilan.",
    videoUrl: "https://www.youtube.com/embed/example-anc-1",
    estimatedMinutes: 25,
    objectives: [
      "Menjelaskan pengertian pemeriksaan antenatal care.",
      "Menyebutkan alat yang diperlukan dalam pemeriksaan.",
      "Mengurutkan tahapan pemeriksaan dasar.",
    ],
    tools: ["Tensimeter", "Stetoskop", "Pita ukur LILA", "Doppler"],
  });

  const materiKehamilanTwo = await createMateri({
    moduleId: moduleKehamilan.id,
    order: 2,
    title: "Tahapan Pemeriksaan Ibu Hamil",
    description:
      "Materi ini membahas tahapan pemeriksaan ibu hamil mulai dari anamnesis hingga pemeriksaan fisik dasar.",
    videoUrl: "https://www.youtube.com/embed/example-anc-2",
    estimatedMinutes: 30,
    objectives: [
      "Menjelaskan tahapan anamnesis singkat.",
      "Mengidentifikasi pemeriksaan fisik dasar pada ibu hamil.",
    ],
    tools: ["Buku KIA", "Timbangan", "Tensimeter", "Doppler"],
  });

  const kuisKehamilan = await createKuis({
    moduleId: moduleKehamilan.id,
    order: 3,
    title: "Kuis Pemeriksaan Kehamilan Dasar",
    description:
      "Kuis singkat untuk mengukur pemahaman mahasiswa terhadap materi pemeriksaan kehamilan dasar.",
    timeLimitMinutes: 10,
    questions: [
      {
        questionText:
          "Apa tujuan utama pemeriksaan antenatal care pada ibu hamil?",
        options: [
          {
            text: "Memantau kondisi ibu dan janin selama kehamilan.",
            isCorrect: true,
          },
          {
            text: "Menggantikan seluruh proses persalinan.",
            isCorrect: false,
          },
          {
            text: "Menentukan jenis kelamin bayi secara pasti.",
            isCorrect: false,
          },
          {
            text: "Menghindari seluruh pemeriksaan laboratorium.",
            isCorrect: false,
          },
        ],
      },
      {
        questionText:
          "Alat apa yang dapat digunakan untuk memantau denyut jantung janin?",
        options: [
          {
            text: "Doppler.",
            isCorrect: true,
          },
          {
            text: "Termometer ruangan.",
            isCorrect: false,
          },
          {
            text: "Timbangan bayi.",
            isCorrect: false,
          },
          {
            text: "Penggaris biasa.",
            isCorrect: false,
          },
        ],
      },
      {
        questionText:
          "Data identitas dan keluhan ibu hamil umumnya dikumpulkan pada tahap apa?",
        options: [
          {
            text: "Anamnesis.",
            isCorrect: true,
          },
          {
            text: "Sterilisasi alat.",
            isCorrect: false,
          },
          {
            text: "Pencatatan nilai akhir.",
            isCorrect: false,
          },
          {
            text: "Evaluasi aplikasi.",
            isCorrect: false,
          },
        ],
      },
    ],
  });

  await createMateri({
    moduleId: moduleBayi.id,
    order: 1,
    title: "Prinsip Perawatan Bayi Baru Lahir",
    description:
      "Materi ini membahas prinsip awal perawatan bayi baru lahir, termasuk menjaga kehangatan dan observasi kondisi bayi.",
    videoUrl: "https://www.youtube.com/embed/example-bbl-1",
    estimatedMinutes: 25,
    objectives: [
      "Menjelaskan prinsip dasar perawatan bayi baru lahir.",
      "Mengidentifikasi kebutuhan awal bayi baru lahir.",
    ],
    tools: ["Kain bersih", "Selimut bayi", "Termometer"],
  });

  await createMateri({
    moduleId: moduleBayi.id,
    order: 2,
    title: "Observasi Awal Bayi Baru Lahir",
    description:
      "Materi ini menjelaskan observasi awal kondisi bayi baru lahir secara sederhana dan terstruktur.",
    videoUrl: "https://www.youtube.com/embed/example-bbl-2",
    estimatedMinutes: 20,
    objectives: [
      "Menjelaskan komponen observasi awal bayi baru lahir.",
      "Mengenali kondisi yang perlu diperhatikan pada bayi baru lahir.",
    ],
    tools: ["Jam", "Termometer", "Lembar observasi"],
  });

  await createKuis({
    moduleId: moduleBayi.id,
    order: 3,
    title: "Kuis Perawatan Bayi Baru Lahir",
    description:
      "Kuis untuk menguji pemahaman dasar mengenai perawatan bayi baru lahir.",
    timeLimitMinutes: 10,
    questions: [
      {
        questionText:
          "Salah satu prinsip awal perawatan bayi baru lahir adalah...",
        options: [
          {
            text: "Menjaga kehangatan bayi.",
            isCorrect: true,
          },
          {
            text: "Memandikan bayi secepat mungkin tanpa observasi.",
            isCorrect: false,
          },
          {
            text: "Mengabaikan tanda vital bayi.",
            isCorrect: false,
          },
          {
            text: "Tidak melakukan pencatatan.",
            isCorrect: false,
          },
        ],
      },
      {
        questionText:
          "Alat yang dapat digunakan untuk memantau suhu bayi adalah...",
        options: [
          {
            text: "Termometer.",
            isCorrect: true,
          },
          {
            text: "Doppler.",
            isCorrect: false,
          },
          {
            text: "Pita LILA.",
            isCorrect: false,
          },
          {
            text: "Stetoskop janin.",
            isCorrect: false,
          },
        ],
      },
    ],
  });

  await createMateri({
    moduleId: moduleMenyusui.id,
    order: 1,
    title: "Dasar Teknik Menyusui",
    description:
      "Materi ini membahas konsep dasar teknik menyusui, kenyamanan ibu, dan posisi bayi.",
    videoUrl: "https://www.youtube.com/embed/example-asi-1",
    estimatedMinutes: 25,
    objectives: [
      "Menjelaskan prinsip dasar teknik menyusui.",
      "Mengidentifikasi posisi ibu dan bayi yang nyaman.",
    ],
    tools: ["Kursi nyaman", "Bantal menyusui", "Media edukasi"],
  });

  await createMateri({
    moduleId: moduleMenyusui.id,
    order: 2,
    title: "Pelekatan Bayi Saat Menyusui",
    description:
      "Materi ini menjelaskan tanda pelekatan bayi yang baik saat menyusui.",
    videoUrl: "https://www.youtube.com/embed/example-asi-2",
    estimatedMinutes: 20,
    objectives: [
      "Menjelaskan tanda pelekatan bayi yang tepat.",
      "Mengenali masalah umum pada proses menyusui.",
    ],
    tools: ["Bantal menyusui", "Poster edukasi"],
  });

  await createKuis({
    moduleId: moduleMenyusui.id,
    order: 3,
    title: "Kuis Teknik Menyusui",
    description:
      "Kuis untuk mengukur pemahaman mahasiswa mengenai teknik menyusui dan pelekatan bayi.",
    timeLimitMinutes: 10,
    questions: [
      {
        questionText:
          "Salah satu tanda pelekatan bayi yang baik saat menyusui adalah...",
        options: [
          {
            text: "Bayi melekat dengan nyaman dan ibu tidak merasa nyeri berlebihan.",
            isCorrect: true,
          },
          {
            text: "Bayi selalu menangis selama menyusu.",
            isCorrect: false,
          },
          {
            text: "Ibu harus selalu berdiri saat menyusui.",
            isCorrect: false,
          },
          {
            text: "Tidak perlu memperhatikan posisi bayi.",
            isCorrect: false,
          },
        ],
      },
      {
        questionText:
          "Alat bantu yang dapat digunakan untuk meningkatkan kenyamanan menyusui adalah...",
        options: [
          {
            text: "Bantal menyusui.",
            isCorrect: true,
          },
          {
            text: "Tensimeter.",
            isCorrect: false,
          },
          {
            text: "Doppler.",
            isCorrect: false,
          },
          {
            text: "Termometer ruangan.",
            isCorrect: false,
          },
        ],
      },
    ],
  });

  const activeStudents = [mahasiswaAisyah, mahasiswaNadia];
  const publicModules = [moduleKehamilan, moduleBayi, moduleMenyusui];

  for (const student of activeStudents) {
    for (const publicModule of publicModules) {
      await prisma.enrollment.create({
        data: {
          userId: student.id,
          moduleId: publicModule.id,
        },
      });
    }
  }

  await prisma.lessonProgress.createMany({
    data: [
      {
        userId: mahasiswaAisyah.id,
        materiId: materiKehamilanOne.id,
        isCompleted: true,
        completedAt: new Date(),
      },
      {
        userId: mahasiswaAisyah.id,
        materiId: materiKehamilanTwo.id,
        isCompleted: true,
        completedAt: new Date(),
      },
      {
        userId: mahasiswaNadia.id,
        materiId: materiKehamilanOne.id,
        isCompleted: true,
        completedAt: new Date(),
      },
    ],
  });

  await createCompletedAttempt({
    userId: mahasiswaAisyah.id,
    kuisId: kuisKehamilan.id,
    correctCount: 3,
    durationSeconds: 420,
  });

  await createCompletedAttempt({
    userId: mahasiswaNadia.id,
    kuisId: kuisKehamilan.id,
    correctCount: 2,
    durationSeconds: 510,
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: mahasiswaAisyah.id,
        moduleId: moduleKehamilan.id,
        type: NotificationType.MATERI_BARU,
        title: "Materi baru tersedia",
        body: "Materi Pemeriksaan Kehamilan Dasar sudah dapat dipelajari.",
        href: `/dashboard/modules/${moduleKehamilan.id}`,
      },
      {
        userId: mahasiswaNadia.id,
        moduleId: moduleKehamilan.id,
        type: NotificationType.HASIL_KUIS,
        title: "Hasil kuis tersedia",
        body: "Hasil Kuis Pemeriksaan Kehamilan Dasar sudah tersedia.",
        href: `/dashboard/modules/${moduleKehamilan.id}`,
      },
      {
        userId: dosenUser.id,
        moduleId: moduleKehamilan.id,
        type: NotificationType.KUIS_DIKERJAKAN,
        title: "Kuis telah dikerjakan",
        body: "Mahasiswa telah mengerjakan Kuis Pemeriksaan Kehamilan Dasar.",
        href: `/dashboard/lecturer/modules/${moduleKehamilan.id}`,
      },
      {
        userId: admin.id,
        moduleId: moduleDraft.id,
        type: NotificationType.MODUL_DIPUBLIKASI,
        title: "Modul draft tersedia",
        body: "Modul Draft Simulasi tersedia untuk pengujian status modul.",
        href: `/dashboard/admin`,
      },
    ],
  });

  await prisma.activityLog.createMany({
    data: [
      {
        userId: admin.id,
        actionType: "SEED_DATABASE",
        description: "Seed data EduBidan sesuai flow aplikasi berhasil dijalankan.",
      },
      {
        userId: dosenUser.id,
        actionType: "PUBLISH_MODULE",
        description: "Dosen mempublikasikan tiga modul pembelajaran utama.",
      },
      {
        userId: mahasiswaRina.id,
        actionType: "DEACTIVATE_USER",
        description: "Akun mahasiswa Rina Lestari disiapkan sebagai contoh user nonaktif.",
      },
    ],
  });

  console.log("Seeding completed successfully.");
  console.table([
    {
      role: "ADMIN",
      email: admin.email,
      password: DEFAULT_PASSWORD,
    },
    {
      role: "DOSEN",
      email: dosenUser.email,
      password: DEFAULT_PASSWORD,
    },
    {
      role: "MAHASISWA",
      email: mahasiswaAisyah.email,
      password: DEFAULT_PASSWORD,
    },
    {
      role: "MAHASISWA",
      email: mahasiswaNadia.email,
      password: DEFAULT_PASSWORD,
    },
    {
      role: "MAHASISWA_NONAKTIF",
      email: mahasiswaRina.email,
      password: DEFAULT_PASSWORD,
    },
  ]);
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });