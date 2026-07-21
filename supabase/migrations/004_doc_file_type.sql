-- ============================================
-- AFT NexGen Cloud — Migration 004
-- Add "doc" to file_type CHECK constraint
-- Allows .doc (Word 97-2003) files to be uploaded
-- ============================================

-- Remove old constraint
ALTER TABLE activity_plans DROP CONSTRAINT IF EXISTS activity_plans_file_type_check;

-- Add new constraint with "doc" included
ALTER TABLE activity_plans ADD CONSTRAINT activity_plans_file_type_check 
  CHECK (file_type IN ('xlsx','xls','pdf','docx','doc','link'));