# 🛠️ AFT NexGen Cloud — Tech Stack & Tools

> รายการเฟรมเวิร์ก ภาษา และเครื่องมือที่ใช้ในโปรเจกต์นี้

---

## 📋 Frameworks & Core Libraries

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.2.10 | React framework (App Router) |
| **React** | 19.x | UI component library |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **Turbopack** | — | Rust-based bundler (Next.js default) |

## 🔤 Languages

| Language | Where Used |
|---|---|
| **TypeScript (.ts, .tsx)** | All source code (components, pages, API routes, utilities) |
| **CSS** | Global styles, Tailwind directives (`globals.css`) |
| **PL/pgSQL** | Supabase migrations (`supabase/migrations/`) |
| **JSON** | Configuration (`package.json`, `tsconfig.json`, `tailwind.config.ts`) |
| **Markdown** | Documentation (`README.md`, `TOOL.md`, `AGENTS.md`, `CLAUDE.md`) |

## 🗄️ Database & Backend

| Service | Purpose |
|---|---|
| **Supabase** | PostgreSQL database, Auth, Storage |
| **Supabase Auth** | User authentication (email/password, session management) |
| **Supabase Storage** | Private file storage (PDFs, signed URLs) |
| **Row-Level Security (RLS)** | Database-level access policies |

## 🧩 Key Dependencies (npm)

| Package | Version | Purpose |
|---|---|---|
| `next` | 16.2.10 | Framework |
| `react` / `react-dom` | 19.x | UI rendering |
| `@supabase/supabase-js` | ^2.x | Supabase JavaScript client |
| `@supabase/ssr` | ^0.x | Server-side rendering for Supabase |
| `tailwindcss` | ^4.x | CSS framework |
| `typescript` | ^5.x | Type checking |
| `@tailwindcss/postcss` | — | PostCSS plugin for Tailwind |
| `eslint` / `eslint-config-next` | — | Linting |
| `noto-sans-thai` (Google Fonts) | — | Thai font |

## 🎨 Styling System

| Concept | Implementation |
|---|---|
| **CSS Framework** | Tailwind CSS utility classes |
| **Custom Properties** | CSS custom properties for Light/Dark theme (`--color-bg-primary`, `--color-accent`, etc.) |
| **Design Rule** | 60-30-10 Color Distribution |
| **60% Dominant** | `#FFFFFF` (Light) / `#0F172A` (Dark) |
| **30% Secondary** | `#0F172A` / `#1E3A8A` |
| **10% Accent** | `#EAB308` (Tech Yellow) |
| **Dark Mode** | Class-based (`<html class="dark">`) with localStorage persistence |
| **Typography CSS vars** | `--font-family-body` (overridable via Settings), `--text-size-base` (14/16/18px) |
| **Gradient (Light)** | `linear-gradient(135deg, #ffffff, #f8fafc)` |
| **Glassmorphism (Dark)** | `rgba(30,41,59,0.6)` with `backdrop-filter: blur(12px)` |

## 🧠 State Management

| Method | Where Used |
|---|---|
| **`useState`** | Local component state (forms, filters, modals) |
| **`useCallback`** | Memoized event handlers |
| **`useMemo`** | Computed/filtered data |
| **`useEffect`** | Side effects (localStorage read, auth check) |
| **`createContext`** | Theme, Settings, Supabase, Tab providers (global context) |

---

## ⚙️ Settings Component (การตั้งค่า)

### Overview
The Settings feature provides a pop-up modal for users to customize:
- **Appearance**: Light/Dark theme toggle (uses existing `ThemeProvider`)
- **Typography**: Font style (Noto Sans Thai / TH Sarabun) + Text size (เล็ก/กลาง/ใหญ่ = 14/16/18px)
- **Notifications**: Web Push toggle with `Notification.requestPermission()`

### Files

| File | Purpose |
|---|---|
| `src/components/ui/SettingsProvider.tsx` | React Context provider. Manages `fontStyle: "default" \| "sarabun"`, `textSize: "small" \| "medium" \| "large"`, `notificationsEnabled: boolean`. Persists to localStorage (`aft-font-style`, `aft-text-size`, `aft-notifications-enabled`). Applies CSS variables `--font-family-body` and `--text-size-base` to `<html>`. |
| `src/components/ui/SettingsModal.tsx` | Modal UI with draft-state pattern. Shows Appearance pills, Typography pills, Notification toggle, Save/Cancel buttons. Used by both Sidebar and Header. |
| `src/app/layout.tsx` | Wraps `<SettingsProvider>` inside `<ThemeProvider>` in the provider hierarchy. |
| `src/app/globals.css` | Declares default `--font-family-body` and `--text-size-base` on `:root`. |

### How to Customize

| What to change | File | Line(s) |
|---|---|---|
| **Button labels** (ใน Sidebar) | `src/components/layout/Sidebar.tsx` | 300-307 |
| **Button labels** (ใน Header) | `src/components/layout/Header.tsx` | 57-66 |
| **Modal title / section text** | `src/components/ui/SettingsModal.tsx` | 106, 125, 152, 157, 173, 191, 195, 212, 224, 228 |
| **Font options** (add/remove fonts) | `src/components/ui/SettingsProvider.tsx` | 26-30 (`FONT_FAMILIES` object) |
| **Text size pixel values** | `src/components/ui/SettingsProvider.tsx` | 33-37 (`FONT_SIZES` object) |
| **Toggle knob color** (ON/OFF knob) | `src/components/ui/SettingsModal.tsx` | 208 |
| **Toggle background ON color** | `src/components/ui/SettingsModal.tsx` | 200 (`bg-accent-500`) |
| **Toggle background OFF color** | `src/components/ui/SettingsModal.tsx` | 200 (`bg-gray-300 dark:bg-gray-600`) |

