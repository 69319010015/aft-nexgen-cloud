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
| **Supabase Storage** | Private file storage (PDFs, signed URLs, uploaded activity plans) |
| **Row-Level Security (RLS)** | Database-level access policies (`activity_plans` — SELECT all, INSERT/UPDATE/DELETE only teachers) |

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
| `xlsx` | ^0.18.x | Excel file parsing (.xlsx/.xls → JSON) |
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
| **`useCallback`** | Memoized event handlers, fetch functions |
| **`useMemo`** | Computed/filtered data (activity plan search & filter) |
| **`useEffect`** | Side effects (localStorage read, auth check, data fetching) |
| **`createContext`** | Theme, Settings, Supabase, Tab providers (global context) |

---

## 📅 Activity Plans Component (แผนปฏิบัติกิจกรรม)

### Overview
The Annual Activity Plan page at `/annual-plan` allows teachers to upload Excel/PDF/DOCX files, view parsed Excel data in a grid, filter plans by year, and delete entries. All data is stored in the `activity_plans` Supabase table.

### Files

| File | Purpose |
|---|---|
| `src/views/annual-plan/AnnualPlanView.tsx` | Main component — displays plan cards, search/filter, upload modal, expandable Excel grid, delete button |
| `src/app/api/activity-plans/route.ts` | API route — `GET` (list), `POST` (upload + insert), `DELETE` (by id) |
| `src/app/annual-plan/page.tsx` | Page shell wrapping `AnnualPlanView` in `ClientLayout` |
| `supabase/migrations/003_activity_plans.sql` | Database migration — creates `activity_plans` table with RLS, indexes, triggers |
| `run-all-migrations.sql` | Combined one-shot migration file (001 + 002 + 003) |

### API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/activity-plans` | Public read | List all plans (RLS handles permissions) |
| `POST` | `/api/activity-plans` | Teacher only | Upload file + form data, parse Excel, insert into DB |
| `DELETE` | `/api/activity-plans?id=xxx` | Teacher only | Delete a plan by UUID (demo user via service role key) |

### How It Works

1. **Upload Flow**:
   - Teacher clicks "📤 อัปโหลดแผน / Upload Plan" → modal opens
   - Fill form (title, fiscal year, club, description) + select file
   - Submit → `FormData` sent to `POST /api/activity-plans`
   - Server: validates auth (Supabase session or demo cookie fallback)
   - If demo user: uses `createAdminClient()` (service role key bypasses RLS)
   - File uploaded to Supabase Storage bucket `uploads`
   - If `.xlsx`/`.xls`: parsed with `xlsx` library → `sheet_to_json` → columns + rows stored as JSONB

2. **Display**:
   - `GET /api/activity-plans` fetches all plans → transformed to camelCase
   - Each plan shown as a card with title, club, year, quarter, status badge
   - Click card → expands to show parsed Excel grid (`ExcelGrid` component)
   - Status = "ดำเนินการแล้ว" automatically on upload

3. **Delete**:
   - Teacher-only 🗑️ icon (rendered as `<span role="button">` to avoid "button inside button" error)
   - Confirmation dialog → `DELETE /api/activity-plans?id=xxx` → refreshes list

---

## 📊 Excel Parsing — How It Works

### What Library Do We Use?
We use **`xlsx`** (also known as **SheetJS**), a popular open-source JavaScript library that can read, parse, and write Excel files (.xlsx, .xls, .csv) directly in Node.js or the browser — **no Excel installation required**.

