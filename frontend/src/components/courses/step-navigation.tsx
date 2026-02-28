"use client";

import { clsx } from "clsx";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MATERIAL_TYPE_LABELS } from "@/lib/constants";
import type { JourneyStep } from "@/lib/types";

interface StepNavigationProps {
  steps: JourneyStep[];
  activeStepIndex: number;
  recommendedStepIndex: number | null;
  onPrev: () => void;
  onNext: () => void;
}

export function StepNavigation({
  steps,
  activeStepIndex,
  recommendedStepIndex,
  onPrev,
  onNext,
}: StepNavigationProps) {
  const hasPrev = activeStepIndex > 0;
  const hasNext = activeStepIndex < steps.length - 1;

  const prevStep = hasPrev ? steps[activeStepIndex - 1] : null;
  const nextStep = hasNext ? steps[activeStepIndex + 1] : null;

  const nextIsRecommended = nextStep && activeStepIndex + 1 === recommendedStepIndex;

  const prevLabel = prevStep
    ? `${MATERIAL_TYPE_LABELS[prevStep.material_type]}: ${prevStep.subtopic_title}`
    : "";
  const nextLabel = nextStep
    ? `${MATERIAL_TYPE_LABELS[nextStep.material_type]}: ${nextStep.subtopic_title}`
    : "";

  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
      <Button
        variant="ghost"
        size="sm"
        onClick={onPrev}
        disabled={!hasPrev}
        className="gap-1"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline max-w-[150px] truncate">
          {prevLabel || "Previous"}
        </span>
        <span className="sm:hidden">Prev</span>
      </Button>

      <span className="text-xs text-gray-400">
        {activeStepIndex + 1} / {steps.length}
      </span>

      <Button
        variant={nextIsRecommended ? "primary" : "ghost"}
        size="sm"
        onClick={onNext}
        disabled={!hasNext}
        className={clsx("gap-1", nextIsRecommended && "shadow-sm")}
      >
        <span className="hidden sm:inline max-w-[150px] truncate">
          {nextLabel || "Next"}
        </span>
        <span className="sm:hidden">Next</span>
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
