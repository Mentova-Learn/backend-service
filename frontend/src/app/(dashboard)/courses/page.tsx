"use client";

import { useEffect, useMemo, useState } from "react";
import { Library, Loader2 } from "lucide-react";
import { CourseCard } from "@/components/courses/course-card";
import { api } from "@/lib/api";
import { TOPIC_LABELS, DIFFICULTY_LABELS } from "@/lib/constants";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Course, CourseTopic, CourseDifficulty } from "@/lib/types";

const TOPICS: CourseTopic[] = ["math", "science", "history", "art", "music", "other"];
const DIFFICULTIES: CourseDifficulty[] = ["beginner", "intermediate", "advanced", "expert"];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<CourseTopic | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<CourseDifficulty | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await api<Course[]>("/api/v1/courses/");
        setCourses(data);
      } catch {
        // Silently handle — empty state shown
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchesSearch =
        search === "" ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      const matchesTopic = !selectedTopic || c.topic === selectedTopic;
      const matchesDiff = !selectedDifficulty || c.difficulty === selectedDifficulty;
      return matchesSearch && matchesTopic && matchesDiff;
    });
  }, [courses, search, selectedTopic, selectedDifficulty]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6">
      {/* Filters */}
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 pl-10 text-sm outline-none transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTopic(null)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              !selectedTopic
                ? "bg-violet-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Topics
          </button>
          {TOPICS.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(selectedTopic === t ? null : t)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                selectedTopic === t
                  ? "bg-violet-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {TOPIC_LABELS[t]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedDifficulty(null)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              !selectedDifficulty
                ? "bg-violet-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Levels
          </button>
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() =>
                setSelectedDifficulty(selectedDifficulty === d ? null : d)
              }
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                selectedDifficulty === d
                  ? "bg-violet-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {DIFFICULTY_LABELS[d]}
            </button>
          ))}
        </div>
      </div>

      {/* Course grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 mb-4">
            <Library className="h-8 w-8 text-violet-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {courses.length === 0 ? "No courses yet" : "No courses found"}
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mb-4">
            {courses.length === 0
              ? "Create your first AI-generated course to get started."
              : "Try adjusting your filters or search query."}
          </p>
          {courses.length === 0 && (
            <Link href="/courses/create">
              <Button>Create your first course</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