### Provider Hierarchy

```
SupabaseProvider
  └─ ThemeProvider
      └─ SettingsProvider      ← NEW
          └─ TabProvider
              └─ <children>
```

---

## 📰 Facebook Feed Component

### Overview
The Facebook Feed (`FacebookFeed.tsx`) displays a carousel of mock posts at the top of the homepage (`#section-home`). It simulates an embedded Facebook page feed with images, titles, dates, navigation arrows, and pagination dots.

### Files

| File | Purpose |
|---|---|
| `src/components/ui/FacebookFeed.tsx` | The entire Facebook feed component. Contains the mock posts array, carousel logic, arrows, pagination dots, and post counter. |

### Mock Posts Data
The 5 mock posts are defined as an array of objects near the top of `FacebookFeed.tsx`:

```ts
const POSTS = [
  {
    image: "https://placehold.co/800x400/...",
    title: "🏆 ประกาศผลการแข่งขันทักษะวิชาชีพ 2569",
    date: "15 กรกฎาคม 2569",
  },
  // ... 4 more posts
];
```

### How to Customize

| What to change | File | Line(s) |
|---|---|---|
| **Add/remove posts** | `src/components/ui/FacebookFeed.tsx` | 40-115 (POSTS array) |
| **Change post image** | `src/components/ui/FacebookFeed.tsx` | `image` field in each post object |
| **Change post title** | `src/components/ui/FacebookFeed.tsx` | `title` field in each post object |
| **Change post date** | `src/components/ui/FacebookFeed.tsx` | `date` field in each post object |
| **Pagination dots** | `src/components/ui/FacebookFeed.tsx` | 165-175 (mapped from POSTS length) |
| **Previous/Next arrows** | `src/components/ui/FacebookFeed.tsx` | 140-160 |
| **Auto-slide interval** | `src/components/ui/FacebookFeed.tsx` | 30-38 (useEffect with setInterval) |
| **Image aspect ratio** | `src/components/ui/FacebookFeed.tsx` | 125 (aspect-ratio style) |

---

## 🔐 Authentication System

| Feature | Implementation |
|---|---|
| **Student Login** | Student ID (11 digits) + National ID (13 digits) → Supabase Auth via `{studentId}@udtc.internal` |
| **Teacher Login** | Email + Password → Supabase Auth |
| **Login API** | `POST /api/auth/login` — detects student vs teacher |
| **Register API** | `POST /api/auth/register` — student self-registration with PENDING status |
| **Recover API** | `POST /api/auth/recover` — teacher password reset email |
| **Approve API** | `PUT /api/auth/approve` — teacher approves/rejects pending students |
| **Requests API** | `GET /api/auth/requests` — teacher views pending registrations |
| **Middleware** | Route protection, PENDING user redirect |
| **Session** | localStorage + cookie (`aft-is-logged-in`, `aft-user-type`, `aft-user-status`) |

## 🧭 Routing (App Router)

| Route | Type | Purpose |
|---|---|---|
| `/` | Static | Main dashboard + all sections |
| `/login` | Static | Student/Teacher login page |
| `/register` | Static | Student registration |
| `/pending` | Static | Pending approval page |
| `/dashboard` | Static | Legacy redirect → `/` |
| `/club` | Static | Club directory |
| `/forms` | Static | Document library |
| `/guidelines` | Static | Activity guidelines |
| `/proposal` | Static | Project proposal |
| `/summary` | Static | Summary reports |
| `/api/auth/*` | Dynamic | Auth API routes |
| `/api/projects` | Dynamic (GET) | Project data |

## 🌐 Deployment

| Service | Config |
|---|---|
| **Platform** | Vercel (Free Tier) |
| **Environment** | `.env.local` (local), Vercel Dashboard (production) |
| **Source Control** | GitHub (`github.com/69319010015/aft-nexgen-cloud`) |

## 📁 Project Structure (Key Files)

```
src/
├── app/
│   ├── layout.tsx            # Root layout + 3 providers (Supabase → Theme → Settings)
│   ├── globals.css           # CSS variables (incl. --font-family-body, --text-size-base)
│   └── page.tsx              # Main SPA (Facebook Feed + dashboard + all sections)
├── components/
│   ├── layout/
│   │   ├── Header.tsx        # ⚙️ Settings trigger + Sign In/Out + ThemeToggle
│   │   └── Sidebar.tsx       # ⚙️ Settings trigger + nav + login
│   ├── providers/
│   │   └── ThemeProvider.tsx  # Light/Dark context
│   └── ui/
│       ├── SettingsProvider.tsx  # Font/Size/Notif context
│       ├── SettingsModal.tsx     # Settings pop-up modal
│       ├── FacebookFeed.tsx      # Mock Facebook carousel
│       ├── theme-toggle...
│       └── ...other components
└── lib/... 
```

## 👥 Roles & Permissions

| Role | Features |
|---|---|
| **Guest** | View dashboard & failed students (read-only) |
| **Student** | View + edit failed students (add/edit reason, cannot delete) |
| **Teacher** | Full access: edit projects, upload files, approve students, delete records, teacher dashboard |

---

*Last updated: July 2026 — Udon Thani Technical College (UDTC)*