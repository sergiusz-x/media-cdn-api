CREATE TABLE `mediacdn_images` (
  `id` int(11) NOT NULL,
  `hash_id` text NOT NULL,
  `timestamp_created` text NOT NULL,
  `channel_id` text NOT NULL,
  `message_id` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `mediacdn_images`
  ADD PRIMARY KEY (`id`);