-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 04, 2026 at 11:38 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `edubidan_db`
--

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `userId`, `actionType`, `description`, `ipAddress`, `createdAt`) VALUES
(4, 6, 'SEED_DATABASE', 'Seed data EduBidan sesuai flow aplikasi berhasil dijalankan.', NULL, '2026-05-31 11:43:04.325'),
(5, 7, 'PUBLISH_MODULE', 'Dosen mempublikasikan tiga modul pembelajaran utama.', NULL, '2026-05-31 11:43:04.325'),
(6, 10, 'DEACTIVATE_USER', 'Akun mahasiswa Rina Lestari disiapkan sebagai contoh user nonaktif.', NULL, '2026-05-31 11:43:04.325'),
(7, 11, 'REGISTER_MAHASISWA', 'Mahasiswa Mahasiswa Baru melakukan registrasi akun.', NULL, '2026-05-31 14:08:44.073'),
(8, 12, 'CREATE_USER', 'Admin membuat akun mahasiswa Dewi Lestari.', NULL, '2026-05-31 14:16:34.542'),
(9, 13, 'CREATE_USER', 'Admin membuat akun dosen Dosen Praktik.', NULL, '2026-05-31 14:16:44.735'),
(10, 12, 'UPDATE_USER', 'Admin memperbarui data pengguna.', NULL, '2026-05-31 14:17:38.992'),
(11, 12, 'DEACTIVATE_USER', 'Admin menonaktifkan akun Dewi Lestari Update.', NULL, '2026-05-31 14:18:28.058'),
(12, 12, 'ACTIVATE_USER', 'Admin mengaktifkan akun Dewi Lestari Update.', NULL, '2026-05-31 14:18:40.839'),
(13, 14, 'REGISTER_MAHASISWA', 'Mahasiswa Mahasiswa Integrasi melakukan registrasi akun.', NULL, '2026-06-01 18:41:55.206'),
(14, NULL, 'CREATE_USER', 'Admin membuat akun mahasiswa Admin Test Mahasiswa.', NULL, '2026-06-01 19:19:47.176'),
(15, NULL, 'CREATE_USER', 'Admin membuat akun dosen Admin Test Dosen.', NULL, '2026-06-01 19:20:34.803'),
(16, NULL, 'UPDATE_USER', 'Admin memperbarui data pengguna.', NULL, '2026-06-01 19:21:45.303'),
(17, NULL, 'UPDATE_USER', 'Admin memperbarui data pengguna.', NULL, '2026-06-01 19:22:25.974'),
(18, NULL, 'DEACTIVATE_USER', 'Admin menonaktifkan akun Admin Test Dosen2.', NULL, '2026-06-01 19:22:27.058'),
(19, NULL, 'DEACTIVATE_USER', 'Admin menonaktifkan akun Admin Test Dosen2.', NULL, '2026-06-01 19:23:10.184'),
(20, NULL, 'DEACTIVATE_USER', 'Admin menonaktifkan akun Admin Test Mahasiswa.', NULL, '2026-06-01 19:23:17.133'),
(21, 13, 'DEACTIVATE_USER', 'Admin menonaktifkan akun Dosen Praktik.', NULL, '2026-06-01 19:43:50.694'),
(22, 13, 'ACTIVATE_USER', 'Admin mengaktifkan akun Dosen Praktik.', NULL, '2026-06-01 19:43:51.503'),
(23, 13, 'DEACTIVATE_USER', 'Admin menonaktifkan akun Dosen Praktik.', NULL, '2026-06-01 19:43:53.071'),
(24, 13, 'ACTIVATE_USER', 'Admin mengaktifkan akun Dosen Praktik.', NULL, '2026-06-01 19:43:54.075'),
(25, NULL, 'ACTIVATE_USER', 'Admin mengaktifkan akun Admin Test Dosen2.', NULL, '2026-06-01 19:56:34.023'),
(26, NULL, 'DEACTIVATE_USER', 'Admin menonaktifkan akun Admin Test Dosen2.', NULL, '2026-06-01 19:56:34.978'),
(27, 12, 'UPDATE_USER', 'Admin memperbarui data pengguna.', NULL, '2026-06-01 20:04:07.861'),
(28, NULL, 'CREATE_USER', 'Admin membuat akun mahasiswa Ikhsan.', NULL, '2026-06-01 20:21:14.096'),
(29, 12, 'UPDATE_USER', 'Admin memperbarui data pengguna.', NULL, '2026-06-01 20:38:19.283'),
(30, NULL, 'DEACTIVATE_USER', 'Admin menonaktifkan akun Ikhsan.', NULL, '2026-06-01 20:40:19.264'),
(31, NULL, 'CREATE_USER', 'Admin membuat akun mahasiswa ikhsan.', NULL, '2026-06-02 14:51:22.087'),
(32, NULL, 'DEACTIVATE_USER', 'Admin menonaktifkan akun ikhsan.', NULL, '2026-06-02 15:07:19.593'),
(33, NULL, 'CREATE_USER', 'Admin membuat akun mahasiswa ikhsan.', NULL, '2026-06-02 15:08:17.506'),
(34, 20, 'CREATE_USER', 'Admin membuat akun mahasiswa rizqi.', NULL, '2026-06-02 15:46:31.202'),
(35, 21, 'REGISTER_MAHASISWA', 'Mahasiswa Iraw melakukan registrasi akun.', NULL, '2026-06-02 16:01:14.608'),
(36, NULL, 'RESET_PASSWORD', 'Admin mereset password akun ikhsan.', NULL, '2026-06-03 01:45:39.052'),
(37, NULL, 'RESET_PASSWORD', 'Admin mereset password akun ikhsan.', NULL, '2026-06-03 02:09:11.982'),
(38, NULL, 'RESET_PASSWORD', 'Admin mereset password akun ikhsan.', NULL, '2026-06-03 02:09:53.407'),
(39, NULL, 'RESET_PASSWORD', 'Admin mereset password akun ikhsan.', NULL, '2026-06-03 02:20:19.859'),
(40, NULL, 'RESET_PASSWORD', 'Admin mereset password akun Ikhsan Rizqi.', NULL, '2026-06-04 04:12:45.266'),
(41, NULL, 'DEACTIVATE_USER', 'Admin menonaktifkan akun Ikhsan Rizqi.', NULL, '2026-06-04 04:13:11.370'),
(42, 22, 'REGISTER_MAHASISWA', 'Mahasiswa Ikhsan Rizqi melakukan registrasi akun.', NULL, '2026-06-04 04:13:40.892');

