-- ============================================
-- AFT NexGen Cloud — Migration 005
-- Create "uploads" bucket (if not exists) + make public
-- ============================================

-- Insert the uploads bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
SELECT 'uploads', 'uploads', true, false, 52428800, NULL
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'uploads');

-- Make sure it's public
UPDATE storage.buckets SET public = true WHERE name = 'uploads';