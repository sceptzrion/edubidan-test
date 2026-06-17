import {
  Baby,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Heart,
  PlayCircle,
  Shield,
  Star,
  Stethoscope,
  UserPlus,
  Video,
} from "lucide-react";

export const landingImages = {
  hero:
    "https://images.unsplash.com/photo-1645684922842-87793d0b25df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  pregnancy:
    "https://images.unsplash.com/photo-1632053651899-3389100579fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  newborn:
    "https://images.unsplash.com/photo-1701557774684-a5d563c46c1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  breastfeeding:
    "https://images.unsplash.com/photo-1632053002434-b203dc8efb37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
};

export const aboutHighlights = [
  {
    icon: Shield,
    title: "Fokus Pembelajaran",
    description:
      "Menyediakan ruang belajar digital untuk membantu mahasiswa kebidanan mengulas materi dasar secara lebih terarah.",
  },
  {
    icon: Heart,
    title: "Pendamping Akademik",
    description:
      "Dirancang sebagai media pendamping, bukan pengganti pembelajaran kelas maupun praktik laboratorium kebidanan.",
  },
  {
    icon: Star,
    title: "Evaluasi Mandiri",
    description:
      "Menyediakan kuis evaluasi agar mahasiswa dapat mengukur pemahaman setelah mempelajari materi video.",
  },
];

export const topicHighlights = [
  {
    img: landingImages.pregnancy,
    icon: Stethoscope,
    title: "Pemeriksaan Kehamilan",
    desc: "Materi dasar mengenai pemeriksaan antenatal, anamnesis, pengamatan kondisi ibu hamil, dan tanda bahaya kehamilan.",
    lessons: "Materi Video",
    duration: "Kuis Evaluasi",
  },
  {
    img: landingImages.newborn,
    icon: Baby,
    title: "Perawatan Bayi Baru Lahir",
    desc: "Pembelajaran mengenai prinsip perawatan awal bayi baru lahir, menjaga kehangatan, IMD, dan perawatan tali pusat.",
    lessons: "Materi Video",
    duration: "Kuis Evaluasi",
  },
  {
    img: landingImages.breastfeeding,
    icon: Heart,
    title: "Teknik Menyusui",
    desc: "Materi ringkas mengenai posisi menyusui, perlekatan bayi, dan edukasi dasar pemberian ASI secara efektif.",
    lessons: "Materi Video",
    duration: "Kuis Evaluasi",
  },
];

export const learningSteps = [
  {
    icon: UserPlus,
    title: "1. Buat Akun",
    desc: "Daftar sebagai mahasiswa dan masuk ke dashboard pembelajaran EduBidan.",
  },
  {
    icon: PlayCircle,
    title: "2. Pelajari Materi",
    desc: "Buka modul yang diikuti, lalu pelajari materi video dan ringkasan pembelajaran.",
  },
  {
    icon: ClipboardCheck,
    title: "3. Kerjakan Kuis",
    desc: "Kerjakan kuis evaluasi untuk mengukur pemahaman terhadap materi yang telah dipelajari.",
  },
  {
    icon: CheckCircle2,
    title: "4. Lihat Hasil",
    desc: "Tinjau skor dan jawaban sebagai bahan refleksi untuk memperbaiki pemahaman materi.",
  },
];

export const landingFaqs = [
  {
    question: "Apakah EduBidan berbayar?",
    answer:
      "Tidak. EduBidan dikembangkan sebagai purwarupa platform pembelajaran untuk keperluan akademik, sehingga akses pada versi awal ini tidak berbayar.",
  },
  {
    question: "Siapa pengguna utama EduBidan?",
    answer:
      "Pengguna utama EduBidan adalah mahasiswa kebidanan. Dosen berperan mengelola modul, materi, dan kuis, sedangkan admin mengelola pengguna sistem.",
  },
  {
    question: "Apakah EduBidan menyediakan sertifikat?",
    answer:
      "Tidak untuk versi awal. EduBidan difokuskan pada modul pembelajaran, materi video, progres belajar, kuis evaluasi, dan rekap nilai.",
  },
  {
    question: "Apakah materi bisa diakses offline?",
    answer:
      "Belum untuk versi awal. Pengguna membutuhkan koneksi internet untuk mengakses materi, menonton video, dan mengerjakan kuis evaluasi.",
  },
];

export const heroBadges = [
  { icon: BookOpen, label: "Modul Pembelajaran" },
  { icon: Video, label: "Materi Video" },
  { icon: GraduationCap, label: "Kuis Evaluasi" },
];