"use client";

import { LectureViewer } from "@/components/courses/lecture-viewer";
import { FlashcardViewer } from "@/components/courses/flashcard-viewer";
import { QuizViewer } from "@/components/courses/quiz-viewer";
import { FillBlankViewer } from "@/components/courses/fill-blank-viewer";
import { MultipleChoiceViewer } from "@/components/courses/multiple-choice-viewer";
import { MatchingViewer } from "@/components/courses/matching-viewer";
import { OrderingViewer } from "@/components/courses/ordering-viewer";
import { TrueFalseViewer } from "@/components/courses/true-false-viewer";
import { CaseStudyViewer } from "@/components/courses/case-study-viewer";
import { SortingViewer } from "@/components/courses/sorting-viewer";
import { SpotlightViewer } from "@/components/courses/spotlight-viewer";
import type {
  JourneyStep,
  CourseMaterial,
  LectureData,
  FlashcardSetData,
  QuizData,
  FillInTheBlankData,
  MultipleChoiceData,
  MatchingData,
  OrderingData,
  TrueFalseData,
  CaseStudyData,
  SortingData,
  SpotlightData,
} from "@/lib/types";

interface StepContentProps {
  step: JourneyStep;
  materials: CourseMaterial[];
  courseId: string;
  onComplete: () => void;
}

export function StepContent({
  step,
  materials,
  courseId,
  onComplete,
}: StepContentProps) {
  // Find the material and section for this step
  const material = materials.find((m) => m.id === step.material_id);
  if (!material) {
    return (
      <p className="text-center text-gray-500 py-8">
        Material not found.
      </p>
    );
  }

  const section = material.data.find((s) => s.index === step.section_index);
  if (!section) {
    return (
      <p className="text-center text-gray-500 py-8">
        Section not found.
      </p>
    );
  }

  switch (step.material_type) {
    case "lecture":
      return (
        <LectureViewer
          title={step.subtopic_title}
          data={section.material as LectureData}
          isCompleted={step.is_completed}
          onComplete={onComplete}
        />
      );

    case "flashcards":
      return (
        <FlashcardViewer
          sections={[
            { title: step.subtopic_title, data: section.material as FlashcardSetData },
          ]}
          onComplete={onComplete}
        />
      );

    case "quiz":
      return (
        <QuizViewer
          sections={[
            { title: step.subtopic_title, data: section.material as QuizData },
          ]}
          courseId={courseId}
          materialId={material.id}
          onComplete={onComplete}
        />
      );

    case "fill_in_the_blank":
      return (
        <FillBlankViewer
          sections={[
            { title: step.subtopic_title, data: section.material as FillInTheBlankData },
          ]}
          onComplete={onComplete}
        />
      );

    case "multiple_choice":
      return (
        <MultipleChoiceViewer
          sections={[
            { title: step.subtopic_title, data: section.material as MultipleChoiceData },
          ]}
          courseId={courseId}
          materialId={material.id}
          onComplete={onComplete}
        />
      );

    case "matching":
      return (
        <MatchingViewer
          data={section.material as MatchingData}
          onComplete={onComplete}
        />
      );

    case "ordering":
      return (
        <OrderingViewer
          data={section.material as OrderingData}
          onComplete={onComplete}
        />
      );

    case "true_false":
      return (
        <TrueFalseViewer
          data={section.material as TrueFalseData}
          onComplete={onComplete}
        />
      );

    case "case_study":
      return (
        <CaseStudyViewer
          data={section.material as CaseStudyData}
          title={step.subtopic_title}
          isCompleted={step.is_completed}
          onComplete={onComplete}
        />
      );

    case "sorting":
      return (
        <SortingViewer
          data={section.material as SortingData}
          onComplete={onComplete}
        />
      );

    case "spotlight":
      return (
        <SpotlightViewer
          data={section.material as SpotlightData}
          onComplete={onComplete}
        />
      );

    default:
      return (
        <p className="text-center text-gray-500 py-8">
          Unknown material type.
        </p>
      );
  }
}
