"use client";

// ============================================
// AFT NexGen Cloud — Projects Hook
// Fetches, filters, and manages project data
// ============================================

import { useState, useEffect, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/lib/types/database";

export function useProjects(initialProjects: Project[] = []) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [filterQuery, setFilterQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      if (!supabase) return;
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setProjects(data as Project[]);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Client-side filter: match Event Name or Responsible Person
  const filteredProjects = useMemo(() => {
    if (!filterQuery.trim()) return projects;
    const query = filterQuery.toLowerCase().trim();
    return projects.filter(
      (p) =>
        p.event_name_th.toLowerCase().includes(query) ||
        p.event_name_en.toLowerCase().includes(query) ||
        p.responsible_person.toLowerCase().includes(query)
    );
  }, [projects, filterQuery]);

  return {
    projects: filteredProjects,
    allProjects: projects,
    loading,
    filterQuery,
    setFilterQuery,
    refreshProjects: fetchProjects,
  };
}