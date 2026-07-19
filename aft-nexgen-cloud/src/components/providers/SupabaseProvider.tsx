"use client";

// ============================================
// AFT NexGen Cloud — Supabase Provider
// Provides a single Supabase client instance
// ============================================

import { createClient } from "@/lib/supabase/client";
import { createContext, useContext } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

const SupabaseContext = createContext<SupabaseClient | null>(null);

export function useSupabase() {
  const context = useContext(SupabaseContext);
  return context;
}

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}
