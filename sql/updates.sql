SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+07:00";

DROP TABLE IF EXISTS updates;

CREATE TABLE `updates` (
  `id` int(10) UNSIGNED NOT NULL,
  `update_text` text NOT NULL,
  `image_path` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `updates`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `updates`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
