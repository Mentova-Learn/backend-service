"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type {
  Course,
  DashboardSummary,
  CourseProgress,
  MaterialProgress,
} from "@/lib/types";

export interface DerivedStats {
  coursesEnrolled: number;
  coursesCompleted: number;
  sectionsCompleted: number;
  totalSections: number;
  bestQuizScore: number | null;
}

export type RecommendationType = "continue" | "review" | "try_new";

export interface Recommendation {
  type: RecommendationType;
  courseId: string;
  courseName: string;
  materialTitle: string;
  materialType: string;
  message: string;
}

export interface DashboardData {
  stats: DerivedStats;
  recommendations: Recommendation[];
  recentCourses: Course[];
  courseProgress: Record<string, number>;
  loading: boolean;
}

function computeStats(
  courses: Course[],
  summary: DashboardSummary,
): DerivedStats {
  const coursesEnrolled = courses.length;

  // A course is completed when all its material sections are done
  let coursesCompleted = 0;
  for (const cp of summary.courses_with_progress) {
    const totalForCourse = cp.materials.reduce(
      (sum, m) => sum + m.total_sections,
      0,
    );
    const completedForCourse = cp.materials.reduce(
      (sum, m) => sum + m.completed_sections,
      0,
    );
    if (totalForCourse > 0 && completedForCourse === totalForCourse) {
      coursesCompleted++;
    }
  }

  return {
    coursesEnrolled,
    coursesCompleted,
    sectionsCompleted: summary.completed_sections,
    totalSections: summary.total_sections,
    bestQuizScore: summary.best_quiz_percentage,
  };
}

function computeRecommendations(
  courses: Course[],
  summary: DashboardSummary,
): Recommendation[] {
  const courseMap = new Map(courses.map((c) => [c.id, c]));
  const recs: Recommendation[] = [];

  for (const cp of summary.courses_with_progress) {
    const course = courseMap.get(cp.course_id);
    if (!course) continue;

    addContinueRecs(recs, cp, course);
    addReviewRecs(recs, cp, course);
    addTryNewRecs(recs, cp, course);
  }

  return recs.slice(0, 5);
}

function addContinueRecs(
  recs: Recommendation[],
  cp: CourseProgress,
  course: Course,
) {
  for (const mat of cp.materials) {
    if (mat.completed_sections > 0 && mat.completed_sections < mat.total_sections) {
      recs.push({
        type: "continue",
        courseId: cp.course_id,
        courseName: course.name,
        materialTitle: mat.title,
        materialType: mat.type,
        message: `Continue ${mat.title} — ${mat.completed_sections}/${mat.total_sections} sections done`,
      });
    }
  }
}

function addReviewRecs(
  recs: Recommendation[],
  cp: CourseProgress,
  course: Course,
) {
  // Check for low quiz scores
  const materialMap = new Map(cp.materials.map((m) => [m.material_id, m]));
  const seenMaterials = new Set<string>();

  for (const score of cp.recent_scores) {
    if (seenMaterials.has(score.material_id)) continue;
    const pct = score.total > 0 ? Math.round((score.score / score.total) * 100) : 0;
    if (pct < 70) {
      const mat = materialMap.get(score.material_id);
      seenMaterials.add(score.material_id);
      recs.push({
        type: "review",
        courseId: cp.course_id,
        courseName: course.name,
        materialTitle: mat?.title ?? "Quiz",
        materialType: mat?.type ?? "quiz",
        message: `Review ${mat?.title ?? "Quiz"} — scored ${pct}%`,
      });
    }
  }
}

function addTryNewRecs(
  recs: Recommendation[],
  cp: CourseProgress,
  course: Course,
) {
  for (const mat of cp.materials) {
    if (mat.completed_sections === 0 && mat.total_sections > 0) {
      // For lectures, suggest starting the course journey instead
      const label = mat.type === "lecture"
        ? `Start learning ${course.name}`
        : `Try ${mat.title} — ${mat.total_sections} sections available`;
      recs.push({
        type: "try_new",
        courseId: cp.course_id,
        courseName: course.name,
        materialTitle: mat.title,
        materialType: mat.type,
        message: label,
      });
    }
  }
}

function computeCourseProgress(
  summary: DashboardSummary,
): Record<string, number> {
  const progress: Record<string, number> = {};
  for (const cp of summary.courses_with_progress) {
    const total = cp.materials.reduce((s, m) => s + m.total_sections, 0);
    const completed = cp.materials.reduce((s, m) => s + m.completed_sections, 0);
    progress[cp.course_id] = total > 0 ? Math.round((completed / total) * 100) : 0;
  }
  return progress;
}

export function useDashboard(): DashboardData {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [coursesData, summaryData] = await Promise.all([
          api<Course[]>("/api/v1/courses/"),
          api<DashboardSummary>("/api/v1/dashboard/summary"),
        ]);
        setCourses(coursesData);
        setSummary(summaryData);
      } catch {
        // Silently fail — dashboard will show empty state
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !summary) {
    return {
      stats: {
        coursesEnrolled: 0,
        coursesCompleted: 0,
        sectionsCompleted: 0,
        totalSections: 0,
        bestQuizScore: null,
      },
      recommendations: [],
      recentCourses: [],
      courseProgress: {},
      loading,
    };
  }

  const stats = computeStats(courses, summary);
  const recommendations = computeRecommendations(courses, summary);
  const courseProgress = computeCourseProgress(summary);

  // Sort by created_at descending, take 4 most recent
  const recentCourses = [...courses]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  return {
    stats,
    recommendations,
    recentCourses,
    courseProgress,
    loading,
  };
}