--
-- Dumping data for table `attempt_answers`
--

INSERT INTO `attempt_answers` (`id`, `attemptId`, `soalId`, `optionId`) VALUES
(7, 3, 8, 29),
(8, 3, 9, 33),
(9, 3, 10, 37),
(10, 4, 8, 29),
(11, 4, 9, 33),
(12, 4, 10, 38),
(13, 5, 19, 69),
(14, 5, 20, 73),
(15, 6, 19, NULL),
(16, 6, 20, NULL),
(17, 7, 19, 69),
(18, 7, 20, 73),
(19, 8, 11, NULL),
(20, 8, 12, NULL),
(28, 12, 19, 69),
(29, 12, 20, 73);

--
-- Dumping data for table `dosen_profiles`
--

INSERT INTO `dosen_profiles` (`id`, `userId`, `nidnNip`) VALUES
(2, 7, '1987654321'),
(3, 13, '19880001');

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`id`, `userId`, `moduleId`, `isKicked`, `kickReason`, `joinedAt`, `updatedAt`) VALUES
(7, 8, 5, 0, NULL, '2026-05-31 11:43:04.251', '2026-05-31 11:43:04.251'),
(8, 8, 6, 0, NULL, '2026-05-31 11:43:04.255', '2026-05-31 11:43:04.255'),
(9, 8, 7, 0, NULL, '2026-05-31 11:43:04.259', '2026-05-31 11:43:04.259'),
(10, 9, 5, 0, NULL, '2026-05-31 11:43:04.263', '2026-05-31 11:43:04.263'),
(11, 9, 6, 0, NULL, '2026-05-31 11:43:04.267', '2026-05-31 11:43:04.267'),
(12, 9, 7, 1, 'hilang', '2026-05-31 11:43:04.270', '2026-06-03 11:48:01.201'),
(13, 11, 5, 0, NULL, '2026-05-31 18:28:02.169', '2026-05-31 18:31:42.605'),
(17, 22, 7, 0, NULL, '2026-06-04 06:05:46.071', '2026-06-04 06:05:46.071'),
(18, 22, 9, 0, NULL, '2026-06-04 08:54:04.196', '2026-06-04 08:54:04.196');

--
-- Dumping data for table `kuis`
--

INSERT INTO `kuis` (`id`, `contentId`, `title`, `description`, `hasTimeLimit`, `timeLimitMinutes`, `createdAt`, `updatedAt`) VALUES
(4, 12, 'Kuis Pemeriksaan Kehamilan Dasar', 'Kuis singkat untuk mengukur pemahaman mahasiswa terhadap materi pemeriksaan kehamilan dasar.', 1, 10, '2026-05-31 11:43:04.157', '2026-05-31 11:43:04.157'),
(5, 15, 'Kuis Perawatan Bayi Baru Lahir', 'Kuis untuk menguji pemahaman dasar mengenai perawatan bayi baru lahir.', 1, 17, '2026-05-31 11:43:04.209', '2026-06-04 08:22:24.288'),
(6, 18, 'Kuis Teknik Menyusuii', 'Kuis untuk mengukur pemahaman mahasiswa mengenai teknik menyusui dan pelekatan bayi.', 1, 10, '2026-05-31 11:43:04.242', '2026-06-04 06:37:06.984');

