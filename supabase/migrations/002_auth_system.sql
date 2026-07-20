-- ============================================
-- AFT NexGen Cloud — Auth System V2
-- Student/Teacher roles, approval flow, recovery
-- ============================================

-- 1. ENRICH PROFILES TABLE
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS user_type TEXT NOT NULL DEFAULT 'student' CHECK (user_type IN ('student', 'teacher')),
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'APPROVED' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- For teacher profiles, set default status to APPROVED and user_type to teacher
-- (admins will handle this via the admin dashboard)

-- 2. STUDENT REGISTRATION REQUESTS TABLE
-- Queue for teachers to review pending student signups
CREATE TABLE IF NOT EXISTS public.registration_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  department TEXT,
  level TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS POLICIES FOR REGISTRATION_REQUESTS
ALTER TABLE public.registration_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a registration request (public signup)
CREATE POLICY "Anyone can create registration requests"
  ON public.registration_requests
  FOR INSERT
  WITH CHECK (true);

-- Teachers can view all registration requests
CREATE POLICY "Teachers can view all registration requests"
  ON public.registration_requests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND user_type = 'teacher'
    )
  );

-- Teachers can update registration requests (approve/reject)
CREATE POLICY "Teachers can update registration requests"
  ON public.registration_requests
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND user_type = 'teacher'
    )
  );

-- Students can view their own request
CREATE POLICY "Students can view own request"
  ON public.registration_requests
  FOR SELECT
  USING (student_id = SPLIT_PART(auth.email(), '@', 1));

-- 4. UPDATE PROFILE AUTO-CREATION TRIGGER
-- Respect user_type and status from user metadata
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  _user_type TEXT;
  _status TEXT;
  _full_name TEXT;
BEGIN
  _user_type := COALESCE(NEW.raw_user_meta_data->>'user_type', 'student');
  _status := CASE WHEN _user_type = 'teacher' THEN 'APPROVED' ELSE 'PENDING' END;
  _full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'ไม่ระบุชื่อ / Unknown');

  INSERT INTO public.profiles (id, student_id, full_name, role, user_type, status, email)
  VALUES (
    NEW.id,
    SPLIT_PART(NEW.email, '@', 1),
    _full_name,
    CASE WHEN _user_type = 'teacher' THEN 'admin' ELSE 'student' END,
    _user_type,
    _status,
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop old trigger and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 5. POLICY: Students with PENDING status can only read limited data
-- Drop old policy that allows all students to view projects
DROP POLICY IF EXISTS "Students can view own projects" ON public.projects;

-- New policy: Only APPROVED students can view own projects
CREATE POLICY "Approved students can view own projects"
  ON public.projects
  FOR SELECT
  USING (
    responsible_id = (
      SELECT student_id FROM public.profiles WHERE id = auth.uid()
    )
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND status = 'APPROVED'
    )
  );