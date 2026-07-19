-- ============================================
-- AFT NexGen Cloud — Initial Database Schema
-- For Udon Thani Technical College (UDTC)
-- ============================================

-- 1. PROFILES TABLE
-- Extends auth.users with role and student information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'director', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROJECTS TABLE
-- Stores event/project data, budgets, and PDF references
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name_th TEXT NOT NULL,
  event_name_en TEXT NOT NULL,
  education_level TEXT NOT NULL,          -- e.g., "ปวช. 1", "ปวส. 2"
  semester TEXT NOT NULL,                  -- e.g., "1/2569", "2/2568"
  budget_received NUMERIC(12, 2) NOT NULL DEFAULT 0,
  budget_spent NUMERIC(12, 2) NOT NULL DEFAULT 0,
  responsible_person TEXT NOT NULL,
  responsible_id TEXT NOT NULL,
  pdf_template_path TEXT,                  -- Path in Supabase Storage bucket
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- 3. STORAGE BUCKET SETUP
-- Bucket for project PDF templates
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-pdfs', 'project-pdfs', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- PROFILES: Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- PROFILES: Admins and directors can view all profiles
CREATE POLICY "Directors and admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('director', 'admin')
    )
  );

-- PROJECTS: Students can view their own projects
CREATE POLICY "Students can view own projects"
  ON public.projects
  FOR SELECT
  USING (
    responsible_id = (
      SELECT student_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- PROJECTS: Directors and admins can view all projects
CREATE POLICY "Directors and admins can view all projects"
  ON public.projects
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('director', 'admin')
    )
  );

-- PROJECTS: Directors and admins can insert projects
CREATE POLICY "Directors and admins can insert projects"
  ON public.projects
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('director', 'admin')
    )
  );

-- PROJECTS: Directors and admins can update projects
CREATE POLICY "Directors and admins can update projects"
  ON public.projects
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('director', 'admin')
    )
  );

-- STORAGE: Project PDFs — authenticated users can read files
CREATE POLICY "Authenticated users can read project PDFs"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'project-pdfs' AND auth.role() = 'authenticated'
  );

-- STORAGE: Only admins can upload PDFs
CREATE POLICY "Admins can upload project PDFs"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'project-pdfs' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- TRIGGERS: Auto-update updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- AUTO-CREATE PROFILE ON USER SIGNUP
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, student_id, full_name, role)
  VALUES (
    NEW.id,
    SPLIT_PART(NEW.email, '@', 1),  -- Extract student_id from email
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'ไม่ระบุชื่อ / Unknown'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();