--
-- Dumping data for table `lesson_progress`
--

INSERT INTO `lesson_progress` (`id`, `userId`, `materiId`, `isCompleted`, `completedAt`, `createdAt`, `updatedAt`) VALUES
(4, 8, 7, 1, '2026-05-31 11:43:04.272', '2026-05-31 11:43:04.274', '2026-05-31 11:43:04.274'),
(5, 8, 8, 1, '2026-05-31 11:43:04.272', '2026-05-31 11:43:04.274', '2026-05-31 11:43:04.274'),
(6, 9, 7, 1, '2026-05-31 11:43:04.272', '2026-05-31 11:43:04.274', '2026-05-31 11:43:04.274'),
(7, 8, 11, 1, '2026-06-03 13:34:40.462', '2026-06-03 13:34:40.481', '2026-06-03 13:34:40.481'),
(8, 8, 12, 1, '2026-06-03 13:34:45.321', '2026-06-03 13:34:45.326', '2026-06-03 13:34:45.326'),
(9, 8, 14, 1, '2026-06-03 13:35:24.910', '2026-06-03 13:35:24.915', '2026-06-03 13:35:24.915'),
(10, 22, 19, 1, '2026-06-04 08:54:12.793', '2026-06-04 08:54:12.806', '2026-06-04 08:54:12.806');

--
-- Dumping data for table `mahasiswa_profiles`
--

INSERT INTO `mahasiswa_profiles` (`id`, `userId`, `npm`) VALUES
(4, 8, '2310631170001'),
(5, 9, '2310631170002'),
(6, 10, '2310631170003'),
(7, 11, '2310631179999'),
(8, 12, '2310631178888'),
(9, 14, '2310631177777'),
(14, 20, '2210631170130'),
(15, 21, '2310631177776'),
(16, 22, '2210631170131');

--
-- Dumping data for table `materis`
--

INSERT INTO `materis` (`id`, `contentId`, `title`, `description`, `videoSource`, `videoUrl`, `estimatedMinutes`, `createdAt`, `updatedAt`) VALUES
(7, 10, 'Pengenalan Pemeriksaan Antenatal Care', 'Materi ini menjelaskan pengertian, tujuan, alat, dan alur dasar pemeriksaan kehamilan.', 'EMBED', 'https://www.youtube.com/embed/example-anc-1', 25, '2026-05-31 11:43:04.124', '2026-05-31 11:43:04.124'),
(8, 11, 'Tahapan Pemeriksaan Ibu Hamil', 'Materi ini membahas tahapan pemeriksaan ibu hamil mulai dari anamnesis hingga pemeriksaan fisik dasar.', 'EMBED', 'https://www.youtube.com/embed/example-anc-2', 30, '2026-05-31 11:43:04.137', '2026-05-31 11:43:04.137'),
(9, 13, 'Prinsip Perawatan Bayi Baru Lahir', 'Materi ini membahas prinsip awal perawatan bayi baru lahir, termasuk menjaga kehangatan dan observasi kondisi bayi.', 'EMBED', 'https://www.youtube.com/embed/example-bbl-1', 25, '2026-05-31 11:43:04.183', '2026-05-31 11:43:04.183'),
(10, 14, 'Observasi Awal Bayi Baru Lahir', 'Materi ini menjelaskan observasi awal kondisi bayi baru lahir secara sederhana dan terstruktur.', 'EMBED', 'https://www.youtube.com/embed/example-bbl-2', 20, '2026-05-31 11:43:04.195', '2026-05-31 11:43:04.195'),
(11, 16, 'Dasar Teknik Menyusui', 'Materi ini membahas konsep dasar teknik menyusui, kenyamanan ibu, dan posisi bayi.', 'EMBED', 'https://youtu.be/CyZOSN90lNs?si=V3Y8TDilM3ReDEni', 25, '2026-05-31 11:43:04.223', '2026-06-04 07:17:19.554'),
(12, 17, 'Pelekatan Bayi Saat Menyusui', 'Materi ini menjelaskan tanda pelekatan bayi yang baik saat menyusui.', 'EMBED', 'https://www.youtube.com/embed/example-asi-2', 20, '2026-05-31 11:43:04.233', '2026-05-31 11:43:04.233'),
(14, 20, 'Judul', 'ya gitu lah', 'EMBED', 'youtube.com', 15, '2026-06-03 11:10:06.260', '2026-06-03 11:10:20.223'),
(15, 23, 'halo', 'awd', 'EMBED', 'wad', 12, '2026-06-03 17:32:45.705', '2026-06-03 17:32:45.705'),
(16, 24, 'abru bgt', 's', 'EMBED', 's', 2, '2026-06-03 18:09:28.326', '2026-06-03 18:09:28.326'),
(17, 25, 'gadgetin', 'waw', 'EMBED', 'https://youtu.be/CyZOSN90lNs?si=V3Y8TDilM3ReDEni', 16, '2026-06-04 08:20:51.545', '2026-06-04 08:20:51.545'),
(18, 26, 'wa', 'aw', 'EMBED', 'https://youtu.be/CyZOSN90lNs?si=V3Y8TDilM3ReDEni', 16, '2026-06-04 08:25:00.549', '2026-06-04 08:25:00.549'),
(19, 27, 'Kereta', '4k', 'EMBED', 'https://youtu.be/eCE4hYw8AAI?si=aBBCiaqy0edQuDVN', 59, '2026-06-04 08:53:15.532', '2026-06-04 08:53:15.532');

