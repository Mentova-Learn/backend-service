"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Sparkles, ArrowLeft, ArrowRight, CheckCircle, Lightbulb, BookOpen, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SpotlightData } from "@/lib/types";

const TYPE_STYLES: Record<string, { bg: string; border: string; icon: typeof Sparkles; accent: string; label: string }> = {
  fact: { bg: "bg-sky-50", border: "border-sky-200", icon: Sparkles, accent: "text-sky-600", label: "Fun Fact" },
  tip: { bg: "bg-emerald-50", border: "border-emerald-200", icon: Lightbulb, accent: "text-emerald-600", label: "Pro Tip" },
  mnemonic: { bg: "bg-purple-50", border: "border-purple-200", icon: Brain, accent: "text-purple-600", label: "Memory Aid" },
  analogy: { bg: "bg-amber-50", border: "border-amber-200", icon: BookOpen, accent: "text-amber-600", label: "Analogy" },
};

interface SpotlightViewerProps {
  data: SpotlightData;
  isCompleted?: boolean;
  onComplete?: () => void;
}

export function SpotlightViewer({ data, isCompleted, onComplete }: SpotlightViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const highlights = data.highlights;
  const current = highlights[currentIndex];
  const isLast = currentIndex === highlights.length - 1;

  const style = TYPE_STYLES[current.type] || TYPE_STYLES.fact;
  const Icon = style.icon;

  const goNext = () => {
    if (isLast) return;
    setCurrentIndex((i) => i + 1);
  };

  const goPrev = () => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Badge bg="bg-amber-100" text="text-amber-700">
          <Sparkles className="h-3 w-3 mr-1 inline" />
          Spotlight
        </Badge>
        <span className="text-sm text-gray-500">
          {currentIndex + 1} of {highlights.length}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-1.5">
        {highlights.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={clsx(
              "h-2 rounded-full transition-all cursor-pointer",
              idx === currentIndex ? "w-6 bg-amber-500" : idx < currentIndex ? "w-2 bg-amber-300" : "w-2 bg-gray-200",
            )}
          />
        ))}
      </div>

      {/* Card */}
      <div className={clsx("rounded-2xl border p-8 text-center transition-all", style.bg, style.border)}>
        <div className={clsx("inline-flex h-12 w-12 items-center justify-center rounded-full mb-4", style.bg)}>
          <Icon className={clsx("h-6 w-6", style.accent)} />
        </div>
        <p className={clsx("text-xs uppercase tracking-wider font-semibold mb-3", style.accent)}>
          {style.label}
        </p>
        <p className="text-lg text-gray-800 leading-relaxed">{current.content}</p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-3">
        <Button variant="secondary" size="sm" onClick={goPrev} disabled={currentIndex === 0}>
          <ArrowLeft className="h-4 w-4" />
        </Button>

        {isLast && isCompleted ? (
          <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
            <CheckCircle className="h-5 w-5" />
            Got it
          </div>
        ) : isLast && onComplete ? (
          <Button size="sm" onClick={onComplete}>
            <CheckCircle className="h-4 w-4" />
            Got it
          </Button>
        ) : (
          <Button variant="secondary" size="sm" onClick={goNext} disabled={isLast}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
