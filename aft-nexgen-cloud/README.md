# 🚀 AFT NexGen Cloud

**ระบบบริหารจัดการโครงการและงบประมาณ วิทยาลัยเทคนิคอุดรธานี**
**Project & Budget Management System — Udon Thani Technical College (UDTC)**

[![GitHub Repository](https://img.shields.io/badge/GitHub-aft--nexgen--cloud-181717?style=flat&logo=github)](https://github.com/69319010015/aft-nexgen-cloud)

---

## ⚡ How to Run (วิธีรัน)

**Your project is located at:**
```
d:\Project อวท (old 7.16.2026)\aft-nexgen-cloud
```

### Option 1: Double-Click (ง่ายที่สุด)
1. Open **File Explorer**
2. Go to `d:\Project อวท (old 7.16.2026)\aft-nexgen-cloud`
3. Double-click **`run-dev.bat`**
4. Open your browser → **http://localhost:3000**

### Option 2: VS Code Terminal
```bash
cd "d:\Project อวท (old 7.16.2026)\aft-nexgen-cloud"
npm install   # only the first time
npm run dev
```

### Demo Accounts
| Role | Username/Email | Password |
|---|---|---|
| **Teacher** | `teacher@udontech.ac.th` | `69319010015` |
| **Student** | `69319010015` | `1419902419920` |

---

## 📋 Project Overview & Scope

**AFT NexGen Cloud** is an official vocational application built for Udon Thani Technical College (UDTC) to modernize and streamline project and budget management. It provides college directors, faculty, and student leaders with a Thai-language dashboard to track events, monitor budgets, manage failed students, and process student registrations.

### Key Objectives
- Replace paper-based or spreadsheet-driven project tracking with a centralized web platform
- Enforce strict authentication: Student ID + National ID (students) / Email + Password (teachers)
- Provide real-time budget overview (allocated vs. spent) with raw arithmetic calculations
- Support 3 user roles: **Guest** (read-only), **Student** (limited edit), **Teacher** (full admin)
- Manage failed students with reason tracking (ไม่เข้าแถว / ไม่เข้ากิจกรรม / ไม่เข้าลูกเสือ)
- Student self-registration with teacher approval workflow
- Secure PDF document storage and retrieval via Supabase Storage (signed URLs)
- Deploy on Vercel Free Tier with environment-protected API keys

### Tech Stack
| Layer        | Technology                               |
|--------------|------------------------------------------|
| **Frontend** | Next.js 16+ (App Router), TypeScript, Tailwind CSS |
| **Database** | Supabase (PostgreSQL with Row-Level Security) |
| **Storage**  | Supabase Storage (private bucket, signed URLs) |
| **Auth**     | Supabase Auth + Middleware session guard |
| **Deployment** | Vercel (Free Tier)                     |
| **Theme**    | Light/Dark mode with 60-30-10 color rule |

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
- **Teacher Login**: Email + Password
- **Registration**: Student self-registration → PENDING → Teacher approval
- **Password Recovery**: Teacher-only email reset
- **Role-Based UI**: Guest (read-only), Student (limited edit), Teacher (full admin)
- Teacher demo: `teacher@udontech.ac.th` / `69319010015`

### ✅ Gemini-Style Sidebar Navigation
- Opens by default on page load
- Two permanent tabs: Dashboard (📊) + Failed Students (⚠️)
- Teacher-only tab: ยืนยันการสมัคร (🧑‍🏫)
- ⚙️ ตั้งค่า button opens Settings Modal
- Responsive with mobile backdrop overlay

### ✅ Teacher Dashboard (แดชบอร์ดอาจารย์)
- Pending registration approval queue with inline editing
- Approve/reject buttons for each pending student
- Bulk delete by academic year with double-confirmation modal
- Department and level dropdown selectors

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
- **แผนปฏิบัติกิจกรรมประจำปีงบประมาณ / Annual Plan** (`/annual-plan`) — Annual budget activity plan
- **ชมรมวิชาชีพ / Club** (`/club`) — Professional club directory with search and filters
- **ระเบียบและแนวทางการปฏิบัติ อวท. / Regulations** (`/regulations`) — Activity guidelines and regulations
- **แบบฟอร์ม อวท. / AFT Forms** (`/aft-forms`) — Document download library page
- **คลังไฟล์รวม / Files Management** (`/files-management`) — Central file repository
- **แดชบอร์ดโครงการ / Dashboard** (`/dashboard`) — Project dashboard overview
- **ผลสรุปส่งโครงการ / Project Summary** (`/project-summary`) — Project submission summary
- **สรุปเล่มโครงการ / Book Summary** (`/book-summary`) — Project book summary
- **Google Map** — Embedded college location map

### ✅ Database Connection Models
- **Supabase Browser Client** (`src/lib/supabase/client.ts`): Client components
- **Supabase Server Client** (`src/lib/supabase/server.ts`): Server components & route handlers
- **Supabase Admin Client** (`src/lib/supabase/admin.ts`): Service role operations

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
- [x] Gemini-style Sidebar with 4 nav sections (Dashboard, Failed, Teacher, Club)
- [x] OverviewCards — 5 metric stat cards
- [x] DataTable — Thai-only with status badges, inline editing, file upload
- [x] FilterInput — debounced client-side search
- [x] FileUploader — Drag & drop (PDF, DOCX, PNG, JPG)
- [x] DownloadButton — Supabase Storage signed URL
- [x] TeacherDashboard — pending approvals, inline edit, bulk year delete
- [x] FacebookFeed — embedded Facebook page widget
- [x] GoogleMap — embedded college location map
- [x] Login page — Student ID/National ID + Email/Password tabs
- [x] Register page — Student self-registration with department/level
- [x] Pending approval page
- [x] Club page — filtered mock club table
- [x] Forms page — document download library
- [x] Guidelines page — activity guidelines
- [x] Proposal page — project proposal submission
- [x] Summary page — summary reports
- [x] Middleware — route protection, PENDING user redirect
- [x] API routes: `/api/auth/*` (login, register, recover, requests, approve)
- [x] Database migrations — `profiles`, `projects`, `registration_requests` tables + auth v2
- [x] `.env.local` with Supabase credentials configured
- [x] Demo data pre-loaded for immediate visual testing
- [x] Teacher demo account (`teacher@udontech.ac.th` / `69319010015`)
- [x] Sidebar opens by default
- [x] RBAC: Guest/Student/Teacher role-based UI (edit buttons, delete, upload hidden per role)
- [x] Failed students reason tracking with inline edit
- [x] Failed students room text input in edit mode
- [x] Teacher-only delete for failed students
- [x] SettingsProvider — font style (Noto/TH Sarabun), text size, notification preferences with localStorage persistence
- [x] SettingsModal — Appearance/Light-Dark pills, Typography (ฟอนต์มาตรฐานปัจจุบัน, TH Sarabun), Text Size (เล็ก/กลาง/ใหญ่), Notifications toggle
- [x] Thai localization — all Settings text translated to Thai
- [x] Toggle knob color — gray for all ON/OFF states regardless of theme
- [x] FacebookFeed — 5 mock posts with image carousel, pagination dots, prev/next controls

### 🔲 Pending (Future Phases)
- [ ] Run database migration on Supabase SQL Editor
- [ ] Create Supabase Auth users with real email/password
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
├── TOOL.md                          # Tech stack & tools reference (← including Settings + Facebook Feed docs)
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
├── mcp-filesystem.bat               # MCP filesystem config
├── public/
│   ├── images/
│   │   └── aft-logo.png             # AFT NexGen Cloud logo
│   └── *.svg                        # Next.js default SVGs
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql   # Base schema, RLS, triggers
│       └── 002_auth_system.sql      # Auth system v2
└── src/
    ├── middleware.ts                 # Route protection
    ├── app/
    │   ├── layout.tsx               # Root layout + providers (Supabase → Theme → Settings)
    │   ├── globals.css              # CSS variables, Tailwind directives
    │   ├── page.tsx                 # Main SPA: all sections
    │   ├── favicon.ico
    │   ├── login/page.tsx
    │   ├── register/page.tsx
    │   ├── pending/page.tsx
    │   ├── club/page.tsx
    │   ├── forms/page.tsx
    │   ├── guidelines/page.tsx
    │   ├── proposal/page.tsx
    │   ├── summary/page.tsx
    │   └── api/auth/*
    ├── components/
    │   ├── layout/
    │   │   ├── ClientLayout.tsx
    │   │   ├── Header.tsx           # ⚙️ Settings button + Sign In/Out + ThemeToggle
    │   │   └── Sidebar.tsx          # ⚙️ Settings button + nav items + login
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
```

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/publishable key | ✅ Yes |
| `DEEPSEEK_API_KEY` | For future AI features | ❌ Optional |

> **⚠️ SECURITY WARNING**: Never commit `.env.local` to version control.

---

## 🧭 Where to Change Things (อยากแก้ไขอะไร → ไปที่ไฟล์ไหน)

| อยากเปลี่ยน / I want to change... | ไฟล์ / File | บรรทัด / Line |
|---|---|---|
| **ปุ่ม Settings** (ข้อความ, สไตล์) | `src/components/layout/Sidebar.tsx` | 300-307 |
| **ปุ่ม Settings** (ใน Header) | `src/components/layout/Header.tsx` | 57-66 |
| **ข้อความใน Modal Settings** | `src/components/ui/SettingsModal.tsx` | 106, 125-142, 154-183, 191-218, 224-229 |
| **Font Style options** (เพิ่ม/ลดฟอนต์) | `src/components/ui/SettingsProvider.tsx` | 26-30 |
| **Text Size values** (เล็ก=14px, กลาง=16px, ใหญ่=18px) | `src/components/ui/SettingsProvider.tsx` | 33-37 |
| **Notification permission logic** | `src/components/ui/SettingsProvider.tsx` | 113-138 |
| **Toggle knob color** (ON/OFF) | `src/components/ui/SettingsModal.tsx` | 208 |
| **Facebook Feed — รูป/ข้อความโพสต์** | `src/components/ui/FacebookFeed.tsx` | 40-115 (mock posts array) |
| **Facebook Feed — pagination dots** | `src/components/ui/FacebookFeed.tsx` | 165-175 |
| **Facebook Feed — arrow buttons** | `src/components/ui/FacebookFeed.tsx` | 140-160 |
| **Theme colors (Light/Dark)** | `src/app/globals.css` | 8-56 |
| **Nav menu items (Sidebar)** | `src/components/sidebar/SidebarMenu.ts` | 52-63 (GENERAL_MENUS array) |
| **ปุ่มเมนูบนหน้าแรก (HomeView)** | `src/views/home/HomeView.tsx` | 9-16 (DEPARTMENT_ROUTES array) |
| **Failed student mock data** | `src/components/layout/Sidebar.tsx` | 36-42 |
| **Activities table data** | `src/app/page.tsx` | 65-130 (approx.) |
| **Overview dashboard stats** | `src/components/ui/OverviewCards.tsx` | 30-85 |
| **Login form** | `src/app/login/page.tsx` | entire file |
| **Register form** | `src/app/register/page.tsx` | entire file |
| **API routes** | `src/app/api/auth/*` | per route |
| **Database schema** | `supabase/migrations/*.sql` | per migration |

---

## 🚀 Getting Started

```bash
# Install dependencies (one time only)
npm install

# Run development server
npm run dev

# Open in browser
# http://localhost:3000
```

### Quick Start (Windows)
Double-click `install-deps.bat` to install, then `run-dev.bat` to start.

### Demo Accounts

| Role | Username/Email | Password |
|---|---|---|
| **Teacher** | `teacher@udontech.ac.th` | `69319010015` |
| **Student** | `69319010015` | `1419902419920` |

---

## 🖥️ How to Open the Website in VS Code

1. Open Visual Studio Code → **File > Open Folder** → Select `aft-nexgen-cloud`
2. Press **Ctrl + `** to open Terminal
3. Run `npm install` (first time only)
4. Run `npm run dev`
5. Open browser → `http://localhost:3000`

### Troubleshooting

| ปัญหา | สาเหตุ | วิธีแก้ |
|----------------|----------------|-------------------|
| `'npm' is not recognized` | Node.js ไม่ได้ติดตั้ง | ดาวน์โหลด Node.js จาก https://nodejs.org/ |
| `Port 3000 is already in use` | พอร์ตถูกใช้ | รัน `npm run dev -- -p 3001` |
| `Module not found` | dependencies ไม่ได้ติดตั้ง | รัน `npm install` อีกครั้ง |

---

## 🗄️ Database Setup (Supabase)

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Go to SQL Editor** → New Query
3. **Run the migrations in order:**
   - First: `supabase/migrations/001_initial_schema.sql`
   - Second: `supabase/migrations/002_auth_system.sql`
4. **Execute** the SQL to create tables, RLS policies, and storage bucket
5. **Add users** via Supabase Auth dashboard

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
| View club directory | ✅ | ✅ | ✅ |
| View forms/guidelines | ✅ | ✅ | ✅ |
| Submit proposals | ✅ | ✅ | ✅ |

---

## 📝 License

**AFT NexGen Cloud** — Official project of Udon Thani Technical College (UDTC).
Developed for educational administration purposes only.

---

*Built with Next.js, Supabase, Tailwind CSS, and ☕ by the UDTC development team.*