"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { api } from "@/lib/api";
import type {
  Course,
  CourseMaterial,
  CourseGenerationStatus,
  JourneyStep,
  JourneyView,
} from "@/lib/types";

export interface UseJourneyReturn {
  course: Course | null;
  materials: CourseMaterial[];
  journey: JourneyView | null;
  activeStepIndex: number;
  loading: boolean;
  generationStatus: CourseGenerationStatus | null;
  completionPct: number;
  showSpecialisation: boolean;
  goNext: () => void;
  goPrev: () => void;
  goToStep: (index: number) => void;
  handleComplete: (materialId: string, sectionIndex: number) => Promise<void>;
  refreshJourney: () => Promise<void>;
  currentStep: JourneyStep | null;
  // Extension state
  extensionPrompt: string;
  setExtensionPrompt: (prompt: string) => void;
  extending: boolean;
  handleExtend: () => Promise<void>;
}

export function useJourney(courseId: string): UseJourneyReturn {
  const [course, setCourse] = useState<Course | null>(null);
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [journey, setJourney] = useState<JourneyView | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [initialised, setInitialised] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<CourseGenerationStatus | null>(null);

  // Extension state
  const [extensionPrompt, setExtensionPrompt] = useState("");
  const [extending, setExtending] = useState(false);

  const sseRef = useRef<EventSource | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [courseData, materialsData, journeyData] = await Promise.all([
        api<Course>(`/api/v1/courses/${courseId}`),
        api<CourseMaterial[]>(`/api/v1/courses/${courseId}/materials`),
        api<JourneyView>(`/api/v1/courses/${courseId}/journey`),
      ]);
      setCourse(courseData);
      setMaterials(materialsData);
      setJourney(journeyData);
      setGenerationStatus(courseData.status);

      // Auto-navigate to recommended step on initial load
      if (!initialised && journeyData.recommended_step_index !== null) {
        setActiveStepIndex(journeyData.recommended_step_index);
        setInitialised(true);
      } else if (!initialised) {
        setInitialised(true);
      }
    } catch {
      // Error handled by showing empty state
    } finally {
      setLoading(false);
    }
  }, [courseId, initialised]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Connect SSE when course is generating to auto-refresh on completion.
  useEffect(() => {
    if (generationStatus !== "generating") {
      sseRef.current?.close();
      sseRef.current = null;
      return;
    }
    if (sseRef.current) return;

    const token = typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:80";
    const url = token
      ? `${base}/api/v1/courses/${courseId}/events?token=${encodeURIComponent(token)}`
      : `${base}/api/v1/courses/${courseId}/events`;

    const es = new EventSource(url);
    sseRef.current = es;

    es.onmessage = (evt) => {
      try {
        const payload = JSON.parse(evt.data) as { type: string; status?: CourseGenerationStatus };
        if (payload.type === "status" && payload.status) {
          setGenerationStatus(payload.status);
          if (payload.status !== "generating") {
            es.close();
            sseRef.current = null;
            // Refresh the full journey data when generation is done.
            fetchData();
          }
        }
      } catch {
        // Ignore parse errors
      }
    };

    es.onerror = () => {
      es.close();
      sseRef.current = null;
    };

    return () => {
      es.close();
      sseRef.current = null;
    };
  }, [courseId, generationStatus, fetchData]);

  const refreshJourney = useCallback(async () => {
    try {
      const [materialsData, journeyData] = await Promise.all([
        api<CourseMaterial[]>(`/api/v1/courses/${courseId}/materials`),
        api<JourneyView>(`/api/v1/courses/${courseId}/journey`),
      ]);
      setMaterials(materialsData);
      setJourney(journeyData);
    } catch {
      // Silent fail
    }
  }, [courseId]);

  const goNext = useCallback(() => {
    if (journey && activeStepIndex < journey.steps.length - 1) {
      setActiveStepIndex((prev) => prev + 1);
    }
  }, [journey, activeStepIndex]);

  const goPrev = useCallback(() => {
    if (activeStepIndex > 0) {
      setActiveStepIndex((prev) => prev - 1);
    }
  }, [activeStepIndex]);

  const goToStep = useCallback((index: number) => {
    setActiveStepIndex(index);
  }, []);

  const handleComplete = useCallback(
    async (materialId: string, sectionIndex: number) => {
      try {
        await api(`/api/v1/courses/${courseId}/materials/${materialId}/complete`, {
          method: "POST",
          body: JSON.stringify({ section_index: sectionIndex }),
        });
        await refreshJourney();
      } catch {
        // Silent fail
      }
    },
    [courseId, refreshJourney],
  );

  const handleExtend = useCallback(async () => {
    if (!extensionPrompt.trim() || extending) return;
    setExtending(true);
    try {
      await api<CourseMaterial[]>(
        `/api/v1/courses/${courseId}/extend`,
        {
          method: "POST",
          body: JSON.stringify({ prompt: extensionPrompt }),
        },
      );
      await refreshJourney();
      setExtensionPrompt("");
    } catch {
      // Silent fail
    } finally {
      setExtending(false);
    }
  }, [courseId, extensionPrompt, extending, refreshJourney]);

  const completionPct =
    journey && journey.total_steps > 0
      ? Math.round((journey.completed_steps / journey.total_steps) * 100)
      : 0;

  const showSpecialisation = completionPct >= 50;

  const currentStep =
    journey && activeStepIndex < journey.steps.length
      ? journey.steps[activeStepIndex]
      : null;

  return {
    course,
    materials,
    journey,
    activeStepIndex,
    loading,
    generationStatus,
    completionPct,
    showSpecialisation,
    goNext,
    goPrev,
    goToStep,
    handleComplete,
    refreshJourney,
    currentStep,
    extensionPrompt,
    setExtensionPrompt,
    extending,
    handleExtend,
  };
}
