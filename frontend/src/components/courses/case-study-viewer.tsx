"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { clsx } from "clsx";
import { FileText, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CaseStudyData } from "@/lib/types";

interface CaseStudyViewerProps {
  data: CaseStudyData;
  title: string;
  isCompleted: boolean;
  onComplete?: () => void;
}

export function CaseStudyViewer({
  data,
  title,
  isCompleted,
  onComplete,
}: CaseStudyViewerProps) {
  const [revealedQuestions, setRevealedQuestions] = useState<Set<number>>(
    new Set(),
  );

  const toggleQuestion = (idx: number) => {
    setRevealedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Badge bg="bg-teal-100" text="text-teal-700">
          <FileText className="h-3 w-3 mr-1 inline" />
          Case Study
        </Badge>
        <span className="text-sm text-gray-500">{title}</span>
      </div>

      {/* Scenario */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <div className="prose prose-violet max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-li:text-gray-700">
          <ReactMarkdown>{data.scenario}</ReactMarkdown>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Discussion Questions
        </h3>
        {data.questions.map((q, idx) => {
          const isRevealed = revealedQuestions.has(idx);
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleQuestion(idx)}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-xs font-semibold shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {q.question}
                  </span>
                </div>
                {isRevealed ? (
                  <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                )}
              </button>
              {isRevealed && (
                <div className="px-5 pb-4 border-t border-gray-100 pt-3">
                  <p className="text-xs font-medium text-teal-600 mb-1">
                    Sample Answer
                  </p>
                  <p className="text-sm text-gray-600">{q.sample_answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Complete */}
      {onComplete && (
        <div className="flex justify-center">
          {isCompleted ? (
            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
              <CheckCircle className="h-5 w-5" />
              Marked as read
            </div>
          ) : (
            <Button onClick={onComplete}>
              <CheckCircle className="h-4 w-4" />
              Mark as Read
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