--
-- Dumping data for table `materi_objectives`
--

INSERT INTO `materi_objectives` (`id`, `materiId`, `text`, `order`) VALUES
(14, 7, 'Menjelaskan pengertian pemeriksaan antenatal care.', 1),
(15, 7, 'Menyebutkan alat yang diperlukan dalam pemeriksaan.', 2),
(16, 7, 'Mengurutkan tahapan pemeriksaan dasar.', 3),
(17, 8, 'Menjelaskan tahapan anamnesis singkat.', 1),
(18, 8, 'Mengidentifikasi pemeriksaan fisik dasar pada ibu hamil.', 2),
(19, 9, 'Menjelaskan prinsip dasar perawatan bayi baru lahir.', 1),
(20, 9, 'Mengidentifikasi kebutuhan awal bayi baru lahir.', 2),
(21, 10, 'Menjelaskan komponen observasi awal bayi baru lahir.', 1),
(22, 10, 'Mengenali kondisi yang perlu diperhatikan pada bayi baru lahir.', 2),
(25, 12, 'Menjelaskan tanda pelekatan bayi yang tepat.', 1),
(26, 12, 'Mengenali masalah umum pada proses menyusui.', 2),
(33, 14, 'Tujuan 1', 1),
(34, 14, 'Tujuan 2', 2),
(35, 15, 'w', 1),
(36, 16, 's', 1),
(39, 11, 'Menjelaskan prinsip dasar teknik menyusui.', 1),
(40, 11, 'Mengidentifikasi posisi ibu dan bayi yang nyaman.', 2),
(41, 17, 'w', 1),
(42, 18, 'w', 1),
(43, 19, 'Kereta', 1),
(44, 19, 'ASMR', 2);

--
-- Dumping data for table `materi_tools`
--

INSERT INTO `materi_tools` (`id`, `materiId`, `name`) VALUES
(20, 7, 'Tensimeter'),
(21, 7, 'Stetoskop'),
(22, 7, 'Pita ukur LILA'),
(23, 7, 'Doppler'),
(24, 8, 'Buku KIA'),
(25, 8, 'Timbangan'),
(26, 8, 'Tensimeter'),
(27, 8, 'Doppler'),
(28, 9, 'Kain bersih'),
(29, 9, 'Selimut bayi'),
(30, 9, 'Termometer'),
(31, 10, 'Jam'),
(32, 10, 'Termometer'),
(33, 10, 'Lembar observasi'),
(37, 12, 'Bantal menyusui'),
(38, 12, 'Poster edukasi'),
(44, 14, 'Hp'),
(45, 14, 'Media'),
(46, 15, 'w'),
(47, 16, 's'),
(51, 11, 'Kursi nyaman'),
(52, 11, 'Bantal menyusui'),
(53, 11, 'Media edukasi'),
(54, 17, 'w'),
(55, 18, 'w'),
(56, 19, 'Kuota'),
(57, 19, 'Wifi');

--
-- Dumping data for table `modules`
--

INSERT INTO `modules` (`id`, `dosenProfileId`, `title`, `description`, `bannerUrl`, `accessCode`, `status`, `estimatedMinutes`, `createdAt`, `updatedAt`, `bannerPublicId`) VALUES
(5, 2, 'Pemeriksaan Kehamilan Dasar', 'Modul video dan evaluasi dasar untuk memahami alur pemeriksaan antenatal care.', '/images/modules/pemeriksaan-kehamilan.jpg', 'ANC001', 'PUBLIK', 90, '2026-05-31 11:43:04.090', '2026-05-31 11:43:04.090', NULL),
(6, 2, 'Perawatan Bayi Baru Lahir', 'Modul pembelajaran mengenai perawatan awal bayi baru lahir secara aman dan terstruktur.', '/images/modules/perawatan-bayi-baru-lahir.jpg', 'BBL001', 'PUBLIK', 90, '2026-05-31 11:43:04.098', '2026-06-04 08:21:16.941', NULL),
(7, 2, 'Teknik Menyusui', 'Modul pembelajaran mengenai teknik menyusui, posisi ibu dan bayi, serta pelekatan yang tepat.', NULL, 'ASI001', 'PUBLIK', 60, '2026-05-31 11:43:04.104', '2026-06-04 06:06:08.055', NULL),
(8, 2, 'Modul Draft Simulasi', 'Modul draft untuk menguji status publikasi pada dashboard dosen dan admin.', NULL, 'DRAFT001', 'DRAFT', 30, '2026-05-31 11:43:04.111', '2026-05-31 11:43:04.111', NULL),
(9, 3, 'Modul Uji API Updates', 'Deskripsi modul sudah diperbarui.', '/images/modules/modul-uji-api.jpg', 'API001', 'PUBLIK', 60, '2026-05-31 18:15:13.240', '2026-06-04 08:53:50.936', NULL),
(10, 3, 'coba ajas', NULL, NULL, 'BIDAN-Q63', 'DRAFT', NULL, '2026-06-03 09:57:31.752', '2026-06-03 10:19:43.239', NULL);

