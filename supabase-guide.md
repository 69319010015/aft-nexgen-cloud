# Supabase SQL Setup Guide

## 📍 Where to Put the SQL

The migration file is already at:
```
supabase/migrations/003_activity_plans.sql
```

## 🚀 How to Run This Migration

### Step 1: Open Supabase Dashboard
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project (the one connected to this app)
3. Click **SQL Editor** in the left sidebar

### Step 2: Run the Migration
1. Click **New Query** (or "+ New Query")
2. **Copy ONLY the file** `supabase/migrations/003_activity_plans.sql` — do NOT copy from this guide
3. **Important:** Run migrations 001 and 002 first if you haven't already:
   - First: `001_initial_schema.sql` (creates `profiles` table)
   - Second: `002_auth_system.sql` (adds `user_type` column to `profiles`)
   - Third: `003_activity_plans.sql` (creates `activity_plans` table)
4. Paste the SQL into the editor
5. Click **Run** (▶️ button)

### Step 3: Verify It Worked
1. In the left sidebar, click **Table Editor**
2. You should see a new table called **`activity_plans`**
3. Click on it to see the columns

### Step 4: Test with Sample Data (Optional)
After running the migration, open a **NEW query tab** and paste ONLY this line:

```sql
INSERT INTO activity_plans (title, fiscal_year, club, description, quarter, status, file_type, excel_columns, excel_data) VALUES ('ทดสอบแผน', '2569', 'ชมรมทดสอบ', 'แผนทดสอบระบบ', '1', 'รอดำเนินการ', 'xlsx', '["ลำดับ","กิจกรรม","หมายเหตุ"]'::jsonb, '[{"ลำดับ":"1","กิจกรรม":"ทดสอบ","หมายเหตุ":"สำเร็จ"}]'::jsonb);
```

Then check it (separate query tab):
```sql
SELECT * FROM activity_plans;
```

## 📋 Table Structure (`activity_plans`)

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

## 🔐 Permissions (RLS)

- **Everyone** can view all activity plans (SELECT)
- **Only teachers** (`user_type = 'teacher'`) can INSERT, UPDATE, DELETE

## 💾 How to Export Data If Needed

In Supabase Dashboard:
1. Go to **Table Editor** → `activity_plans`
2. Click **Export** (download icon)
3. Choose CSV or SQL format

---

*File location: `supabase/migrations/003_activity_plans.sql`*