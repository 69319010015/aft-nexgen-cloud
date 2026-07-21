-- ============================================
-- AFT NexGen Cloud — Migration 005
-- Make "uploads" bucket public so file URLs work
-- ============================================

UPDATE storage.buckets SET public = true WHERE name = 'uploads';