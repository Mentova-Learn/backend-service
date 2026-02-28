"use client";

import { clsx } from "clsx";
import {
  BookOpen,
  CreditCard,
  HelpCircle,
  PenTool,
  ListChecks,
  CheckCircle,
  Circle,
  Link2,
  ArrowUpDown,
  Scale,
  FileText,
  FolderTree,
  Sparkles,
} from "lucide-react";
import { MATERIAL_TYPE_LABELS } from "@/lib/constants";
import type { JourneyStep, CourseMaterialType } from "@/lib/types";

const MATERIAL_ICONS: Record<CourseMaterialType, typeof BookOpen> = {
  lecture: BookOpen,
  flashcards: CreditCard,
  quiz: HelpCircle,
  fill_in_the_blank: PenTool,
  multiple_choice: ListChecks,
  matching: Link2,
  ordering: ArrowUpDown,
  true_false: Scale,
  case_study: FileText,
  sorting: FolderTree,
  spotlight: Sparkles,
};

interface JourneyTimelineProps {
  steps: JourneyStep[];
  activeStepIndex: number;
  recommendedStepIndex: number | null;
  onStepClick: (index: number) => void;
}

export function JourneyTimeline({
  steps,
  activeStepIndex,
  recommendedStepIndex,
  onStepClick,
}: JourneyTimelineProps) {
  return (
    <div className="space-y-0.5">
      {steps.map((step, idx) => {
        const Icon = MATERIAL_ICONS[step.material_type] || BookOpen;
        const isActive = idx === activeStepIndex;
        const isRecommended = idx === recommendedStepIndex;
        const isCompleted = step.is_completed;

        // Detect subtopic transitions for visual grouping
        const prevStep = idx > 0 ? steps[idx - 1] : null;
        const isNewSubtopic =
          prevStep && prevStep.subtopic_title !== step.subtopic_title;

        return (
          <div key={`${step.material_id}-${step.section_index}-${step.material_type}`}>
            {isNewSubtopic && (
              <div className="my-2 border-t border-gray-100" />
            )}
            <button
              onClick={() => onStepClick(idx)}
              className={clsx(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-all cursor-pointer",
                isActive
                  ? "bg-violet-50 text-violet-700 font-medium"
                  : isCompleted
                    ? "text-gray-500 hover:bg-gray-50"
                    : "text-gray-600 hover:bg-gray-50",
              )}
            >
              {/* Status indicator */}
              <div className="shrink-0">
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : isActive || isRecommended ? (
                  <div className="h-4 w-4 rounded-full border-2 border-violet-500 bg-violet-100 animate-pulse" />
                ) : (
                  <Circle className="h-4 w-4 text-gray-300" />
                )}
              </div>

              {/* Icon */}
              <Icon
                className={clsx(
                  "h-3.5 w-3.5 shrink-0",
                  isActive
                    ? "text-violet-600"
                    : isCompleted
                      ? "text-gray-400"
                      : "text-gray-400",
                )}
              />

              {/* Label */}
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs">
                  {MATERIAL_TYPE_LABELS[step.material_type]}
                </div>
                <div
                  className={clsx(
                    "truncate text-xs",
                    isActive ? "text-violet-500" : "text-gray-400",
                  )}
                >
                  {step.subtopic_title}
                </div>
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}

interface JourneyProgressBarProps {
  totalSteps: number;
  completedSteps: number;
  steps: JourneyStep[];
  activeStepIndex: number;
  onStepClick: (index: number) => void;
}

export function JourneyProgressBar({
  totalSteps,
  completedSteps,
  steps,
  activeStepIndex,
  onStepClick,
}: JourneyProgressBarProps) {
  const pct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">
          {completedSteps}/{totalSteps} steps
        </span>
        <span className="font-medium text-violet-600">{pct}%</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-violet-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Mobile: compact step pills */}
      <div className="flex gap-1 overflow-x-auto pb-1 lg:hidden">
        {steps.map((step, idx) => {
          const isActive = idx === activeStepIndex;
          return (
            <button
              key={`${step.material_id}-${step.section_index}-${step.material_type}`}
              onClick={() => onStepClick(idx)}
              className={clsx(
                "shrink-0 h-1.5 rounded-full transition-all cursor-pointer",
                isActive
                  ? "w-6 bg-violet-500"
                  : step.is_completed
                    ? "w-2 bg-green-400"
                    : "w-2 bg-gray-200",
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
