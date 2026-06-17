import type { LearningItem, LearningModule } from "@/types/learning";

export const learningModules: LearningModule[] = [
  {
    id: 1,
    title: "Pemeriksaan Kehamilan Dasar",
    description:
      "Modul pembelajaran pemeriksaan antenatal dasar, mulai dari anamnesis, pemeriksaan fisik, hingga edukasi tanda bahaya kehamilan.",
    banner:
      "https://images.unsplash.com/photo-1559757175-5700dde675bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    thumbnail:
      "https://images.unsplash.com/photo-1632053651899-3389100579fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    progress: 75,
    estimatedTime: "120 Menit",
    instructor: {
      name: "Dr. Rina Hartati, M.Keb",
      email: "rina.hartati@staff.unsika.ac.id",
    },
    objectives: [
      "Memahami konsep dasar pemeriksaan antenatal pada ibu hamil",
      "Mampu menjelaskan tahapan anamnesis kehamilan",
      "Mengenali tanda bahaya kehamilan yang membutuhkan rujukan",
      "Memahami dokumentasi hasil pemeriksaan kehamilan secara sistematis",
    ],
    participants: [
      { id: 1, name: "Sari Dewi", email: "sari.dewi@student.unsika.ac.id" },
      { id: 2, name: "Anisa Putri", email: "anisa.putri@student.unsika.ac.id" },
      { id: 3, name: "Rina Lestari", email: "rina.lestari@student.unsika.ac.id" },
      { id: 4, name: "Maya Sari", email: "maya.sari@student.unsika.ac.id" },
    ],
    items: [
      {
        id: 1,
        kind: "materi",
        title: "Pengantar Antenatal Care",
        description:
          "Materi ini membahas tujuan, ruang lingkup, dan alur dasar pemeriksaan antenatal pada ibu hamil.",
        duration: "12 Menit",
        estimatedMinutes: 12,
        isCompleted: true,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1632053651899-3389100579fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        objectives: [
          "Memahami tujuan pemeriksaan antenatal",
          "Menjelaskan alur pemeriksaan dasar ibu hamil",
          "Mengidentifikasi manfaat pemeriksaan rutin selama kehamilan",
        ],
        tools: ["Buku KIA", "Form pemeriksaan", "Alat tulis"],
      },
      {
        id: 2,
        kind: "materi",
        title: "Anamnesis Ibu Hamil",
        description:
          "Materi ini menjelaskan tahapan pengumpulan informasi awal dari ibu hamil secara sistematis.",
        duration: "15 Menit",
        estimatedMinutes: 15,
        isCompleted: true,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1632053651899-3389100579fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        objectives: [
          "Mengetahui komponen penting anamnesis",
          "Mampu mengidentifikasi keluhan utama ibu hamil",
          "Mampu mencatat riwayat kehamilan dengan benar",
        ],
        tools: ["Form anamnesis", "Buku KIA"],
      },
      {
        id: 3,
        kind: "kuis",
        title: "Kuis Pemahaman Pemeriksaan Kehamilan",
        description:
          "Kuis ini digunakan untuk mengukur pemahaman awal mahasiswa mengenai pemeriksaan kehamilan dasar.",
        duration: "15 Menit",
        estimatedMinutes: 15,
        timeLimitMinutes: 15,
        isCompleted: false,
        questions: [
          {
            id: 1,
            question: "Apa tujuan utama pemeriksaan antenatal pada ibu hamil?",
            options: [
              "Menentukan jenis kelamin janin",
              "Memantau kesehatan ibu dan janin",
              "Mengganti pemeriksaan laboratorium",
              "Menentukan metode persalinan sejak awal",
            ],
            correct: 1,
          },
          {
            id: 2,
            question: "Data apa yang penting dikumpulkan saat anamnesis ibu hamil?",
            options: [
              "Riwayat kehamilan dan keluhan utama",
              "Hobi pasien",
              "Warna pakaian pasien",
              "Jenis makanan favorit",
            ],
            correct: 0,
          },
          {
            id: 3,
            question: "Apa contoh tanda bahaya kehamilan yang perlu dirujuk?",
            options: [
              "Mual ringan pada pagi hari",
              "Perdarahan pervaginam",
              "Sering buang air kecil",
              "Nafsu makan meningkat",
            ],
            correct: 1,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Perawatan Bayi Baru Lahir",
    description:
      "Modul pembelajaran mengenai perawatan awal bayi baru lahir, termasuk menjaga kehangatan, IMD, dan perawatan tali pusat.",
    banner:
      "https://images.unsplash.com/photo-1701557774684-a5d563c46c1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    thumbnail:
      "https://images.unsplash.com/photo-1701557774684-a5d563c46c1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    progress: 45,
    estimatedTime: "90 Menit",
    instructor: {
      name: "Rina Melati, S.ST., M.Kes",
      email: "rina.melati@staff.unsika.ac.id",
    },
    objectives: [
      "Memahami prinsip dasar perawatan bayi baru lahir",
      "Mengetahui langkah menjaga kehangatan bayi",
      "Memahami perawatan tali pusat secara aman",
    ],
    participants: [
      { id: 1, name: "Sari Dewi", email: "sari.dewi@student.unsika.ac.id" },
      { id: 2, name: "Nita Suryani", email: "nita.suryani@student.unsika.ac.id" },
    ],
    items: [
      {
        id: 1,
        kind: "materi",
        title: "Prinsip Perawatan Bayi Baru Lahir",
        description:
          "Materi ini membahas prinsip dasar perawatan bayi baru lahir pada fase awal setelah persalinan.",
        duration: "14 Menit",
        estimatedMinutes: 14,
        isCompleted: false,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1701557774684-a5d563c46c1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        objectives: [
          "Memahami prinsip perawatan awal bayi",
          "Menjelaskan pentingnya menjaga kehangatan bayi",
          "Mengetahui prinsip kebersihan dalam perawatan bayi",
        ],
        tools: ["Kain bersih", "Sarung tangan", "Klem tali pusat"],
      },
      {
        id: 2,
        kind: "kuis",
        title: "Kuis Perawatan Bayi Baru Lahir",
        description:
          "Kuis ini digunakan untuk mengevaluasi pemahaman mahasiswa terkait perawatan awal bayi baru lahir.",
        duration: "15 Menit",
        estimatedMinutes: 15,
        timeLimitMinutes: 15,
        isCompleted: false,
        questions: [
          {
            id: 1,
            question:
              "Apa salah satu prinsip penting dalam perawatan bayi baru lahir?",
            options: [
              "Segera memandikan bayi",
              "Menjaga kehangatan bayi",
              "Memberikan makanan padat",
              "Memisahkan bayi dari ibu",
            ],
            correct: 1,
          },
          {
            id: 2,
            question:
              "Apa tujuan utama perawatan tali pusat yang benar?",
            options: [
              "Mencegah infeksi",
              "Mempercepat bayi tidur",
              "Mengurangi kebutuhan ASI",
              "Meningkatkan berat badan secara langsung",
            ],
            correct: 0,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Teknik Menyusui Efektif",
    description:
      "Modul pembelajaran mengenai posisi menyusui, perlekatan bayi, dan edukasi dasar pemberian ASI.",
    banner:
      "https://images.unsplash.com/photo-1632053002434-b203dc8efb37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    thumbnail:
      "https://images.unsplash.com/photo-1632053002434-b203dc8efb37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    progress: 20,
    estimatedTime: "75 Menit",
    instructor: {
      name: "Nia Kurniawati, Amd.Keb",
      email: "nia.kurniawati@staff.unsika.ac.id",
    },
    objectives: [
      "Memahami posisi menyusui yang benar",
      "Mengetahui tanda perlekatan bayi yang baik",
      "Mengenali kendala umum dalam proses menyusui",
    ],
    participants: [
      { id: 1, name: "Maya Sari", email: "maya.sari@student.unsika.ac.id" },
      { id: 2, name: "Dewi Anggraini", email: "dewi.anggraini@student.unsika.ac.id" },
    ],
    items: [
      {
        id: 1,
        kind: "materi",
        title: "Posisi dan Perlekatan Menyusui",
        description:
          "Materi ini menjelaskan posisi ibu dan bayi serta teknik perlekatan yang benar saat menyusui.",
        duration: "13 Menit",
        estimatedMinutes: 13,
        isCompleted: false,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1632053002434-b203dc8efb37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        objectives: [
          "Memahami posisi menyusui yang nyaman",
          "Mengetahui tanda perlekatan yang benar",
          "Mengenali tanda bayi menyusu efektif",
        ],
        tools: ["Boneka bayi", "Bantal menyusui"],
      },
      {
        id: 2,
        kind: "kuis",
        title: "Kuis Teknik Menyusui",
        description:
          "Kuis ini mengukur pemahaman mahasiswa mengenai posisi dan perlekatan saat menyusui.",
        duration: "15 Menit",
        estimatedMinutes: 15,
        timeLimitMinutes: 15,
        isCompleted: false,
        questions: [
          {
            id: 1,
            question: "Apa tanda perlekatan menyusui yang baik?",
            options: [
              "Bayi hanya mengisap ujung puting",
              "Mulut bayi terbuka lebar dan melekat pada areola",
              "Ibu merasa nyeri terus-menerus",
              "Bayi sering terlepas setiap beberapa detik",
            ],
            correct: 1,
          },
        ],
      },
    ],
  },
];

export function getLearningModule(moduleId: number) {
  return learningModules.find((learningModule) => learningModule.id === moduleId) ?? null;
}

export function getLearningItem(moduleId: number, itemId: number) {
  const learningModule = getLearningModule(moduleId);

  if (!learningModule) return null;

  const itemIndex = learningModule.items.findIndex((item) => item.id === itemId);
  const item = learningModule.items[itemIndex];

  if (!item) return null;

  return {
    module: learningModule,
    item,
    itemIndex,
    previousItem: learningModule.items[itemIndex - 1] ?? null,
    nextItem: learningModule.items[itemIndex + 1] ?? null,
  };
}

export function getModuleContentSummary(items: LearningItem[]) {
  const materialCount = items.filter((item) => item.kind === "materi").length;
  const quizCount = items.filter((item) => item.kind === "kuis").length;

  return `${materialCount} Materi, ${quizCount} Kuis`;
}

export function getModuleItemCounts(items: LearningItem[]) {
  const materialCount = items.filter((item) => item.kind === "materi").length;
  const quizCount = items.filter((item) => item.kind === "kuis").length;

  return {
    materialCount,
    quizCount,
  };
}

export function getStudentModuleCards() {
  return learningModules.map((module) => {
    const { materialCount, quizCount } = getModuleItemCounts(module.items);

    return {
      id: module.id,
      title: module.title,
      desc: module.description,
      img: module.thumbnail,
      progress: module.progress,
      lessons: materialCount,
      quizzes: quizCount,
      duration: module.estimatedTime,
      instructor: module.instructor.name,
    };
  });
}

export function toModulePlaylistItem(item: LearningItem) {
  return {
    id: item.id,
    kind: item.kind,
    title: item.title,
    duration:
      item.kind === "kuis"
        ? `${item.questions?.length ?? 0} Soal • ${
            item.timeLimitMinutes ?? item.estimatedMinutes
          } Menit`
        : item.duration,
    objectivesCount: item.objectives?.length ?? 0,
    toolsCount: item.tools?.length ?? 0,
    isCompleted: item.isCompleted,
  };
}

export function toModuleTaskItem(item: LearningItem) {
  return {
    id: item.id,
    title: item.title,
    duration: `${item.questions?.length ?? 0} Soal • ${
      item.timeLimitMinutes ?? item.estimatedMinutes
    } Menit`,
    isCompleted: item.isCompleted,
    score: item.latestScore,
  };
}

export function toLessonPlaylistItem(item: LearningItem) {
  return {
    id: item.id,
    kind: item.kind,
    title: item.title,
    duration:
      item.kind === "kuis"
        ? `${item.timeLimitMinutes ?? item.estimatedMinutes} Menit`
        : item.duration,
    completed: item.isCompleted,
  };
}