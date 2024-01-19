CREATE TABLE `links` (
	`id` text(15) PRIMARY KEY NOT NULL,
	`url` text(255) NOT NULL,
	`sus_link` text(255) NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