--
-- Dumping data for table `module_contents`
--

INSERT INTO `module_contents` (`id`, `moduleId`, `kind`, `order`) VALUES
(10, 5, 'MATERI', 1),
(11, 5, 'MATERI', 2),
(12, 5, 'KUIS', 3),
(13, 6, 'MATERI', 1),
(14, 6, 'MATERI', 2),
(15, 6, 'KUIS', 3),
(16, 7, 'MATERI', 1),
(17, 7, 'MATERI', 2),
(18, 7, 'KUIS', 3),
(20, 7, 'MATERI', 4),
(23, 7, 'MATERI', 5),
(24, 7, 'MATERI', 6),
(25, 6, 'MATERI', 4),
(26, 10, 'MATERI', 1),
(27, 9, 'MATERI', 1);

--
-- Dumping data for table `module_objectives`
--

INSERT INTO `module_objectives` (`id`, `moduleId`, `text`, `order`) VALUES
(8, 5, 'Mahasiswa memahami tujuan pemeriksaan antenatal care.', 1),
(9, 5, 'Mahasiswa mampu mengidentifikasi alat pemeriksaan kehamilan dasar.', 2),
(10, 5, 'Mahasiswa mampu menjelaskan tahapan pemeriksaan secara sistematis.', 3),
(21, 7, 'Mahasiswa memahami prinsip dasar teknik menyusui yang benar.', 1),
(22, 7, 'Mahasiswa mampu menjelaskan posisi dan pelekatan bayi saat menyusui.', 2),
(29, 6, 'Mahasiswa memahami prinsip dasar perawatan bayi baru lahir.', 1),
(30, 6, 'Mahasiswa mampu mengenali tahapan perawatan awal bayi baru lahir.', 2),
(31, 9, 'Tujuan pembelajaran pertama', 1),
(32, 9, 'Tujuan pembelajaran kedua', 2);

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `userId`, `moduleId`, `type`, `title`, `body`, `href`, `isRead`, `readAt`, `createdAt`) VALUES
(5, 8, 5, 'MATERI_BARU', 'Materi baru tersedia', 'Materi Pemeriksaan Kehamilan Dasar sudah dapat dipelajari.', '/dashboard/modules/5', 1, '2026-06-03 16:39:53.337', '2026-05-31 11:43:04.321'),
(6, 9, 5, 'HASIL_KUIS', 'Hasil kuis tersedia', 'Hasil Kuis Pemeriksaan Kehamilan Dasar sudah tersedia.', '/dashboard/modules/5', 0, NULL, '2026-05-31 11:43:04.321'),
(7, 7, 5, 'KUIS_DIKERJAKAN', 'Kuis telah dikerjakan', 'Mahasiswa telah mengerjakan Kuis Pemeriksaan Kehamilan Dasar.', '/dashboard/lecturer/modules/5', 1, '2026-06-03 16:39:00.647', '2026-05-31 11:43:04.321'),
(8, 6, 8, 'MODUL_DIPUBLIKASI', 'Modul draft tersedia', 'Modul Draft Simulasi tersedia untuk pengujian status modul.', '/dashboard/admin', 1, '2026-06-03 16:39:24.380', '2026-05-31 11:43:04.321'),
(9, 7, 7, 'MAHASISWA_BERGABUNG', 'Mahasiswa baru bergabung', 'ikhsan (2210631170131) bergabung ke modul Teknik Menyusui.', '/dashboard/lecturer/modules/7', 1, '2026-06-03 17:23:04.695', '2026-06-03 17:22:18.628'),
(10, 7, 7, 'KUIS_DIKERJAKAN', 'Kuis telah dikerjakan', 'ikhsan (2210631170131) mengerjakan Kuis Teknik Menyusuii pada modul Teknik Menyusui. Nilai: 100.0 (2/2 benar).', '/dashboard/lecturer/gradebook/7', 0, NULL, '2026-06-03 17:23:59.310'),
(11, 8, 7, 'MATERI_BARU', 'Materi baru tersedia', 'Materi \"halo\" telah ditambahkan pada modul Teknik Menyusui.', '/dashboard/modules/7', 0, NULL, '2026-06-03 17:32:45.746'),
(13, 8, 7, 'MATERI_BARU', 'Materi baru tersedia', 'Materi \"abru bgt\" telah ditambahkan pada modul Teknik Menyusui.', '/dashboard/modules/7', 0, NULL, '2026-06-03 18:09:28.383'),
(14, 7, 7, 'MAHASISWA_BERGABUNG', 'Mahasiswa baru bergabung', 'Ikhsan Rizqi (2210631170131) bergabung ke modul Teknik Menyusui.', '/dashboard/lecturer/modules/7', 0, NULL, '2026-06-04 06:05:46.150'),
(15, 7, 7, 'KUIS_DIKERJAKAN', 'Kuis telah dikerjakan', 'Ikhsan Rizqi (2210631170131) mengerjakan Kuis Teknik Menyusuii pada modul Teknik Menyusui. Nilai: 100.0 (2/2 benar).', '/dashboard/lecturer/gradebook/7', 0, NULL, '2026-06-04 06:38:31.911'),
(16, 8, 6, 'MATERI_BARU', 'Materi baru tersedia', 'Materi \"gadgetin\" telah ditambahkan pada modul Perawatan Bayi Baru Lahir.', '/dashboard/modules/6', 0, NULL, '2026-06-04 08:20:51.590'),
(17, 9, 6, 'MATERI_BARU', 'Materi baru tersedia', 'Materi \"gadgetin\" telah ditambahkan pada modul Perawatan Bayi Baru Lahir.', '/dashboard/modules/6', 0, NULL, '2026-06-04 08:20:51.590'),
(18, 13, 9, 'MAHASISWA_BERGABUNG', 'Mahasiswa baru bergabung', 'Ikhsan Rizqi (2210631170131) bergabung ke modul Modul Uji API Updates.', '/dashboard/lecturer/modules/9', 0, NULL, '2026-06-04 08:54:04.272');

