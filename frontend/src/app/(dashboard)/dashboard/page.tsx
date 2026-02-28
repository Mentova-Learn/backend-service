"use client";

import { BookOpen, Trophy, CheckCircle, Target } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useDashboard } from "@/lib/hooks/use-dashboard";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { StatsCard } from "@/components/dashboard/stats-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Recommendations } from "@/components/dashboard/recommendations";
import { CourseProgressCard } from "@/components/dashboard/course-progress-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Spinner } from "@/components/ui/spinner";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { stats, recommendations, recentCourses, courseProgress, loading } =
    useDashboard();

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const isEmpty = stats.coursesEnrolled === 0;

  return (
    <div className="space-y-8 max-w-6xl">
      <WelcomeBanner name={user.full_name} />

      {isEmpty ? (
        <>
          <EmptyState />
          <QuickActions />
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              label="Courses Enrolled"
              value={stats.coursesEnrolled}
              icon={<BookOpen className="h-5 w-5 text-violet-600" />}
              color="bg-violet-100"
            />
            <StatsCard
              label="Completed"
              value={stats.coursesCompleted}
              icon={<Trophy className="h-5 w-5 text-emerald-600" />}
              color="bg-emerald-100"
            />
            <StatsCard
              label="Sections Done"
              value={`${stats.sectionsCompleted}/${stats.totalSections}`}
              icon={<CheckCircle className="h-5 w-5 text-sky-600" />}
              color="bg-sky-100"
            />
            <StatsCard
              label="Best Quiz Score"
              value={
                stats.bestQuizScore !== null ? `${stats.bestQuizScore}%` : "—"
              }
              icon={<Target className="h-5 w-5 text-orange-600" />}
              color="bg-orange-100"
            />
          </div>

          <Recommendations recommendations={recommendations} />

          {recentCourses.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Your Courses
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentCourses.map((course) => (
                  <CourseProgressCard
                    key={course.id}
                    course={course}
                    progress={courseProgress[course.id] ?? 0}
                  />
                ))}
              </div>
            </div>
          )}

          <QuickActions />
        </>
      )}
    </div>
  );
}
