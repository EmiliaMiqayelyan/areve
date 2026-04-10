-- Run once on existing databases (skip any statement that errors if column already exists).
ALTER TABLE settings ADD COLUMN tiktok_url VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE settings ADD COLUMN youtube_url VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE settings ADD COLUMN site_content JSON NULL;
