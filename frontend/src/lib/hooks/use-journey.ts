"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import type {
  Course,
  CourseMaterial,
  JourneyStep,
  JourneyView,
} from "@/lib/types";

export interface UseJourneyReturn {
  course: Course | null;
  materials: CourseMaterial[];
  journey: JourneyView | null;
  activeStepIndex: number;
  loading: boolean;
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

  // Extension state
  const [extensionPrompt, setExtensionPrompt] = useState("");
  const [extending, setExtending] = useState(false);

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