--
-- Dumping data for table `notif_preferences`
--

INSERT INTO `notif_preferences` (`id`, `userId`, `moduleUpdate`, `newMaterial`, `newQuiz`, `quizResult`, `quizActivity`, `accountActivity`, `systemAlert`) VALUES
(6, 6, 1, 1, 1, 1, 1, 1, 1),
(7, 7, 1, 1, 1, 1, 1, 1, 1),
(8, 8, 1, 1, 1, 1, 0, 1, 1),
(9, 9, 1, 1, 1, 1, 0, 1, 1),
(10, 10, 1, 1, 1, 1, 1, 1, 1),
(11, 11, 1, 1, 1, 1, 0, 1, 1),
(12, 12, 1, 1, 1, 1, 1, 1, 1),
(13, 13, 1, 1, 1, 1, 1, 1, 1),
(14, 14, 1, 1, 1, 1, 0, 1, 1),
(20, 20, 1, 1, 1, 1, 1, 1, 1),
(21, 21, 1, 1, 1, 1, 0, 1, 1),
(22, 22, 1, 1, 1, 1, 0, 1, 1);

--
-- Dumping data for table `otp_codes`
--

INSERT INTO `otp_codes` (`id`, `email`, `code`, `status`, `expiresAt`, `createdAt`) VALUES
(1, '2310631179999@student.unsika.ac.id', '8848', 'EXPIRED', '2026-06-01 16:29:42.903', '2026-06-02 16:19:42.908'),
(2, '2210631170130@student.unsika.ac.id', '6606', 'USED', '2026-06-02 16:30:10.012', '2026-06-02 16:20:10.013'),
(3, '2210631170131@student.unsika.ac.id', '9739', 'USED', '2026-06-02 16:46:47.448', '2026-06-02 16:36:47.451'),
(4, '2210631170131@student.unsika.ac.id', '7905', 'EXPIRED', '2026-05-04 16:56:52.014', '2026-06-02 16:46:52.018'),
(5, '2210631170131@student.unsika.ac.id', '7969', 'EXPIRED', '2026-06-01 17:07:11.215', '2026-06-02 16:57:11.218'),
(6, '2210631170131@student.unsika.ac.id', '2859', 'USED', '2026-06-02 17:07:34.569', '2026-06-02 16:57:34.572'),
(7, '2210631170131@student.unsika.ac.id', '5018', 'EXPIRED', '2026-06-02 17:12:36.120', '2026-06-02 17:02:36.125'),
(8, '2210631170131@student.unsika.ac.id', '5687', 'EXPIRED', '2026-06-02 17:14:04.323', '2026-06-02 17:04:04.325'),
(9, 'dosen.praktik@staff.unsika.ac.id', '8902', 'USED', '2026-06-03 09:52:12.254', '2026-06-03 09:42:12.264'),
(10, '2210631170131@student.unsika.ac.id', '7389', 'USED', '2026-06-03 13:23:50.620', '2026-06-03 13:13:50.622'),
(11, '2210631170131@student.unsika.ac.id', '7078', 'USED', '2026-06-04 04:00:12.087', '2026-06-04 03:50:12.095'),
(12, '2210631170131@student.unsika.ac.id', '4350', 'PENDING', '2026-06-04 04:21:30.878', '2026-06-04 04:11:30.884');

