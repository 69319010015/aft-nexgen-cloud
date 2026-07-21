# 🚀 AFT NexGen Cloud

**ระบบบริหารจัดการโครงการและงบประมาณ วิทยาลัยเทคนิคอุดรธานี**
**Project & Budget Management System — Udon Thani Technical College (UDTC)**

[![GitHub Repository](https://img.shields.io/badge/GitHub-aft--nexgen--cloud-181717?style=flat&logo=github)](https://github.com/69319010015/aft-nexgen-cloud.git)

---

## ⚡ How to Run (วิธีรัน)

```
c:\Users\IT-PC\Downloads\aft-nexgen-cloud-main (1)\aft-nexgen-cloud-main
```

### Option 1: Double-Click (ง่ายที่สุด)
1. Open **File Explorer**
2. Go to your project folder
3. Double-click **`run-dev.bat`**
4. Open browser → **http://localhost:3000**

### Option 2: VS Code Terminal
```bash
cd "c:\Users\IT-PC\Downloads\aft-nexgen-cloud-main (1)\aft-nexgen-cloud-main"
npm install   # only the first time
npm run dev
```

### Demo Accounts
| Role | Username/Email | Password |
|------|---------------|----------|
| **Teacher** | `teacher@udontech.ac.th` | `69319010015` |
| **Admin (อวท.)** | `admin@udontech.ac.th` | `69319010015` |
| **Student** | `69319010015` | `1419902419920` |

> 💡 **Google OAuth** also available — requires `@udontech.ac.th` email domain

---

## 📋 Project Overview & Scope

**AFT NexGen Cloud** is an official vocational application built for Udon Thani Technical College (UDTC) to modernize and streamline project and budget management. It provides college directors, faculty, and student leaders with a Thai-language dashboard to track events, monitor budgets, manage failed students, process student registrations, and **upload/view annual activity plans with Excel data**.

### Key Objectives
- Replace paper-based or spreadsheet-driven project tracking with a centralized web platform
- Enforce strict authentication: Student ID + National ID (students) / Email + Password (teachers) / Google OAuth with `@udontech.ac.th` domain restriction
- Provide real-time budget overview (allocated vs. spent) with raw arithmetic calculations
- Support 3 user roles: **Guest** (read-only), **Student** (limited edit), **Teacher** (full admin)
- Manage failed students with reason tracking (ไม่เข้าแถว / ไม่เข้ากิจกรรม / ไม่เข้าลูกเสือ)
- Student self-registration with teacher approval workflow
- **Upload annual activity plans (Excel/PDF/DOCX) and parse Excel data into web tables**
- Secure document storage and retrieval via Supabase Storage
- Deploy on Vercel Free Tier with environment-protected API keys

### Tech Stack
| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16+ (App Router), TypeScript, Tailwind CSS |
| **Database** | Supabase (PostgreSQL with Row-Level Security) |
| **Storage** | Supabase Storage (private bucket, signed URLs) |
| **Auth** | Supabase Auth + Google OAuth + Middleware session guard |
| **Deployment** | Vercel (Free Tier) |
| **Theme** | Light/Dark mode with 60-30-10 color rule |

> See `TOOL.md` for full tech stack details.

---

## 🎯 Active Capabilities (What It Does)

### ✅ Live Dashboard Tracker
- **Overview Cards**: Top panel showing Total Students (1,840), AFT Committee (32), Total Events, Allocated Budget, and Remaining Budget
- **Activity Table**: Thai-only table with columns: ชื่อกิจกรรม, ระดับ/ภาคเรียน, สถานะการอนุมัติ (🟢อนุมัติ/🟠รอยืนยัน/🔴ไม่อนุมัติ), งบที่ได้รับ, งบที่ใช้ไป, ผู้รับผิดชอบ, อัปโหลดเอกสาร
- **Client-Side Fast Filter**: Instant text search with 200ms debounce
- **Responsive Design**: Adapts from mobile to desktop using Tailwind breakpoints

### ✅ Project Status Management
- 3 status badges: 🟢 อนุมัติ, 🟠 รอยืนยัน, 🔴 ไม่อนุมัติ
- Inline editing for teachers (click "แก้ไข" → input fields → "บันทึก")
- Drag-and-drop file upload (PDF, DOCX, PNG, JPG)
- Read-only view for students and guests

### ✅ Failed Students Report (รายงานนักศึกษาไม่ผ่านกิจกรรม)
- **3 reasons**: ไม่เข้าแถว, ไม่เข้ากิจกรรม, ไม่เข้าลูกเสือ
- Inline editing for logged-in users: edit semester, reason (dropdown), department (dropdown), room
- Teacher-only delete button (red "ลบ")
- Search filter by name, department, or semester

### ✅ Student/Teacher Authentication System
- **Student Login**: Student ID (11 digits) + National ID (13 digits)
- **Teacher Login**: Email + Password with `@udontech.ac.th` domain restriction
- **Admin (อวท.) Login**: Email + Password with `@udontech.ac.th` domain restriction
- **Google OAuth**: Sign in with Google — pre-filtered to `@udontech.ac.th` accounts only
- **Domain Check (Server-side)**: `/api/auth/login` validates email domain; rejects non-@udontech.ac.th with 403
- **OAuth Callback**: `/api/auth/callback` validates domain after Google sign-in; signs out if invalid
- **Registration**: Student self-registration → PENDING → Teacher approval
- **Password Recovery**: Teacher & Admin email reset
- **Role-Based UI**: Guest (read-only), Student (limited edit), Teacher (full admin)
- Teacher demo: `teacher@udontech.ac.th` / `69319010015`
- Admin demo: `admin@udontech.ac.th` / `69319010015`

### ✅ Annual Activity Plans (แผนปฏิบัติกิจกรรมประจำปีงบประมาณ)
- **Route**: `/annual-plan`
- **Upload**: Teacher-only — click 📤 อัปโหลดแผน / Upload Plan → fill form + select file (xlsx/xls/pdf/docx)
- **Excel Parsing**: `.xlsx` / `.xls` files are parsed server-side with the `xlsx` library — column headers and row data are extracted and stored as JSONB in Supabase
- **Data Display**: Each plan card shows title, club, fiscal year, quarter, status badge. Click to expand — reveals parsed Excel data in a grid table
- **Status**: New uploads automatically set to "✅ ดำเนินการแล้ว" (no pending approval needed since only teachers can upload)
- **Delete**: Teacher-only 🗑️ trash icon on each card — deletes from database with confirmation dialog
- **Filter**: Search by title/club/description + filter by fiscal year dropdown
- **Database**: `activity_plans` table with JSONB columns (`excel_columns`, `excel_data`) for parsed content
- **API**: `/api/activity-plans` with GET (list), POST (upload), DELETE (remove)

### ✅ Gemini-Style Sidebar Navigation
- Opens by default on page load
- **4 permission-gated groups**:
  - 📦 **กลุ่ม 1: หน้าแรกและข้อมูลทั่วไป** — Everyone
  - 🎓 **กลุ่ม 2: Student** — Logged-in users only (⚠️ รายงานนักศึกษาไม่ผ่านกิจกรรม)
  - 👨‍🏫 **กลุ่ม 3: Teacher** — Teacher only (🧑‍🏫 Teacher Dashboard → `/dashboard`)
  - 🏫 **กลุ่ม 4: Admin/Teacher อวท.** — Teacher only (🧑‍🏫 แดชบอร์ดอาจารย์ อวท.(admin) → `/dashboard`)
- ⚙️ ตั้งค่า button opens Settings Modal
- Responsive with mobile backdrop overlay

### ✅ Teacher Dashboard (แดชบอร์ดอาจารย์)
- Located at `/dashboard` (moved from homepage)
- Pending registration approval queue with inline editing
- Approve/reject buttons for each pending student
- Bulk delete by academic year with double-confirmation modal
- Department and level dropdown selectors
- **Teacher only** — hidden from students and guests

### ✅ Settings & Preferences (การตั้งค่า)
- **Trigger buttons**: ⚙️ ตั้งค่า in both Sidebar and Header
- **Modal**: Appearance (โหมดสว่าง/โหมดมืด pills), Typography (Noto Sans Thai / TH Sarabun), Text Size (เล็ก/กลาง/ใหญ่), Notifications (เปิดใช้งาน/ปิดใช้งาน with browser permission)
- **Persistence**: Font style, text size, notification preference saved to localStorage
- **Draft-state pattern**: Changes staged locally; only applied on Save

### ✅ Facebook Feed (ข่าวสารล่าสุด)
- Embedded Facebook-style feed in `#section-home` on the main page
- **5 mock posts**: Each with image, title, date, and thumbnail gradient overlay
- **Carousel controls**: Previous/Next arrows + 5 pagination dots
- **Post counter**: Shows current page (e.g. 1/5) in footer
- **Data source**: Hard-coded mock posts in `FacebookFeed.tsx`

### ✅ Additional Pages
- **แผนปฏิบัติกิจกรรมประจำปีงบประมาณ / Annual Plan** (`/annual-plan`) — Annual budget activity plan with Excel upload & parsing
- **ชมรมวิชาชีพ / Club** (`/club`) — Professional club directory with search and filters
- **ระเบียบและแนวทางการปฏิบัติ อวท. / Regulations** (`/regulations`) — Activity guidelines and regulations
- **แบบฟอร์ม อวท. / AFT Forms** (`/aft-forms`) — Document download library page
- **คลังไฟล์รวม / Files Management** (`/files-management`) — Central file repository
- **แดชบอร์ดโครงการ / Dashboard** (`/dashboard`) — Project dashboard overview + Teacher Dashboard
- **ผลสรุปส่งโครงการ / Project Summary** (`/project-summary`) — Project submission summary
- **สรุปเล่มโครงการ / Book Summary** (`/book-summary`) — Project book summary
- **Google Map** — Embedded college location map

### ✅ Database Connection Models
- **Supabase Browser Client** (`src/lib/supabase/client.ts`): Client components
- **Supabase Server Client** (`src/lib/supabase/server.ts`): Server components & route handlers
- **Supabase Admin Client** (`src/lib/supabase/admin.ts`): Service role operations (bypasses RLS)

### ✅ Secure PDF Downloads
- Government PDF templates stored in private Supabase Storage bucket (`project-pdfs`)
- Downloads served via 60-second expiration signed URLs
- RLS policies for authorized document access

---

## 🏗️ Build Checklist

### ✅ Completed
- [x] Next.js 16 project with TypeScript, Tailwind CSS, App Router
- [x] Custom Tailwind configuration with 60-30-10 color palette and `darkMode: 'class'`
- [x] CSS custom properties for Light/Dark theme
- [x] Supabase browser, server, and admin client utilities
- [x] Database type definitions (`Project`, `Profile`, `RegistrationRequest`)
- [x] Budget calculation utilities (raw arithmetic)
- [x] Thai National ID validation utility (checksum algorithm)
- [x] `ThemeProvider` + `SupabaseProvider` + `TabProvider` context wrappers
- [x] `ClientLayout` — client-side layout with sidebar + header
- [x] Gemini-style Sidebar with 4 nav sections (General, Student, Teacher, Admin/Teacher อวท.)
- [x] OverviewCards — 5 metric stat cards
- [x] DataTable — Thai-only with status badges, inline editing, file upload
- [x] FilterInput — debounced client-side search
- [x] FileUploader — Drag & drop (PDF, DOCX, PNG, JPG)
- [x] DownloadButton — Supabase Storage signed URL
- [x] TeacherDashboard — pending approvals, inline edit, bulk year delete (at `/dashboard`)
- [x] FacebookFeed — embedded Facebook page widget
- [x] GoogleMap — embedded college location map
- [x] Login page — 3 tabs: นักเรียน/นักศึกษา อวท., อาจารย์, อาจารย์ อวท.
- [x] Login page — Google OAuth button with `hd: "udontech.ac.th"` pre-filter
- [x] Login page — domain validation error display
- [x] Register page — Student self-registration with department/level
- [x] Pending approval page
- [x] Club page — filtered mock club table
- [x] Forms page — document download library
- [x] Guidelines page — activity guidelines
- [x] Proposal page — project proposal submission
- [x] Summary page — summary reports
- [x] Middleware — route protection, PENDING user redirect
- [x] API routes: `/api/auth/*` (login, register, recover, requests, approve, callback)
- [x] OAuth callback route (`/api/auth/callback`) — email domain validation + session setup
- [x] Server-side email domain restriction (`@udontech.ac.th`) in login API
- [x] Dashboard layout — no Header (clean page)
- [x] Database migrations — `profiles`, `projects`, `registration_requests`, `activity_plans` tables
- [x] `.env.local` with Supabase credentials configured (URL + anon key + service role key)
- [x] Demo data pre-loaded for immediate visual testing
- [x] Teacher demo account (`teacher@udontech.ac.th` / `69319010015`)
- [x] Admin demo account (`admin@udontech.ac.th` / `69319010015`)
- [x] Sidebar opens by default
- [x] RBAC: Guest/Student/Teacher role-based UI (edit buttons, delete, upload hidden per role)
- [x] Failed students reason tracking with inline edit
- [x] Failed students room text input in edit mode
- [x] Teacher-only delete for failed students
- [x] SettingsProvider — font style (Kanit/TH Sarabun), text size, notification preferences with localStorage persistence
- [x] SettingsModal — Appearance/Light-Dark pills, Typography, Text Size slider, Notifications toggle
- [x] Thai localization — all Settings text translated to Thai
- [x] FacebookFeed — 5 mock posts with image carousel, pagination dots, prev/next controls
- [x] **Activity Plans page** (`/annual-plan`) with upload modal, Excel parsing, data display, delete button
- [x] **API route** `/api/activity-plans` — GET (list), POST (upload with file + form), DELETE (by id)
- [x] **Excel parsing** — `xlsx` npm library reads `.xlsx`/`.xls` → columns + rows stored as JSONB in `excel_columns` / `excel_data`
- [x] **Service role key** in `.env.local` for admin client bypassing RLS
- [x] **Demo user auth** — API checks `aft-user-type` cookie fallback for teacher demo accounts
- [x] **Database migration** `003_activity_plans.sql` — table with RLS policies, indexes, auto-update trigger

### 🔲 Pending (Future Phases)
- [ ] Configure Google OAuth in Supabase Dashboard (Authentication → Providers → Google)
- [ ] Upload government PDF templates to `project-pdfs` storage bucket
- [ ] Configure Vercel deployment with environment variables
- [ ] End-to-end testing with real authentication and data
- [ ] User management (admin panel for creating accounts)
- [ ] Detailed project reporting/export features

---

## 📁 Project Structure

```
aft-nexgen-cloud/
├── .env.example                     # Environment variable template
├── .env.local                       # Local Supabase credentials (configured)
├── .gitignore
├── README.md
├── TOOL.md                          # Tech stack & tools reference
├── AGENTS.md
├── CLAUDE.md
├── next.config.ts
├── tailwind.config.ts               # Custom 60-30-10 palette + darkMode
├── tsconfig.json
├── package.json
├── postcss.config.mjs
├── eslint.config.mjs
├── install-deps.bat                 # Windows dependency install script
├── run-dev.bat                      # Windows dev server runner
├── run-all-migrations.sql           # Combined SQL migrations (for Supabase SQL Editor)
├── supabase-guide.md                # Guide for running migrations
├── public/
│   ├── images/
│   │   └── aft-logo.png             # AFT NexGen Cloud logo
│   └── *.svg                        # Next.js default SVGs
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql   # Base schema, RLS, triggers
│       ├── 002_auth_system.sql      # Auth system v2
│       └── 003_activity_plans.sql   # Activity plans table + Excel JSON columns
└── src/
    ├── middleware.ts                 # Route protection
    ├── app/
    │   ├── layout.tsx               # Root layout + providers (Supabase → Theme → Settings)
    │   ├── globals.css              # CSS variables, Tailwind directives
    │   ├── page.tsx                 # Main SPA: all sections
    │   ├── login/page.tsx           # 3 tabs + Google OAuth + domain error
    │   ├── register/page.tsx
    │   ├── pending/page.tsx
    │   ├── annual-plan/page.tsx     # Annual Activity Plan page
    │   ├── club/page.tsx
    │   ├── forms/page.tsx
    │   ├── guidelines/page.tsx
    │   ├── proposal/page.tsx
    │   ├── summary/page.tsx
    │   ├── dashboard/
    │   │   ├── layout.tsx           # Clean layout (no Header)
    │   │   └── page.tsx             # TeacherDashboard + ActivityListView
    │   └── api/
    │       ├── activity-plans/
    │       │   └── route.ts         # GET (list) + POST (upload) + DELETE
    │       ├── auth/
    │       │   ├── callback/route.ts
    │       │   └── ...
    │       └── projects/route.ts
    ├── components/
    │   ├── layout/
    │   │   ├── ClientLayout.tsx
    │   │   ├── Header.tsx           # ⚙️ Settings button + Sign In/Out + ThemeToggle
    │   │   └── Sidebar.tsx          # 4 groups + ⚙️ Settings + login
    │   ├── providers/
    │   │   ├── ThemeProvider.tsx
    │   │   ├── SupabaseProvider.tsx
    │   │   └── TabProvider.tsx
    │   └── ui/
    │       ├── OverviewCards.tsx
    │       ├── DataTable.tsx
    │       ├── FilterInput.tsx
    │       ├── DownloadButton.tsx
    │       ├── FileUploader.tsx
    │       ├── TeacherDashboard.tsx
    │       ├── FacebookFeed.tsx      # 5 mock posts + carousel
    │       ├── GoogleMap.tsx
    │       ├── ThemeToggle.tsx
    │       ├── SettingsProvider.tsx  # Context for font/size/notif settings
    │       └── SettingsModal.tsx     # Settings pop-up modal UI
    └── lib/
        ├── supabase/
        │   ├── client.ts
        │   ├── server.ts
        │   └── admin.ts
        ├── hooks/
        │   └── useProjects.ts
        ├── utils/
        │   ├── calculations.ts
        │   └── validation.ts
        └── types/
            └── database.ts
```

---

## 🔧 Environment Variables Setup

### Local Development

The `.env.local` file is already configured with Supabase credentials:

```
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://plsevkiwvivrqjjuuvgn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_cP2ZTP5wWyEaYVcNq0xGlQ_3rV3E8Na
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (set in local .env only)
```

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/publishable key | ✅ Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (bypasses RLS — set in local .env only) | ✅ For admin operations |
| `NEXT_PUBLIC_SITE_URL` | Site URL for OAuth redirects (e.g. `http://localhost:3000`) | ✅ For OAuth |
| `DEEPSEEK_API_KEY` | For future AI features | ❌ Optional |

> **⚠️ SECURITY WARNING**: Never commit `.env.local` to version control.

---

## 🧭 Where to Change Things (อยากแก้ไขอะไร → ไปที่ไฟล์ไหน)

| อยากเปลี่ยน / I want to change... | ไฟล์ / File | บรรทัด / Line |
|---|---|---|
| **ปุ่ม Settings** (ข้อความ, สไตล์) | `src/components/layout/Sidebar.tsx` | 335-342 |
| **ปุ่ม Settings** (ใน Header) | `src/components/layout/Header.tsx` | 57-66 |
| **ข้อความใน Modal Settings** | `src/components/ui/SettingsModal.tsx` | 106, 125-142, 154-183, 191-218, 224-229 |
| **Font Style options** (เพิ่ม/ลดฟอนต์) | `src/components/ui/SettingsProvider.tsx` | 26-30 |
| **Text Size values** | `src/components/ui/SettingsProvider.tsx` | 33-37 |
| **Facebook Feed — รูป/ข้อความโพสต์** | `src/components/ui/FacebookFeed.tsx` | 40-115 (mock posts array) |
| **Activity Plans — Upload form fields** | `src/views/annual-plan/AnnualPlanView.tsx` | 195-230, 367-403 |
| **Activity Plans — Excel parsing logic** | `src/app/api/activity-plans/route.ts` | 182-196 |
| **Activity Plans — Status on upload** | `src/app/api/activity-plans/route.ts` | 200 (`status: "ดำเนินการแล้ว"`) |
| **Theme colors (Light/Dark)** | `src/app/globals.css` | 8-56 |
| **Nav menu items (Sidebar)** | `src/components/layout/Sidebar.tsx` | 202-290 (4 groups) |
| **ปุ่มเมนูบนหน้าแรก (HomeView)** | `src/views/home/HomeView.tsx` | 9-16 (DEPARTMENT_ROUTES) |
| **Failed student mock data** | `src/components/layout/Sidebar.tsx` | 36-42 |
| **Activities table data** | `src/app/page.tsx` | 20-26 |
| **Overview dashboard stats** | `src/components/ui/OverviewCards.tsx` | 30-85 |
| **Login form — tabs & Google OAuth** | `src/app/login/page.tsx` | entire file |
| **Domain restriction (@udontech.ac.th)** | `src/app/api/auth/login/route.ts` | 35-43 |
| **OAuth callback logic** | `src/app/api/auth/callback/route.ts` | entire file |
| **Register form** | `src/app/register/page.tsx` | entire file |
| **Teacher Dashboard** | `src/components/ui/TeacherDashboard.tsx` | entire file |
| **Dashboard page** | `src/app/dashboard/page.tsx` | entire file |
| **Database schema** | `supabase/migrations/*.sql` | per migration |

---

## 🗄️ Database Setup (Supabase)

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Go to SQL Editor** → New Query
3. **Run the migrations in order:**
   - First: `supabase/migrations/001_initial_schema.sql`
   - Second: `supabase/migrations/002_auth_system.sql`
   - Third: `supabase/migrations/003_activity_plans.sql`
4. **Or use the combined file:** Copy all from `run-all-migrations.sql` → paste → Run (one-shot)
5. **Execute** the SQL to create tables (`profiles`, `projects`, `registration_requests`, `activity_plans`), RLS policies, and storage bucket
6. **Add users** via Supabase Auth dashboard
7. **For Google OAuth**: Supabase Dashboard → Authentication → Providers → Google → Enable with `@udontech.ac.th` domain

### Activity Plans Table Structure (`activity_plans`)

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (auto) | Primary key |
| `title` | TEXT | Plan name |
| `fiscal_year` | TEXT | e.g. "2569" |
| `club` | TEXT | Club name |
| `description` | TEXT | Plan details |
| `quarter` | TEXT | "1", "2", "3", "4" |
| `status` | TEXT | ดำเนินการแล้ว / กำลังดำเนินการ / รอดำเนินการ |
| `excel_data` | JSONB | Parsed Excel rows as JSON array |
| `excel_columns` | JSONB | Excel column headers as JSON array |
| `file_url` | TEXT | Link to uploaded file |
| `file_type` | TEXT | xlsx / xls / pdf / docx / link |
| `file_size` | INTEGER | File size in bytes |
| `original_filename` | TEXT | Original uploaded filename |
| `uploaded_at` | TIMESTAMPTZ | Upload timestamp |
| `uploaded_by` | UUID | Links to auth.users |

---

## 🎨 Color System

The interface follows the **60-30-10 rule**:

| Role | Light Mode | Dark Mode |
|------|-----------|-----------|
| **60% Dominant** — Backgrounds | `#FFFFFF` White, `#F8FAFC` Slate-50 | `#0F172A` Slate-900, `#1E293B` Slate-800 |
| **30% Secondary** — Text, Navigation, Structure | `#0F172A` Slate-900, `#1E3A8A` Blue-900 | `#F1F5F9` Slate-100, `#CBD5E1` Slate-300 |
| **10% Accent** — CTAs, Status, Alerts | `#EAB308` Yellow-500, `#FACC15` Yellow-400 | `#FACC15` Yellow-400, `#EAB308` Yellow-500 |

---

## 👥 User Roles & Permissions

| Feature | Guest | Student (login) | Teacher (login) |
|---|---|---|---|
| View dashboard | ✅ | ✅ | ✅ |
| View failed students | ✅ | ✅ | ✅ |
| Edit failed students | ❌ | ✅ | ✅ |
| Delete failed students | ❌ | ❌ | ✅ |
| View teacher tab | ❌ | ❌ | ✅ |
| Approve registrations | ❌ | ❌ | ✅ |
| Edit project table | ❌ | ❌ | ✅ |
| Upload files | ❌ | ❌ | ✅ |
| **Upload activity plans** | ❌ | ❌ | ✅ |
| **Delete activity plans** | ❌ | ❌ | ✅ |
| View club directory | ✅ | ✅ | ✅ |
| View forms/guidelines | ✅ | ✅ | ✅ |
| Submit proposals | ✅ | ✅ | ✅ |
| Google OAuth | ✅ | ✅ | ✅ |

---

## 📝 License

**AFT NexGen Cloud** — Official project of Udon Thani Technical College (UDTC).
Developed for educational administration purposes only.

---

## 📋 Recent Updates (7/21/2026)

| Feature | Description |
|---|---|
| **Activity Plans — Full CRUD** | New `/api/activity-plans` route with GET, POST, DELETE. Teacher-only upload with file + form. |
| **Excel Parsing** | `xlsx` npm library parses `.xlsx`/`.xls` files server-side — columns and rows stored as JSONB in `activity_plans` table |
| **Activity Plans Page** | `/annual-plan` — real data from Supabase (not mock). Expandable cards show parsed Excel grid. |
| **Delete Activity Plans** | Teacher-only 🗑️ trash button with confirmation dialog |
| **Status on Upload** | New uploads automatically set to "ดำเนินการแล้ว" (no pending approval needed) |
| **Combined Migration File** | `run-all-migrations.sql` — one file to run all 3 migrations at once |
| **Supabase Connection** | `.env.local` fully configured with URL, anon key, and service role key |
| **Service Role Client** | `createAdminClient()` bypasses RLS for demo teacher accounts |

*Built with Next.js, Supabase, Tailwind CSS, and ☕ by the UDTC development team.*