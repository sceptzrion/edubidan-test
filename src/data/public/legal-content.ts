import { siteConfig } from "@/config/site";

export const privacySections = [
  {
    title: "1. Informasi yang Dikumpulkan",
    content:
      "EduBidan mengumpulkan data dasar yang diperlukan untuk menjalankan fitur pembelajaran, seperti nama lengkap, NPM, email, nomor telepon opsional, foto profil opsional, progres belajar, hasil kuis, dan aktivitas penggunaan sistem.",
  },
  {
    title: "2. Penggunaan Informasi",
    content:
      "Data digunakan untuk mengelola akun, menampilkan modul yang diikuti, menyimpan progres belajar, menampilkan hasil kuis, serta mendukung rekap nilai yang dapat dilihat oleh mahasiswa, dosen pengampu, dan admin sesuai peran masing-masing.",
  },
  {
    title: "3. Perlindungan Data",
    content:
      "EduBidan berupaya menerapkan praktik keamanan dasar seperti pembatasan akses berdasarkan peran. Pada implementasi backend, kata sandi pengguna harus disimpan dalam bentuk hash, bukan teks asli.",
  },
  {
    title: "4. Berbagi Informasi",
    content:
      "Data pengguna tidak dijual atau disewakan kepada pihak ketiga. Akses data hanya digunakan untuk kebutuhan operasional sistem, evaluasi pembelajaran, pengujian purwarupa, dan penyusunan laporan akademik.",
  },
  {
    title: "5. Cookie dan Penyimpanan Lokal",
    content:
      "Sistem dapat menggunakan cookie atau penyimpanan lokal untuk menjaga sesi login dan menyimpan preferensi tampilan seperti mode terang atau gelap.",
  },
  {
    title: "6. Hak Pengguna",
    content:
      "Pengguna dapat memperbarui data profil tertentu dan meminta bantuan admin untuk perubahan atau penghapusan data yang tidak dapat diubah secara mandiri.",
  },
  {
    title: "7. Retensi Data",
    content:
      "Data disimpan selama masa pengujian dan pengembangan purwarupa. Setelah kebutuhan akademik selesai, data dapat dibersihkan sesuai kebijakan pengembang.",
  },
  {
    title: "8. Kontak",
    content: `Pertanyaan atau permintaan terkait privasi dapat dikirimkan melalui email ${siteConfig.contact.email}.`,
  },
];

export const termsSections = [
  {
    title: "1. Ketentuan Umum",
    content:
      "Dengan menggunakan EduBidan, pengguna menyetujui bahwa platform ini merupakan purwarupa media pembelajaran kebidanan digital untuk keperluan akademik.",
  },
  {
    title: "2. Akun Pengguna",
    content:
      "Pengguna bertanggung jawab menjaga kerahasiaan akun. Mahasiswa dapat mendaftar secara mandiri, sedangkan akun dosen dan admin dikelola melalui admin sistem.",
  },
  {
    title: "3. Ruang Lingkup Layanan",
    content:
      "EduBidan menyediakan fitur modul pembelajaran, materi video, progres belajar, kuis evaluasi, rekap nilai, dan pengelolaan pengguna sesuai peran.",
  },
  {
    title: "4. Penggunaan Konten",
    content:
      "Konten pembelajaran hanya digunakan untuk tujuan edukasi dan pendamping pembelajaran. Pengguna tidak diperkenankan menyalin atau menggunakan konten untuk tujuan komersial tanpa izin.",
  },
  {
    title: "5. Evaluasi dan Nilai",
    content:
      "Kuis dan skor pada EduBidan digunakan sebagai evaluasi pembelajaran. Hasil tersebut bukan sertifikasi kompetensi resmi dan tidak menggantikan penilaian akademik formal kecuali ditentukan oleh pihak pengampu.",
  },
  {
    title: "6. Batasan Tanggung Jawab",
    content:
      "Karena masih berupa purwarupa, EduBidan dapat mengalami bug, error, downtime, atau perubahan fitur selama proses pengembangan.",
  },
  {
    title: "7. Perubahan Ketentuan",
    content:
      "Ketentuan dapat diperbarui sesuai kebutuhan pengembangan sistem. Penggunaan berkelanjutan dianggap sebagai persetujuan terhadap ketentuan terbaru.",
  },
  {
    title: "8. Kontak dan Bantuan",
    content: `Pertanyaan terkait penggunaan EduBidan dapat dikirimkan melalui email ${siteConfig.contact.email}.`,
  },
];