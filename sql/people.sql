SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+07:00";

DROP TABLE IF EXISTS people;

CREATE TABLE `people` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `catatan` text NOT NULL,
  `bank_id` int(10) NOT NULL,
  `nominal` text NOT NULL,
  `image_path` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `people`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `people`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
