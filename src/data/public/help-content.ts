import { siteConfig } from "@/config/site";

import {
  BookOpen,
  ClipboardCheck,
  HelpCircle,
  Settings,
  UserCircle,
} from "lucide-react";

export const helpCategories = [
  {
    id: "Semua",
    icon: HelpCircle,
    title: "Semua",
  },
  {
    id: "Akun",
    icon: UserCircle,
    title: "Akun",
  },
  {
    id: "Modul",
    icon: BookOpen,
    title: "Modul",
  },
  {
    id: "Kuis",
    icon: ClipboardCheck,
    title: "Kuis",
  },
  {
    id: "Teknis",
    icon: Settings,
    title: "Teknis",
  },
] as const;

export const helpFaqs = [
  {
    category: "Akun",
    q: "Siapa yang bisa mendaftar mandiri di EduBidan?",
    a: "Pendaftaran mandiri hanya tersedia untuk mahasiswa. Akun dosen dan admin dibuat melalui pengelolaan pengguna oleh admin.",
  },
  {
    category: "Akun",
    q: "Format email apa yang digunakan mahasiswa?",
    a: "Mahasiswa menggunakan format email npm@student.unsika.ac.id. Format ini membantu sistem mengenali akun sebagai mahasiswa.",
  },
  {
    category: "Akun",
    q: "Bagaimana jika saya lupa kata sandi?",
    a: "Gunakan menu Lupa Kata Sandi pada halaman login. Sistem akan meminta email terdaftar, kode OTP, lalu kata sandi baru.",
  },
  {
    category: "Akun",
    q: "Apakah NPM dan email bisa diubah?",
    a: "Tidak. NPM dan email berfungsi sebagai identitas utama akun mahasiswa, sehingga tidak dapat diubah secara mandiri.",
  },
  {
    category: "Modul",
    q: "Bagaimana cara mengakses modul pembelajaran?",
    a: "Setelah login, buka menu Modul. Sistem akan menampilkan daftar modul yang sudah diikuti oleh mahasiswa.",
  },
  {
    category: "Modul",
    q: "Bagaimana cara bergabung ke modul baru?",
    a: "Mahasiswa dapat menekan tombol Gabung Modul lalu memasukkan kode modul yang diberikan oleh dosen atau instruktur.",
  },
  {
    category: "Modul",
    q: "Apakah modul dikelompokkan berdasarkan kategori?",
    a: "Tidak. Pada versi awal, EduBidan tidak menyediakan fitur kategori atau filter modul. Tiga topik materi digunakan sebagai batasan isi pembelajaran, bukan fitur navigasi.",
  },
  {
    category: "Modul",
    q: "Apa saja yang tampil di detail modul?",
    a: "Detail modul menampilkan banner, progres belajar, deskripsi, estimasi waktu, jumlah materi dan kuis, instruktur, tujuan pembelajaran, daftar pembelajaran, kuis evaluasi, dan peserta.",
  },
  {
    category: "Modul",
    q: "Apakah materi harus dipelajari berurutan?",
    a: "Urutan materi dan kuis mengikuti susunan yang dibuat oleh dosen. Mahasiswa disarankan mengikuti urutan tersebut agar pemahaman lebih terstruktur.",
  },
  {
    category: "Kuis",
    q: "Bagaimana cara mengerjakan kuis?",
    a: "Buka detail modul, pilih kuis pada daftar pembelajaran atau tab Kuis & Evaluasi, lalu tekan tombol mulai pada halaman persiapan kuis.",
  },
  {
    category: "Kuis",
    q: "Apakah kuis memiliki batas waktu?",
    a: "Kuis dapat memiliki batas waktu apabila dosen menetapkannya. Jika ada, informasi batas waktu akan tampil sebelum kuis dimulai.",
  },
  {
    category: "Kuis",
    q: "Apakah hasil kuis langsung terlihat?",
    a: "Ya. Setelah mahasiswa menekan submit, sistem menampilkan skor kuis dan opsi untuk meninjau jawaban.",
  },
  {
    category: "Kuis",
    q: "Apakah nilai kuis dianggap sertifikasi?",
    a: "Tidak. Nilai kuis digunakan sebagai evaluasi pembelajaran dan indikator pemahaman, bukan sertifikasi kompetensi resmi.",
  },
  {
    category: "Kuis",
    q: "Siapa yang dapat melihat nilai kuis?",
    a: "Nilai kuis dapat dilihat oleh mahasiswa terkait, dosen pengampu modul, dan admin sesuai kebutuhan pengelolaan sistem.",
  },
  {
    category: "Teknis",
    q: "Apakah EduBidan bisa digunakan offline?",
    a: "Belum untuk versi awal. Pengguna membutuhkan koneksi internet untuk mengakses materi, video pembelajaran, dan kuis evaluasi.",
  },
  {
    category: "Teknis",
    q: "Browser apa yang direkomendasikan?",
    a: "Gunakan Google Chrome, Microsoft Edge, Firefox, atau Safari versi terbaru agar tampilan dan fitur berjalan optimal.",
  },
  {
    category: "Teknis",
    q: "Mengapa video tidak muncul atau tidak bisa diputar?",
    a: "Pastikan koneksi internet stabil dan browser tidak memblokir konten embed. Jika video berasal dari tautan eksternal, pastikan layanan tersebut dapat diakses.",
  },
  {
    category: "Teknis",
    q: "Bagaimana cara melaporkan bug?",
    a: `Laporkan kendala melalui email ${siteConfig.contact.email} dengan menyertakan deskripsi masalah, perangkat yang digunakan, dan halaman yang bermasalah.`,
  },
];