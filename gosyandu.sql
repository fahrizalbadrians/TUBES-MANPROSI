-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 19, 2025 at 10:20 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gosyandu`
--

-- --------------------------------------------------------

--
-- Table structure for table `children`
--

CREATE TABLE `children` (
  `id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `name` varchar(120) NOT NULL,
  `nik` varchar(32) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `address` text DEFAULT NULL,
  `sex` enum('L','P') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `children`
--

INSERT INTO `children` (`id`, `created_by`, `parent_id`, `name`, `nik`, `birth_date`, `address`, `sex`, `created_at`) VALUES
(1, 3, 6, 'adi', '098765432123456', '2024-03-03', 'bojongzzz', 'L', '2025-12-19 09:07:45');

-- --------------------------------------------------------

--
-- Table structure for table `consult_messages`
--

CREATE TABLE `consult_messages` (
  `id` int(11) NOT NULL,
  `thread_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `consult_messages`
--

INSERT INTO `consult_messages` (`id`, `thread_id`, `sender_id`, `message`, `created_at`) VALUES
(1, 1, 4, 'kebanyakan begadang', '2025-12-19 08:59:49'),
(2, 2, 6, 'jangan dicat', '2025-12-19 09:10:11');

-- --------------------------------------------------------

--
-- Table structure for table `consult_threads`
--

CREATE TABLE `consult_threads` (
  `id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `staff_id` int(11) DEFAULT NULL,
  `is_private` tinyint(1) NOT NULL DEFAULT 1,
  `title` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `consult_threads`
--

INSERT INTO `consult_threads` (`id`, `created_by`, `client_id`, `staff_id`, `is_private`, `title`, `created_at`) VALUES
(1, 4, 4, NULL, 1, 'darah rendah kenapa ?', '2025-12-19 08:59:28'),
(2, 6, 6, NULL, 1, 'bayi saya warna kuning kenapa >', '2025-12-19 09:09:54');

-- --------------------------------------------------------

--
-- Table structure for table `education_posts`
--

CREATE TABLE `education_posts` (
  `id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `type` enum('ARTICLE','VIDEO','POSTER') NOT NULL,
  `title` varchar(200) NOT NULL,
  `content` text DEFAULT NULL,
  `media_url` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `education_posts`
--

INSERT INTO `education_posts` (`id`, `author_id`, `type`, `title`, `content`, `media_url`, `created_at`) VALUES
(1, 1, 'ARTICLE', 'Gizi Seimbang untuk Balita', 'edukasi gizi bayi', 'https://www.siloamhospitals.com/informasi-siloam/artikel/kebutuhan-gizi-bayi', '2025-12-19 08:51:21');

-- --------------------------------------------------------

--
-- Table structure for table `elderly`
--

CREATE TABLE `elderly` (
  `id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(120) NOT NULL,
  `nik` varchar(32) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `elderly`
--

INSERT INTO `elderly` (`id`, `created_by`, `user_id`, `name`, `nik`, `birth_date`, `address`, `created_at`) VALUES
(1, 3, 4, 'rudi', '123456789098765', '1970-07-01', 'bojozz', '2025-12-19 08:55:47');

-- --------------------------------------------------------

--
-- Table structure for table `immunizations`
--

CREATE TABLE `immunizations` (
  `id` int(11) NOT NULL,
  `child_id` int(11) NOT NULL,
  `recorded_by` int(11) NOT NULL,
  `vaccine` varchar(120) NOT NULL,
  `vaccine_type_id` int(11) DEFAULT NULL,
  `schedule_id` int(11) DEFAULT NULL,
  `given_at` date NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `measurements`
--

CREATE TABLE `measurements` (
  `id` int(11) NOT NULL,
  `person_type` enum('CHILD','PREGNANT','ELDERLY') NOT NULL,
  `person_id` int(11) NOT NULL,
  `recorded_by` int(11) NOT NULL,
  `recorded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `weight_kg` decimal(6,2) DEFAULT NULL,
  `height_cm` decimal(6,2) DEFAULT NULL,
  `blood_pressure` varchar(20) DEFAULT NULL,
  `blood_sugar` decimal(6,2) DEFAULT NULL,
  `cholesterol` decimal(6,2) DEFAULT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `measurements`
--

INSERT INTO `measurements` (`id`, `person_type`, `person_id`, `recorded_by`, `recorded_at`, `weight_kg`, `height_cm`, `blood_pressure`, `blood_sugar`, `cholesterol`, `notes`) VALUES
(1, 'ELDERLY', 1, 3, '2025-12-19 08:56:19', 70.00, 170.00, '60/55', 90.00, 190.00, '.'),
(2, 'PREGNANT', 1, 3, '2025-12-19 09:04:37', 80.00, 160.00, '200/130', 80.00, 190.00, NULL),
(3, 'CHILD', 1, 3, '2025-12-19 09:08:19', 16.00, 40.00, '120/90', 90.00, 120.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `recipient_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `level` enum('INFO','WARNING','DANGER') NOT NULL DEFAULT 'INFO',
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `related_type` enum('MEASUREMENT','SYSTEM','IMMUNIZATION') NOT NULL DEFAULT 'MEASUREMENT',
  `related_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `recipient_id`, `title`, `message`, `level`, `is_read`, `related_type`, `related_id`, `created_at`) VALUES
(1, 3, 'Notifikasi Kesehatan', 'rudi: Tekanan darah rendah (60/55). Mohon tindak lanjuti.', 'WARNING', 0, 'MEASUREMENT', 1, '2025-12-19 08:56:19'),
(2, 4, 'Notifikasi Kesehatan', 'rudi: Tekanan darah rendah (60/55). Mohon tindak lanjuti.', 'WARNING', 1, 'MEASUREMENT', 1, '2025-12-19 08:56:19'),
(3, 3, 'Notifikasi Kesehatan', 'rini: Tekanan darah tinggi (200/130). Mohon tindak lanjuti.', 'DANGER', 0, 'MEASUREMENT', 2, '2025-12-19 09:04:37'),
(4, 5, 'Notifikasi Kesehatan', 'rini: Tekanan darah tinggi (200/130). Mohon tindak lanjuti.', 'DANGER', 0, 'MEASUREMENT', 2, '2025-12-19 09:04:37'),
(5, 3, 'Notifikasi Kesehatan', 'adi: Tekanan darah tinggi (120/90); Terindikasi stunting (TB 40 cm, usia ~21 bln). Mohon tindak lanjuti.', 'DANGER', 0, 'MEASUREMENT', 3, '2025-12-19 09:08:19'),
(6, 6, 'Notifikasi Kesehatan', 'adi: Tekanan darah tinggi (120/90); Terindikasi stunting (TB 40 cm, usia ~21 bln). Mohon tindak lanjuti.', 'DANGER', 0, 'MEASUREMENT', 3, '2025-12-19 09:08:19'),
(7, 6, 'Pengingat Imunisasi', 'adi: Hepatitis B (HB-0) (HB-0) TERLAMBAT (jatuh tempo 2024-03-03).', 'DANGER', 0, 'IMMUNIZATION', 1, '2025-12-19 09:08:23'),
(8, 3, 'Pengingat Imunisasi', 'adi: Hepatitis B (HB-0) (HB-0) TERLAMBAT (jatuh tempo 2024-03-03).', 'DANGER', 0, 'IMMUNIZATION', 1, '2025-12-19 09:08:23'),
(9, 6, 'Pengingat Imunisasi', 'adi: BCG (BCG) TERLAMBAT (jatuh tempo 2024-03-03).', 'DANGER', 0, 'IMMUNIZATION', 2, '2025-12-19 09:08:23'),
(10, 3, 'Pengingat Imunisasi', 'adi: BCG (BCG) TERLAMBAT (jatuh tempo 2024-03-03).', 'DANGER', 0, 'IMMUNIZATION', 2, '2025-12-19 09:08:23'),
(11, 6, 'Pengingat Imunisasi', 'adi: Polio (OPV) (OPV-0) TERLAMBAT (jatuh tempo 2024-03-03).', 'DANGER', 0, 'IMMUNIZATION', 3, '2025-12-19 09:08:23'),
(12, 3, 'Pengingat Imunisasi', 'adi: Polio (OPV) (OPV-0) TERLAMBAT (jatuh tempo 2024-03-03).', 'DANGER', 0, 'IMMUNIZATION', 3, '2025-12-19 09:08:23'),
(13, 6, 'Pengingat Imunisasi', 'adi: Polio (OPV) (OPV-1) TERLAMBAT (jatuh tempo 2024-04-28).', 'DANGER', 0, 'IMMUNIZATION', 4, '2025-12-19 09:08:23'),
(14, 3, 'Pengingat Imunisasi', 'adi: Polio (OPV) (OPV-1) TERLAMBAT (jatuh tempo 2024-04-28).', 'DANGER', 0, 'IMMUNIZATION', 4, '2025-12-19 09:08:23'),
(15, 6, 'Pengingat Imunisasi', 'adi: DPT-HB-Hib (Pentavalen) (DPT-HB-Hib 1) TERLAMBAT (jatuh tempo 2024-04-28).', 'DANGER', 0, 'IMMUNIZATION', 9, '2025-12-19 09:08:23'),
(16, 3, 'Pengingat Imunisasi', 'adi: DPT-HB-Hib (Pentavalen) (DPT-HB-Hib 1) TERLAMBAT (jatuh tempo 2024-04-28).', 'DANGER', 0, 'IMMUNIZATION', 9, '2025-12-19 09:08:23'),
(17, 6, 'Pengingat Imunisasi', 'adi: Polio (OPV) (OPV-2) TERLAMBAT (jatuh tempo 2024-05-26).', 'DANGER', 0, 'IMMUNIZATION', 5, '2025-12-19 09:08:23'),
(18, 3, 'Pengingat Imunisasi', 'adi: Polio (OPV) (OPV-2) TERLAMBAT (jatuh tempo 2024-05-26).', 'DANGER', 0, 'IMMUNIZATION', 5, '2025-12-19 09:08:23'),
(19, 6, 'Pengingat Imunisasi', 'adi: DPT-HB-Hib (Pentavalen) (DPT-HB-Hib 2) TERLAMBAT (jatuh tempo 2024-05-26).', 'DANGER', 0, 'IMMUNIZATION', 10, '2025-12-19 09:08:23'),
(20, 3, 'Pengingat Imunisasi', 'adi: DPT-HB-Hib (Pentavalen) (DPT-HB-Hib 2) TERLAMBAT (jatuh tempo 2024-05-26).', 'DANGER', 0, 'IMMUNIZATION', 10, '2025-12-19 09:08:23'),
(21, 6, 'Pengingat Imunisasi', 'adi: Polio (OPV) (OPV-3) TERLAMBAT (jatuh tempo 2024-06-23).', 'DANGER', 0, 'IMMUNIZATION', 6, '2025-12-19 09:08:23'),
(22, 3, 'Pengingat Imunisasi', 'adi: Polio (OPV) (OPV-3) TERLAMBAT (jatuh tempo 2024-06-23).', 'DANGER', 0, 'IMMUNIZATION', 6, '2025-12-19 09:08:23'),
(23, 6, 'Pengingat Imunisasi', 'adi: Polio (IPV) (IPV) TERLAMBAT (jatuh tempo 2024-06-23).', 'DANGER', 0, 'IMMUNIZATION', 8, '2025-12-19 09:08:23'),
(24, 3, 'Pengingat Imunisasi', 'adi: Polio (IPV) (IPV) TERLAMBAT (jatuh tempo 2024-06-23).', 'DANGER', 0, 'IMMUNIZATION', 8, '2025-12-19 09:08:23'),
(25, 6, 'Pengingat Imunisasi', 'adi: DPT-HB-Hib (Pentavalen) (DPT-HB-Hib 3) TERLAMBAT (jatuh tempo 2024-06-23).', 'DANGER', 0, 'IMMUNIZATION', 11, '2025-12-19 09:08:23'),
(26, 3, 'Pengingat Imunisasi', 'adi: DPT-HB-Hib (Pentavalen) (DPT-HB-Hib 3) TERLAMBAT (jatuh tempo 2024-06-23).', 'DANGER', 0, 'IMMUNIZATION', 11, '2025-12-19 09:08:23'),
(27, 6, 'Pengingat Imunisasi', 'adi: MR (Measles-Rubella) (MR 1) TERLAMBAT (jatuh tempo 2024-12-01).', 'DANGER', 0, 'IMMUNIZATION', 13, '2025-12-19 09:08:23'),
(28, 3, 'Pengingat Imunisasi', 'adi: MR (Measles-Rubella) (MR 1) TERLAMBAT (jatuh tempo 2024-12-01).', 'DANGER', 0, 'IMMUNIZATION', 13, '2025-12-19 09:08:23'),
(29, 6, 'Pengingat Imunisasi', 'adi: Polio (OPV) (OPV-4 (Booster)) TERLAMBAT (jatuh tempo 2025-08-31).', 'DANGER', 0, 'IMMUNIZATION', 7, '2025-12-19 09:08:23'),
(30, 3, 'Pengingat Imunisasi', 'adi: Polio (OPV) (OPV-4 (Booster)) TERLAMBAT (jatuh tempo 2025-08-31).', 'DANGER', 0, 'IMMUNIZATION', 7, '2025-12-19 09:08:23'),
(31, 6, 'Pengingat Imunisasi', 'adi: DPT-HB-Hib (Pentavalen) (DPT-HB-Hib (Booster)) TERLAMBAT (jatuh tempo 2025-08-31).', 'DANGER', 0, 'IMMUNIZATION', 12, '2025-12-19 09:08:23'),
(32, 3, 'Pengingat Imunisasi', 'adi: DPT-HB-Hib (Pentavalen) (DPT-HB-Hib (Booster)) TERLAMBAT (jatuh tempo 2025-08-31).', 'DANGER', 0, 'IMMUNIZATION', 12, '2025-12-19 09:08:23'),
(33, 6, 'Pengingat Imunisasi', 'adi: MR (Measles-Rubella) (MR 2) TERLAMBAT (jatuh tempo 2025-08-31).', 'DANGER', 0, 'IMMUNIZATION', 14, '2025-12-19 09:08:23'),
(34, 3, 'Pengingat Imunisasi', 'adi: MR (Measles-Rubella) (MR 2) TERLAMBAT (jatuh tempo 2025-08-31).', 'DANGER', 0, 'IMMUNIZATION', 14, '2025-12-19 09:08:23');

-- --------------------------------------------------------

--
-- Table structure for table `pmt`
--

CREATE TABLE `pmt` (
  `id` int(11) NOT NULL,
  `child_id` int(11) NOT NULL,
  `recorded_by` int(11) NOT NULL,
  `item` varchar(160) NOT NULL,
  `given_at` date NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pregnant_mothers`
--

CREATE TABLE `pregnant_mothers` (
  `id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(120) NOT NULL,
  `nik` varchar(32) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `address` text DEFAULT NULL,
  `hpht` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pregnant_mothers`
--

INSERT INTO `pregnant_mothers` (`id`, `created_by`, `user_id`, `name`, `nik`, `birth_date`, `address`, `hpht`, `created_at`) VALUES
(1, 3, 5, 'rini', '123456788776554', '1996-06-06', 'bojongs', '2026-01-01', '2025-12-19 09:03:53');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(120) NOT NULL,
  `email` varchar(160) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('PEGAWAI_POSYANDU','MASYARAKAT') NOT NULL DEFAULT 'MASYARAKAT',
  `phone` varchar(40) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password_hash`, `role`, `phone`, `created_at`) VALUES
(1, 'Admin Pegawai', 'pegawai@gosyandu.com', '$2b$10$x.fvPn17FdtzwvGndZ5LJO47fBJiqz.M0oNlkuDD5o/CFVRp2ugtW', 'PEGAWAI_POSYANDU', NULL, '2025-12-19 08:51:21'),
(3, 'a', 'a@gosyandu.com', '$2a$10$Ch/bnnZzSBRRH1Dm1e87QeIEYYvNrZ/Buy8H0kJjyQ0rCArFsMJEO', 'PEGAWAI_POSYANDU', NULL, '2025-12-19 08:53:48'),
(4, 'aa', 'a@mail.com', '$2a$10$A4nXDnArfnMwPuE9FF5WIeVAs7DZpOlw9dGejvcA85ooUzEc0u2oK', 'MASYARAKAT', NULL, '2025-12-19 08:54:21'),
(5, 'rini', 'rini@mail.com', '$2a$10$dPnht4tckxh1l6HgTRw.rOADBdDUd/87Yyywszu/S9KMBpREQinRm', 'MASYARAKAT', NULL, '2025-12-19 09:01:57'),
(6, 'adi', 'adi@mail.com', '$2a$10$OWdfdiFFz0wB7D4E6jKHhO/POB0.gtRAVFGqyIbr8.mSzxu3Km6S6', 'MASYARAKAT', NULL, '2025-12-19 09:06:25');

-- --------------------------------------------------------

--
-- Table structure for table `vaccine_schedules`
--

CREATE TABLE `vaccine_schedules` (
  `id` int(11) NOT NULL,
  `vaccine_type_id` int(11) NOT NULL,
  `dose_label` varchar(40) NOT NULL,
  `recommended_age_weeks` int(11) NOT NULL,
  `min_age_weeks` int(11) DEFAULT NULL,
  `max_age_weeks` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vaccine_schedules`
--

INSERT INTO `vaccine_schedules` (`id`, `vaccine_type_id`, `dose_label`, `recommended_age_weeks`, `min_age_weeks`, `max_age_weeks`, `notes`, `created_at`) VALUES
(1, 1, 'HB-0', 0, 0, 1, '0-24 jam', '2025-12-19 08:51:20'),
(2, 2, 'BCG', 0, 0, 12, '0-3 bulan (umum)', '2025-12-19 08:51:20'),
(3, 3, 'OPV-0', 0, 0, 4, 'Saat lahir', '2025-12-19 08:51:20'),
(4, 3, 'OPV-1', 8, 6, 12, 'Usia 2 bulan', '2025-12-19 08:51:20'),
(5, 3, 'OPV-2', 12, 10, 16, 'Usia 3 bulan', '2025-12-19 08:51:20'),
(6, 3, 'OPV-3', 16, 14, 20, 'Usia 4 bulan', '2025-12-19 08:51:20'),
(7, 3, 'OPV-4 (Booster)', 78, 72, 104, 'Usia 18 bulan (booster)', '2025-12-19 08:51:20'),
(8, 4, 'IPV', 16, 14, 24, 'Usia 4 bulan', '2025-12-19 08:51:21'),
(9, 5, 'DPT-HB-Hib 1', 8, 6, 12, 'Usia 2 bulan', '2025-12-19 08:51:21'),
(10, 5, 'DPT-HB-Hib 2', 12, 10, 16, 'Usia 3 bulan', '2025-12-19 08:51:21'),
(11, 5, 'DPT-HB-Hib 3', 16, 14, 20, 'Usia 4 bulan', '2025-12-19 08:51:21'),
(12, 5, 'DPT-HB-Hib (Booster)', 78, 72, 104, 'Usia 18 bulan (booster)', '2025-12-19 08:51:21'),
(13, 6, 'MR 1', 39, 36, 52, 'Usia 9 bulan', '2025-12-19 08:51:21'),
(14, 6, 'MR 2', 78, 72, 104, 'Usia 18 bulan', '2025-12-19 08:51:21');

-- --------------------------------------------------------

--
-- Table structure for table `vaccine_types`
--

CREATE TABLE `vaccine_types` (
  `id` int(11) NOT NULL,
  `code` varchar(32) NOT NULL,
  `name` varchar(120) NOT NULL,
  `mandatory` tinyint(1) NOT NULL DEFAULT 1,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vaccine_types`
--

INSERT INTO `vaccine_types` (`id`, `code`, `name`, `mandatory`, `description`, `created_at`) VALUES
(1, 'HB0', 'Hepatitis B (HB-0)', 1, 'Diberikan segera setelah lahir (0-24 jam)', '2025-12-19 08:51:20'),
(2, 'BCG', 'BCG', 1, 'Pencegahan TBC', '2025-12-19 08:51:20'),
(3, 'POLIO_OPV', 'Polio (OPV)', 1, 'Polio oral', '2025-12-19 08:51:20'),
(4, 'POLIO_IPV', 'Polio (IPV)', 1, 'Polio suntik', '2025-12-19 08:51:20'),
(5, 'DPT_HB_HIB', 'DPT-HB-Hib (Pentavalen)', 1, 'Difteri, Pertusis, Tetanus, Hepatitis B, Hib', '2025-12-19 08:51:20'),
(6, 'MR', 'MR (Measles-Rubella)', 1, 'Campak dan Rubella', '2025-12-19 08:51:20');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `children`
--
ALTER TABLE `children`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_children_created_by` (`created_by`),
  ADD KEY `idx_children_parent` (`parent_id`,`created_at`);

--
-- Indexes for table `consult_messages`
--
ALTER TABLE `consult_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_msg_sender` (`sender_id`),
  ADD KEY `idx_msg_thread` (`thread_id`,`created_at`);

--
-- Indexes for table `consult_threads`
--
ALTER TABLE `consult_threads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_thread_by` (`created_by`),
  ADD KEY `idx_threads_client` (`client_id`,`created_at`),
  ADD KEY `idx_threads_staff` (`staff_id`,`created_at`);

--
-- Indexes for table `education_posts`
--
ALTER TABLE `education_posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_edu_author` (`author_id`),
  ADD KEY `idx_edu_created` (`created_at`);

--
-- Indexes for table `elderly`
--
ALTER TABLE `elderly`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_elderly_created_by` (`created_by`),
  ADD KEY `idx_elderly_user` (`user_id`,`created_at`);

--
-- Indexes for table `immunizations`
--
ALTER TABLE `immunizations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_imm_by` (`recorded_by`),
  ADD KEY `fk_imm_vtype` (`vaccine_type_id`),
  ADD KEY `fk_imm_sched` (`schedule_id`),
  ADD KEY `idx_imm_child` (`child_id`,`given_at`);

--
-- Indexes for table `measurements`
--
ALTER TABLE `measurements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_measurements_person` (`person_type`,`person_id`,`recorded_at`),
  ADD KEY `fk_measurements_recorded_by` (`recorded_by`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_notif_recipient` (`recipient_id`,`is_read`,`created_at`);

--
-- Indexes for table `pmt`
--
ALTER TABLE `pmt`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pmt_by` (`recorded_by`),
  ADD KEY `idx_pmt_child` (`child_id`,`given_at`);

--
-- Indexes for table `pregnant_mothers`
--
ALTER TABLE `pregnant_mothers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_preg_created_by` (`created_by`),
  ADD KEY `idx_preg_user` (`user_id`,`created_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `vaccine_schedules`
--
ALTER TABLE `vaccine_schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_sched_vtype` (`vaccine_type_id`);

--
-- Indexes for table `vaccine_types`
--
ALTER TABLE `vaccine_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `children`
--
ALTER TABLE `children`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `consult_messages`
--
ALTER TABLE `consult_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `consult_threads`
--
ALTER TABLE `consult_threads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `education_posts`
--
ALTER TABLE `education_posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `elderly`
--
ALTER TABLE `elderly`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `immunizations`
--
ALTER TABLE `immunizations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `measurements`
--
ALTER TABLE `measurements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `pmt`
--
ALTER TABLE `pmt`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pregnant_mothers`
--
ALTER TABLE `pregnant_mothers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `vaccine_schedules`
--
ALTER TABLE `vaccine_schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `vaccine_types`
--
ALTER TABLE `vaccine_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `children`
--
ALTER TABLE `children`
  ADD CONSTRAINT `fk_children_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `fk_children_parent_id` FOREIGN KEY (`parent_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `consult_messages`
--
ALTER TABLE `consult_messages`
  ADD CONSTRAINT `fk_msg_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `fk_msg_thread` FOREIGN KEY (`thread_id`) REFERENCES `consult_threads` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `consult_threads`
--
ALTER TABLE `consult_threads`
  ADD CONSTRAINT `fk_thread_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `fk_thread_client` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `fk_thread_staff` FOREIGN KEY (`staff_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `education_posts`
--
ALTER TABLE `education_posts`
  ADD CONSTRAINT `fk_edu_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `elderly`
--
ALTER TABLE `elderly`
  ADD CONSTRAINT `fk_elderly_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `fk_elderly_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `immunizations`
--
ALTER TABLE `immunizations`
  ADD CONSTRAINT `fk_imm_by` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `fk_imm_child` FOREIGN KEY (`child_id`) REFERENCES `children` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_imm_sched` FOREIGN KEY (`schedule_id`) REFERENCES `vaccine_schedules` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_imm_vtype` FOREIGN KEY (`vaccine_type_id`) REFERENCES `vaccine_types` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `measurements`
--
ALTER TABLE `measurements`
  ADD CONSTRAINT `fk_measurements_recorded_by` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notif_recipient` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pmt`
--
ALTER TABLE `pmt`
  ADD CONSTRAINT `fk_pmt_by` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `fk_pmt_child` FOREIGN KEY (`child_id`) REFERENCES `children` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pregnant_mothers`
--
ALTER TABLE `pregnant_mothers`
  ADD CONSTRAINT `fk_preg_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `fk_preg_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `vaccine_schedules`
--
ALTER TABLE `vaccine_schedules`
  ADD CONSTRAINT `fk_sched_vtype` FOREIGN KEY (`vaccine_type_id`) REFERENCES `vaccine_types` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
