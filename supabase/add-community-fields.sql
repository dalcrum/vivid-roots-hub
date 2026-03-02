-- ============================================
-- ADD COMMUNITY & SCHOOL DETAIL COLUMNS
-- ============================================

-- Add new columns to the projects table
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS community_population integer,
ADD COLUMN IF NOT EXISTS school_name text,
ADD COLUMN IF NOT EXISTS school_size integer,
ADD COLUMN IF NOT EXISTS grades_served text;
