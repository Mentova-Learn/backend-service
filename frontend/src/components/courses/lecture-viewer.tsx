"use client";

import ReactMarkdown from "react-markdown";
import { BookOpen, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { LectureData } from "@/lib/types";

interface LectureViewerProps {
  title: string;
  data: LectureData;
  isCompleted: boolean;
  onComplete?: () => void;
}

export function LectureViewer({
  title,
  data,
  isCompleted,
  onComplete,
}: LectureViewerProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Badge bg="bg-violet-100" text="text-violet-700">
          <BookOpen className="h-3 w-3 mr-1 inline" />
          Lecture
        </Badge>
        <span className="text-sm text-gray-500">{title}</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <div className="prose prose-violet max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-li:text-gray-700 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-violet-700 prose-pre:bg-gray-900 prose-pre:text-gray-100">
          <ReactMarkdown>{data.content}</ReactMarkdown>
        </div>
      </div>

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
