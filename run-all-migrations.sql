-- ============================================
-- AFT NexGen Cloud — ALL MIGRATIONS IN ONE FILE
-- Copy ALL of this → Supabase Dashboard → SQL Editor → Run
-- ============================================

-- === 001: Initial Schema (profiles table) ===
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- === 002: Auth System (user_type column) ===
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'student'
  CHECK (user_type IN ('student', 'teacher', 'admin'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS student_id TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved'
  CHECK (status IN ('pending', 'approved', 'rejected'));

CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_student_id ON profiles(student_id);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);

-- === 003: Activity Plans table ===
DROP TABLE IF EXISTS activity_plans CASCADE;

CREATE TABLE IF NOT EXISTS activity_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  fiscal_year TEXT NOT NULL CHECK (fiscal_year ~ '^\d{4}$'),
  club TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  quarter TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'รอดำเนินการ'
    CHECK (status IN ('ดำเนินการแล้ว', 'กำลังดำเนินการ', 'รอดำเนินการ')),
  excel_data JSONB DEFAULT '[]'::jsonb,
  excel_columns JSONB DEFAULT '[]'::jsonb,
  file_url TEXT,
  file_type TEXT CHECK (file_type IN ('xlsx','xls','pdf','docx','link')),
  file_size INTEGER DEFAULT 0,
  original_filename TEXT DEFAULT '',
  uploaded_at TIMESTAMPTZ DEFAULT now(),
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_plans_fiscal_year ON activity_plans(fiscal_year);
CREATE INDEX IF NOT EXISTS idx_activity_plans_title ON activity_plans USING gin(to_tsvector('simple', title));
CREATE INDEX IF NOT EXISTS idx_activity_plans_status ON activity_plans(status);
CREATE INDEX IF NOT EXISTS idx_activity_plans_uploaded_by ON activity_plans(uploaded_by);

ALTER TABLE activity_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "viewers_can_view_plans"
  ON activity_plans FOR SELECT USING (true);

CREATE POLICY "teachers_can_insert_plans"
  ON activity_plans FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT id FROM profiles WHERE user_type = 'teacher')
  );

CREATE POLICY "teachers_can_update_plans"
  ON activity_plans FOR UPDATE
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE user_type = 'teacher')
  );

CREATE POLICY "teachers_can_delete_plans"
  ON activity_plans FOR DELETE
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE user_type = 'teacher')
  );

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

-- === Test insert (optional) ===
-- INSERT INTO activity_plans (title, fiscal_year, club, description, quarter, status, file_type)
-- VALUES ('ทดสอบแผน', '2569', 'ชมรมทดสอบ', 'แผนทดสอบระบบ', '1', 'รอดำเนินการ', 'xlsx');

-- SELECT * FROM activity_plans;