- **npm package**: `xlsx` (version ^0.18.x)
- **GitHub**: [SheetJS/sheetjs](https://github.com/SheetJS/sheetjs)
- **Why `xlsx`?**: It's lightweight, pure JavaScript (no native dependencies), supports all major Excel formats, and works perfectly on the server side in Next.js API routes.

### The Complete Flow (Step by Step)

```
[User uploads .xlsx file]
         │
         ▼
[formData sent to POST /api/activity-plans]
         │
         ▼
[Server receives file as "File" object]
         │
         ▼
[Convert file to ArrayBuffer] ← file.arrayBuffer()
         │
         ▼
[Parse with XLSX library] ← XLSX.read(buffer, { type: "array" })
         │
         ▼
[Pick first sheet] ← workbook.Sheets[workbook.SheetNames[0]]
         │
         ▼
[Convert sheet rows to JSON] ← XLSX.utils.sheet_to_json()
         │
         ▼
[Filter out _EMPTY columns] ← remove keys starting with "_EMPTY"
         │
         ▼
[Store as JSONB in Supabase] ← { excel_columns: [...], excel_data: [...] }
         │
         ▼
[Frontend fetches via GET API] ← /api/activity-plans
         │
         ▼
[Display in ExcelGrid component] ← columns as header + rows as data
```

### The Code (Real Implementation)

Here's the actual code from `src/app/api/activity-plans/route.ts` (lines 189-207):

```typescript
if (file && fileType && ["xlsx", "xls"].includes(fileType)) {
  try {
    // Step 1: Read file as raw bytes (ArrayBuffer)
    const buffer = await file.arrayBuffer();

    // Step 2: Parse the workbook using XLSX library
    const workbook = XLSX.read(buffer, { type: "array" });

    // Step 3: Get the first sheet only
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

    if (firstSheet) {
      // Step 4: Convert sheet rows to JSON (array of objects)
      //   - Each row becomes: { "คอลัมน์1": "ค่า1", "คอลัมน์2": "ค่า2", ... }
      //   - Empty cells become "" (empty string)
      const jsonData: Record<string, string>[] =
        XLSX.utils.sheet_to_json(firstSheet, { defval: "" });

      if (jsonData.length > 0) {
        // Step 5: Remove empty _EMPTY columns
        //   (XLSX creates these for blank column headers)
        excelColumns = Object.keys(jsonData[0])
          .filter(key => !key.startsWith("_EMPTY"));

        // Step 6: Clean each row — only keep real columns
        excelData = jsonData.map(row => {
          const cleanRow: Record<string, string> = {};
          excelColumns.forEach(col => {
            cleanRow[col] = row[col] || "";
          });
          return cleanRow;
        });
      }
    }
  } catch (err) {
    console.error("Excel parse error:", err);
  }
}
```

### How `sheet_to_json()` Works

The `XLSX.utils.sheet_to_json()` function is the **magic function** that converts an Excel sheet into a JavaScript array of objects:

| Excel Sheet | → | JSON Output |
|---|---|---|
| ![Excel table](https://placehold.co/400x100/eee/999?text=Header+Row+%2B+Data+Rows) | → | `[` <br> `  { "ชื่อ": "สมชาย", "อายุ": "20" },` <br>`  { "ชื่อ": "สมหญิง", "อายุ": "22" }` <br>`]` |

**Key rules:**
- **First row** becomes the **column names** (keys in the object)
- **Each subsequent row** becomes an **object** with those keys
- **Blank cells** use the value from `{ defval: "" }` (empty string instead of `undefined`)
- **Empty column headers** become `_EMPTY`, `_EMPTY_1`, `_EMPTY_2`, etc. (we filter these out)

### Example: Before & After

**Raw Excel data:**
| โครงการ | (blank) | งบประมาณ | (blank) | หมายเหตุ |
|---|---|---|---|---|
| โครงการ ก | | 20,000 | | ผ่าน |
| โครงการ ข | | 15,000 | | รออนุมัติ |

**Without _EMPTY filter (OLD way):**
```
Columns: ["โครงการ", "_EMPTY", "งบประมาณ", "_EMPTY_1", "หมายเหตุ"]
Data: [{ "โครงการ": "โครงการ ก", "_EMPTY": "", "งบประมาณ": "20,000", "_EMPTY_1": "", "หมายเหตุ": "ผ่าน" }]
```

**With _EMPTY filter (NOW):**
```
Columns: ["โครงการ", "งบประมาณ", "หมายเหตุ"]
Data: [{ "โครงการ": "โครงการ ก", "งบประมาณ": "20,000", "หมายเหตุ": "ผ่าน" }]
```

### How the Frontend Displays It

In `AnnualPlanView.tsx`, the `ExcelGrid` component renders the parsed data:

```tsx
function ExcelGrid({ columns, data }) {
  // Header row — uses columns array
  // Data rows — maps each object to cells
  return (
    <div className="grid" style={{
      gridTemplateColumns: `repeat(${columns.length}, minmax(100px, 1fr))`
    }}>
      {columns.map(col => <div className="header">{col}</div>)}
      {data.map(row => columns.map(col => <div>{row[col]}</div>))}
    </div>
  );
}
```

### Important Notes & Limitations

| # | Note | Explanation |
|---|---|---|
| 1 | **First sheet only** | We only read `SheetNames[0]` (the first sheet/tab). If your Excel has multiple sheets, only the first one is parsed. **See guide below on how to handle this.** |
| 2 | **Header row required** | The first row of your sheet **MUST** be column headers (like ชื่อ, วันที่, งบประมาณ). If there's no header row, the data won't display correctly. |
| 3 | **Blank cells become ""** | We set `{ defval: "" }` so empty cells are empty strings, not `null` or `undefined`. |
| 4 | **Empty columns are hidden** | Any column without a proper header name (`_EMPTY`) is automatically removed. |
| 5 | **Numbers become text** | All values are stored as strings in Supabase JSONB. You won't be able to do math on them from the database. |
| 6 | **File size limit** | Very large Excel files (10MB+) may cause slow uploads or timeout. Keep files under 5MB for best results. |
| 7 | **Formatting is lost** | Colors, fonts, merged cells, and formulas are NOT preserved — only the raw cell values are kept. |

---

## ⚠️ ข้อสำคัญ: อ่านได้เฉพาะ Sheet แรกเท่านั้น

### ปัญหา
ถ้าคุณเปิดไฟล์ Excel แล้วเห็น **หลาย Sheet** (เช่น Sheet1, Sheet2, Sheet3 ที่อยู่ด้านล่างซ้าย):

![Example of multiple sheets](https://placehold.co/600x60/eee/999?text=%3C+Sheet1+%7C+Sheet2+%7C+Sheet3+%7C+%E0%B9%82%E0%B8%84%E0%B8%A3%E0%B8%87%E0%B8%81%E0%B8%B2%E0%B8%A3+%E2%80%A2+%E2%80%A2+%E2%80%A2+%3E)

**ระบบจะอ่านเฉพาะ Sheet แรกเท่านั้น (Sheet1)** — Sheet2, Sheet3, และ sheet อื่นๆ จะ **ไม่ถูกอ่าน**

### วิธีแก้ (2 วิธี)

---

#### ✅ วิธีที่ 1: อัปโหลดทีละ Sheet (แนะนำ)

**ทำ:** ก็อปปี้ข้อมูลจากแต่ละ sheet ไปเป็นไฟล์แยก → อัปโหลดทีละไฟล์

| ขั้นตอน | ภาพประกอบ |
|---------|-----------|
| 1. เปิดไฟล์ Excel → คลิก **Sheet1** | ![Sheet1 tab](https://placehold.co/300x50/eee/999?text=คลิก+Sheet1) |
| 2. Ctrl+A → Ctrl+C (เลือกทั้งหมด → คัดลอก) | — |
| 3. เปิด Excel ใหม่ → Ctrl+V (วาง) | — |
| 4. **บันทึกเป็นไฟล์ใหม่** (เช่น `แผน_ไตรมาส1.xlsx`) | — |
| 5. ทำซ้ำข้อ 1-4 สำหรับ **Sheet2**, **Sheet3**, ฯลฯ | — |
| 6. **อัปโหลดทีละไฟล์** บนเว็บไซต์ | ![Upload button](https://placehold.co/200x40/eab308/000?text=%F0%9F%93%A4+Upload+Plan) |

**ข้อดี:** ข้อมูลไม่ปนกัน, จัดการง่าย, ดูทีละแผนได้
**ข้อเสีย:** ต้องอัปโหลดหลายครั้ง

---

#### ✅ วิธีที่ 2: รวมข้อมูลทั้งหมดไว้ใน Sheet เดียว (เร็วที่สุด)

**ทำ:** Copy ข้อมูลจากทุก sheet มารวมกันใน Sheet1 → อัปโหลดครั้งเดียว

| ขั้นตอน | รายละเอียด |
|---------|------------|
| 1. เปิดไฟล์ Excel → คลิก **Sheet1** | ดูข้อมูลที่มีอยู่ |
| 2. คลิก **Sheet2** → Ctrl+A → Ctrl+C | คัดลอกข้อมูลทั้งหมดจาก Sheet2 |
| 3. คลิกกลับไป **Sheet1** → เลื่อนลงไปแถว **ว่างสุดท้าย** ต่อจากข้อมูลเดิม | หาแถวว่างถัดไป |
| 4. **Ctrl+V** วางข้อมูล Sheet2 ต่อท้าย Sheet1 | ข้อมูลจะต่อกันยาวลงมา |
| 5. ทำซ้ำข้อ 2-4 สำหรับ Sheet3, Sheet4, ฯลฯ | รวมทุก sheet |
| 6. **บันทึกไฟล์** | แล้วอัปโหลดครั้งเดียว |

**ข้อดี:** อัปโหลดครั้งเดียวจบ, ข้อมูลทั้งหมดอยู่ในแผนเดียว
**ข้อเสีย:** ถ้ามีหลายโครงการปนกัน อาจดูยาก

---

#### ❌ วิธีที่ใช้ไม่ได้ (Don't)
- **Merge cells ใน Excel แบบรวม header** → ไม่ได้ผล (อ่านแค่ค่ามุมบนซ้าย)
- **Upload ไฟล์ .xlsm (macro-enabled)** → อาจใช้ไม่ได้
- **หวังว่าระบบจะอ่านได้ทุก sheet อัตโนมัติ** → **อ่านได้แค่ Sheet แรกเท่านั้น**

---

### จะรู้ได้ยังไงว่าไฟล์มีกี่ Sheet?

1. เปิดไฟล์ Excel
2. **ดูด้านล่างซ้าย** — ถ้ามีหลายแท็บ (Sheet1, Sheet2, แผนงาน, โครงการ, ...) แสดงว่ามีหลาย Sheet
3. ถ้ามีแค่แท็บเดียว → Upload ได้เลย! ✅

### สรุป
| สถานการณ์ | ทำยังไง |
|---|---|
| มี **1 Sheet** → Upload เลย | ✅ |
| มี **หลาย Sheet** → เลือกวิธีที่ 1 หรือ 2 ด้านบน | ✅ |
| ข้อมูลอยู่ใน **Sheet ที่ 2, 3, ...** เท่านั้น → Copy ไป Sheet1 หรือทำเป็นไฟล์แยก | ✅ |

---

### How to Prepare Your Excel File for Upload

✅ **Dos:**
- Put column names in the **first row** (row 1)
- Keep your data **organized in columns**
- Save as `.xlsx` (preferred) or `.xls`
- Use **short, clear column names** (e.g. "ชื่อกิจกรรม", "วันที่", "งบประมาณ")

❌ **Don'ts:**
- Don't leave **blank columns** between data columns (they become `_EMPTY`)
- Don't use **merged cells** as headers (only the top-left value is read)
- Don't include **images/charts** (they're ignored)
- Don't include **multiple tables** in one sheet (only the first table is read)

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
      └─ SettingsProvider
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
| **Admin (อวท.) Login** | Email + Password → Supabase Auth |
| **Demo Teacher Login** | Hardcoded fallback: `teacher@udontech.ac.th` / `69319010015` — sets localStorage + cookies directly |
| **Demo Admin Login** | Hardcoded fallback: `admin@udontech.ac.th` / `69319010015` — sets localStorage + cookies directly |
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
| `/annual-plan` | Static | Annual activity plan (upload + Excel display) |
| `/club` | Static | Club directory |
| `/forms` | Static | Document library |
| `/guidelines` | Static | Activity guidelines |
| `/proposal` | Static | Project proposal |
| `/summary` | Static | Summary reports |
| `/api/auth/*` | Dynamic | Auth API routes |
| `/api/projects` | Dynamic (GET) | Project data |
| `/api/activity-plans` | Dynamic (GET, POST, DELETE) | Activity plans CRUD |

## 🌐 Deployment

| Service | Config |
|---|---|
| **Platform** | Vercel (Free Tier) |
| **Environment** | `.env.local` (local), Vercel Dashboard (production) |
| **Source Control** | GitHub (`github.com/69319010015/aft-nexgen-cloud`) |
| **Supabase Project** | `plsevkiwvivrqjjuuvgn` |

## 📁 Project Structure (Key Files)

```
src/
├── app/
│   ├── layout.tsx              # Root layout + 3 providers (Supabase → Theme → Settings)
│   ├── globals.css             # CSS variables (incl. --font-family-body, --text-size-base)
│   ├── page.tsx                # Main SPA (Facebook Feed + dashboard + all sections)
│   ├── annual-plan/
│   │   └── page.tsx            # Annual Activity Plan page
│   └── api/
│       ├── activity-plans/
│       │   └── route.ts        # GET + POST + DELETE for activity plans
│       ├── auth/...            # All auth API routes
│       └── projects/route.ts   # Projects API
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # ⚙️ Settings trigger + Sign In/Out + ThemeToggle
│   │   └── Sidebar.tsx         # ⚙️ Settings trigger + nav + login
│   ├── providers/
│   │   └── ThemeProvider.tsx   # Light/Dark context
│   └── ui/
│       ├── SettingsProvider.tsx  # Font/Size/Notif context
│       ├── SettingsModal.tsx     # Settings pop-up modal
│       ├── FacebookFeed.tsx      # Mock Facebook carousel
│       └── ...other components
├── views/
│   └── annual-plan/
│       └── AnnualPlanView.tsx  # Activity plans component (cards, upload, expand, delete)
└── lib/... 
```

## 👥 Roles & Permissions

| Role | Features |
|---|---|
| **Guest** | View dashboard & failed students & activity plans (read-only) |
| **Student** | View + edit failed students (add/edit reason, cannot delete). View activity plans. |
| **Teacher** | Full access: edit projects, upload files, approve students, delete records, teacher dashboard, **upload/delete activity plans** |

---

*Last updated: July 2026 — Udon Thani Technical College (UDTC)*