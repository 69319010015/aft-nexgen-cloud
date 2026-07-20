// ============================================
// AFT NexGen Cloud — Supabase Database Types
// ============================================

export interface Project {
  id: string;
  event_name_th: string;
  event_name_en: string;
  education_level: string;
  semester: string;
  budget_received: number;
  budget_spent: number;
  responsible_person: string;
  responsible_id: string;
  pdf_template_path: string | null;
  status: "อนุมัติ" | "รอยืนยัน" | "ไม่อนุมัติ";
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  student_id: string;
  full_name: string;
  role: "student" | "director" | "admin";
  user_type: "student" | "teacher";
  status: "PENDING" | "APPROVED" | "REJECTED";
  email: string | null;
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface RegistrationRequest {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  department: string | null;
  level: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  created_at: string;
}

export interface DashboardStats {
  total_events: number;
  total_budget_allocated: number;
  total_budget_spent: number;
  remaining_budget: number;
}

export interface SessionInfo {
  user_id: string;
  student_id: string;
  full_name: string;
  role: "student" | "director" | "admin";
  user_type: "student" | "teacher";
  status: "PENDING" | "APPROVED" | "REJECTED";
  email: string | null;
}

export type LoginRequest = {
  studentId?: string;
  nationalId?: string;
  email?: string;
  password?: string;
};

export type RegisterRequest = {
  studentId: string;
  fullName: string;
  nationalId: string;
  department?: string;
  level?: string;
};

export type ApprovalAction = {
  requestId: string;
  action: "APPROVED" | "REJECTED";
  rejectionReason?: string;
};