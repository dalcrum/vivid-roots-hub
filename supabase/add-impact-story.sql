-- Add impact_story column for completed project narratives
ALTER TABLE projects ADD COLUMN IF NOT EXISTS impact_story TEXT DEFAULT NULL;