--
-- Dumping data for table `quiz_attempts`
--

INSERT INTO `quiz_attempts` (`id`, `userId`, `kuisId`, `score`, `totalCorrect`, `totalQuestions`, `durationSeconds`, `startedAt`, `submittedAt`, `isCompleted`) VALUES
(3, 8, 4, 100, 3, 3, 420, '2026-05-31 11:43:04.283', '2026-05-31 11:43:04.282', 1),
(4, 9, 4, 66.66666666666666, 2, 3, 510, '2026-05-31 11:43:04.307', '2026-05-31 11:43:04.305', 1),
(5, 8, 6, 100, 2, 2, 20, '2026-06-03 13:45:56.181', '2026-06-03 13:45:56.168', 1),
(6, 8, 6, 0, 0, 2, 4, '2026-06-03 13:46:26.638', '2026-06-03 13:46:26.633', 1),
(7, 8, 6, 100, 2, 2, 2, '2026-06-03 13:53:52.258', '2026-06-03 13:53:52.254', 1),
(8, 8, 5, 0, 0, 2, 15, '2026-06-03 14:14:58.394', '2026-06-03 14:14:58.377', 1),
(12, 22, 6, 100, 2, 2, 8, '2026-06-04 06:38:31.867', '2026-06-04 06:38:31.862', 1);

--
-- Dumping data for table `soals`
--

INSERT INTO `soals` (`id`, `kuisId`, `questionText`, `mediaUrl`, `order`, `mediaPublicId`) VALUES
(8, 4, 'Apa tujuan utama pemeriksaan antenatal care pada ibu hamil?', NULL, 1, NULL),
(9, 4, 'Alat apa yang dapat digunakan untuk memantau denyut jantung janin?', NULL, 2, NULL),
(10, 4, 'Data identitas dan keluhan ibu hamil umumnya dikumpulkan pada tahap apa?', NULL, 3, NULL),
(11, 5, 'Salah satu prinsip awal perawatan bayi baru lahir adalah...', NULL, 1, NULL),
(12, 5, 'Alat yang dapat digunakan untuk memantau suhu bayi adalah...', NULL, 2, NULL),
(19, 6, 'Salah satu tanda pelekatan bayi yang baik saat menyusui adalah...', NULL, 1, NULL),
(20, 6, 'Siapa Nama char ini', 'https://res.cloudinary.com/dyfjcunh7/image/upload/v1780555026/edubidan/questions/buynbrgqebw86pph5efd.png', 2, 'edubidan/questions/buynbrgqebw86pph5efd');

--
-- Dumping data for table `soal_options`
--

