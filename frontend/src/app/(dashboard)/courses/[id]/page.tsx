"use client";

import { useParams } from "next/navigation";
import {
  Clock,
  ArrowLeft,
  BookOpen,
  Plus,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FullPageSpinner } from "@/components/ui/spinner";
import { JourneyTimeline, JourneyProgressBar } from "@/components/courses/journey-timeline";
import { StepContent } from "@/components/courses/step-content";
import { StepNavigation } from "@/components/courses/step-navigation";
import { SpecialisationPanel } from "@/components/courses/specialisation-panel";
import { useJourney } from "@/lib/hooks/use-journey";
import {
  TOPIC_GRADIENTS,
  TOPIC_LABELS,
  DIFFICULTY_LABELS,
  DIFFICULTY_COLORS,
} from "@/lib/constants";

export default function CourseViewPage() {
  const params = useParams();
  const courseId = params.id as string;

  const {
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
  } = useJourney(courseId);

  if (loading) return <FullPageSpinner />;
  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Course not found
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          This course may have been deleted or you don&apos;t have access.
        </p>
        <Link
          href="/courses"
          className="text-sm font-medium text-violet-600 hover:text-violet-700"
        >
          Back to courses
        </Link>
      </div>
    );
  }

  const gradient = course.colour
    ? [course.colour, course.colour]
    : TOPIC_GRADIENTS[course.topic] || TOPIC_GRADIENTS.other;
  const topicLabel = TOPIC_LABELS[course.topic] || "Other";
  const diffLabel =
    DIFFICULTY_LABELS[course.difficulty] || course.difficulty;
  const diffColor = DIFFICULTY_COLORS[course.difficulty] || {
    bg: "bg-gray-100",
    text: "text-gray-700",
  };

  return (
    <div className="max-w-6xl space-y-6">
      {/* Back link */}
      <Link
        href="/courses"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to courses
      </Link>

      {/* Course header */}
      <div
        className="rounded-2xl p-8 text-white relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <BookOpen className="h-32 w-32" />
        </div>
        <div className="relative space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge bg="bg-white/20" text="text-white">
              {topicLabel}
            </Badge>
            <Badge bg={diffColor.bg} text={diffColor.text}>
              {diffLabel}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold">{course.name}</h1>
          <p className="text-white/80 text-sm max-w-2xl">
            {course.description}
          </p>
          <div className="flex items-center gap-4 text-white/70 text-sm pt-2">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {course.estimated_hours}h estimated
            </span>
            {course.tags.length > 0 && (
              <div className="flex gap-1.5">
                {course.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/15 px-2 py-0.5 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overall progress bar */}
      {journey && (
        <JourneyProgressBar
          totalSteps={journey.total_steps}
          completedSteps={journey.completed_steps}
          steps={journey.steps}
          activeStepIndex={activeStepIndex}
          onStepClick={goToStep}
        />
      )}

      {/* Main content area */}
      {journey && journey.steps.length > 0 ? (
        <div className="flex gap-6">
          {/* Timeline sidebar — desktop only */}
          <div className="hidden lg:block w-64 shrink-0">
            <Card className="p-3 sticky top-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <JourneyTimeline
                steps={journey.steps}
                activeStepIndex={activeStepIndex}
                recommendedStepIndex={journey.recommended_step_index}
                onStepClick={goToStep}
              />
            </Card>
          </div>

          {/* Step content */}
          <div className="flex-1 min-w-0">
            <Card className="p-6">
              {currentStep ? (
                <>
                  <StepContent
                    step={currentStep}
                    materials={materials}
                    courseId={courseId}
                    onComplete={() =>
                      handleComplete(
                        currentStep.material_id,
                        currentStep.section_index,
                      )
                    }
                  />
                  <StepNavigation
                    steps={journey.steps}
                    activeStepIndex={activeStepIndex}
                    recommendedStepIndex={journey.recommended_step_index}
                    onPrev={goPrev}
                    onNext={goNext}
                  />
                </>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Select a step from the timeline to begin.
                </p>
              )}
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p className="text-sm">
            No materials available for this course yet.
          </p>
        </div>
      )}

      {/* Specialisation Panel */}
      {showSpecialisation && (
        <SpecialisationPanel
          courseId={courseId}
          onContentGenerated={refreshJourney}
        />
      )}

      {/* Extend Course */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Plus className="h-5 w-5 text-violet-600" />
          Extend Course
        </h3>
        <p className="text-sm text-gray-500">
          Add new sections to all material types with a custom prompt.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={extensionPrompt}
            onChange={(e) => setExtensionPrompt(e.target.value)}
            placeholder="e.g. Add a section about advanced techniques..."
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleExtend();
            }}
          />
          <Button
            onClick={handleExtend}
            disabled={!extensionPrompt.trim() || extending}
          >
            {extending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {extending ? "Extending..." : "Extend"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
