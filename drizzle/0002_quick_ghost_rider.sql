ALTER TABLE `onboarding_submissions` ADD `dealership_address` text;--> statement-breakpoint
ALTER TABLE `onboarding_submissions` ADD `dealership_phone` varchar(50);--> statement-breakpoint
ALTER TABLE `onboarding_submissions` ADD `primary_contact_name` varchar(255);--> statement-breakpoint
ALTER TABLE `onboarding_submissions` ADD `primary_contact_email` varchar(320);--> statement-breakpoint
ALTER TABLE `onboarding_submissions` ADD `primary_contact_cell` varchar(50);--> statement-breakpoint
ALTER TABLE `onboarding_submissions` DROP COLUMN `contact_email`;--> statement-breakpoint
ALTER TABLE `onboarding_submissions` DROP COLUMN `contact_phone`;