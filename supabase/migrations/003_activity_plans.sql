-- ============================================
-- AFT NexGen Cloud — Migration 003
-- Activity Plans: stores plan metadata + parsed
-- Excel content as JSON for direct web rendering
-- ============================================

-- ⚠️ Drop if re-running (remove this line on first run if table doesn't exist)
DROP TABLE IF EXISTS activity_plans CASCADE;

-- ─── Activity Plans Table ─────────────────────
CREATE TABLE IF NOT EXISTS activity_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  fiscal_year TEXT NOT NULL CHECK (fiscal_year ~ '^\d{4}$'),
  club TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  quarter TEXT DEFAULT '',

  -- Status
  status TEXT NOT NULL DEFAULT 'รอดำเนินการ'
    CHECK (status IN ('ดำเนินการแล้ว', 'กำลังดำเนินการ', 'รอดำเนินการ')),

  -- Parsed file content (Excel rows → JSON array)
  -- e.g. [{"col1":"value","col2":"value"}, ...]
  excel_data JSONB DEFAULT '[]'::jsonb,
  excel_columns JSONB DEFAULT '[]'::jsonb, -- column headers

  -- Upload tracking
  file_url TEXT,
  file_type TEXT CHECK (file_type IN ('xlsx','xls','pdf','docx','link')),
  file_size INTEGER DEFAULT 0,
  original_filename TEXT DEFAULT '',
  uploaded_at TIMESTAMPTZ DEFAULT now(),
  uploaded_by UUID REFERENCES auth.users(id),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Indexes ──────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_activity_plans_fiscal_year ON activity_plans(fiscal_year);
CREATE INDEX IF NOT EXISTS idx_activity_plans_title ON activity_plans USING gin(to_tsvector('simple', title));
CREATE INDEX IF NOT EXISTS idx_activity_plans_status ON activity_plans(status);
CREATE INDEX IF NOT EXISTS idx_activity_plans_uploaded_by ON activity_plans(uploaded_by);

-- ─── Row-Level Security ───────────────────────
ALTER TABLE activity_plans ENABLE ROW LEVEL SECURITY;

-- Everyone can view approved/active plans
CREATE POLICY "viewers_can_view_plans"
  ON activity_plans
  FOR SELECT
  USING (true);

-- Only teachers/admins can insert/update/delete
CREATE POLICY "teachers_can_insert_plans"
  ON activity_plans
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles
      WHERE user_type = 'teacher'
    )
  );

CREATE POLICY "teachers_can_update_plans"
  ON activity_plans
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles
      WHERE user_type = 'teacher'
    )
  );

CREATE POLICY "teachers_can_delete_plans"
  ON activity_plans
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles
      WHERE user_type = 'teacher'
    )
  );

-- ─── Updated_at trigger ───────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_activity_plans_updated_at
  BEFORE UPDATE ON activity_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();