INSERT INTO `soal_options` (`id`, `soalId`, `text`, `isCorrect`, `order`) VALUES
(29, 8, 'Memantau kondisi ibu dan janin selama kehamilan.', 1, 1),
(30, 8, 'Menggantikan seluruh proses persalinan.', 0, 2),
(31, 8, 'Menentukan jenis kelamin bayi secara pasti.', 0, 3),
(32, 8, 'Menghindari seluruh pemeriksaan laboratorium.', 0, 4),
(33, 9, 'Doppler.', 1, 1),
(34, 9, 'Termometer ruangan.', 0, 2),
(35, 9, 'Timbangan bayi.', 0, 3),
(36, 9, 'Penggaris biasa.', 0, 4),
(37, 10, 'Anamnesis.', 1, 1),
(38, 10, 'Sterilisasi alat.', 0, 2),
(39, 10, 'Pencatatan nilai akhir.', 0, 3),
(40, 10, 'Evaluasi aplikasi.', 0, 4),
(41, 11, 'Menjaga kehangatan bayi.', 1, 1),
(42, 11, 'Memandikan bayi secepat mungkin tanpa observasi.', 0, 2),
(43, 11, 'Mengabaikan tanda vital bayi.', 0, 3),
(44, 11, 'Tidak melakukan pencatatan.', 0, 4),
(45, 12, 'Termometer.', 1, 1),
(46, 12, 'Doppler.', 0, 2),
(47, 12, 'Pita LILA.', 0, 3),
(48, 12, 'Stetoskop janin.', 0, 4),
(69, 19, 'Bayi melekat dengan nyaman dan ibu tidak merasa nyeri berlebihan.', 1, 1),
(70, 19, 'Bayi selalu menangis selama menyusu.', 0, 2),
(71, 19, 'Ibu harus selalu berdiri saat menyusui.', 0, 3),
(72, 19, 'Tidak perlu memperhatikan posisi bayi.', 0, 4),
(73, 20, 'Hu Tao.', 1, 1),
(74, 20, 'Tensimeter.', 0, 2),
(75, 20, 'Doppler.', 0, 3),
(76, 20, 'Termometer ruangan.', 0, 4);

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `avatarUrl`, `phoneNumber`, `isActive`, `createdAt`, `updatedAt`, `avatarPublicId`) VALUES
(6, 'Admin EduBidan', 'admin@edubidan.id', '$2b$10$KC2LftM4ugHxFAEljrSFN.7QEDv8uDDfFgf344oo0B3tgXraEvKV2', 'ADMIN', NULL, '081200000001', 1, '2026-05-31 11:43:04.029', '2026-05-31 11:43:04.029', NULL),
(7, 'Dosen S.Keb', 'dosen.kebidanan@staff.unsika.ac.id', '$2b$10$KC2LftM4ugHxFAEljrSFN.7QEDv8uDDfFgf344oo0B3tgXraEvKV2', 'DOSEN', NULL, '081200000002', 1, '2026-05-31 11:43:04.051', '2026-06-03 17:44:11.998', NULL),
(8, 'Siti Aisyah', '2310631170001@student.unsika.ac.id', '$2b$10$KC2LftM4ugHxFAEljrSFN.7QEDv8uDDfFgf344oo0B3tgXraEvKV2', 'MAHASISWA', NULL, '081200000003', 1, '2026-05-31 11:43:04.062', '2026-05-31 11:43:04.062', NULL),
(9, 'Nadia Putri', '2310631170002@student.unsika.ac.id', '$2b$10$KC2LftM4ugHxFAEljrSFN.7QEDv8uDDfFgf344oo0B3tgXraEvKV2', 'MAHASISWA', NULL, '081200000004', 1, '2026-05-31 11:43:04.069', '2026-05-31 11:43:04.069', NULL),
(10, 'Rina Lestari', '2310631170003@student.unsika.ac.id', '$2b$10$KC2LftM4ugHxFAEljrSFN.7QEDv8uDDfFgf344oo0B3tgXraEvKV2', 'MAHASISWA', NULL, '081200000005', 0, '2026-05-31 11:43:04.077', '2026-05-31 11:43:04.077', NULL),
(11, 'Mahasiswa Baru', '2310631179999@student.unsika.ac.id', '$2b$10$HDDlq4H1.7FSTrpRLxWTP.Bby76/KEsRlZ8jrCEq1oHuxcmQ.LUzu', 'MAHASISWA', NULL, NULL, 1, '2026-05-31 14:08:44.073', '2026-05-31 14:08:44.073', NULL),
(12, 'Dewi Lestari Update', '2310631178888@student.unsika.ac.id', '$2b$10$qMHDhrfeCONnGcnt4LB96u8JUomJWFXZjzxYdyuRPVZNN1KAxHbRi', 'MAHASISWA', NULL, '081299990001', 1, '2026-05-31 14:16:34.542', '2026-06-01 20:38:19.283', NULL),
(13, 'Dosen Praktik', 'dosen.praktik@staff.unsika.ac.id', '$2b$10$pI6vQF0jhl6v9KupBNMEYeMKmDhXQ6JW6j9m1j0u9kKaqEf5r5Dhq', 'DOSEN', NULL, '081288880002', 1, '2026-05-31 14:16:44.735', '2026-06-03 09:42:37.406', NULL),
(14, 'Mahasiswa Integrasi', '2310631177777@student.unsika.ac.id', '$2b$10$TmzYzUYxUq0ycINVUETvpOcS9m/Lu8BFhpwDkn72cuB5GdnskEtHO', 'MAHASISWA', NULL, NULL, 1, '2026-06-01 18:41:55.206', '2026-06-01 18:41:55.206', NULL),
(20, 'rizqi', '2210631170130@student.unsika.ac.id', '$2b$10$m5/VKmbNeIwbGSS/u9WjguH84rbT5.X3qZKm18720QIMWasSWriHC', 'MAHASISWA', NULL, NULL, 1, '2026-06-02 15:46:31.202', '2026-06-02 16:24:48.229', NULL),
(21, 'Iraw', '2310631177776@student.unsika.ac.id', '$2b$10$9Nw5KPJdwY6lGR/feYc2fupOrGwlixIWnUDQ/0DIZAvvreDTLd3ze', 'MAHASISWA', NULL, NULL, 1, '2026-06-02 16:01:14.608', '2026-06-02 16:01:14.608', NULL),
(22, 'Ikhsan Rizqi', '2210631170131@student.unsika.ac.id', '$2b$10$tkSN09uQ2xmnBgwFAo.3OOrJy4Ap7WjQJhjB.wbnKswzmF61cLMX.', 'MAHASISWA', NULL, NULL, 1, '2026-06-04 04:13:40.892', '2026-06-04 05:38:44.551', NULL);
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
